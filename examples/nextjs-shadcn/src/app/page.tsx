import Link from "next/link";
import * as React from "react";
import EditorExample from "./editor-example";
import { dummyCastData } from "./dummy-casts";
import { Cast } from "./cast";

export default function Page() {
  return (
    <div className="flex flex-col container">
      <div className="gap-5 py-3">
        <h1 className="font-bold text-3xl">
          The easiest way to integrate Farcaster cast creation and rich embeds
          in React
        </h1>
        <h2 className="text-xl mt-2">
          Using Mini-apps powered by Mod protocol
        </h2>
      </div>
      <hr className="mb-10" />
      <div className="flex md:flex-row gap-10 flex-col">
        <div className="flex flex-col md:w-1/2">
          <h1 className="text-xl mb-4">Casting example</h1>
          <div className="max-w-lg">
            <EditorExample />
          </div>
          <div className="mt-10">
            <h2 className="font-bold mt-0">Supports out of the box</h2>
            <ul>
              <li>✅ @ mentions</li>
              <li>✅ Automatic linking</li>
              <li>✅ Channels</li>
              <li>✅ Links</li>
              <li>✅ Max cast length (320 bytes)</li>
              <li>✅ Open graph previews</li>
              <li>✅ Textcuts</li>
              <li>✅ Image upload to IPFS (via mini-app)</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:w-1/2">
          <h1 className="text-xl">Displaying casts with rich embeds</h1>
          <h2 className="my-2">NFT via OpenGraph</h2>
          <Cast cast={dummyCastData[2]} />
          <h2 className="my-2">Embedded Video</h2>
          <Cast cast={dummyCastData[3]} />
          <h2 className="my-2">Embedded URL</h2>
          <Cast cast={dummyCastData[0]} />
          <h2 className="my-2">Embedded Image</h2>
          <Cast cast={dummyCastData[1]} />
        </div>
      </div>
    </div>
  );
}
