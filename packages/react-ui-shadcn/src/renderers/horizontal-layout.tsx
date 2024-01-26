import React from "react";
import { Renderers } from "@mod-protocol/react";
import { Skeleton } from "../components/ui/skeleton";

export const HorizontalLayoutRenderer = (
  props: React.ComponentProps<Renderers["HorizontalLayout"]>
) => {
  return (
    <div className="flex flex-row w-[inherit] h-full gap-2 items-center">
      {props.isLoading ? (
        <Skeleton className="w-full h-4 min-w-4 min-h-8" />
      ) : (
        props.children
      )}
    </div>
  );
};
