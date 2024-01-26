import { ModManifest } from "@mod-protocol/core";
import action from "./action";
import error from "./error";
import loading from "./loading";
import upload from "./upload";

const manifest: ModManifest = {
  slug: "infura-ipfs-upload",
  name: "Add image",
  custodyAddress: "0xdcC59cF0Adf4175973D4abc8c0715f83f90d2f1d",
  logo: "https://i.imgur.com/FxgecX7.png",
  custodyGithubUsername: "davidfurlong",
  version: "0.0.1",
  creationEntrypoints: action,
  elements: {
    "#action": action,
    "#upload": upload,
    "#loading": loading,
    "#error": error,
  },
};

export default manifest;
