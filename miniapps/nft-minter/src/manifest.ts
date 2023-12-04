import { ModManifest } from "@mod-protocol/core";
import view from "./view";

const manifest: ModManifest = {
  slug: "nft-minter",
  name: "Preview and mint NFTs",
  custodyAddress: "furlong.eth",
  version: "0.0.1",
  logo: "https://i.imgur.com/fuSkgoJ.png",
  custodyGithubUsername: "davidfurlong",
  contentEntrypoints: [
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
