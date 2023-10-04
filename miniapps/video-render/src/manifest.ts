import { Manifest } from "@packages/core";
import view from "./view";

const manifest: Manifest = {
  slug: "video-render",
  name: "View Videos",
  custodyAddress: "furlong.eth",
  version: "0.0.1",
  logo: "https://i.imgur.com/RITeKTW.png",
  custodyGithubUsername: "davidfurlong",
  contentEntrypoints: [
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
