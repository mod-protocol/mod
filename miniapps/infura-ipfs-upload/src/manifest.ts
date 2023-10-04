import { Manifest } from "@mod-protocol/core";
import action from "./action";
import error from "./error";
import loading from "./loading";
import upload from "./upload";

const manifest: Manifest = {
  slug: "infura-ipfs-upload",
  name: "Upload files to IPFS using infura",
  custodyAddress: "furlong.eth",
  logo: "https://i.imgur.com/ks7Akx5.png",
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
