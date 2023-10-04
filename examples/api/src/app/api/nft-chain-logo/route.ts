import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const chain = request.nextUrl.searchParams.get("chain");
  const url = new URL("https://warpcast.com/");

  if (!chain || chain === "base") {
    url.pathname = "~/images/og/BaseChain.webp";
  } else {
    // TODO: other chains
    url.pathname = "~/images/og/BaseChain.webp";
  }

  const res = await fetch(url);

  return new Response(res.body, {
    status: res.status,
    headers: res.headers,
  });
}
