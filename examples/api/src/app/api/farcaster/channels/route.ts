import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  const channelsRes = await fetch(
    "https://api.neynar.com/v2/farcaster/channel/list",
    {
      headers: {
        api_key: process.env.NEYNAR_API_SECRET,
      },
    }
  );
  const result = await channelsRes.json();

  const channels = result.channels.map((channel) => ({
    name: channel.name,
    parent_url: channel.url,
    image: channel.image_url,
    channel_id: channel.id,
  }));

  const channelsWithHome = [
    {
      name: "Home",
      parent_url: null,
      image: "https://warpcast.com/~/channel-images/home.png",
      channel_id: "home",
    },
    ...channels.sort((a, b) => (a.name < b.name ? -1 : 1)),
  ];

  return NextResponse.json({
    channels: !!q
      ? channelsWithHome.filter((channel) => {
          return channel.name.toLowerCase().includes(q.toLowerCase());
        })
      : channelsWithHome,
  });
}
