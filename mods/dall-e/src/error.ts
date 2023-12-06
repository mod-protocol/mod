import { ModElement } from "@mod-protocol/core";

const error: ModElement[] = [
  {
    type: "text",
    label: "ERROR: {{refs.myChatGPTServerRequest.error.message}}",
  },
  {
    type: "button",
    label: "Retry",
    onclick: {
      ref: "myChatGPTServerRequest",
      type: "POST",
      url: "{{api}}/dall-e",
      body: {
        json: {
          type: "object",
          value: {
            prompt: {
              type: "string",
              value: "{{refs.prompt.value}}",
            },
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

export default error;
