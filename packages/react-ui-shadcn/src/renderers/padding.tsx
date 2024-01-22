import React from "react";
import { Renderers } from "@mod-protocol/react";

export const PaddingRenderer = (
  props: React.ComponentProps<Renderers["Padding"]>
) => {
  return <div className="p-2 w-[inherit]">{props.children}</div>;
};
