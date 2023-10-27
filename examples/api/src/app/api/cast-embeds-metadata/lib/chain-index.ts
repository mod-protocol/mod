import * as chains from "viem/chains";

export const chainById = Object.values(chains).reduce(
  (acc: { [key: number]: chains.Chain }, cur) => {
    if (cur.id) acc[cur.id] = cur;
    return acc;
  },
  {}
);
chainById[1] = { ...chains.mainnet, network: "ethereum" }; // Convenience: rename 'homestead' to 'ethereum'

export const chainByName = Object.values(chains).reduce(
  (acc: { [key: string]: chains.Chain }, cur) => {
    if (cur.network) acc[cur.network] = cur;
    return acc;
  },
  { ethereum: { ...chains.mainnet, network: "ethereum" } } // Convenience for ethereum, which is 'homestead' otherwise
);
