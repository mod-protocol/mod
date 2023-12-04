import { NextRequest } from "next/server";
import { resolveChainIcon } from "./lib/chains/chain-icon";
import { chainById, chainByName } from "./lib/chains/chain-index";

export async function GET(request: NextRequest) {
  let chainNameOrId =
    request.nextUrl.searchParams.get("chain") ||
    parseInt(request.nextUrl.searchParams.get("chain-id"));

  const chain = chainById[chainNameOrId] || chainByName[chainNameOrId];

  if (!chain) {
    return new Response(null, {
      status: 404,
    });
  }

  let chainIconUrl = await resolveChainIcon(chain.id);

  const res = await fetch(chainIconUrl);

  return new Response(res.body, {
    status: res.status,
    headers: res.headers,
  });
}
