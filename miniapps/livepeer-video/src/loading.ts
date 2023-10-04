import { Element } from "@mod-protocol/core";

const loading: Element[] = [
  {
    type: "text",
    label: "Uploading the file: {{refs.myFileUploadRequest.progress}}%",
  },
  {
    type: "circular-progress",
  },
];

export default loading;
