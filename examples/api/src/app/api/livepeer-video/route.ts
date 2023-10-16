import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const form = await request.formData();

  const controller = new AbortController();
  const signal = controller.signal;

  // Cancel upload if it takes longer than 15s
  setTimeout(() => {
    controller.abort();
  }, 15_000);

  const uploadRes: Response | null = await fetch(
    "https://ipfs.infura.io:5001/api/v0/add",
    {
      method: "POST",
      body: form,
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.INFURA_API_KEY + ":" + process.env.INFURA_API_SECRET
          ).toString("base64"),
      },
      signal,
    }
  );

  const { Hash: hash } = await uploadRes.json();

  const responseData = { url: `ipfs://${hash}` };

  return NextResponse.json({ data: responseData });
}

// needed for preflight requests to succeed
export const OPTIONS = async (request: NextRequest) => {
  return NextResponse.json({});
};

export const GET = async (request: NextRequest) => {
  let url = request.nextUrl.searchParams.get("url");

  // Exchange for livepeer url
  const cid = url.replace("ipfs://", "");
  const gatewayUrl = `${process.env.IPFS_DEFAULT_GATEWAY}/${cid}`;

  // Get HEAD to get content type
  const response = await fetch(gatewayUrl, { method: "HEAD" });
  const contentType = response.headers.get("content-type");

  // TODO: Cache this
  const uploadRes = await fetch(
    "https://livepeer.studio/api/asset/upload/url",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LIVEPEER_API_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "filename.mp4",
        staticMp4: contentType === "video/mp4" ? true : false,
        playbackPolicy: {
          type: "public",
        },
        url: gatewayUrl,
      }),
    }
  );

  if (!uploadRes.ok) {
    // console.error(uploadRes.status, await uploadRes.text());
    return NextResponse.error();
  }

  const { asset } = await uploadRes.json();

  const playbackUrl = `https://lp-playback.com/hls/${asset.playbackId}/index.m3u8`;

  return NextResponse.json({
    url: playbackUrl,
    fallbackUrl: gatewayUrl,
    mimeType: contentType,
  });
};

export const runtime = "edge";
