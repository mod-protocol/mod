import toNumber from "lodash.tonumber";
import toString from "lodash.tostring";
import { NextRequest, NextResponse } from "next/server";

const { GIPHY_API_KEY } = process.env;

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  const type = request.nextUrl.searchParams.get("type") || "gifs";
  const limit = Math.max(
    Math.min(toNumber(request.nextUrl.searchParams.get("limit")) || 24, 100),
    24
  );
  const offset = request.nextUrl.searchParams.get("offset") || 0;

  if (!["gifs", "stickers"].includes(type)) {
    return NextResponse.json(
      {
        message: `Unrecognized type '${type}'; valid options are: gifs, stickers`,
      },
      { status: 400 }
    );
  }

  const requestUrl = new URL("https://api.giphy.com/");
  requestUrl.searchParams.set("api_key", GIPHY_API_KEY);
  requestUrl.searchParams.set("limit", toString(limit));
  requestUrl.searchParams.set("offset", toString(offset));
  requestUrl.searchParams.set("rating", "g");
  requestUrl.searchParams.set("bundle", "messaging_non_clips");

  if (!q) {
    requestUrl.pathname = `/v1/${type}/trending`;
  } else {
    requestUrl.pathname = `/v1/${type}/search`;
    requestUrl.searchParams.set("q", q);
    requestUrl.searchParams.set("lang", "en");
  }

  const res = await fetch(requestUrl.href).then((res) => res.json());

  return NextResponse.json({
    list: res.data.map((item) => item.images.original.url),
    hasMore:
      res.pagination.total_count > res.pagination.count + res.pagination.offset,
  });
}
