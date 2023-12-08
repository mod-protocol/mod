import { ModManifest } from "@mod-protocol/core";
import action from "./action";
import success from "./success";
import error from "./error";
import loading from "./loading";

const manifest: ModManifest = {
  slug: "chatgpt-shorten",
  name: "Shorten text using AI",
  custodyAddress: "furlong.eth",
  logo: "https://i.imgur.com/hV566qC.png",
  custodyGithubUsername: "davidfurlong",
  version: "0.0.1",
  creationEntrypoints: action,
  elements: {
    "#success": success,
    "#error": error,
    "#loading": loading,
  },
};

export default manifest;
