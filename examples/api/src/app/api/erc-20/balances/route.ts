import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, formatEther, http } from "viem2";
import {
  chainByName,
  getEthUsdPrice,
  numberWithCommas,
  parseTokenParam,
  parseInfoRequestParams,
} from "../lib/utils";

export async function GET(request: NextRequest) {
  const { blockchain, tokenAddress } = parseInfoRequestParams(request);
  const userAddress = request.nextUrl.searchParams
    .get("walletAddress")
    ?.toLowerCase();
  const buyOptionsUsd = request.nextUrl.searchParams
    .get("buyOptionsUsd")
    .split(",")
    .map((x) => parseFloat(x));

  if (!tokenAddress || !blockchain) {
    return new Response("Missing tokenAddress or blockchain", {
      status: 400,
    });
  }

  // Get eth balance on blockchain
  const chain = chainByName[blockchain];
  const client = createPublicClient({
    transport: http(),
    chain,
  });

  const [balance, ethPriceUsd] = await Promise.all([
    client.getBalance({
      address: userAddress as `0x${string}`,
    }),
    getEthUsdPrice(),
  ]);

  const ethBalanceUsd = parseFloat(formatEther(balance)) * Number(ethPriceUsd);

  return NextResponse.json({
    ethBalance: numberWithCommas(
      parseFloat(formatEther(balance)).toPrecision(4)
    ),
    ethPriceUsd,
    ethBalanceUsd: numberWithCommas(ethBalanceUsd.toFixed(2)),
    chain: {
      id: chain.id,
      name: chain.name,
    },
    buyOptionsUsd: buyOptionsUsd.map((x) => ethBalanceUsd > x),
  });
}
