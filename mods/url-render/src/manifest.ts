import { ModManifest } from "@mod-protocol/core";
import fullimage from "./fullimage";
// import smallimage from "./smallimage";

const manifest: ModManifest = {
  slug: "url-render",
  name: "View urls",
  custodyAddress: "furlong.eth",
  version: "0.0.1",
  logo: "https://i.imgur.com/E7PAMHH.png",
  custodyGithubUsername: "davidfurlong",
  richEmbedEntrypoints: [
    {
      if: {
        value: "true",
        match: {
          equals: "true",
        },
      },
      element: fullimage,
    },
  ],
  elements: {
    "#fullimage": fullimage,
  },
};

export default manifest;
