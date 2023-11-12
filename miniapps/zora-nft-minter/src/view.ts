import { ModElement } from "@mod-protocol/core";

const view: ModElement[] = [
  {
    type: "card",
    imageSrc: "{{embed.metadata.image.url}}",
    aspectRatio: 16 / 11,
    topLeftBadge: "@{{embed.metadata.nft.collection.creator.username}}",
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
              value: "{{user.wallet.address}}",
              match: {
                NOT: {
                  equals: "",
                },
              },
            },
            then: {
              if: {
                value: "{{refs.mintTx.hash}}",
                match: {
                  NOT: {
                    equals: "",
                  },
                },
              },
              then: {
                type: "link",
                label:
                  "View on {{refs.txDataRequest.response.data.explorer.name}}",
                url: "{{refs.txDataRequest.response.data.explorer.url}}/tx/{{refs.mintTx.hash}}",
              },
              else: {
                type: "button",
                label: "Mint",
                onclick: {
                  type: "GET",
                  ref: "txDataRequest",
                  url: "{{api}}/nft-minter?taker={{user.wallet.address}}&itemId={{embed.metadata.nft.collection.id}}/{{embed.metadata.nft.tokenId}}",
                  onsuccess: {
                    type: "SENDETHTRANSACTION",
                    ref: "mintTx",
                    txData: {
                      from: "{{refs.txDataRequest.response.data.data.from}}",
                      to: "{{refs.txDataRequest.response.data.data.to}}",
                      value: "{{refs.txDataRequest.response.data.data.value}}",
                      data: "{{refs.txDataRequest.response.data.data.data}}",
                    },
                    chainId: "{{refs.txDataRequest.response.data.chainId}}",
                  },
                },
              },
            },
            else: {
              type: "button",
              label: "Mint",
              onclick: {
                type: "OPENLINK",
                url: "{{embed.metadata.nft.collection.mintUrl}}",
              },
            },
          },
        ],
      },
    ],
  },
];

export default view;
