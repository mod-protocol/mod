import { ModConditionalElement } from "@mod-protocol/core";

const rendering: ModConditionalElement[] = [
  {
    if: {
      value: "{{embed.metadata.json-ld.WebPage[0].mod:model.@type}}",
      match: {
        equals: "schema.modprotocol.org/lit-protocol/0.0.1/EncryptedData",
      },
    },
    element: [
      {
        type: "card",
        aspectRatio: 1200 / 630,
        imageSrc: "{{embed.metadata.image.url}}",
        elements: [
          {
            type: "button",
            loadingLabel: "Sign the message",
            label: "Sign to decrypt the secret message",
            onclick: {
              onsuccess: "#decrypt",
              onerror: "#error",
              type: "web3.eth.personal.sign",
              ref: "authSig",
              data: {
                // domain: "localhost:3000",
                // address: "{{user.wallet.address}}",
                statement:
                  "You are signing a message to prove you own this account",
                // uri: "http://localhost:3000",
                version: "1",
                // FIXME
                chainId: "1",
              },
            },
          },
        ],
      },
    ],
  },
];
export default rendering;
