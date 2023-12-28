import { NextRequest, NextResponse } from "next/server";
import { Channel } from "@mod-protocol/farcaster";
import { Levenshtein } from "./levenshtein-distance";

// todo we should add cache headers to this
export async function GET(
  request: NextRequest
): Promise<NextResponse<{ channels: Array<Channel> } | { message: string }>> {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q").toLowerCase();
  const hideHome = searchParams.get("hideHome") === "true";

  const channelsRes = await fetch(
    "https://api.neynar.com/v2/farcaster/channel/list",
    {
      headers: {
        api_key: process.env.NEYNAR_API_SECRET,
      },
    }
  );

  if (channelsRes.status >= 400) {
    console.error(channelsRes.statusText);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: channelsRes.status }
    );
  }

  const result = await channelsRes.json();

  const channels = result.channels;

  const channelsWithHome = hideHome
    ? channels
    : [
        {
          id: "",
          description: "followers",
          name: "Home",
          object: "channel",
          parent_url: null,
          image_url: "https://warpcast.com/~/channel-images/home.png",
          channel_id: "home",
        },
        ...channels,
      ];

  if (!!q) {
    const channelsWithLevenshteinDistance = channelsWithHome.map((channel) => ({
      channel: channel,
      // levenshtein distance is helpful to suggest channels despite typos in the query, a lower distance is better
      relevancy_score: Math.min(
        // since channel name lengths are limited, performance issues with this algo which is O(n^2) where n is string length
        // which is reasonably bounded, however with thousands of channel results we may want to reconsider
        Levenshtein.get(q, channel.name),
        Levenshtein.get(q, channel.id),
        // Make sure query "cart" resolves to a lower distance for "cartoons" vs "darts", but not lower than a channel called "cart"
        channel.name.toLowerCase().startsWith(q) ? 1 : Infinity,
        channel.id.toLowerCase().startsWith(q) ? 1 : Infinity
      ),
    }));

    return NextResponse.json({
      channels: channelsWithLevenshteinDistance
        .filter((envelopedChannel) => {
          return envelopedChannel.relevancy_score <= 3;
        })
        // fixme: check correct order
        .sort((a, b) => a.relevancy_score - b.relevancy_score)
        .map((envelopedChannel) => envelopedChannel.channel),
    });
  } else {
    return NextResponse.json({
      channels: channelsWithHome.sort((a, b) => {
        // put home channel first, then alphabetical
        return a.id === "" ? -1 : b.id === "" ? 1 : a.name < b.name ? -1 : 1;
      }),
    });
  }
}
