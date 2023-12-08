import { ModElement } from "@mod-protocol/core";

const view: ModElement[] = [
  {
    type: "vertical-layout",
    elements: [
      {
        if: {
          value: "{{embed.url}}",
          match: {
            startsWith: "ipfs://",
          },
        },
        then: {
          type: "vertical-layout",
          elements: [
            {
              if: {
                value: "{{refs.transcodedResponse.response.data.url}}",
                match: {
                  NOT: {
                    equals: "",
                  },
                },
              },
              then: {
                type: "video",
                videoSrc: "{{refs.transcodedResponse.response.data.url}}",
                // .m3u8
                mimeType: "application/x-mpegURL",
              },
              else: {
                type: "vertical-layout",
                elements: [
                  {
                    type: "video",
                    videoSrc:
                      "https://cloudflare-ipfs.com/ipfs/{{embed.url | split ipfs:// | index 1}}",
                    mimeType: "{{embed.metadata.mimeType}}",
                  },
                  {
                    type: "button",
                    label: "Load stream",
                    onclick: {
                      type: "GET",
                      url: "{{api}}/livepeer-video",
                      searchParams: {
                        url: "{{embed.url}}",
                      },
                      ref: "transcodingResponse",
                      onsuccess: {
                        type: "GET",
                        url: "{{api}}/livepeer-video/{{refs.transcodingResponse.response.data.id}}",
                        ref: "transcodedResponse",
                        retryTimeout: 1000,
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
];

export default view;
