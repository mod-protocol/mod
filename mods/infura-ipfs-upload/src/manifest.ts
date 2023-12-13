import { ModManifest } from "@mod-protocol/core";
import action from "./action";
import error from "./error";
import loading from "./loading";
import upload from "./upload";

const manifest: ModManifest = {
  slug: "infura-ipfs-upload",
  name: "Add image",
  custodyAddress: "furlong.eth",
  logo: "https://i.imgur.com/FxgecX7.png",
  custodyGithubUsername: "davidfurlong",
  version: "0.0.1",
  creationEntrypoints: action,
  inputCreationEntrypoints: [
    {
      elementId: "#upload",
      mimeTypes: ["^image/.*$"],
      contentRef: "myOpenFileAction",
    },
  ],
  elements: {
    "#action": action,
    "#upload": upload,
    "#loading": loading,
    "#error": error,
  },
};

export default manifest;
