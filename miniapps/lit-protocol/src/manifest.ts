import { ModManifest } from "@mod-protocol/core";
import action from "./action";
import loading from "./loading";

const manifest: ModManifest = {
  slug: "lit-protocol",
  name: "Token gated casts",
  custodyAddress: "furlong.eth",
  logo: "https://openseauserdata.com/files/2105703ca9fbe5116c26b9967a596abe.png",
  custodyGithubUsername: "davidfurlong",
  version: "0.0.1",
  creationEntrypoints: action,
  elements: {
    "#action": action,
    "#loading": loading,
  },
};

export default manifest;
