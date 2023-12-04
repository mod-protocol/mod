import { NextRequest, NextResponse } from "next/server";
import { ChatGPTAPI } from "chatgpt";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const api = new ChatGPTAPI({
    apiKey: process.env.CHATGPT_API_SECRET,
    // completionParams: {
    //   model: "gpt-4",
    // },
  });

  const response = await api.sendMessage(
    `
    ${body.prompt}

    ${body.text}
    `
  );

  return NextResponse.json({ response });
}

// needed for preflight requests to succeed
export const OPTIONS = async (request: NextRequest) => {
  // Return Response
  return NextResponse.json({});
};
