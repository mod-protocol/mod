"use client";

import React from "react";
import {
  ContentContext,
  Embed,
  ModManifest,
  canRenderEntrypointWithContext,
} from "@mod-protocol/core";

import { RenderMiniApp, Renderers } from ".";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error(
    "Please provide the NEXT_PUBLIC_API_URL environment variable"
  );
}
const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  embed: Embed;
  renderers: Renderers;
  fallbackRenderMiniApp: ModManifest;
  renderMiniApps: ModManifest[];
};

export function RenderEmbed(props: Props) {
  let matchingMiniapps = [{ embed: props.embed, api: API_URL }].flatMap<{
    context: ContentContext;
    manifest: ModManifest;
  }>((context) => {
    function getMatchingMiniApps(miniApps: ModManifest[]) {
      return miniApps
        .map(
          (
            miniapp
          ): null | {
            context: ContentContext;
            manifest: ModManifest;
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
        context: ContentContext;
        manifest: ModManifest;
      }>;
    }

    let matchingMiniApps = getMatchingMiniApps(props.renderMiniApps);

    if (matchingMiniApps.length) {
      return matchingMiniApps;
    }

    // use fallback instead
    return getMatchingMiniApps([props.fallbackRenderMiniApp]);
  });

  return matchingMiniapps.length
    ? matchingMiniapps.map((miniapp, index) => (
        <RenderMiniApp
          {...miniapp.context}
          key={index}
          variant="content"
          manifest={miniapp.manifest}
          renderers={props.renderers}
        />
      ))
    : null;
}
