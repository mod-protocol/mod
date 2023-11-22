import { ModManifest } from "@mod-protocol/core";
import action from "./action";
import loading from "./loading";
import error from "./error";
import sign from "./sign";

const manifest: ModManifest = {
  slug: "lit-protocol",
  name: "Token gate",
  custodyAddress: "furlong.eth",
  logo: "https://openseauserdata.com/files/2105703ca9fbe5116c26b9967a596abe.png",
  custodyGithubUsername: "davidfurlong",
  version: "0.0.1",
  creationEntrypoints: sign,
  permissions: ["web3.eth.personal.sign"],
  modelDefinitions: {
    EncryptedData: {
      type: "object",
      properties: {
        cipherText: { type: "string" },
        dataToEncryptHash: { type: "string" },
        accessControlConditions: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            properties: {
              conditionType: { type: "string" },
              contractAddress: { type: "string" },
              standardContractType: { type: "string" },
              chain: { type: "string" },
              method: { type: "string" },
              parameters: {
                type: "array",
                minItems: 1,
                items: { type: "string" },
              },
              returnValueTest: {
                type: "object",
                properties: {
                  comparator: { type: "string" },
                  value: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  elements: {
    "#sign": sign,
    "#error": error,
    "#action": action,
    "#loading": loading,
  },
};

export default manifest;
