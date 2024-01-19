import { ModElement } from "@mod-protocol/core";

const buy: ModElement[] = [
  {
    type: "padding",
    elements: [
      // If no buy amount, go back to #view
      {
        type: "horizontal-layout",
        elements: [
          {
            if: {
              value: "{{refs.buyAmountUsd}}",
              match: {
                equals: "",
              },
            },
            then: {
              type: "vertical-layout",
              onload: "#view",
            },
          },
        ],
      },
      //
      {
        if: [
          {
            value: "{{refs.swapTx.isSuccess}}",
            match: {
              NOT: {
                equals: "true",
              },
            },
          },
        ],
        then: {
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
      },

      {
        type: "vertical-layout",
        onload: {
          type: "POST",
          url: "{{api}}/erc-20/buy?walletAddress={{user.wallet.address}}&token={{embed.url}}&buyAmountUsd={{refs.buyAmountUsd}}",
          ref: "swapTxDataReq",
          onsuccess: {
            type: "SENDETHTRANSACTION",
            ref: "swapTx",
            txData: {
              from: "{{refs.swapTxDataReq.response.data.transaction.from}}",
              to: "{{refs.swapTxDataReq.response.data.transaction.to}}",
              value: "{{refs.swapTxDataReq.response.data.transaction.value}}",
              data: "{{refs.swapTxDataReq.response.data.transaction.data}}",
            },
            chainId: "{{refs.balancesReq.response.data.chain.id}}",
            onerror: {
              type: "SETSTATE",
              state: {
                buyAmountUsd: "",
              },
            },
          },
          onerror: {
            type: "SETSTATE",
            state: {
              buyAmountUsd: "",
            },
          },
        },
      },
      {
        if: {
          value: "{{refs.swapTx.hash}}",
          match: {
            NOT: {
              equals: "",
            },
          },
        },
        then: {
          if: {
            value: "{{refs.swapTx.isSuccess}}",
            match: {
              equals: "true",
            },
          },
          then: {
            type: "horizontal-layout",
            elements: [
              {
                type: "button",
                label: "Back",
                variant: "secondary",
                onclick: {
                  type: "SETSTATE",
                  state: {
                    isBuying: "false",
                    buyAmountUsd: "",
                  },
                },
              },
              {
                type: "text",
                label: "Transaction successful",
                variant: "secondary",
              },
              {
                type: "link",
                label: "Explorer",
                url: "{{refs.swapTxDataReq.response.data.explorer.url}}/tx/{{refs.swapTx.hash}}",
              },
            ],
          },
          else: {
            if: {
              value: "{{refs.swapTx.isSuccess}}",
              match: {
                equals: "false",
              },
            },
            then: {
              type: "link",
              label: "Failed",
              variant: "link",
              url: "{{refs.swapTxDataReq.response.data.explorer.url}}/tx/{{refs.swapTx.hash}}",
            },
            else: {
              type: "horizontal-layout",
              elements: [
                {
                  type: "link",
                  label: "Confirming...",
                  variant: "link",
                  url: "{{refs.swapTxDataReq.response.data.explorer.url}}/tx/{{refs.swapTx.hash}}",
                },
              ],
            },
          },
        },
      },
    ],
  },
];

export default buy;
