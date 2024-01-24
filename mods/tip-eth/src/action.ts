import { ModElement } from "@mod-protocol/core";

const action: ModElement[] = [
  {
    type: "vertical-layout",
    elements: [
      {
        if: {
          value: "{{refs.tipReq.response.data}}",
          match: {
            NOT: {
              equals: "",
            },
          },
        },
        then: {
          if: {
            value: "{{refs.sendEthTx.hash}}",
            match: {
              NOT: {
                equals: "",
              },
            },
          },
          then: {
            if: {
              value: "{{refs.sendEthTx.isSuccess}}",
              match: {
                equals: "true",
              },
            },
            then: {
              type: "horizontal-layout",
              elements: [
                {
                  type: "text",
                  label: "Transaction successful",
                  variant: "secondary",
                },
                {
                  type: "link",
                  label: "Explorer",
                  url: "{{refs.tipReq.response.data.suggestedChain.blockExplorers.default.url}}/tx/{{refs.sendEthTx.hash}}",
                },
              ],
            },
            else: {
              if: {
                value: "{{refs.sendEthTx.isSuccess}}",
                match: {
                  equals: "false",
                },
              },
              then: {
                type: "link",
                label: "Failed",
                variant: "link",
                url: "{{refs.tipReq.response.data.suggestedChain.blockExplorers.default.url}}/tx/{{refs.sendEthTx.hash}}",
              },
              else: {
                type: "horizontal-layout",
                elements: [
                  {
                    type: "link",
                    label: "Confirming...",
                    variant: "link",
                    url: "{{refs.tipReq.response.data.suggestedChain.blockExplorers.default.url}}/tx/{{refs.sendEthTx.hash}}",
                  },
                ],
              },
            },
          },
          else: {
            type: "vertical-layout",
            elements: [
              {
                type: "text",
                label:
                  "Sending {{refs.tipReq.response.data.valueEthFormatted}} (${{refs.tipReq.response.data.valueUsdFormatted}}) to {{refs.tipReq.response.data.tx.to}}",
              },
              {
                type: "text",
                label:
                  "Suggested chain: {{refs.tipReq.response.data.suggestedChain.name}}",
                variant: "secondary",
              },
              {
                type: "button",
                label: "Send",
                onclick: {
                  type: "SENDETHTRANSACTION",
                  ref: "sendEthTx",
                  txData: {
                    from: "{{user.wallet.address}}",
                    to: "{{refs.tipReq.response.data.tx.to}}",
                    value: "{{refs.tipReq.response.data.tx.value}}",
                    data: "{{refs.tipReq.response.data.tx.data}}",
                  },
                  chainId: "{{refs.tipReq.response.data.suggestedChain.id}}",
                },
              },
            ],
          },
        },
        else: {
          type: "horizontal-layout",
          elements: [
            {
              type: "button",
              label: "$1.00",
              onclick: {
                type: "GET",
                ref: "tipReq",
                url: "{{api}}/tip-eth?fid={{author.farcaster.fid}}&amountUsd=1.00&fromAddress={{user.wallet.address}}",
              },
            },
            {
              type: "button",
              label: "$5.00",
              onclick: {
                type: "GET",
                ref: "tipReq",
                url: "{{api}}/tip-eth?fid={{author.farcaster.fid}}&amountUsd=5.00&fromAddress={{user.wallet.address}}",
              },
            },
            {
              type: "button",
              label: "$10.00",
              onclick: {
                type: "GET",
                ref: "tipReq",
                url: "{{api}}/tip-eth?fid={{author.farcaster.fid}}&amountUsd=10.00&fromAddress={{user.wallet.address}}",
              },
            },
          ],
        },
      },
      {
        if: {
          value: "{{refs.tipReq.error}}",
          match: {
            NOT: {
              equals: "",
            },
          },
        },
        then: {
          type: "text",
          label: "Error: {{refs.tipReq.error.error.message}}",
          variant: "secondary",
        },
      },
    ],
  },
];

export default action;
