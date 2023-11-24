import { ModElement } from "@mod-protocol/core";

const decrypt: ModElement[] = [
  {
    type: "vertical-layout",
    elements: [],
    onload: {
      ref: "decryption-request",
      type: "POST",
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
            payload: {
              type: "object",
              value: {
                cipherTextRetrieved: {
                  type: "string",
                  value:
                    "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.cipherText}}",
                },
                dataToEncryptHashRetrieved: {
                  type: "string",
                  value:
                    "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.dataToEncryptHash}}",
                },
                accessControlConditions: {
                  type: "array",
                  value: [
                    {
                      type: "object",
                      value: {
                        conditionType: {
                          type: "string",
                          value:
                            "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.accessControlConditions[0].conditionType}}",
                        },
                        contractAddress: {
                          type: "string",
                          value:
                            "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.accessControlConditions[0].contractAddress}}",
                        },
                        standardContractType: {
                          type: "string",
                          value:
                            "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.accessControlConditions[0].standardContractType}}",
                        },
                        chain: {
                          type: "string",
                          value:
                            "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.accessControlConditions[0].chain}}",
                        },
                        method: {
                          type: "string",
                          value:
                            "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.accessControlConditions[0].method}}",
                        },
                        parameters: {
                          type: "array",
                          value: [
                            {
                              type: "string",
                              value:
                                "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.accessControlConditions[0].parameters[0]}}",
                            },
                          ],
                        },
                        returnValueTest: {
                          type: "object",
                          value: {
                            comparator: {
                              type: "string",
                              value:
                                "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.accessControlConditions[0].returnValueTest.comparator}}",
                            },
                            value: {
                              type: "string",
                              value:
                                "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.accessControlConditions[0].returnValueTest.value}}",
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      url: "{{api}}/lit-protocol-renderer",
      onsuccess: "#success",
      onerror: "#error",
      onloading: "#loading",
    },
  },
];
export default decrypt;
