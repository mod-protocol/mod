import { NextResponse, NextRequest } from "next/server";
import channels from "./channels.json";

// Update Channels from: https://github.com/neynarxyz/farcaster-channels/blob/main/warpcast.json

const channelsWithHome = [
  {
    name: "Home",
    parent_url: null,
    image: "https://warpcast.com/~/channel-images/home.png",
    channel_id: "home",
  },
  ...channels.sort((a, b) => (a.name < b.name ? -1 : 1)),
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  return NextResponse.json({
    channels: channelsWithHome.filter((channel) =>
      channel.name.toLowerCase().includes(q.toLowerCase())
    ),
  });
}
