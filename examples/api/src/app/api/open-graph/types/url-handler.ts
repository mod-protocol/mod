import { UrlMetadata } from "@mod-protocol/core";

export type UrlHandler = {
  matchers: string[];
  handler: (url: string) => Promise<UrlMetadata>;
};
