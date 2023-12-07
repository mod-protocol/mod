import { DocsThemeConfig } from "nextra-theme-docs";
import Logo from "./Logo";

const config: DocsThemeConfig = {
  logo: Logo,
  project: {
    link: "https://github.com/mod-protocol/mod",
  },
  docsRepositoryBase: "https://github.com/mod-protocol/mod/docs",
  footer: {
    text: "Mod Protocol",
  },
  head: null,
  useNextSeoProps() {
    return {
      titleTemplate: "%s - Mod Protocol Docs",
      defaultTitle: "Mod Protocol Docs",
      description:
        "A protocol and set of open source libraries for decentralized social Mods",
      openGraph: {
        titleTemplate: "%s - Mod Protocol Docs",
        description:
          "A protocol and set of open source libraries for decentralized social Mods",
        images: [
          {
            url: "https://docs.modprotocol.org/og.png",
            width: 1200,
            height: 630,
            alt: "Mod Protocol Docs",
            type: "image/png",
          },
        ],
      },
      twitter: {
        handle: "@modprotocol",
        cardType: "summary_large_image",
      },
    };
  },
};

export default config;
