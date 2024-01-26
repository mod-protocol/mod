import { ModManifest } from "@mod-protocol/core";
import view from "./view";
import buying from "./buying";

const manifest: ModManifest = {
  slug: "erc-20",
  name: "ERC-20",
  custodyAddress: "0xdcC59cF0Adf4175973D4abc8c0715f83f90d2f1d",
  version: "0.0.1",
  logo: "",
  custodyGithubUsername: "stephancill",
  richEmbedEntrypoints: [
    {
      if: {
        value: "{{embed.url}}",
        match: {
          OR: [
            { startsWith: "https://app.uniswap.org/tokens/" },
            {
              regex: "eip155:(\\d+)/erc20:0x([0-9a-fA-F]+)",
            },
          ],
        },
      },
      element: view,
    },
  ],
  elements: {
    "#view": view,
    "#buying": buying,
  },
  permissions: ["user.wallet.address"], // "user.farcaster.fid"
};

export default manifest;
