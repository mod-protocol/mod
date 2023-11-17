import { UrlMetadata } from "@mod-protocol/core";
import { UrlHandler } from "../../types/url-handler";
import fallback from "./fallback";

async function handleZoraPremintUrl(url: string): Promise<UrlMetadata | null> {
  const metadata = fallback.handler(url, { nftMetadata: false });
  return metadata;
}

const handler: UrlHandler = {
  matchers: [/https:\/\/zora\.co\/collect\/([^\/]+):([^\/]+)\/(premint-\d+)/],
  handler: handleZoraPremintUrl,
};

export default handler;
