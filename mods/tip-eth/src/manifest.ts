import { ModManifest } from "@mod-protocol/core";
import action from "./action";

const manifest: ModManifest = {
  slug: "tip-eth",
  name: "Send the author a tip",
  custodyAddress: "stephancill.eth",
  version: "0.0.1",
  logo: "https://i.imgur.com/MKmOtSU.png",
  custodyGithubUsername: "stephancill",
  actionEntrypoints: action,
};

export default manifest;
