export const dynamic = "force-dynamic";

import { NextResponse, NextRequest } from "next/server";
import { UrlMetadata } from "@mod-protocol/core";
import urlHandlers from "./lib/url-handlers";

export async function GET(request: NextRequest) {
  try {
    const url = decodeURIComponent(request.nextUrl.searchParams.get("url"));
    let urlMetadata: UrlMetadata | null = null;
    for (const { matchers, handler } of urlHandlers) {
      if (matchers.some((matcher) => url.match(matcher))) {
        urlMetadata = await handler(url);
        // Stop after successful match
        if (urlMetadata) break;
      }
    }

    return NextResponse.json(urlMetadata);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: err.message },
      { status: err.status ?? 400 }
    );
  }
}
