import { ModElement } from "@mod-protocol/core";

const error: ModElement[] = [
  // FIXME
  {
    type: "text",
    label: "Failed to decrypt",
  },
  // Buy token link?
  {
    type: "button",
    label: "Get a token",
    onclick: {
      type: "OPENLINK",
      // fixme
      url: "https://mint.fun/{{embed.metadata.modmodel.chain}}/{{embed.metadata.modmodel.tokenId}}",
    },
  },
];

export default error;
