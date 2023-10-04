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

  let prompt = "";
  if (body.text.length > 280) {
    // send a message and wait for the response
    prompt = `Please shorten the following text to below 280 characters:`;
  } else {
    prompt = `Please shorten the following text:`;
  }

  const response = await api.sendMessage(
    `
    ${prompt}

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
