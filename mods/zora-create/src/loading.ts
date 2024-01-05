import { ModElement } from "@mod-protocol/core";

const loading: ModElement[] = [
  {
    type: "text",
    label: "Uploading the file: {{refs.myZoraCreateRequest.progress}}%",
  },
  {
    type: "circular-progress",
  },
];

export default loading;
