import { UrlMetadata } from "@mod-protocol/core";
import { UrlHandler } from "../../types/url-handler";

async function handleImgurUrl(url: string): Promise<UrlMetadata | null> {
  // Get HEAD
  const response = await fetch(url, {
    method: "HEAD",
  });

  // Get content-type
  const contentType = response.headers.get("content-type");

  if (!contentType.startsWith("image/")) {
    return null;
  }

  const urlMetadata: UrlMetadata = {
    image: {
      url,
    },
    mimeType: contentType,
  };

  return urlMetadata;
}

const handler: UrlHandler = {
  matchers: ["https://i.imgur.com/.*"],
  handler: handleImgurUrl,
};

export default handler;
