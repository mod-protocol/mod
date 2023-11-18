import { UrlMetadata } from "@mod-protocol/core";
import { UrlHandler } from "../../types/url-handler";
import { fetchNFTMetadata, toUrlMetadata } from "../util";

async function handleZoraCollectUrl(url: string): Promise<UrlMetadata | null> {
  const parsedUrl = new URL(url);
  const pathname = parsedUrl.pathname;
  const pathParts = pathname.split("/");
  const tokenId = pathParts[3];
  const chainAndContractAddress = pathParts[2].toLowerCase();
  let [chain, contractAddress] = chainAndContractAddress.split(":");

  const chainMapping = {
    eth: "ethereum",
    oeth: "optimism",
    base: "base",
    zora: "zora",
  };

  if (chainMapping[chain]) {
    chain = chainMapping[chain];
  }

  const nftMetadata = await fetchNFTMetadata({
    contractAddress,
    tokenId,
    chain,
    mintUrl: url,
  });

  const urlMetadata: UrlMetadata = toUrlMetadata(nftMetadata);

  return urlMetadata;
}

const handler: UrlHandler = {
  name: "Zora Collect",
  matchers: ["https://zora.co/collect/.*"],
  handler: handleZoraCollectUrl,
};

export default handler;
