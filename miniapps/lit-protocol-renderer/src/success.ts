import { ModElement } from "@mod-protocol/core";

const success: ModElement[] = [
  {
    type: "horizontal-layout",
    elements: [
      {
        type: "avatar",
        src: "https://cdn-icons-png.flaticon.com/512/102/102288.png",
      },
      {
        type: "text",
        label: "{{refs.decryption-request.response.data.decryptedString}}",
      },
    ],
  },
];

export default success;
