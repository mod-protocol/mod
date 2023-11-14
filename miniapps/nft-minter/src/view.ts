import { ModElement } from "@mod-protocol/core";

const view: ModElement[] = [
  {
    type: "card",
    imageSrc: "{{embed.metadata.image.url}}",
    aspectRatio: 16 / 11,
    // fixme: may be undefined, in that case dont render.
    topLeftBadge: "@{{embed.metadata.nft.collection.creator.username}}",
    onclick: {
      type: "OPENLINK",
      url: "{{embed.metadata.nft.collection.openSeaUrl}}",
      onsuccess: "#view",
    },
    elements: [
      {
        type: "horizontal-layout",
        elements: [
          {
            type: "avatar",
            src: "{{api}}/nft-chain-logo?chain={{embed.metadata.nft.collection.chain}}",
          },
          {
            type: "text",
            label: "{{embed.metadata.nft.collection.name}}",
          },
          {
            if: {
              value: "{{embed.metadata.nft.mintUrl}}",
              match: {
                NOT: {
                  equals: "",
                },
              },
            },
            then: {
              type: "link",
              label: "Mint",
              url: "{{embed.metadata.nft.mintUrl}}",
            },
            else: {
              type: "link",
              label: "View collection",
              url: "{{embed.metadata.nft.collection.openSeaUrl}}",
            },
          },
        ],
      },
    ],
  },
];

export default view;
