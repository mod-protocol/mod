import { ModManifest } from "@mod-protocol/core";
import view from "./view";
import rerender from "./rerender";

const manifest: ModManifest = {
  slug: "farcaster-frames-render",
  name: "View Farcaster Frames",
  custodyAddress: "furlong.eth",
  version: "0.0.1",
  logo: "https://i.imgur.com/B8TP2gG.png",
  custodyGithubUsername: "davidfurlong",
  richEmbedEntrypoints: [
    {
      if: {
        value: "{{embed.metadata.customOpenGraph.['fc:frame']}}",
        match: {
          equals: "vNext",
        },
      },
      element: view,
    },
  ],
  elements: {
    "#view": view,
    "#rerender": rerender,
  },
};

export default manifest;
