import { UrlMetadata } from "@mod-protocol/core";
import { UrlHandler } from "../../types/url-handler";
import { chainById } from "../chains/chain-index";
import { fetchNFTMetadata } from "../util";
import { groupLinkedDataByType } from "./local-fetch";

const ethDataSelectors: {
  selectorAll: string;
  nameAttr: string;
  contentAttr: string;
}[] = [
  {
    selectorAll: 'meta[property^="eth:"]',
    nameAttr: "property",
    contentAttr: "content",
  },
  {
    // manifold.xyz
    selectorAll: 'meta[name^="eth:"]',
    nameAttr: "name",
    contentAttr: "content",
  },
];

const jsonLdDataSelector = new URLSearchParams({
  "data.json-ld.selectorAll": 'script[type="application/ld+json"]',
  "data.json-ld.attr": "text",
  "data.json-ld.type": "string",
}).toString();

// Open Graph NFT extension
// https://warpcast.notion.site/NFT-extended-open-graph-5a64ca22d2374f99832bc4b91c386c46
// https://microlink.io/docs/api/parameters/data
const ethSearchParams = ethDataSelectors.map(
  ({ selectorAll, nameAttr, contentAttr }, index) => {
    const id = `data.ethProperty${index}`;
    const idContent = `data.ethContent${index}`;
    return new URLSearchParams({
      [`${id}.selectorAll`]: selectorAll,
      [`${id}.attr`]: nameAttr,
      [`${idContent}.selectorAll`]: selectorAll,
      [`${idContent}.attr`]: contentAttr,
      [`${idContent}.type`]: "string",
    }).toString();
  }
);

async function metascraperHandler(
  url: string,
  { nftMetadata }: { nftMetadata?: boolean } = { nftMetadata: true }
): Promise<UrlMetadata> {
  const searchParams = new URLSearchParams({
    url,
    userAgent: "bot",
    "headers.accept": "text/html",
  });

  // Using the hosted metascraper service, but can be self hosted (https://metascraper.js.org)
  let metadataUrl = `https://pro.microlink.io/?${searchParams.toString()}`;

  if (nftMetadata) {
    metadataUrl += `&${ethSearchParams.join("&")}`;
  }

  metadataUrl += `&${jsonLdDataSelector}`;

  const response = await fetch(
    // To self host, use https://github.com/microlinkhq/metascraper
    metadataUrl,
    {
      headers: {
        "x-api-key": process.env.MICROLINK_API_KEY,
      },
    }
  );

  if (!response.ok) {
    console.error(`[Metascraper] Fetch failed for ${url} [${response.status}]`);
    return null;
  }

  const { data, headers, statusCode } = await response.json();

  if (statusCode !== 200) {
    console.error(`[Metascraper] Failed to scrape ${url} [${statusCode}]`);
    return null;
  }

  let formattedJsonLd = [];
  if (data["jsonLd"]) {
    if (Array.isArray(data["jsonLd"])) {
      formattedJsonLd = data["jsonLd"]
        .map((el) => {
          try {
            return JSON.parse(el);
          } catch (err) {
            console.error(err);
            return false;
          }
        })
        .filter((truthy) => truthy);
    } else {
      try {
        formattedJsonLd = [JSON.parse(data["jsonLd"])];
      } catch (err) {
        console.error(err);
      }
    }
  }

  const urlMetadata: UrlMetadata = {
    image: data.image
      ? {
          url: data.image.url,
          width: data.image.width,
          height: data.image.height,
        }
      : undefined,
    description: data.description,
    alt: data.alt,
    "json-ld": formattedJsonLd
      ? groupLinkedDataByType(formattedJsonLd)
      : undefined,
    title: data.title,
    publisher: data.publisher,
    logo: data.logo
      ? {
          url: data.logo.url,
        }
      : undefined,
    mimeType: headers["content-type"],
  };

  // Zip opengraph extension data into a single object
  const matchedEthData = ethDataSelectors
    .map((_, index) => {
      const id = `ethProperty${index}`;
      const idContent = `ethContent${index}`;
      const ethData = {};
      if (!data[id] || !data[idContent]) return null;
      for (let i = 0; i < data[id].length; i++) {
        ethData[data[id][i]] = data[idContent][i];
      }
      return ethData;
    })
    .filter((x) => x);

  if (matchedEthData.length > 0) {
    const ethData = matchedEthData[0];

    let contractAddress: string | undefined =
      ethData["eth:nft:contract_address"];
    let chain: string | undefined = (
      ethData["eth:nft:chain"] ||
      ethData["nft:chain"] ||
      "ethereum"
    ).toLowerCase();
    const mintUrl = ethData["eth:nft:mint_url"] || url;

    // Handle case where contractAddress is in the form of <chain>:<contractAddress>
    if (contractAddress && contractAddress.includes(":")) {
      [chain, contractAddress] = contractAddress.split(":");
    }

    // Handle case where chain is chain ID instead of chain name
    if (!Number.isNaN(parseInt(chain))) {
      chain = chainById[parseInt(chain)].network;
    }

    const nftMetadata = await fetchNFTMetadata({
      contractAddress,
      chain,
      mintUrl,
    });

    urlMetadata.nft = nftMetadata;
  }

  return urlMetadata;
}

const handler: UrlHandler = {
  name: "Metascraper",
  matchers: [".*"],
  handler: metascraperHandler,
};

export default handler;
