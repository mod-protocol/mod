import { ModElement } from "@mod-protocol/core";

const buy: ModElement[] = [
  {
    type: "padding",
    elements: [
      {
        type: "horizontal-layout",
        elements: [
          {
            type: "circular-progress",
          },
          {
            type: "text",
            label:
              "Buying ~${{refs.buyAmountUsd}} of {{refs.tokenReq.response.data.name}}...",
            variant: "secondary",
          },
        ],
      },

      {
        type: "horizontal-layout",
        elements: [
          // If there is no buyAmountUsd value, go to #view
          {
            if: {
              value: "{{refs.buyAmountUsd}}",
              match: {
                equals: "",
              },
            },
            then: {
              type: "horizontal-layout",
              onload: "#view",
            },
          },
        ],
      },
      {
        type: "vertical-layout",
        onload: {
          type: "POST",
          url: "{{api}}/erc-20/buy?walletAddress={{user.wallet.address}}&token={{embed.url}}&buyAmountUsd={{refs.buyAmountUsd}}",
          ref: "swapTxDataReq",
          onsuccess: {
            type: "SENDETHTRANSACTION",
            ref: "swapTxReq",
            txData: {
              from: "{{refs.swapTxDataReq.response.data.transaction.from}}",
              to: "{{refs.swapTxDataReq.response.data.transaction.to}}",
              value: "{{refs.swapTxDataReq.response.data.transaction.value}}",
              data: "{{refs.swapTxDataReq.response.data.transaction.data}}",
            },
            chainId: "{{refs.balancesReq.response.data.chain.id}}",
            onerror: {
              type: "SETSTATE",
              ref: "buyAmountUsd",
              value: "",
            },
          },
          onerror: {
            type: "SETSTATE",
            ref: "buyAmountUsd",
            value: "",
          },
        },
      },
    ],
  },
];

export default buy;
