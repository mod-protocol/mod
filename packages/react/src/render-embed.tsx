"use client";

import {
  ModManifest,
  RichEmbedContext,
  canRenderEntrypointWithContext,
} from "@mod-protocol/core";

import { RenderMod, Renderers, ResolverTypes } from ".";

type Props = RichEmbedContext & {
  renderers: Renderers;
  /** is used as a fallback when all other mods fail to match the richEmbed type */
  defaultRichEmbedMod: ModManifest;
  mods: ModManifest[];
  resolvers?: ResolverTypes;
};

export function RichEmbed(props: Props) {
  let matchingMods = [
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

  const miniapp = matchingMods[0];

  return miniapp ? (
    <RenderMod
      {...miniapp.context}
      {...props.resolvers}
      variant="richEmbed"
      manifest={miniapp.manifest}
      renderers={props.renderers}
    />
  ) : null;
}
