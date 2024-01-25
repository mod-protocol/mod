import { NextRequest, NextResponse } from "next/server";
import { fromHex } from "viem2";
import {
  chainByName,
  getEthUsdPrice,
  getSwapTransaction,
  parseInfoRequestParams,
} from "../lib/utils";

export async function POST(request: NextRequest) {
  const { blockchain, tokenAddress } = parseInfoRequestParams(request);

  const userAddress = request.nextUrl.searchParams
    .get("walletAddress")
    ?.toLowerCase();
  const buyAmountUsd = parseFloat(
    request.nextUrl.searchParams.get("buyAmountUsd")
  );

  if (!tokenAddress || !blockchain) {
    return new Response("Missing tokenAddress or blockchain", {
      status: 400,
    });
  }

  const chain = chainByName[blockchain];

  const ethPriceUsd = await getEthUsdPrice();
  const ethInputAmount = (buyAmountUsd / ethPriceUsd).toString();

  const swapRoute = await getSwapTransaction({
    blockchain,
    ethInputAmountFormatted: ethInputAmount,
    outTokenAddress: tokenAddress,
    recipientAddress: userAddress,
    feePercentageInt: 5,
    feeRecipientAddress: process.env.ERC_20_FEE_RECIPIENT,
  });

  const tx = swapRoute.methodParameters;

  return NextResponse.json({
    transaction: {
      from: userAddress,
      to: tx.to,
      value: fromHex(tx.value as `0x${string}`, {
        to: "bigint",
      }).toString(),
      data: tx.calldata,
    },
    explorer: chain.blockExplorers.default,
  });
}
