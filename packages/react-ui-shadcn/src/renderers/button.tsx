import React from "react";
import { Renderers } from "@mod-protocol/react";
import { CircularProgress } from "components/ui/circular-progress";
import { Button } from "components/ui/button";

export const ButtonRenderer = (
  props: React.ComponentProps<Renderers["Button"]>
) => {
  const {
    label,
    isDisabled,
    isLoading,
    onClick,
    variant = "primary",
    loadingLabel = "",
  } = props;
  return (
    <Button
      variant={variant}
      disabled={isDisabled || isLoading}
      onClick={(e) => {
        // prevent an anchor inside a parent with an onclick also triggering the parent onclick
        e.stopPropagation();
        return onClick();
      }}
    >
      {isLoading ? (
        <>
          <CircularProgress size="sm" className={loadingLabel ? "mr-1" : ""} />
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </Button>
  );
};
