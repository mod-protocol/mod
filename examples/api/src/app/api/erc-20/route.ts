import { NextRequest } from "next/server";
import {
  getFollowingHolderInfo,
  getPriceData,
  parseTokenParam,
  getTokenInfo,
} from "./lib/utils";

export async function GET(request: NextRequest) {
  const fid = request.nextUrl.searchParams.get("fid");
  const token = request.nextUrl.searchParams.get("token")?.toLowerCase();
  let tokenAddress = request.nextUrl.searchParams
    .get("tokenAddress")
    ?.toLowerCase();
  let blockchain = request.nextUrl.searchParams
    .get("blockchain")
    ?.toLowerCase();
  const methodName = request.nextUrl.searchParams
    .get("function")
    ?.toLowerCase();

  if (token) {
    const parsedToken = parseTokenParam(token);
    tokenAddress = parsedToken.tokenAddress;
    blockchain = parsedToken.blockchain;
  }

  const { fn, options } = {
    holders: {
      fn: getFollowingHolderInfo,
      options: {
        headers: new Headers({
          "Cache-Control": "public, max-age=3600, immutable",
        }),
      },
    },
    price: {
      fn: getPriceData,
      options: {
        headers: new Headers({
          "Cache-Control": "public, max-age=3600, immutable",
        }),
      },
    },
    token: {
      fn: getTokenInfo,
      options: {
        headers: new Headers({
          "Cache-Control": "public, max-age=3600, immutable",
        }),
      },
    },
  }[methodName];

  if (!fn) {
    return Response.json({
      error: "Invalid function",
    });
  }

  const result = await fn({
    fid,
    tokenAddress,
    blockchain,
  });

  return Response.json(result, {
    ...options,
  });
}

// needed for preflight requests to succeed
export const OPTIONS = async (request: NextRequest) => {
  return Response.json({});
};
