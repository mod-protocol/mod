import { ModManifest } from "@mod-protocol/core";
import action from "./action";
import error from "./error";
import loading from "./loading";

const manifest: ModManifest = {
  slug: "zora-create",
  name: "Add NFT via Zora Premint",
  custodyAddress: "0xdcC59cF0Adf4175973D4abc8c0715f83f90d2f1d",
  logo: "https://i.imgur.com/rsfLOfD.png",
  custodyGithubUsername: "stephancill",
  version: "0.0.1",
  permissions: ["user.wallet.address"],
  creationEntrypoints: action,
  elements: {
    "#error": error,
    "#loading": loading,
  },
};

export default manifest;
