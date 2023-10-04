import { Element } from "@packages/core";

const creation: Element[] = [
  {
    type: "dialog",
    onclose: {
      type: "EXIT",
    },
    elements: [
      {
        type: "vertical-layout",
        elements: [
          {
            type: "input",
            ref: "choice1",
            placeholder: "Choice 1",
          },
          {
            type: "input",
            ref: "choice2",
            placeholder: "Choice 2",
          },
          {
            type: "input",
            ref: "choice3",
            placeholder: "Choice 3 (optional)",
          },
          {
            type: "input",
            ref: "choice4",
            placeholder: "Choice 4 (optional)",
          },
          {
            type: "button",
            label: "Create Poll",
            onclick: {
              if: {
                value: "{{refs.choice3.value}}",
                match: {
                  NOT: {
                    equals: "",
                  },
                },
              },
              then: {
                if: {
                  value: "{{refs.choice4.value}}",
                  match: {
                    NOT: {
                      equals: "",
                    },
                  },
                },
                then: {
                  type: "SETINPUT",
                  value:
                    "{{input}}1. {{refs.choice1.value}}<br/>2. {{refs.choice2.value}}<br/>3. {{refs.choice3.value}}<br/>4. {{refs.choice4.value}}",
                  onsuccess: {
                    type: "EXIT",
                  },
                },
                else: {
                  type: "SETINPUT",
                  value:
                    "{{input}}1. {{refs.choice1.value}}<br/>2. {{refs.choice2.value}}<br/>3. {{refs.choice3.value}}",
                  onsuccess: {
                    type: "EXIT",
                  },
                },
              },
              else: {
                type: "SETINPUT",
                value:
                  "{{input}}1. {{refs.choice1.value}}<br/>2. {{refs.choice2.value}}",
                onsuccess: {
                  type: "EXIT",
                },
              },
            },
          },
        ],
      },
    ],
  },
];

export default creation;
