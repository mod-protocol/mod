export const dynamic = "force-dynamic";
export const maxDuration = 20;

import { NextResponse, NextRequest } from "next/server";
import { UrlMetadata } from "@mod-protocol/core";
import urlHandlers from "./lib/url-handlers";

export async function GET(request: NextRequest) {
  const url = decodeURIComponent(request.nextUrl.searchParams.get("url"));
  try {
    let urlMetadata: UrlMetadata | null = null;
    let handlerName: string | null = null;
    for (const { matchers, handler, name } of urlHandlers) {
      if (matchers.some((matcher) => url.match(matcher))) {
        urlMetadata = await handler(url);
        handlerName = name;
        // Stop after successful match
        if (urlMetadata) break;
      }
    }

    if (!urlMetadata) {
      throw new Error(`No handler returned a valid response for ${url}`);
    }

    return NextResponse.json({ ...urlMetadata, handlerName });
  } catch (err) {
    console.error(`Error fetching metadata for ${url}`);
    console.error(err);
    return NextResponse.json(
      { message: err.message },
      { status: err.status ?? 400 }
    );
  }
}
