import React from "react";
import { Renderers } from "@packages/react";

export const HorizontalLayoutRenderer = (
  props: React.ComponentProps<Renderers["HorizontalLayout"]>
) => {
  return (
    <div className="flex flex-row h-full space-x-2 items-center">
      {props.children}
    </div>
  );
};
