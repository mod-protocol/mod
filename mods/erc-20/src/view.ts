import { ModElement } from "@mod-protocol/core";

const view: ModElement[] = [
  {
    type: "horizontal-layout",
    onload: {
      type: "GET",
      url: "{{api}}/erc-20?fid={{user.farcaster.fid}}&token={{embed.url}}",
      ref: "tokenReq",
    },
    elements: [
      {
        if: {
          value: "{{refs.tokenReq.response.data}}",
          match: {
            NOT: {
              equals: "",
            },
          },
        },
        then: {
          type: "vertical-layout",
          elements: [
            {
              type: "horizontal-layout",
              elements: [
                {
                  if: {
                    value: "{{refs.tokenReq.response.data.tokenData.image}}",
                    match: {
                      NOT: {
                        equals: "",
                      },
                    },
                  },
                  then: {
                    type: "avatar",
                    src: "{{refs.tokenReq.response.data.tokenData.image}}",
                  },
                },
                {
                  type: "link",
                  label: "{{refs.tokenReq.response.data.tokenData.name}}",
                  url: "https://coingecko.com/en/coins/points",
                },
                {
                  type: "text",
                  variant: "secondary",
                  label:
                    "${{refs.tokenReq.response.data.priceData.unitPriceUsd}}",
                },
                {
                  if: {
                    value:
                      "{{refs.tokenReq.response.data.priceData.change24h}}",
                    match: {
                      NOT: {
                        equals: "",
                      },
                    },
                  },
                  then: {
                    type: "horizontal-layout",
                    elements: [
                      {
                        type: "text",
                        variant: "secondary",
                        label: "24h:",
                      },
                      {
                        type: "text",
                        variant: "secondary",
                        label:
                          "{{refs.tokenReq.response.data.priceData.change24h}}",
                      },
                    ],
                  },
                },
              ],
            },
            // Holders you know
            {
              type: "text",
              variant: "secondary",
              label:
                "{{refs.tokenReq.response.data.holderData.holdersCount}} holders you know",
            },
          ],
        },
        else: {
          type: "circular-progress",
        },
      },
    ],
  },
];

export default view;
