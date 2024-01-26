import { NextRequest } from "next/server";
import { getPriceData, parseInfoRequestParams } from "../../lib/utils";

export async function GET(request: NextRequest) {
  const { tokenAddress, blockchain } = parseInfoRequestParams(request);
  const result = await getPriceData({
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
      // Cache for 1 hour
      "Cache-Control": "public, max-age=3600, immutable",
    }),
  });
}
