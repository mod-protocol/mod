import { ModElement } from "@mod-protocol/core";

const loading: ModElement[] = [
  {
    type: "text",
    label: "Fetching a response...",
  },
  {
    type: "circular-progress",
  },
];

export default loading;
