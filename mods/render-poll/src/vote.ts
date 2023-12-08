import { ModElement } from "@mod-protocol/core";

const vote: ModElement = {
  type: "vertical-layout",
  elements: [
    {
      type: "text",
      label: "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.question}}",
    },
    {
      type: "button",
      variant: "secondary",
      onclick: {
        ref: "choice1",
        type: "ADDREPLY",
        text: "1.",
        onsuccess: "#results",
      },
      label: "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.choice1}}",
    },
    {
      type: "button",
      variant: "secondary",
      onclick: {
        ref: "choice2",
        type: "ADDREPLY",
        text: "2.",
        onsuccess: "#results",
      },
      label: "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.choice2}}",
    },
    {
      if: {
        value:
          "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.choice3}}",
        match: {
          NOT: {
            equals: "",
          },
        },
      },
      then: {
        type: "button",
        variant: "secondary",
        onclick: {
          ref: "choice3",
          type: "ADDREPLY",
          text: "3.",
          onsuccess: "#results",
        },
        label:
          "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.choice3}}",
      },
    },
    {
      if: {
        value:
          "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.choice4}}",
        match: {
          NOT: {
            equals: "",
          },
        },
      },
      then: {
        type: "button",
        variant: "secondary",
        onclick: {
          ref: "choice4",
          type: "ADDREPLY",
          text: "4.",
          onsuccess: "#results",
        },
        label:
          "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.choice4}}",
      },
    },
  ],
};

export default vote;
