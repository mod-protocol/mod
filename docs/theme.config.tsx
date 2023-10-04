import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import Image from "next/image";

const config: DocsThemeConfig = {
  logo: (
    <Image
      src="/mod-protocol.svg"
      alt="Mod protocol"
      width={350}
      height={28.5}
    />
  ),
  project: {
    link: "https://github.com/mod-protocol/mod-monorepo",
  },
  docsRepositoryBase: "https://github.com/mod-protocol/mod-monorepo/docs",
  footer: {
    text: "Mod Protocol",
  },
  useNextSeoProps() {
    return {
      titleTemplate: "%s - Mod Protocol",
    };
  },
};

export default config;
