import { ModElement } from "@mod-protocol/core";

const action: ModElement[] = [
  {
    type: "vertical-layout",
    elements: [
      {
        type: "input",
        ref: "plaintext",
        placeholder: "Content to token gate",
      },
      {
        type: "select",
        options: [
          {
            value: "ethereum",
            label: "Ethereum",
          },
          {
            value: "optimism",
            label: "Optimism",
          },
          {
            value: "polygon",
            label: "Polygon",
          },
        ],
        ref: "chain",
        placeholder: "Chain",
      },
      {
        type: "select",
        options: [
          {
            value: "ERC721",
            label: "ERC721",
          },
          {
            value: "ERC1155",
            label: "ERC1155",
          },
        ],
        ref: "standardContractType",
        placeholder: "Contract type",
      },
      {
        type: "input",
        isClearable: true,
        ref: "contract",
        placeholder: "Contract address",
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
                  value: "{{refs.standardContractType.value}}",
                },
                messageToEncrypt: {
                  type: "string",
                  value: "{{refs.plaintext.value}}",
                },
                chain: {
                  type: "string",
                  value: "{{refs.chain.value}}",
                },
                tokens: {
                  type: "string",
                  value: "1",
                },
                contract: {
                  type: "string",
                  value: "{{refs.contract.value}}",
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
          onerror: {
            // fixme: show error
            type: "EXIT",
          },
        },
      },
    ],
  },
];

export default action;
