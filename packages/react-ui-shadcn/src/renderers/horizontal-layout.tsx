import React from "react";
import { Renderers } from "@mod-protocol/react";

export const HorizontalLayoutRenderer = (
  props: React.ComponentProps<Renderers["HorizontalLayout"]>
) => {
  return (
    <div className="flex flex-row h-full gap-2 items-center">
      {props.children}
    </div>
  );
};
