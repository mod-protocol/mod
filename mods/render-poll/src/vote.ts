import { ModElement } from "@mod-protocol/core";

const vote: ModElement[] = [
  {
    type: "vertical-layout",
    elements: [
      {
        type: "button",
        onclick: {
          ref: "choice1",
          type: "ADDREPLY",
          text: "1.",
          onsuccess: "#results",
        },
        label: "Choice 1",
      },
      {
        type: "button",
        onclick: {
          ref: "choice1",
          type: "ADDREPLY",
          text: "2.",
          onsuccess: "#results",
        },
        label: "Choice 2",
      },
      {
        type: "button",
        onclick: {
          ref: "choice1",
          type: "ADDREPLY",
          text: "3.",
          onsuccess: "#results",
        },
        label: "Choice 3 (optional)",
      },
      {
        type: "button",
        onclick: {
          ref: "choice1",
          type: "ADDREPLY",
          text: "4.",
          onsuccess: "#results",
        },
        label: "Choice 4 (optional)",
      },
    ],
  },
];

export default vote;
