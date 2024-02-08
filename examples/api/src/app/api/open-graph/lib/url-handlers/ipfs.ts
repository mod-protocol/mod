import { UrlMetadata } from "@mod-protocol/core";
import { UrlHandler } from "../../types/url-handler";

async function handleIpfsUrl(url: string): Promise<UrlMetadata | null> {
  const cid = url.replace("ipfs://", "");

  const gatewayUrl = `${process.env.IPFS_DEFAULT_GATEWAY}/${cid}`;

  // Get HEAD only
  const response = await fetch(gatewayUrl, { method: "HEAD" });

  if (!response.ok) {
    return null;
  }

  const contentType = response.headers.get("content-type");

  if (!contentType) {
    return null;
  }

  // TODO: Generate thumbnail if image/video

  const urlMetadata: UrlMetadata = {
    title: `IPFS ${cid}`,
    mimeType: contentType,
  };

  return urlMetadata;
}

const handler: UrlHandler = {
  name: "IPFS",
  matchers: ["ipfs://.*"],
  handler: handleIpfsUrl,
};

export default handler;
