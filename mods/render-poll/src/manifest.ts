import { ModManifest } from "@mod-protocol/core";
import view from "./view";
import error from "./error";
import results from "./results";

const manifest: ModManifest = {
  slug: "render-poll",
  name: "Renders a poll",
  custodyAddress: "furlong.eth",
  custodyGithubUsername: "davidfurlong",
  logo: "https://i.imgur.com/KNajEKx.png",
  version: "0.0.1",
  richEmbedEntrypoints: view,
  permissions: ["farcaster.messagereply.create", "user.farcaster.fid"],
  elements: {
    "#error": error,
    "#results": results,
  },
};

export default manifest;
