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
        type: "padding",
        elements: [
          // Go to #buying to execute order if there is a buyAmountUsd value
          {
            if: {
              value: "{{refs.buyAmountUsd}}",
              match: {
                NOT: {
                  equals: "",
                },
              },
            },
            then: {
              type: "horizontal-layout",
              onload: "#buying",
            },
          },
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
                        value:
                          "{{refs.tokenReq.response.data.tokenData.image}}",
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
                      variant: "secondary",
                      url: "{{refs.tokenReq.response.data.tokenData.url}}",
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
                          value: "{{refs.isBuying}}",
                          match: {
                            equals: "true",
                          },
                        },
                        then: {
                          type: "button",
                          label: "Cancel",
                          variant: "secondary",
                          onclick: {
                            type: "SETSTATE",
                            ref: "isBuying",
                            value: "false",
                          },
                        },
                        else: {
                          type: "button",
                          label: "Buy",
                          onclick: {
                            type: "SETSTATE",
                            ref: "isBuying",
                            value: "true",
                          },
                        },
                      },
                    },
                  ],
                },

                {
                  if: {
                    value: "{{refs.isBuying}}",
                    match: {
                      equals: "true",
                    },
                  },
                  then: {
                    type: "horizontal-layout",
                    onload: {
                      type: "GET",
                      url: "{{api}}/erc-20/balances?walletAddress={{user.wallet.address}}&token={{embed.url}}&buyOptionsUsd=5,50,500",
                      ref: "balancesReq",
                    },
                    elements: [
                      {
                        if: {
                          value: "{{refs.balancesReq.response.data}}",
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
                              if: {
                                value:
                                  "{{refs.balancesReq.response.data.buyOptionsUsd[0]}}",
                                match: {
                                  equals: "true",
                                },
                              },
                              then: {
                                type: "horizontal-layout",
                                elements: [
                                  {
                                    type: "text",
                                    label: "Buy amount:",
                                  },
                                  {
                                    if: {
                                      value:
                                        "{{refs.balancesReq.response.data.buyOptionsUsd[0]}}",
                                      match: {
                                        equals: "true",
                                      },
                                    },
                                    then: {
                                      type: "button",
                                      label: "$5.00",
                                      onclick: {
                                        type: "SETSTATE",
                                        ref: "buyAmountUsd",
                                        value: "5.00",
                                      },
                                    },
                                  },
                                  {
                                    if: {
                                      value:
                                        "{{refs.balancesReq.response.data.buyOptionsUsd[1]}}",
                                      match: {
                                        equals: "true",
                                      },
                                    },
                                    then: {
                                      type: "button",
                                      label: "$50.00",
                                      onclick: {
                                        type: "SETSTATE",
                                        ref: "buyAmountUsd",
                                        value: "50.00",
                                      },
                                    },
                                  },
                                  {
                                    if: {
                                      value:
                                        "{{refs.balancesReq.response.data.buyOptionsUsd[2]}}",
                                      match: {
                                        equals: "true",
                                      },
                                    },
                                    then: {
                                      type: "button",
                                      label: "$500.00",
                                      onclick: {
                                        type: "SETSTATE",
                                        ref: "buyAmountUsd",
                                        value: "500.00",
                                      },
                                    },
                                  },
                                ],
                              },
                              else: {
                                type: "text",
                                label:
                                  "Not enough ETH on {{refs.balancesReq.response.data.chain.name}}",
                              },
                            },
                            {
                              type: "text",
                              label:
                                "{{refs.balancesReq.response.data.chain.name}} balance: {{refs.balancesReq.response.data.ethBalance}} ETH ({{refs.balancesReq.response.data.ethBalanceUsd}} USD)",
                              variant: "secondary",
                            },
                          ],
                        },
                        else: {
                          type: "circular-progress",
                        },
                      },
                    ],
                  },
                  // Holders you know
                  else: {
                    type: "text",
                    variant: "secondary",
                    label:
                      "{{refs.tokenReq.response.data.holderData.holdersCount}} holders you know",
                  },
                },
              ],
            },
            else: {
              type: "circular-progress",
            },
          },
        ],
      },
    ],
  },
];

export default view;
