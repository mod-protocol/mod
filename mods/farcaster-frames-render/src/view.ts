import { ModElement } from "@mod-protocol/core";

const view: ModElement[] = [
  {
    type: "card",
    // a warpcast special
    aspectRatio: 1.9166,
    imageSrc: "{{embed.metadata.customOpenGraph['fc:frame:image']}}",
    elements: [
      {
        type: "horizontal-layout",
        elements: [
          {
            if: {
              value: "{{embed.metadata.customOpenGraph['fc:frame:button:1']}}",
              match: {
                NOT: {
                  equals: "",
                },
              },
            },
            then: {
              type: "button",
              variant: "secondary",
              label: "{{embed.metadata.customOpenGraph['fc:frame:button:1']}}",
              onclick: {
                ref: "frameActionResponse",
                type: "SENDFCFRAMEACTION",
                post_url:
                  "{{embed.metadata.customOpenGraph['fc:frame:post_url']}}",
                url: "{{embed.url}}",
                action: "1",
                onsuccess: "#rerender",
              },
            },
          },
          {
            if: {
              value: "{{embed.metadata.customOpenGraph['fc:frame:button:2']}}",
              match: {
                NOT: {
                  equals: "",
                },
              },
            },
            then: {
              type: "button",
              variant: "secondary",
              label: "{{embed.metadata.customOpenGraph['fc:frame:button:2']}}",
              onclick: {
                ref: "frameActionResponse",
                type: "SENDFCFRAMEACTION",
                post_url:
                  "{{embed.metadata.customOpenGraph['fc:frame:post_url']}}",
                url: "{{embed.url}}",
                action: "2",
                onsuccess: "#rerender",
              },
            },
          },
          {
            if: {
              value: "{{embed.metadata.customOpenGraph['fc:frame:button:3']}}",
              match: {
                NOT: {
                  equals: "",
                },
              },
            },
            then: {
              type: "button",
              variant: "secondary",
              label: "{{embed.metadata.customOpenGraph['fc:frame:button:3']}}",
              onclick: {
                ref: "frameActionResponse",
                type: "SENDFCFRAMEACTION",
                post_url:
                  "{{embed.metadata.customOpenGraph['fc:frame:post_url']}}",
                url: "{{embed.url}}",
                action: "3",
                onsuccess: "#rerender",
              },
            },
          },
          {
            if: {
              value: "{{embed.metadata.customOpenGraph['fc:frame:button:4']}}",
              match: {
                NOT: {
                  equals: "",
                },
              },
            },
            then: {
              type: "button",
              variant: "secondary",
              label: "{{embed.metadata.customOpenGraph['fc:frame:button:4']}}",
              onclick: {
                ref: "frameActionResponse",
                type: "SENDFCFRAMEACTION",
                post_url:
                  "{{embed.metadata.customOpenGraph['fc:frame:post_url']}}",
                url: "{{embed.url}}",
                action: "4",
                onsuccess: "#rerender",
              },
            },
          },
        ],
      },
    ],
  },
];

export default view;
