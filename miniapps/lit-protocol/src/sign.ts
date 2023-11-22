import { ModElement } from "@mod-protocol/core";

const action: ModElement[] = [
  {
    type: "vertical-layout",
    elements: [
      {
        type: "text",
        label: "Sign to prove ownership of this account",
      },
      {
        type: "button",
        label: "Sign",
        onclick: {
          onsuccess: "#action",
          onerror: "#error",
          type: "web3.eth.personal.sign",
          ref: "authSig",
          data: {
            // FIXME domain
            domain: "localhost:3000",
            address: "{{user.wallet.address}}",
            statement:
              "You are signing a message to prove you own this account",
            uri: "http://localhost:3000",
            version: "1",
            // FIXME: test this works with non ethereum chain
            chainId: "1",
          },
        },
      },
    ],
  },
];

export default action;
