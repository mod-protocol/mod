import { ModElement } from "@mod-protocol/core";

const loading: ModElement[] = [
  {
    type: "text",
    label: "Decrypting",
  },
  {
    type: "circular-progress",
  },
];

export default loading;
