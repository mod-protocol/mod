import { ModElement } from "@mod-protocol/core";

const action: ModElement[] = [
  {
    type: "vertical-layout",
    onload: {
      ref: "myChatGPTServerRequest",
      type: "POST",
      url: "{{api}}/chatgpt-shorten",
      body: {
        json: {
          type: "object",
          value: {
            text: {
              type: "string",
              value: "{{input}}",
            },
          },
        },
      },
      onsuccess: "#success",
      onerror: "#error",
      onloading: "#loading",
    },
  },
];

export default action;
