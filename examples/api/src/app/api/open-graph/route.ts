import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // To self host, use https://github.com/microlinkhq/metascraper
    const response = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(
        request.nextUrl.searchParams.get("url")
      )}`
    );

    const data = await response.json();

    return NextResponse.json(data.data);
  } catch (err) {
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: err.status }
    );
  }
}
