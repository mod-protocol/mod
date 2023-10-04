import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  // https://docs.livepeer.org/reference/api#upload-an-asset
  const requestedUrlReq = await fetch(
    "https://livepeer.studio/api/asset/request-upload",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LIVEPEER_API_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "video.mp4",
        staticMp4: true,
        playbackPolicy: {
          type: "public",
        },
        storage: {
          ipfs: true,
        },
      }),
    }
  );

  const requestedUrl = await requestedUrlReq.json();

  const url = requestedUrl.url;

  const videoUpload = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.LIVEPEER_API_SECRET}`,
      "Content-Type": "video/mp4",
    },
    body: form.get("file"),
  });

  if (videoUpload.status >= 400) {
    return NextResponse.json(
      { message: "Something went wrong" },
      {
        status: videoUpload.status,
      }
    );
  }

  // simpler than webhooks, but constrained by serverless function timeout time
  let isUploadSuccess = false;
  let maxTries = 10;
  let tries = 0;
  while (!isUploadSuccess && tries < maxTries) {
    const details = await fetch(
      `https://livepeer.studio/api/asset/${requestedUrl.asset.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.LIVEPEER_API_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );
    const detailsJson = await details.json();

    if (detailsJson.status !== "waiting") {
      break;
    }

    // wait 1s
    await new Promise((resolve) => setTimeout(() => resolve(null), 1000));
    tries = tries + 1;
  }

  if (tries === maxTries) {
    return NextResponse.json(
      {
        message: "Took too long to upload. Try a smaller file",
      },
      { status: 400 }
    );
  }

  // hack, wait at least 3s to make sure url doesn't error
  await new Promise((resolve) => setTimeout(() => resolve(null), 3000));

  return NextResponse.json({ data: requestedUrl });
}

// needed for preflight requests to succeed
export const OPTIONS = async (request: NextRequest) => {
  return NextResponse.json({});
};
