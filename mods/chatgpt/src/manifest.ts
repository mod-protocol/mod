import { ModManifest } from "@mod-protocol/core";
import action from "./action";
import success from "./success";
import error from "./error";
import loading from "./loading";

const manifest: ModManifest = {
  slug: "chatgpt",
  name: "Prompt ChatGPT",
  custodyAddress: "0xdcC59cF0Adf4175973D4abc8c0715f83f90d2f1d",
  logo: "https://i.imgur.com/YayIWi1.png",
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
