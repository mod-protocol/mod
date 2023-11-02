import { UrlMetadata } from "@mod-protocol/core";

export type UrlHandler = {
  matchers: (string | RegExp)[];
  handler: (url: string) => Promise<UrlMetadata>;
};
