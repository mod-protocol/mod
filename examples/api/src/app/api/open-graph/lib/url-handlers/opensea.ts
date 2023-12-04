import { NFTMetadata, UrlMetadata } from "@mod-protocol/core";
import { UrlHandler } from "../../types/url-handler";
import { fetchNFTMetadata, toUrlMetadata } from "../util";

async function handleOpenSeaUrl(url: string): Promise<UrlMetadata | null> {
  // If collection url (e.g. https://opensea.io/collection/farcaster-v3-1)
  if (url.match(/https:\/\/opensea\.io\/collection\/.*/)) {
    const slug = new URL(url).pathname.split("/").slice(-1)[0];

    const collectionResponse = await fetch(
      `https://api.opensea.io/api/v2/collections/${slug}`,
      {
        headers: {
          "x-api-key": process.env.OPENSEA_API_KEY,
        },
      }
    );

    if (!collectionResponse.ok) {
      return null;
    }

    const { contracts } = await collectionResponse.json();

    const nftMetadata = await fetchNFTMetadata({
      openSeaSlug: slug,
      contractAddress: contracts[0].address,
      chain: contracts[0].chain,
    });

    const urlMetadata: UrlMetadata = toUrlMetadata(nftMetadata);

    return urlMetadata;
  }

  // If asset url (e.g. https://opensea.io/assets/base/0xbfdb5d8d1856b8617f1881fd718580256fa8cf35/13354)
  else if (url.match(/https:\/\/opensea\.io\/assets\/.*/)) {
    const pathArgs = new URL(url).pathname.toLowerCase().split("/").slice(2);

    let nftMetadata: NFTMetadata | null = null;

    if (pathArgs.length === 2) {
      // If there are only 2 items means there is no chain specified
      nftMetadata = await fetchNFTMetadata({
        chain: "ethereum",
        contractAddress: pathArgs[0],
        tokenId: pathArgs[1],
      });
    } else {
      nftMetadata = await fetchNFTMetadata({
        chain: pathArgs[0],
        contractAddress: pathArgs[1],
        tokenId: pathArgs[2],
      });
    }

    if (!nftMetadata) {
      return null;
    }

    const urlMetadata: UrlMetadata = toUrlMetadata(nftMetadata);

    return urlMetadata;
  }
}

const urlHandler: UrlHandler = {
  name: "OpenSea",
  matchers: [
    "https://opensea.io/assets/.*",
    "https://opensea.io/collection/.*",
  ],
  handler: handleOpenSeaUrl,
};

export default urlHandler;
