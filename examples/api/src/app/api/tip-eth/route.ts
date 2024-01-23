import { NextRequest } from "next/server";
import { formatEther, parseEther } from "viem";
import * as chains from "viem/chains";
import {
  getBalancesOnChains,
  getEthUsdPrice,
  getVerifiedAddress,
  numberWithCommas,
} from "./lib/util";

export async function GET(request: NextRequest) {
  const fid = request.nextUrl.searchParams.get("fid");
  const amountUsd = request.nextUrl.searchParams.get("amountUsd");
  const fromAddress = request.nextUrl.searchParams.get("fromAddress");

  if (!fid || !amountUsd || !fromAddress) {
    return new Response("Missing parameters", { status: 400 });
  }

  // TODO: Add message via tx data

  const [address, ethPriceUsd] = await Promise.all([
    getVerifiedAddress(fid),
    getEthUsdPrice(),
  ]);
  if (!address) {
    return new Response("No verified addresses for user", { status: 404 });
  }

  const amountEth = parseEther(
    (parseFloat(amountUsd) / ethPriceUsd).toString()
  );

  // Find a chain where both users have balances
  const candidateChains = [
    chains.arbitrum,
    chains.optimism,
    chains.base,
    chains.zora,
  ];

  const [senderBalances, recipientBalances] = await Promise.all([
    getBalancesOnChains({
      address: fromAddress as `0x${string}`,
      chains: candidateChains,
      minBalance: amountEth,
    }),
    getBalancesOnChains({
      address: address,
      chains: candidateChains,
    }),
  ]);
  const senderChainIds = senderBalances.map(({ chain }) => chain.id);

  // Suggested chain is the one where the sender has enough balance and the recipient has the most balance
  const suggestedChain =
    recipientBalances.filter(({ chain }) =>
      senderChainIds.includes(chain.id)
    )[0]?.chain || senderBalances[0]?.chain;

  if (!suggestedChain) {
    return Response.json(
      { message: "No chain with enough ETH balance" },
      { status: 404 }
    );
  }

  return Response.json({
    tx: {
      to: address,
      from: fromAddress,
      value: amountEth.toString(),
      data: "0x",
    },
    valueUsdFormatted: `${numberWithCommas(parseFloat(amountUsd).toFixed(2))}`,
    valueEthFormatted: parseFloat(formatEther(amountEth)).toPrecision(4),
    suggestedChain: suggestedChain,
    chainBalances: senderBalances.map(({ chain, balance }) => ({
      chain,
      balance: balance.toString(),
      balanceUsd: ethPriceUsd
        ? ethPriceUsd * parseFloat(formatEther(balance))
        : undefined,
    })),
  });
}

// needed for preflight requests to succeed
export const OPTIONS = async (request: NextRequest) => {
  // Return Response
  return Response.json({});
};
