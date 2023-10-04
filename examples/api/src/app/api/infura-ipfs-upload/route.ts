import { NextRequest, NextResponse } from "next/server";

const { INFURA_API_KEY, INFURA_API_SECRET } = process.env;

export async function POST(request: NextRequest) {
  const form = await request.formData();

  const uploadRes: Response | null = await fetch(
    "https://ipfs.infura.io:5001/api/v0/add",
    {
      method: "POST",
      body: form,
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(INFURA_API_KEY + ":" + INFURA_API_SECRET).toString(
            "base64"
          ),
      },
    }
  ).catch(() => null);

  if (!uploadRes?.ok) {
    return NextResponse.json(
      { message: "Something was wrong" },
      { status: 500 }
    );
  }

  const json = await uploadRes.json();

  return NextResponse.json({
    url: `https://discove.infura-ipfs.io/ipfs/${json.Hash}`,
  });
}
