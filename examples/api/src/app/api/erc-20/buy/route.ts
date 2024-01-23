import { NextRequest, NextResponse } from "next/server";
import { parseEther } from "viem2";
import {
  chainByName,
  getEthUsdPrice,
  parseInfoRequestParams,
} from "../lib/utils";

export async function POST(request: NextRequest) {
  const { blockchain, tokenAddress } = parseInfoRequestParams(request);

  // TODO: Expose separate execution/receiver addresses
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
  const ethInputAmount = parseEther((buyAmountUsd / ethPriceUsd).toString());

  const swapCalldataParams: {
    src: string;
    dst: string;
    amount: string;
    from: string;
    slippage: string;
    receiver: string;
    fee?: string;
    referrer?: string;
  } = {
    src: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // Native ETH
    dst: tokenAddress,
    amount: ethInputAmount.toString(),
    from: userAddress,
    slippage: "5",
    receiver: userAddress,
  };

  // TODO: Use Uniswap to take advantage of configurable fee
  // The referrer here is the 1inch referral program recipient (20% of surplus from trade)
  // See https://blog.1inch.io/why-should-you-integrate-1inch-apis-into-your-service/
  if (process.env.ERC_20_FEE_RECIPIENT) {
    swapCalldataParams.referrer = process.env.ERC_20_FEE_RECIPIENT;
  }

  const swapCalldataRes = await fetch(
    `https://api.1inch.dev/swap/v5.2/${chain.id}/swap?${new URLSearchParams(
      swapCalldataParams
    ).toString()}`,
    {
      headers: {
        Authorization: `Bearer ${process.env["ERC_20_1INCH_API_KEY"]}`,
      },
    }
  );

  const swapCalldataJson = await swapCalldataRes.json();

  return NextResponse.json({
    transaction: swapCalldataJson.tx,
    explorer: chain.blockExplorers.default,
  });
}
