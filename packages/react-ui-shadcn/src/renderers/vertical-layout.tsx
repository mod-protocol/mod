import React from "react";
import { Renderers } from "@mod-protocol/react";
import { Skeleton } from "../components/ui/skeleton";

export const VerticalLayoutRenderer = (
  props: React.ComponentProps<Renderers["VerticalLayout"]>
) => {
  return (
    <div className="flex flex-col w-full space-y-2">
      {props.isLoading ? (
        <Skeleton className="w-[inherit] h-full h-4 min-w-4 min-h-8" />
      ) : (
        props.children
      )}
    </div>
  );
};
