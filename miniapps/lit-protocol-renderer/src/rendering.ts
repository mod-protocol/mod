const rendering = [
  {
    if: {
      // FIXME:
      value: "{{embed.metadata.nft.collection.name}}",
      match: {
        equals: "1234",
      },
    },
    element: [
      {
        type: "vertical-layout",
        elements: [],
        onload: {
          ref: "decryption-request",
          type: "POST",
          url: "{{api}}/lit-protocol-renderer",
          onsuccess: "#success",
          onerror: "#error",
          onloading: "#loading",
        },
      },
    ],
  },
];
export default rendering;
