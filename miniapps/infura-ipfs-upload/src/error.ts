import { Element } from "@packages/core";

const error: Element[] = [
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
