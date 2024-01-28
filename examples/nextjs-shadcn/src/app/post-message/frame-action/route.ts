import { NextRequest, NextResponse } from "next/server";

//proxy so as to not expose neynar api key
export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.json();

  try {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        api_key: process.env.NEYNAR_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const res = await fetch(
      "https://api.neynar.com/v2/farcaster/frame/action",
      options
    );
    const resJson = (await res.json()) as {
      version: string;
      frames_url: string;
      image: string;
      buttons: Array<{ index: number; title: string }>;
      post_url: string;
    };

    return NextResponse.json(
      {
        "fc:frame": resJson.version,
        "fc:frame:image": resJson.image,
        "fc:frame:post_url": resJson.post_url,
        ...resJson.buttons.reduce((prev, next, i) => {
          return {
            ...prev,
            ["fc:frame:button:" + next.index]: next.title,
          };
        }, {}),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
