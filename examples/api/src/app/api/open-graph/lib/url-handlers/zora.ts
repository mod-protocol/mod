import { UrlMetadata } from "@mod-protocol/core";
import { UrlHandler } from "../../types/url-handler";
import { fetchNFTMetadata, toUrlMetadata } from "../util";

async function handleZoraCollectUrl(url: string): Promise<UrlMetadata | null> {
  const [, , , , chainAndContractAddress] = url.split("/");

  const [chain, contractAddress] = chainAndContractAddress.split(":");

  const nftMetadata = await fetchNFTMetadata({
    contractAddress,
    chain,
    mintUrl: url,
  });

  const urlMetadata: UrlMetadata = toUrlMetadata(nftMetadata);

  return urlMetadata;
}

const handler: UrlHandler = {
  matchers: ["https://zora.co/collect/.*"],
  handler: handleZoraCollectUrl,
};

export default handler;