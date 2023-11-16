import { ModManifest } from "@mod-protocol/core";
import action from "./action";
import error from "./error";
import loading from "./loading";

const manifest: ModManifest = {
  slug: "zora-create",
  name: "Add NFT via Zora Premint",
  custodyAddress: "stephancill.eth",
  logo: "https://i.imgur.com/rsfLOfD.png",
  custodyGithubUsername: "stephancill",
  version: "0.0.1",
  // permissions: ["user.wallet", "user.id"],
  creationEntrypoints: action,
  elements: {
    "#error": error,
    "#loading": loading,
  },
};

export default manifest;
