import { ModElement } from "@mod-protocol/core";

const view: ModElement[] = [
  {
    type: "card",
    aspectRatio: 16 / 8,
    imageSrc: "{{embed.metadata.image.url}}",
    onclick: {
      type: "OPENLINK",
      url: "{{embed.url}}",
      onsuccess: "#view",
    },
    elements: [
      {
        type: "text",
        label: "{{embed.metadata.title}}",
      },
      {
        type: "text",
        label: "{{embed.metadata.publisher}}",
      },
    ],
  },
];

export default view;
