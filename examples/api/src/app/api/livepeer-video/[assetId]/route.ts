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

export const GET = async (
  req: NextRequest,
  { params }: { params: { assetId: string } }
) => {
  const assetRequest = await fetch(
    `https://livepeer.studio/api/asset/${params.assetId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.LIVEPEER_API_SECRET}`,
      },
    }
  );

  const assetResponseJson = await assetRequest.json();
  const { playbackUrl } = assetResponseJson;

  if (!playbackUrl) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json({
    url: playbackUrl,
  });
};

export const runtime = "edge";
