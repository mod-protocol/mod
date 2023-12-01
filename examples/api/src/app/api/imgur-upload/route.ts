import { NextRequest, NextResponse } from "next/server";

const { NEXT_PUBLIC_IMGUR_CLIENT_ID } = process.env;

const uploadToImgur = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("type", "file");
  const response = await fetch("https://api.imgur.com/3/upload", {
    method: "POST",
    headers: {
      Authorization: `Client-ID ${NEXT_PUBLIC_IMGUR_CLIENT_ID}`, // replace with your Client ID
    },
    body: formData,
  });

  if (!response.ok) {
    return null;
  }

  const { data } = await response.json();

  if (!data) return null;

  return data.link;
};

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const file: File = form.get("file") as File;

  try {
    const url = await uploadToImgur(file);

    if (url) {
      return NextResponse.json({ url });
    } else {
      return NextResponse.json(
        { error: "Failed to upload to Imgur" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// needed for preflight requests to succeed
export const OPTIONS = async (request: NextRequest) => {
  return NextResponse.json({});
};
