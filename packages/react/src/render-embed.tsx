"use client";

import React from "react";
import {
  RichEmbedContext,
  Embed,
  ModManifest,
  canRenderEntrypointWithContext,
} from "@mod-protocol/core";

import { ResolverTypes, RenderMod, Renderers } from ".";

type Props = RichEmbedContext & {
  renderers: Renderers;
  /** is used as a fallback when all other mods fail to match the richEmbed type */
  defaultRichEmbedMod: ModManifest;
  mods: ModManifest[];
  resolvers?: ResolverTypes;
};

export function RichEmbed(props: Props) {
  let matchingMiniapps = [
    { embed: props.embed, api: props.api, user: props.user },
  ].flatMap<{
    context: RichEmbedContext;
    manifest: ModManifest;
  }>((context) => {
    function getMatchingMods(mods: ModManifest[]) {
      return mods
        .map(
          (
            mod
          ): null | {
            context: RichEmbedContext;
            manifest: ModManifest;
          } => {
            for (const entrypoint of mod.richEmbedEntrypoints ?? []) {
              if (canRenderEntrypointWithContext(entrypoint, context)) {
                return {
                  context: context,
                  manifest: mod,
                };
              }
            }
            return null;
          }
        )
        .filter(Boolean) as Array<{
        context: RichEmbedContext;
        manifest: ModManifest;
      }>;
    }

    let matchingMods = getMatchingMods(props.mods);

    if (matchingMods.length) {
      return matchingMods;
    }

    // use fallback instead
    return getMatchingMods([props.defaultRichEmbedMod]);
  });

  return matchingMiniapps.length
    ? matchingMiniapps.map((mod, index) => (
        <RenderMod
          {...mod.context}
          {...props.resolvers}
          key={index}
          variant="richEmbed"
          manifest={mod.manifest}
          renderers={props.renderers}
        />
      ))
    : null;
}
