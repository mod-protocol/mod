import { UrlMetadata } from "@mod-protocol/core";
import { UrlHandler } from "../../types/url-handler";
import { chainById } from "../chains/chain-index";
import { fetchNFTMetadata, toUrlMetadata } from "../util";

/**
  The chain protocol is used to point to onchain objects like assets or NFT collections. URIs must adhere to the the CAIP-19 asset URI specification.

  Example (NFT): chain://eip155:1/erc721:0xa723a8a69d9b8cf0bc93b92f9cb41532c1a27f8f/11
  Example (NFT collection): chain://eip155:1/erc721:0xa723a8a69d9b8cf0bc93b92f9cb41532c1a27f8f

  Protocol Identifier Regex: ^chain:\/\/
  Protocol URI Regex: ^eip155:(\d+)\/([a-zA-Z0-9]+):([a-zA-Z0-9]+)(\/([a-zA-Z0-9]+))?$
 */
async function handleCaip19Url(url: string): Promise<UrlMetadata | null> {
  const [, , prefixAndChainId, prefixAndContractAddress, tokenId] =
    url.split("/");

  let [, chainId] = prefixAndChainId.split(":");
  const [, contractAddress] = prefixAndContractAddress.split(":");

  if (!chainId) {
    // Many of the of CAIP-19 URLs today are malformed missing the chain ID, default to ethereum
    // console.warn(
    //   "No chain ID found in CAIP-19 URL, defaulting to ethereum",
    //   url
    // );
    chainId = "1";
  }

  const chain = chainById[chainId].network;

  // Default mint url
  const mintUrl = `https://mint.fun/${chain}/${contractAddress}`;

  const nftMetadata = await fetchNFTMetadata({
    contractAddress,
    chain,
    mintUrl,
  });

  const urlMetadata: UrlMetadata = toUrlMetadata(nftMetadata);

  return urlMetadata;
}

const urlHandler: UrlHandler = {
  matchers: ["^chain://"],
  handler: handleCaip19Url,
};

export default urlHandler;
