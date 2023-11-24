import React from "react";
import { Renderers } from "@mod-protocol/react";

export const ContainerRenderer = (
  props: React.ComponentProps<Renderers["Container"]>
) => {
  return (
    <div className="mt-2 rounded-md overflow-hidden border p-2">
      {props.children}
    </div>
  );
};
