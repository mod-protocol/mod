import React from "react";
import { Renderers } from "@mod-protocol/react";

export const TextRenderer = (
  props: React.ComponentProps<Renderers["Text"]>
) => {
  const { label } = props;
  return <p className="my-0 flex-1">{label}</p>;
};
