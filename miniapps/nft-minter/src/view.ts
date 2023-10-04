import { Element } from "@mod-protocol/core";

const view: Element[] = [
  {
    type: "card",
    imageSrc: "{{embed.metadata.nft.mediaUrl}}",
    aspectRatio: 16 / 11,
    topLeftBadge: "@{{embed.metadata.nft.creator.username}}",
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
            src: "{{api}}/nft-chain-logo?chain={{embed.metadata.nft.chain}}",
          },
          {
            type: "text",
            label: "{{embed.metadata.nft.collection.name}}",
          },
          {
            type: "button",
            label: "Mint",
            onclick: {
              type: "OPENLINK",
              url: "{{embed.metadata.nft.collection.mintUrl}}",
              onsuccess: "#view",
            },
          },
        ],
      },
    ],
  },
];

export default view;
