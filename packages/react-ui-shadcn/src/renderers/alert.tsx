import {
  ExclamationTriangleIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "components/ui/alert";
import React from "react";
import { Renderers } from "@mod-protocol/react";

export const AlertRenderer = (
  props: React.ComponentProps<Renderers["Alert"]>
) => {
  const { description, title, variant } = props;
  return (
    <Alert variant={variant === "error" ? "destructive" : "default"}>
      {variant === "error" ? (
        <ExclamationTriangleIcon className="h-4 w-4" />
      ) : (
        <CheckCircledIcon className="h-4 w-4" />
      )}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};
