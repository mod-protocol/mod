import { ModManifest } from "@mod-protocol/core";
import action from "./action";
import error from "./error";
import loading from "./loading";
import upload from "./upload";

const manifest: ModManifest = {
  slug: "imgur-upload",
  name: "Upload image to Imgur",
  custodyAddress: "stephancill.eth",
  logo: "https://imgur.com/favicon.ico",
  custodyGithubUsername: "stephancill",
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
