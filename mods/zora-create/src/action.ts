import { ModElement } from "@mod-protocol/core";

const action: ModElement[] = [
  {
    type: "vertical-layout",
    elements: [
      {
        type: "text",
        label: "Upload and mint an image as a Zora freemint NFT",
      },
      {
        type: "input",
        placeholder: "Title (optional)",
        ref: "title",
      },
      {
        type: "input",
        placeholder: "Description (optional)",
        ref: "description",
      },
      {
        type: "button",
        label: "Choose an image",
        onclick: {
          ref: "myOpenFileAction",
          type: "OPENFILE",
          maxFiles: 1,
          accept: ["image/jpeg", "image/jpg", "image/png"],
          // onsuccess: ,
          onerror: "#error",
          oncancel: {
            type: "EXIT",
          },
        },
      },
      {
        if: {
          value: "{{refs.myOpenFileAction.files.length}}",
          match: {
            equals: "1",
          },
        },
        then: {
          type: "vertical-layout",
          elements: [
            {
              type: "image",
              imageSrc: "{{refs.myOpenFileAction.files[0].base64}}",
            },
            {
              type: "button",
              label: "Create",
              onclick: {
                type: "POST",
                url: "{{api}}/zora-create",
                ref: "myZoraCreateRequest",
                body: {
                  json: {
                    type: "object",
                    value: {
                      title: {
                        type: "string",
                        value: "{{refs.title.value}}",
                      },
                      description: {
                        type: "string",
                        value: "{{refs.description.value}}",
                      },
                      imageData: {
                        type: "string",
                        value: "{{refs.myOpenFileAction.files[0].base64}}",
                      },
                      creator: {
                        type: "object",
                        value: {
                          address: {
                            type: "string",
                            value: "{{user.wallet.address}}",
                          },
                          fid: {
                            type: "string",
                            value: "{{user.farcaster.fid}}",
                          },
                        },
                      },
                    },
                  },
                },
                onsuccess: {
                  type: "ADDEMBED",
                  url: "{{refs.myZoraCreateRequest.response.data.url}}",
                  name: "Zora Premint",
                  mimeType: "text/html",
                  onsuccess: {
                    type: "EXIT",
                  },
                },
                onloading: "#loading",
              },
            },
          ],
        },
      },
    ],
  },
];

export default action;
