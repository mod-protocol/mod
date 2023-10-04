import { Manifest } from "@packages/core";
import view from "./view";

const manifest: Manifest = {
  slug: "image-render",
  name: "View Images",
  custodyAddress: "furlong.eth",
  version: "0.0.1",
  logo: "https://i.imgur.com/UkDzVVB.png",
  custodyGithubUsername: "davidfurlong",
  contentEntrypoints: [
    {
      if: {
        value: "{{embed.url}}",
        match: {
          equals: "{{embed.metadata.image.url}}",
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
