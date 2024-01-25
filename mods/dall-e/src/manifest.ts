import { ModManifest } from "@mod-protocol/core";
import action from "./action";
import success from "./success";
import error from "./error";
import loading from "./loading";

const manifest: ModManifest = {
  slug: "dall-e",
  name: "Use AI to make an image",
  custodyAddress: "0xdcC59cF0Adf4175973D4abc8c0715f83f90d2f1d",
  logo: "https://i.imgur.com/zKiFDal.png",
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
