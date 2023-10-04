import React from "react";
import { Renderers } from "@packages/react";
import { CircularProgress } from "@/components/ui/circular-progress";

export const CircularProgressRenderer = (
  props: React.ComponentProps<Renderers["CircularProgress"]>
) => {
  return <CircularProgress />;
};
