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
        type: "button",
        label: "Choose an image",
        onclick: {
          ref: "myOpenFileAction",
          type: "OPENFILE",
          maxFiles: 1,
          accept: ["image/jpeg", "image/jpg", "image/png"],
          onsuccess: {
            type: "POST",
            url: "{{api}}/zora-create",
            ref: "myZoraCreateRequest",
            body: {
              json: {
                type: "object",
                value: {
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
                        value: "{{user.fid}}",
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
          onerror: "#error",
          oncancel: {
            type: "EXIT",
          },
        },
      },
    ],
  },
];

export default action;
