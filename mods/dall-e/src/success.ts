import { ModElement } from "@mod-protocol/core";

const success: ModElement[] = [
  {
    type: "vertical-layout",
    elements: [
      {
        type: "image",
        imageSrc:
          "{{refs.myChatGPTServerRequest.response.data.response.data[0].url}}",
      },
      {
        type: "horizontal-layout",
        elements: [
          {
            if: {
              value:
                "{{refs.myChatGPTServerRequest.response.data.response.data[0].url}}",
              match: {
                NOT: {
                  equals: "",
                },
              },
            },
            then: {
              type: "button",
              label: "Add image",
              onclick: {
                type: "ADDEMBED",
                url: "{{refs.myChatGPTServerRequest.response.data.response.data[0].url}}",
                name: "{{refs.myChatGPTServerRequest.response.data.response.data[0].revised_prompt}}",
                mimeType: "image/png",
                onsuccess: {
                  type: "EXIT",
                },
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
            },
          },
        ],
      },
    ],
  },
];

export default success;
