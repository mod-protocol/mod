import React from "react";
import { Renderers } from "@packages/react";

export const VerticalLayoutRenderer = (
  props: React.ComponentProps<Renderers["VerticalLayout"]>
) => {
  return <div className="flex flex-col w-full space-y-2">{props.children}</div>;
};
