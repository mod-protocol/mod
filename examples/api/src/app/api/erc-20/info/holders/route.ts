import { NextRequest } from "next/server";
import {
  getFollowingHolderInfo,
  parseInfoRequestParams,
} from "../../lib/utils";

export async function GET(request: NextRequest) {
  const { fid, tokenAddress, blockchain } = parseInfoRequestParams(request);
  const result = await getFollowingHolderInfo({
    fid,
    blockchain,
    tokenAddress,
  });

  if (!tokenAddress || !blockchain) {
    return new Response("Missing tokenAddress or blockchain", {
      status: 400,
    });
  }

  return Response.json(result, {
    headers: new Headers({
      // Cache for 1 day
      "Cache-Control": "public, max-age=86400, immutable",
    }),
  });
}
