import { UrlMetadata } from "@mod-protocol/core";

export type UrlHandler = {
  name: string;
  matchers: (string | RegExp)[];
  handler: (url: string, options?: any) => Promise<UrlMetadata>;
};
