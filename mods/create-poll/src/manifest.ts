import { ModManifest } from "@mod-protocol/core";
import creation from "./creation";
import loading from "./loading";
import error from "./error";

const manifest: ModManifest = {
  slug: "create-poll",
  name: "Create a poll",
  custodyAddress: "furlong.eth",
  custodyGithubUsername: "davidfurlong",
  logo: "https://i.imgur.com/KNajEKx.png",
  version: "0.0.1",
  creationEntrypoints: creation,
  elements: {
    "#error": error,
    "#action": creation,
    "#loading": loading,
  },
  modelDefinitions: {
    Poll: {
      type: "object",
      properties: {
        choice1: { type: "string" },
        choice2: { type: "string" },
        choice3: { type: "string" },
        choice4: { type: "string" },
        endDate: { type: "string", format: "date-time" },
      },
      required: ["choice1", "choice2"],
    },
  },
};

export default manifest;
