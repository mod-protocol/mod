import { ModElement } from "@mod-protocol/core";

const fullimage: ModElement[] = [
  {
    type: "card",
    aspectRatio: 16 / 8,
    imageSrc: "{{embed.metadata.image.url}}",
    onclick: {
      type: "OPENLINK",
      url: "{{embed.url}}",
      onsuccess: "#fullimage",
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

export default fullimage;
