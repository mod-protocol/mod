import { FarcasterMention } from "@mod-protocol/farcaster";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<
  | NextResponse<{
      message: string;
    }>
  | NextResponse<{
      data: FarcasterMention;
    }>
> {
  const username = request.nextUrl.searchParams.get("username");

  const req = await fetch(
    `https://api.neynar.com/v1/farcaster/user-by-username?api_key=${
      process.env.NEYNAR_API_SECRET
    }&username=${encodeURIComponent(username)}`
  );

  if (req.status >= 400) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: req.status }
    );
  }

  const result = await req.json();
  const user = result.result.user;

  return NextResponse.json({
    data: {
      fid: user.fid,
      display_name: user.display_name,
      username: user.username,
      avatar_url: user.pfp_url,
    },
  });
}

// Alternative query if implementing yourself
// `
//  select
//     fid, display_name, username, avatar_url, LEAST(extensions.levenshtein(display_name, search_query::text, 1, 1, 3), extensions.levenshtein(username, search_query::text, 1, 1, 3)) as levenshtein_distance
//     from
//       profiles
//     where
//       display_name ilike  search_query || '%' or username ilike  search_query || '%'
//     order by
//       LEAST(extensions.levenshtein(display_name, search_query::text, 1, 1, 3) + 1, extensions.levenshtein(username, search_query::text, 1, 1, 3)) asc
//     limit 10
// `
