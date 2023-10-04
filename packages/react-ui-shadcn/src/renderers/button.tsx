import React from "react";
import { Renderers } from "@packages/react";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Button } from "@/components/ui/button";

export const ButtonRenderer = (
  props: React.ComponentProps<Renderers["Button"]>
) => {
  const { label, isDisabled, isLoading, onClick } = props;
  return (
    <Button
      // className="flex-1"
      disabled={isDisabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? <CircularProgress size="sm" /> : label}
    </Button>
  );
};
