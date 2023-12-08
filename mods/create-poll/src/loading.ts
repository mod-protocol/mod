import { ModElement } from "@mod-protocol/core";

const loading: ModElement[] = [
  {
    type: "horizontal-layout",
    elements: [
      {
        type: "circular-progress",
      },
      {
        type: "text",
        label: "Creating poll",
      },
    ],
  },
];

export default loading;
