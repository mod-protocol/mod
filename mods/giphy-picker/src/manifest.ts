import { ModManifest } from "@mod-protocol/core";
import action from "./action";
import success from "./success";
import error from "./error";
import loading from "./loading";

const manifest: ModManifest = {
  slug: "giphy-picker",
  name: "Add GIF/Sticker",
  custodyAddress: "furlong.eth",
  custodyGithubUsername: "davidfurlong",
  logo: "https://i.imgur.com/vccxL2r.png",
  version: "0.0.1",
  creationEntrypoints: action,
  elements: {
    "#success": success,
    "#error": error,
    "#loading": loading,
  },
};

export default manifest;
