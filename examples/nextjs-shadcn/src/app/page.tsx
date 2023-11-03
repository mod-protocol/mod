import * as React from "react";
import EditorExample from "./editor-example";
import { dummyCastData } from "./dummy-casts";
import { Cast } from "./cast";

export default function Page() {
  return (
    <div className="flex flex-col">
      <div className="py-3 bg-slate-100 mb-4 border-b-2">
        <div className="container flex flex-row gap-8">
          <h1 className="text-2xl">Mod demo</h1>
          <a
            href="https://docs.modprotocol.org"
            target="_blank"
            className="text-blue-700 text-2xl hover:underline ml-auto"
            rel="noopener noreferrer"
          >
            Docs →
          </a>
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
          <h3 className="mb-2 mt-2">NFT Mini-app</h3>
          <Cast cast={dummyCastData[2]} />
          <h3 className="mb-2 mt-4">Video Mini-app</h3>
          <Cast cast={dummyCastData[3]} />
          <h3 className="mb-2 mt-4">URL Mini-app</h3>
          <Cast cast={dummyCastData[0]} />
          <h3 className="mb-2 mt-4">Image Mini-app</h3>
          <Cast cast={dummyCastData[1]} />
        </div>
      </div>
    </div>
  );
}
