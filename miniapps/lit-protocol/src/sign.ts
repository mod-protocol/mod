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
            statement: "",
            version: "1",
            // FIXME
            chainId: "1",
          },
        },
      },
    ],
  },
];

export default action;
