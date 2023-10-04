import { Element } from "@packages/core";

const action: Element[] = [
  {
    type: "vertical-layout",
    elements: [
      {
        type: "button",
        label: "Choose a file",
        onclick: {
          ref: "myOpenFileAction",
          type: "OPENFILE",
          maxFiles: 1,
          accept: ["video/mp4"],
          onsuccess: "#upload",
          onerror: "#error",
          oncancel: {
            type: "EXIT",
          },
        },
      },
    ],
  },
];

export default action;
