import { ModManifest } from "@mod-protocol/core";
import view from "./view";

const manifest: ModManifest = {
  slug: "zora-nft-minter",
  name: "Preview and mint Zora NFTs",
  custodyAddress: "stephancill.eth",
  version: "0.0.1",
  logo: "https://i.imgur.com/fuSkgoJ.png",
  custodyGithubUsername: "stephancill",
  permissions: ["user.wallet.address"],
  contentEntrypoints: [
    {
      if: {
        value: "{{embed.url}}",
        match: {
          startsWith: "https://zora.co/collect",
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
