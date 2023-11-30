import { ModElement } from "@mod-protocol/core";

const action: ModElement[] = [
  {
    type: "vertical-layout",
    elements: [
      {
        type: "input",
        placeholder: "Ask DALL-E to create any image",
        ref: "prompt",
      },
      {
        type: "button",
        label: "Imagine",
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
              },
            },
          },
          onsuccess: "#success",
          onerror: "#error",
          onloading: "#loading",
        },
      },
    ],
  },
];

export default action;
