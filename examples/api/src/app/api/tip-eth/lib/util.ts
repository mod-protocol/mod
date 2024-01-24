import { createPublicClient, http } from "viem";
import * as chains from "viem/chains";

export function numberWithCommas(x: string | number) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}
export async function getEthUsdPrice(): Promise<number> {
  const client = createPublicClient({
    transport: http(),
    chain: chains.mainnet,
  });

  // roundId uint80, answer int256, startedAt uint256, updatedAt uint256, answeredInRound uint80
  const [, answer] = await client.readContract({
    abi: [
      {
        inputs: [],
        name: "latestRoundData",
        outputs: [
          { internalType: "uint80", name: "roundId", type: "uint80" },
          { internalType: "int256", name: "answer", type: "int256" },
          { internalType: "uint256", name: "startedAt", type: "uint256" },
          { internalType: "uint256", name: "updatedAt", type: "uint256" },
          { internalType: "uint80", name: "answeredInRound", type: "uint80" },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "latestRoundData",
    // https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1&search=usdc#ethereum-mainnet
    address: "0x986b5E1e1755e3C2440e960477f25201B0a8bbD4",
  });

  const ethPriceUsd = (1 / Number(answer)) * 1000000000000000000;

  return ethPriceUsd;
}
export async function getBalancesOnChains({
  address,
  chains,
  minBalance = BigInt(0),
}: {
  address: `0x${string}`;
  chains: chains.Chain[];
  minBalance?: bigint;
}) {
  const balances = await Promise.all(
    chains.map(async (chain) => {
      const client = createPublicClient({
        transport: http(),
        chain,
      });
      const balance = await client.getBalance({ address });
      return {
        chain,
        balance,
      };
    })
  );
  return balances
    .filter((b) => b.balance > minBalance)
    .sort((a, b) => Number(b.balance - a.balance));
}
export async function getVerifiedAddress(
  fid: string
): Promise<`0x${string}` | null> {
  const verificationsRes = await fetch(
    `${
      process.env.HUB_HTTP_ENDPOINT || "https://nemes.farcaster.xyz:2281"
    }/v1/verificationsByFid?fid=${fid}`
  );
  const verificationsResJson = await verificationsRes.json();
  const verification = verificationsResJson.messages[0];
  if (!verification) {
    return null;
  }
  const { address } = verification.data.verificationAddEthAddressBody;
  return address;
}
