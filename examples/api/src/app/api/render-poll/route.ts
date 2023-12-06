import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // given a cast hash, fetch the responses, parse them and tally them.

  return NextResponse.json({
    results: "",
  });
}
