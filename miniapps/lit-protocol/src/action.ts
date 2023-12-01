import { ModElement } from "@mod-protocol/core";

const action: ModElement[] = [
  {
    type: "vertical-layout",
    elements: [
      {
        type: "textarea",
        ref: "plaintext",
        placeholder: "Content to token gate",
      },
      {
        type: "combobox",
        onload: {
          ref: "getOptions",
          type: "GET",
          onsuccess: "#action",
          onerror: "#error",
          url: "{{api}}/lit-protocol/search-nfts?wallet_address={{user.wallet.address}}&q={{refs.contract.value}}",
        },
        ref: "contract",
        valueRef: "selectedContract",
        optionsRef: "refs.getOptions.response.data",
        placeholder: "Pick token to gate by",
      },
      {
        type: "button",
        label: "Publish",
        onclick: {
          type: "POST",
          ref: "encryption",
          url: "{{api}}/lit-protocol",
          body: {
            json: {
              type: "object",
              value: {
                authSig: {
                  type: "object",
                  value: {
                    sig: {
                      type: "string",
                      value: "{{refs.authSig.signature}}",
                    },
                    signedMessage: {
                      type: "string",
                      value: "{{refs.authSig.signedMessage}}",
                    },
                    address: {
                      type: "string",
                      value: "{{refs.authSig.address}}",
                    },
                  },
                },
                standardContractType: {
                  type: "string",
                  value: "{{refs.selectedContract.value.contract_type}}",
                },
                messageToEncrypt: {
                  type: "string",
                  value: "{{refs.plaintext.value}}",
                },
                chain: {
                  type: "string",
                  value: "{{refs.selectedContract.value.chain}}",
                },
                tokens: {
                  type: "string",
                  value: "1",
                },
                contract: {
                  type: "string",
                  value: "{{refs.selectedContract.value.contract_address}}",
                },
              },
            },
          },
          onsuccess: {
            type: "ADDEMBED",
            url: "{{refs.encryption.response.data.url}}",
            name: "Encrypted data",
            mimeType: "application/ld+json",
            onsuccess: {
              type: "EXIT",
            },
          },
          onloading: "#loading",
          onerror: "#error",
        },
      },
      {
        type: "button",
        variant: "secondary",
        label: "Manual entry",
        onclick: "#advanced-form",
      },
    ],
  },
];

export default action;
