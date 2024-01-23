import { NextRequest } from "next/server";
import { getTokenInfo, parseInfoRequestParams } from "../../lib/utils";

export async function GET(request: NextRequest) {
  const { tokenAddress, blockchain } = parseInfoRequestParams(request);
  const result = await getTokenInfo({
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
      // Cache for 1 month
      "Cache-Control": "public, max-age=2592000, immutable",
    }),
  });
}
