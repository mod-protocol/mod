"use client";

import React from "react";
import {
  ContentContext,
  Embed,
  ModManifest,
  canRenderEntrypointWithContext,
} from "@mod-protocol/core";

import { RenderMiniApp, Renderers } from ".";

type Props = {
  api: string;
  embed: Embed;
  renderers: Renderers;
  /** is used as a fallback when all other contentMiniApps fail to match the content type */
  defaultContentMiniApp: ModManifest;
  contentMiniApps: ModManifest[];
};

export function RenderEmbed(props: Props) {
  let matchingMiniapps = [{ embed: props.embed, api: props.api }].flatMap<{
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

    let matchingMiniApps = getMatchingMiniApps(props.contentMiniApps);

    if (matchingMiniApps.length) {
      return matchingMiniApps;
    }

    // use fallback instead
    return getMatchingMiniApps([props.defaultContentMiniApp]);
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
