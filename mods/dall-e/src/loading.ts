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
        label: "Give it a sec, it's the closest thing to magic we have...",
      },
    ],
  },
];

export default loading;
