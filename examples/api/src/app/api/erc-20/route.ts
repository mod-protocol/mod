import { NextRequest, NextResponse } from "next/server";
import {
  getFollowingHolderInfo,
  getPriceData,
  parseTokenParam,
  tokenInfo,
} from "./lib/utils";

export async function GET(request: NextRequest) {
  const fid = request.nextUrl.searchParams.get("fid")?.toLowerCase();
  const token = request.nextUrl.searchParams.get("token")?.toLowerCase();
  let tokenAddress = request.nextUrl.searchParams
    .get("tokenAddress")
    ?.toLowerCase();
  let blockchain = request.nextUrl.searchParams
    .get("blockchain")
    ?.toLowerCase();

  if (token) {
    const parsedToken = parseTokenParam(token);
    tokenAddress = parsedToken.tokenAddress;
    blockchain = parsedToken.blockchain;
  }

  if (!tokenAddress) {
    return NextResponse.json({
      error: "Missing tokenAddress",
    });
  }

  if (!blockchain) {
    return NextResponse.json({
      error: "Missing or invalid blockchain",
    });
  }

  const [holderData, priceData, tokenData] = await Promise.all([
    getFollowingHolderInfo({
      blockchain: blockchain,
      tokenAddress: tokenAddress,
      fid: fid,
    }),
    getPriceData({
      blockchain: blockchain,
      tokenAddress: tokenAddress,
    }),
    tokenInfo({
      tokenAddress,
      blockchain,
    }),
  ]);

  return NextResponse.json({
    holderData: {
      holders: [...(holderData || [])],
      holdersCount: holderData?.length || 0,
    },
    priceData,
    tokenData,
  });
}

// needed for preflight requests to succeed
export const OPTIONS = async (request: NextRequest) => {
  return NextResponse.json({});
};
