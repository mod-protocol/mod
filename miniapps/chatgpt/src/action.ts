import { ModElement } from "@mod-protocol/core";

const action: ModElement[] = [
  {
    type: "vertical-layout",
    elements: [
      {
        type: "input",
        placeholder: "Ask the AI anything",
        clearable: true,
        ref: "prompt",
        // onchange: {
        //   ref: "mySearchQueryRequest",
        // },
      },
      {
        type: "button",
        label: "Send",
        onclick: {
          ref: "myChatGPTServerRequest",
          type: "POST",
          url: "{{api}}/chatgpt",
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
    ],
  },
];

export default action;
