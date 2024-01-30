import { ModElement } from "@mod-protocol/core";

const rerender: ModElement[] = [
  {
    type: "card",
    aspectRatio: 3 / 2,
    imageSrc: "{{refs.frameActionResponse.customOpenGraph['fc:frame:image']}}",
    elements: [
      {
        type: "horizontal-layout",
        elements: [
          {
            if: {
              value:
                "{{refs.frameActionResponse.customOpenGraph['fc:frame:button:1']}}",
              match: {
                NOT: {
                  equals: "",
                },
              },
            },
            then: {
              type: "button",
              variant: "secondary",
              label:
                "{{refs.frameActionResponse.customOpenGraph['fc:frame:button:1']}}",
              onclick: {
                ref: "frameActionResponse",
                type: "SENDFCFRAMEACTION",
                post_url:
                  "{{refs.frameActionResponse.customOpenGraph['fc:frame:post_url']}}",
                url: "{{embed.url}}",
                action: "1",
                onsuccess: "#rerender",
              },
            },
          },
          {
            if: {
              value:
                "{{refs.frameActionResponse.customOpenGraph['fc:frame:button:2']}}",
              match: {
                NOT: {
                  equals: "",
                },
              },
            },
            then: {
              type: "button",
              variant: "secondary",
              label:
                "{{refs.frameActionResponse.customOpenGraph['fc:frame:button:2']}}",
              onclick: {
                ref: "frameActionResponse",
                type: "SENDFCFRAMEACTION",
                post_url:
                  "{{refs.frameActionResponse.customOpenGraph['fc:frame:post_url']}}",
                url: "{{embed.url}}",
                action: "2",
                onsuccess: "#rerender",
              },
            },
          },
          {
            if: {
              value:
                "{{refs.frameActionResponse.customOpenGraph['fc:frame:button:3']}}",
              match: {
                NOT: {
                  equals: "",
                },
              },
            },
            then: {
              type: "button",
              variant: "secondary",
              label:
                "{{refs.frameActionResponse.customOpenGraph['fc:frame:button:3']}}",
              onclick: {
                ref: "frameActionResponse",
                type: "SENDFCFRAMEACTION",
                post_url:
                  "{{refs.frameActionResponse.customOpenGraph['fc:frame:post_url']}}",
                url: "{{embed.url}}",
                action: "3",
                onsuccess: "#rerender",
              },
            },
          },
          {
            if: {
              value:
                "{{refs.frameActionResponse.customOpenGraph['fc:frame:button:4']}}",
              match: {
                NOT: {
                  equals: "",
                },
              },
            },
            then: {
              type: "button",
              variant: "secondary",
              label:
                "{{refs.frameActionResponse.customOpenGraph['fc:frame:button:4']}}",
              onclick: {
                ref: "frameActionResponse",
                type: "SENDFCFRAMEACTION",
                post_url:
                  "{{refs.frameActionResponse.customOpenGraph['fc:frame:post_url']}}",
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

export default rerender;
