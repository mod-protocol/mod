import { UrlMetadata } from "@mod-protocol/core";
import { UrlHandler } from "../../types/url-handler";
import mime from "mime";

// Microlink API fails to fetch metadata for direct urls
// If we have the url, we can construct the metadata ourselves
async function handleImageFileUrl(url: string): Promise<UrlMetadata | null> {
  let mimeType: string | null = mime.getType(url);

  if (!mimeType) {
    // Get HEAD
    const response = await fetch(url, {
      method: "HEAD",
    });

    // Get content-type
    mimeType = response.headers.get("content-type");
  }

  if (!mimeType.startsWith("image/")) {
    return null;
  }

  const urlMetadata: UrlMetadata = {
    image: {
      url,
    },
    mimeType,
  };

  return urlMetadata;
}

const handler: UrlHandler = {
  name: "Image File",
  matchers: [/\.((jpg|jpeg|png|gif|bmp|webp|tiff|svg))(?=\?|$)/i],
  handler: handleImageFileUrl,
};

export default handler;
