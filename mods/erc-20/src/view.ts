import { ModElement } from "@mod-protocol/core";

const view: ModElement[] = [
  {
    type: "vertical-layout",
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
            if: [
              {
                value: "{{refs.tokenReq.response.data}}",
                match: {
                  NOT: {
                    equals: "",
                  },
                },
              },
              {
                value: "{{refs.priceReq.response.data}}",
                match: {
                  NOT: {
                    equals: "",
                  },
                },
              },
            ],
            then: {
              type: "vertical-layout",
              elements: [
                {
                  type: "horizontal-layout",
                  elements: [
                    {
                      type: "horizontal-layout",
                      elements: [
                        {
                          if: {
                            value: "{{refs.tokenReq.response.data.image}}",
                            match: {
                              NOT: {
                                equals: "",
                              },
                            },
                          },
                          then: {
                            type: "avatar",
                            src: "{{refs.tokenReq.response.data.image}}",
                            href: "{{refs.tokenReq.response.data.url}}",
                          },
                        },
                        {
                          type: "link",
                          label: "${{refs.tokenReq.response.data.symbol}}",
                          variant: "link",
                          url: "{{refs.tokenReq.response.data.url}}",
                        },
                        {
                          type: "text",
                          variant: "secondary",
                          label:
                            "${{refs.priceReq.response.data.unitPriceUsd}}",
                        },
                        {
                          if: {
                            value: "{{refs.priceReq.response.data.change24h}}",
                            match: {
                              NOT: {
                                equals: "",
                              },
                            },
                          },
                          then: {
                            type: "text",
                            variant: "secondary",
                            label:
                              "24h: {{refs.priceReq.response.data.change24h}}",
                          },
                        },
                      ],
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
                            NOT: {
                              equals: "true",
                            },
                          },
                        },
                        then: {
                          type: "button",
                          label: "Buy",
                          variant: "secondary",
                          onclick: {
                            type: "SETSTATE",
                            state: {
                              isBuying: "true",
                            },
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
                    type: "vertical-layout",
                    onload: {
                      type: "GET",
                      url: "{{api}}/erc-20/balances?walletAddress={{user.wallet.address}}&token={{embed.url}}&buyOptionsUsd=5,50,500",
                      ref: "balancesReq",
                    },
                    elements: [
                      {
                        type: "horizontal-layout",
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
                                            state: {
                                              buyAmountUsd: "5.00",
                                            },
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
                                            state: {
                                              buyAmountUsd: "50.00",
                                            },
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
                                            state: {
                                              buyAmountUsd: "500.00",
                                            },
                                          },
                                        },
                                      },
                                      {
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
                                            state: {
                                              isBuying: "false",
                                            },
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
                              ],
                            },
                            else: {
                              type: "horizontal-layout",
                              loading: true,
                            },
                          },
                        ],
                      },
                    ],
                  },
                },
                {
                  if: [
                    {
                      value: "{{refs.isBuying}}",
                      match: {
                        equals: "true",
                      },
                    },
                    {
                      value: "{{refs.balancesReq.response.data.ethBalance}}",
                      match: {
                        NOT: {
                          equals: "",
                        },
                      },
                    },
                  ],
                  then: {
                    type: "text",
                    label:
                      "{{refs.balancesReq.response.data.chain.name}} balance: {{refs.balancesReq.response.data.ethBalance}} ETH ({{refs.balancesReq.response.data.ethBalanceUsd}} USD)",
                    variant: "secondary",
                  },
                  else: {
                    if: {
                      value: "{{refs.holdersReq.response.data}}",
                      match: {
                        NOT: {
                          equals: "",
                        },
                      },
                    },
                    then: {
                      type: "text",
                      variant: "secondary",
                      label:
                        "{{refs.holdersReq.response.data.holdersCount}} holders you follow",
                    },
                    else: {
                      type: "horizontal-layout",
                      loading: true,
                    },
                  },
                },
              ],
            },
            else: { type: "horizontal-layout", loading: true },
          },
        ],
      },
      {
        type: "horizontal-layout",
        elements: [
          {
            type: "horizontal-layout",
            onload: {
              type: "GET",
              url: "{{api}}/erc-20/info/token?fid={{user.farcaster.fid}}&token={{embed.url}}",
              ref: "tokenReq",
            },
          },
          {
            type: "horizontal-layout",
            onload: {
              type: "GET",
              url: "{{api}}/erc-20/info/holders?fid={{user.farcaster.fid}}&token={{embed.url}}",
              ref: "holdersReq",
            },
          },
          {
            type: "horizontal-layout",
            onload: {
              type: "GET",
              url: "{{api}}/erc-20/info/price?fid={{user.farcaster.fid}}&token={{embed.url}}",
              ref: "priceReq",
            },
          },
        ],
      },
    ],
  },
];

export default view;
