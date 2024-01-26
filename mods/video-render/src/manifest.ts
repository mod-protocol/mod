import { ModManifest } from "@mod-protocol/core";
import view from "./view";

const manifest: ModManifest = {
  slug: "video-render",
  name: "View Videos",
  custodyAddress: "0xdcC59cF0Adf4175973D4abc8c0715f83f90d2f1d",
  version: "0.0.1",
  logo: "https://i.imgur.com/RITeKTW.png",
  custodyGithubUsername: "davidfurlong",
  richEmbedEntrypoints: [
    {
      if: {
        value: "{{embed.url}}",
        match: {
          regex: "^https?://.*.(?:mp4|webm|avi|mov|m3u8)$",
        },
      },
      element: view,
    },
  ],
  elements: {
    "#view": view,
  },
};

export default manifest;
