import { ModManifest } from "@mod-protocol/core";
import view from "./view";

const manifest: ModManifest = {
  slug: "nft-minter",
  name: "Preview and mint NFTs",
  custodyAddress: "0xdcC59cF0Adf4175973D4abc8c0715f83f90d2f1d",
  version: "0.0.1",
  logo: "https://i.imgur.com/fuSkgoJ.png",
  custodyGithubUsername: "davidfurlong",
  richEmbedEntrypoints: [
    {
      if: {
        value: "{{embed.metadata.nft.collection.name}}",
        match: {
          NOT: {
            equals: "",
          },
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
