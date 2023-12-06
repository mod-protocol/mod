import React from "react";
import { Renderers } from "@mod-protocol/react";
import { Progress } from "components/ui/progress";

export const ProgressRenderer = (
  props: React.ComponentProps<Renderers["Progress"]>
) => {
  return (
    <div className="flex">
      <Progress value={props.value} />
      {props.label}
      {props.value.toFixed(1)}%
    </div>
  );
};
