import { Manifest } from "@packages/core";
import action from "./action";
import error from "./error";
import loading from "./loading";
import upload from "./upload";

const manifest: Manifest = {
  slug: "livepeer-video",
  name: "Upload a video using Livepeer",
  custodyAddress: "furlong.eth",
  logo: "https://i.imgur.com/nnPVcMa.png",
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
