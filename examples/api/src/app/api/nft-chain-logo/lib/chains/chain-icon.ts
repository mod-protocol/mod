import { chainById } from "./chain-index";

export async function resolveChainIcon(chainId: number): Promise<string> {
  const chain = await fetch(
    `https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/chains/eip155-${chainId}.json`
  );
  if (!chain.ok) {
    return null;
  }
  const chainJson = await chain.json();

  const iconRes = await fetch(
    `https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/icons/${chainJson.icon}.json`
  );
  if (!iconRes.ok) {
    return null;
  }
  const icons = await iconRes.json();
  let { url } = icons[0];

  if (url) {
    if (url.startsWith("ipfs://")) {
      url = url.replace(
        "ipfs://",
        "https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/iconsDownload/"
      );
    }
  } else {
    // Fall back to alternative asset db, might want to check if it actually exists before returning
    const chain = chainById[chainId];
    url = `https://raw.githubusercontent.com/DefiLlama/icons/master/assets/agg_icons/${chain.network}.jpg`;
  }

  return url;
}
