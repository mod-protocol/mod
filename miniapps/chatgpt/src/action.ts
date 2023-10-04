import { Element } from "@mod-protocol/core";

const action: Element[] = [
  {
    type: "vertical-layout",
    onload: {
      ref: "myChatGPTServerRequest",
      type: "POST",
      url: "{{api}}/chatgpt",
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
