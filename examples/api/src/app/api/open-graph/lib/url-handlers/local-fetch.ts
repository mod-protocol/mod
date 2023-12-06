import { NFTMetadata, UrlMetadata } from "@mod-protocol/core";
import ogs from "open-graph-scraper";
import { UrlHandler } from "../../types/url-handler";
import { chainById } from "../chains/chain-index";
import { fetchNFTMetadata } from "../util";
import * as cheerio from "cheerio";

export function groupLinkedDataByType<T = any>(
  linkedData: T[]
): Record<string, T[]> {
  return linkedData.reduce((prev, next): Record<string, T[]> => {
    return {
      ...prev,
      [next["@type"]]: [...(prev[next["@type"]] ?? []), next],
    };
  }, {});
}

async function localFetchHandler(url: string): Promise<UrlMetadata> {
  // A versatile user agent for which most sites will return opengraph data
  const userAgent =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/601.2.4 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.4 facebookexternalhit/1.1 Facebot Twitterbot/1.0 ModBot";
  const response = await fetch(url, {
    headers: { "user-agent": userAgent, Accept: "text/html" },
  });

  const html = await response.text();

  const $ = cheerio.load(html, { decodeEntities: false, xmlMode: true }, false);
  const jsonLdScripts = $('script[type="application/ld+json"]');

  const linkedData = jsonLdScripts
    .map((i, el) => {
      try {
        const html = $(el).text();
        return JSON.parse(html);
      } catch (e) {
        console.error("Error parsing JSON-LD:", e);
        return null;
      }
    })
    .get();

  const { result: data } = await ogs({
    html,
    customMetaTags: [
      {
        multiple: false,
        property: "eth:nft:contract_address",
        fieldName: "ethNftContractAddress",
      },
      {
        multiple: false,
        property: "eth:nft:chain",
        fieldName: "ethNftChain",
      },
      {
        multiple: false,
        property: "nft:chain",
        fieldName: "ethNftChainAlt",
      },
      {
        multiple: false,
        property: "eth:nft:mint_url",
        fieldName: "ethNftMintUrl",
      },
    ],
  });

  let nftMetadata: NFTMetadata | undefined;
  if (
    data["customMetaTags"] &&
    data["customMetaTags"]["ethNftContractAddress"]
  ) {
    const {
      ethNftContractAddress,
      ethNftChain,
      ethNftChainAlt,
      ethNftMintUrl,
    } = data["customMetaTags"];
    let contractAddress: string | undefined = ethNftContractAddress;
    let chain: string | undefined = (
      ethNftChain ||
      ethNftChainAlt ||
      "ethereum"
    ).toLowerCase();
    const mintUrl = ethNftMintUrl || url;

    // Handle case where contractAddress is in the form of <chain>:<contractAddress>
    if (contractAddress && contractAddress.includes(":")) {
      [chain, contractAddress] = contractAddress.split(":");
    }

    // Handle case where chain is chain ID instead of chain name
    if (!Number.isNaN(parseInt(chain))) {
      chain = chainById[parseInt(chain)].network;
    }

    nftMetadata = await fetchNFTMetadata({
      contractAddress,
      chain,
      mintUrl,
    });
  }

  const urlMetadata: UrlMetadata = {
    title: data.ogTitle,
    description: data.ogDescription || data.twitterDescription,
    image: data.ogImage?.length > 0 ? data.ogImage[0] : undefined,
    logo: data.ogLogo
      ? {
          url: data.ogLogo,
        }
      : undefined,
    "json-ld": groupLinkedDataByType(linkedData),
    publisher: data.ogSiteName,
    mimeType: response["headers"]["content-type"],
    nft: nftMetadata,
  };

  if (response["status"] !== 200) {
    console.error(
      `[Local Fetch] Fetch failed for ${url} [${response["status"]}]`
    );
    return null;
  }

  if (!(urlMetadata.image || urlMetadata.logo)) {
    console.error(`[Local Fetch] No image or logo found for ${url}`);
    return null;
  }

  return urlMetadata;
}

const handler: UrlHandler = {
  name: "Local Fetch",
  matchers: [".*"],
  handler: localFetchHandler,
};

export default handler;
