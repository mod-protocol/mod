import { ModElement } from "@mod-protocol/core";

const error: ModElement[] = [
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
      url: "https://mint.fun/{{embed.metadata.json-ld.WebPage[0].mod:model.payload.accessControlConditions[0].chain}}/{{embed.metadata.json-ld.WebPage[0].mod:model.payload.accessControlConditions[0].contractAddress}}",
      onsuccess: "#error",
      onerror: "#error",
      onloading: "#error",
    },
  },
];

export default error;
