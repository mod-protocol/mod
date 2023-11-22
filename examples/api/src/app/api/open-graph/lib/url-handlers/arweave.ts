import { UrlMetadata } from "@mod-protocol/core";
import { UrlHandler } from "../../types/url-handler";

async function handleArweave(url: string): Promise<UrlMetadata | null> {
  // `https://gateway.irys.xyz/${irysTransactionId}`
  const transactionId = url.split(":")[2];

  const reformattedUrl = `https://gateway.irys.xyz/${transactionId}`;

  const response = await fetch(reformattedUrl, {
    method: "HEAD",
  });

  // Get content-type
  const mimeType = response.headers.get("content-type");

  if (mimeType === "application/json") {
    try {
      const arweaveData = await fetch(reformattedUrl);

      const body = await arweaveData.json();

      // Check for schema
      if (body["@type"] === "Mod")
        return {
          image: {
            url: body.image,
          },
          "json-ld": body,
          description: body.description,
          alt: body.name,
          title: body.name,
          logo: {
            url: body.image,
          },
          mimeType: "application/json",
        };
    } catch (err) {}
  }
  // TODO: handle html

  return null;
}

const urlHandler: UrlHandler = {
  matchers: ["arweave:7wIU:*"],
  handler: handleArweave,
};

export default urlHandler;
