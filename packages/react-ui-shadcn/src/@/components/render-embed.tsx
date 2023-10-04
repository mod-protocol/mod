"use client";

import React from "react";
import {
  ContentContextType,
  Embed,
  Manifest,
  canRenderEntrypointWithContext,
} from "@mod-protocol/core";
import {
  fallbackRenderMiniApp,
  renderMiniApps,
} from "@mod-protocol/miniapp-registry";
import { RenderMiniApp } from "@mod-protocol/react";
import { renderers } from "../../renderers";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error(
    "Please provide the NEXT_PUBLIC_API_URL environment variable"
  );
}
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function RenderEmbed(props: { embed: Embed }) {
  const { embed } = props;

  let matchingMiniapps = [{ embed, api: API_URL }].flatMap<{
    context: ContentContextType;
    manifest: Manifest;
  }>((context) => {
    function getMatchingMiniApps(miniApps: Manifest[]) {
      return miniApps
        .map(
          (
            miniapp
          ): null | {
            context: ContentContextType;
            manifest: Manifest;
          } => {
            for (const entrypoint of miniapp.contentEntrypoints ?? []) {
              if (canRenderEntrypointWithContext(entrypoint, context)) {
                return {
                  context: context,
                  manifest: miniapp,
                };
              }
            }
            return null;
          }
        )
        .filter(Boolean) as Array<{
        context: ContentContextType;
        manifest: Manifest;
      }>;
    }

    let matchingMiniApps = getMatchingMiniApps(renderMiniApps);

    if (matchingMiniApps.length) {
      return matchingMiniApps;
    }

    // use fallback instead
    return getMatchingMiniApps([fallbackRenderMiniApp]);
  });

  return matchingMiniapps.length
    ? matchingMiniapps.map((miniapp, index) => (
        <div key={index} className="mt-2 rounded-md overflow-hidden border">
          <RenderMiniApp
            {...miniapp.context}
            variant="content"
            manifest={miniapp.manifest}
            renderers={renderers}
          />
        </div>
      ))
    : null;
}
