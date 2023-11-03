import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import Image from "next/image";
import { useTheme } from "nextra-theme-docs";

function Logo() {
  const { theme, systemTheme } = useTheme();
  return (
    <Image
      src={
        theme === "dark" || systemTheme === "dark"
          ? "/mod-protocol-white.svg"
          : "/mod-protocol.svg"
      }
      alt="Mod protocol"
      width={350}
      height={28.5}
    />
  );
}

const config: DocsThemeConfig = {
  logo: Logo,
  project: {
    link: "https://github.com/mod-protocol/mod",
  },
  docsRepositoryBase: "https://github.com/mod-protocol/mod/docs",
  footer: {
    text: "Mod Protocol",
  },
  useNextSeoProps() {
    return {
      titleTemplate: "%s - Mod Protocol Docs",
      defaultTitle: "Mod Protocol Docs",
      description:
        "A protocol and set of open source libraries for decentralized social Mini-apps",
      openGraph: {
        titleTemplate: "%s - Mod Protocol Docs",
        description:
          "A protocol and set of open source libraries for decentralized social Mini-apps",
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
