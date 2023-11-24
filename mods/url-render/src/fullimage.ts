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
        label: "{{embed.metadata.publisher}}",
        variant: "secondary",
      },
      {
        type: "text",
        label: "{{embed.metadata.title}}",
        variant: "regular",
      },
      {
        type: "text",
        label: "{{embed.metadata.description}}",
        variant: "secondary",
      },
    ],
  },
];

export default fullimage;
