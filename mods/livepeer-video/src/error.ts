import { ModElement } from "@mod-protocol/core";

const error: ModElement[] = [
  {
    type: "text",
    label: "ERROR: {{refs.myFileUploadRequest.error.statusText}}",
  },
  {
    type: "button",
    label: "Retry",
    onclick: "#action",
  },
];

export default error;
