import { ModElement } from "@mod-protocol/core";

const success: ModElement[] = [
  {
    type: "vertical-layout",
    elements: [
      {
        type: "text",
        label: "{{refs.myChatGPTServerRequest.response.data.response.text}}",
      },
      {
        type: "horizontal-layout",
        elements: [
          {
            type: "button",
            label: "Replace",
            onclick: {
              type: "SETINPUT",
              value:
                "{{refs.myChatGPTServerRequest.response.data.response.text}}",
              onsuccess: {
                type: "EXIT",
              },
            },
          },
          {
            type: "button",
            label: "Retry",
            variant: "secondary",
            onclick: {
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
            },
          },
        ],
      },
    ],
  },
];

export default success;
