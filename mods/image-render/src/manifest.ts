import { ModManifest } from "@mod-protocol/core";
import view from "./view";

const manifest: ModManifest = {
  slug: "image-render",
  name: "View Images",
  custodyAddress: "0xdcC59cF0Adf4175973D4abc8c0715f83f90d2f1d",
  version: "0.0.1",
  logo: "https://i.imgur.com/75cFuT9.png",
  custodyGithubUsername: "davidfurlong",
  richEmbedEntrypoints: [
    {
      if: {
        value: "{{embed.url}}",
        match: {
          OR: [
            { equals: "{{embed.metadata.image.url}}" },
            { endsWith: ".png" },
            { endsWith: ".jpg" },
            { endsWith: ".jpeg" },
            { endsWith: ".gif" },
            { endsWith: ".svg" },
            { endsWith: ".webp" },
          ],
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
