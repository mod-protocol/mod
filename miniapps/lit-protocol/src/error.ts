import { ModElement } from "@mod-protocol/core";

const error: ModElement[] = [
  {
    type: "text",
    label: "ERROR: Something went wrong",
  },
  {
    type: "button",
    label: "Retry",
    onclick: "#sign",
  },
];

export default error;
