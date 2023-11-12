"use client";

import { useTheme } from "@mod-protocol/react-ui-shadcn/dist/components/theme-provider";
import {
  ConnectButton,
  RainbowKitProvider,
  darkTheme,
  getDefaultWallets,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { arbitrum, base, optimism, polygon, zora } from "viem/chains";
import { WagmiConfig, configureChains, createConfig, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { Cast } from "./cast";
import { dummyCastData } from "./dummy-casts";
import EditorExample from "./editor-example";

import "@rainbow-me/rainbowkit/styles.css";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Mod Example App",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,

  connectors: connectors,
  publicClient,
});
export default function Page() {
  const { resolvedTheme } = useTheme();

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        theme={{
          ...(resolvedTheme === "dark"
            ? darkTheme({
                borderRadius: "small",
                accentColor: "#f8fafc",
                accentColorForeground: "#0f172a",
              })
            : lightTheme({
                borderRadius: "small",
                accentColor: "#0f172a",
                accentColorForeground: "#f8fafc",
              })),
        }}
      >
        <div className="flex flex-col">
          <div className="py-3 bg-accent mb-4 border-b-2">
            <div className="container flex flex-row">
              <div className="flex flex-row gap-8 my-auto">
                <h1 className="text-2xl text-accent-foreground">Mod demo</h1>
                <a
                  href="https://docs.modprotocol.org"
                  target="_blank"
                  className="text-blue-700 text-2xl hover:underline"
                  rel="noopener noreferrer"
                >
                  Docs →
                </a>
              </div>

              <div className="ml-auto">
                <ConnectButton />
              </div>
            </div>
          </div>
          <div className="flex md:flex-row gap-10 flex-col container">
            <div className="flex flex-col md:w-1/2">
              <h2 className="text-xl">Mod Editor</h2>
              <h3 className="my-2">
                An open source library for Farcaster cast creation supporting
                Mini-apps
              </h3>
              <div className="max-w-lg">
                <EditorExample />
              </div>
              <div className="mt-10">
                <h2 className="font-bold mt-0">Feature support</h2>
                <ul>
                  <li>✅ @ mentions</li>
                  <li>✅ Channels</li>
                  <li>✅ Links & Auto embeds</li>
                  <li>✅ Image, url and video embeds</li>
                  <li>✅ Max cast length (320 bytes)</li>
                  <li>✅ Open graph previews</li>
                  <li>✅ Textcuts</li>
                  <li>✅ Image upload to IPFS (via mini-app)</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:w-1/2">
              <h2 className="text-xl">Embed renderers</h2>
              <h3 className="mb-2 mt-2">NFT Mini-app with native minting</h3>
              <Cast cast={dummyCastData[4]} />
              <h3 className="mb-2 mt-4">Video Mini-app</h3>
              <Cast cast={dummyCastData[3]} />
              <h3 className="mb-2 mt-4">URL Mini-app</h3>
              <Cast cast={dummyCastData[0]} />
              <h3 className="mb-2 mt-4">Image Mini-app</h3>
              <Cast cast={dummyCastData[1]} />
            </div>
          </div>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
