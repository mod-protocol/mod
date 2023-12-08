import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // given a poll embed, fetch all responses, filter them by date, parse them and tally them.
  const embedUrl = request.nextUrl.searchParams.get("embedUrl");
  const endDate = request.nextUrl.searchParams.get("endDate");
  const fid = request.nextUrl.searchParams.get("fid");

  // fetch all the casts that embed this Poll.
  const req = await fetch(
    // undocumented API for us
    `https://api.neynar.com/v2/farcaster/feed?api_key=${
      process.env.NEYNAR_API_SECRET
    }&feed_type=filter&filter_type=embed_url&embed_url=${encodeURIComponent(
      embedUrl
    )}`
  );

  if (req.status >= 400) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: req.status }
    );
  }

  const castResults = await req.json();

  let allDirectReplies = [];
  // for each castResult, fetch all responses
  await Promise.all(
    castResults.casts.map(async (cast) => {
      // fetch all replies in thread
      const req = await fetch(
        // undocumented API for us
        `https://api.neynar.com/v1/farcaster/all-casts-in-thread?api_key=${process.env.NEYNAR_API_SECRET}&threadHash=${cast.threadHash}`
      );

      const innerCastResults = await req.json();
      allDirectReplies.push(
        ...innerCastResults.result.filter((c) => c.parentHash === cast.hash)
      );

      // use only replies with parent_hash=cast.hash
    })
  );

  // filter by before endDate of poll
  allDirectReplies = allDirectReplies.filter(
    (cast) => new Date(cast.timestamp).getTime() < new Date(endDate).getTime()
  );

  // filter by being a valid vote
  allDirectReplies = allDirectReplies.filter((cast) =>
    cast.text.match(/^(1|2|3|4)(\*|\!|\;|\:|\)|\,| |\.|$)/)
  );

  // allow multiple answers? no
  // for now just take the last answer for each user
  allDirectReplies = allDirectReplies.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  const votedFids = {};
  const tallies = {
    number_respondents: 0,
    results: {
      choice1: 0,
      choice2: 0,
      choice3: 0,
      choice4: 0,
    },
  };
  // count up all the unique votes
  for (const cast of allDirectReplies) {
    if (!votedFids.hasOwnProperty(cast.author.fid)) {
      tallies.number_respondents += 1;
      votedFids[cast.author.fid] = true;
      tallies.results[`choice${cast.text[0]}`] += 1;
    }
  }

  return NextResponse.json({
    has_voted: votedFids.hasOwnProperty(Number(fid)),
    has_ended: new Date(endDate).getTime() < new Date().getTime(),
    ...tallies,
  });
}
