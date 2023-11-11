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
          {
            value: "avalanche",
            label: "Avalanche",
          },
        ],
        ref: "chain",
        placeholder: "Chain",
      },
      {
        // future: CONTRACT AUTOCOMPLETE is better UX
        type: "input",
        clearable: true,
        ref: "contract",
        placeholder: "Contract address",
      },
      {
        type: "input",
        ref: "tokens",
        placeholder: "How many tokens does the wallet need to own?",
      },
      {
        type: "button",
        label: "Publish",
        onclick: {
          type: "POST",
          ref: "encryption",
          url: "{{api}}/lit-protocol/encrypt",
          body: {
            json: {
              type: "object",
              value: {
                authSig: {
                  type: "string",
                  // FIXME
                  value: "{{user.wallet.signature}}",
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
                  value: "{{refs.tokens.value}}",
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
