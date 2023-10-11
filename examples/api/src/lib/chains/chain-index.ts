import * as chains from "viem/chains";

export const chainById = Object.values(chains).reduce(
  (acc: { [key: number]: chains.Chain }, cur) => {
    if (cur.id) acc[cur.id] = cur;
    return acc;
  },
  {}
);

export const chainByName = Object.values(chains).reduce(
  (acc: { [key: string]: chains.Chain }, cur) => {
    if (cur.network) acc[cur.network] = cur;
    return acc;
  },
  { ethereum: chains.mainnet } // Convenience for ethereum, which is 'homestead' otherwise
);
