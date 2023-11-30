import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const imageResponse = await fetch(
    `https://api.openai.com/v1/images/generations`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CHATGPT_API_SECRET}`,
        "OpenAI-Organization": `${process.env.CHATGPT_ORGANIZATION_ID}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: body.prompt,
      }),
    }
  );

  if (!imageResponse.ok) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: imageResponse.status }
    );
  }

  const responseBody: {
    created: number;
    data: Array<{ url: string; revised_prompt: string }>;
  } = await imageResponse.json();

  return NextResponse.json({
    response: responseBody,
  });
}

// needed for preflight requests to succeed
export const OPTIONS = async (request: NextRequest) => {
  // Return Response
  return NextResponse.json({});
};
