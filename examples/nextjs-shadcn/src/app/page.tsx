import Link from "next/link";
import * as React from "react";
import EditorExample from "./editor-example";
import { dummyCastData } from "./dummy-casts";
import { Cast } from "@/components/cast";

export default function Page() {
  return (
    <div className="flex flex-col container">
      <div className="flex gap-5 py-3">
        <h1 className="font-bold text-3xl">Mod Protocol React Example</h1>
      </div>
      <div className="flex md:flex-row gap-10 flex-col">
        <div className="flex flex-col md:w-1/2">
          <h1 className="text-xl mb-4">Cast Creation example</h1>
          <div className="max-w-lg">
            <EditorExample />
          </div>
          <hr className="mt-12 mb-8"></hr>
          <div>
            <h2 className="font-bold mt-0">Features</h2>
            <ul>
              <li>✅ @mentions</li>
              <li>✅ link detection and formatting</li>
              <li>✅ gracefully handling copy paste</li>
              <li>✅ handling max character length & UI</li>
              <li>✅ Open graph previews</li>
            </ul>
            <h2 className="font-bold mt-4">Farcaster specific features</h2>
            <ul>
              <li>✅ textcuts support</li>
              <li>✅ channels support</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:w-1/2">
          <h1 className="text-xl">Rendering</h1>
          <h2 className="my-2">Embedded URL</h2>
          <Cast cast={dummyCastData[0]} />
          <h2 className="my-2">Embedded Image</h2>
          <Cast cast={dummyCastData[1]} />
          <h2 className="my-2">NFT via OpenGraph</h2>
          <Cast cast={dummyCastData[2]} />
          <h2 className="my-2">Embedded Video</h2>
          <Cast cast={dummyCastData[3]} />
        </div>
      </div>
    </div>
  );
}
