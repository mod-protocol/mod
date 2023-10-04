import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const q =
    request.nextUrl.searchParams.get("q") ||
    // neynar won't give a response if the query is empty, so we fallback to "a"
    "a";

  const req = await fetch(
    `https://api.neynar.com/v2/farcaster/user/search?api_key=${
      process.env.NEYNAR_API_SECRET
      // TODO: viewer_fid
    }&viewer_fid=3&q=${encodeURIComponent(q)}`
  );

  if (req.status >= 400) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: req.status }
    );
  }

  const mentionResults = await req.json();

  return NextResponse.json({
    data: mentionResults.result.users.map((user) => ({
      fid: user.fid,
      display_name: user.display_name,
      username: user.username,
      avatar_url: user.pfp_url,
    })),
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
