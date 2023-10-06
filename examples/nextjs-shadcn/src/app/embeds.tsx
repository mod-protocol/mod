"use client";

import React from "react";
import { renderers } from "@mod-protocol/react-ui-shadcn/dist/renderers";
import { RenderEmbed } from "@mod-protocol/react";
import { Embed } from "@mod-protocol/core";
import {
  fallbackRenderMiniApp,
  renderMiniApps,
} from "@mod-protocol/miniapp-registry";

export function Embeds(props: { embeds: Array<Embed> }) {
  return (
    <div>
      {props.embeds.map((embed, i) => (
        <RenderEmbed
          embed={embed}
          key={i}
          renderers={renderers}
          fallbackRenderMiniApp={fallbackRenderMiniApp}
          renderMiniApps={renderMiniApps}
        />
      ))}
    </div>
  );
}
