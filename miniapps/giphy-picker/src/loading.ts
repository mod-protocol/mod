import { ModElement } from "@mod-protocol/core";

const loading: ModElement[] = [
  {
    type: "vertical-layout",
    elements: [
      {
        ref: "giphyType",
        type: "tabs",
        values: ["gifs", "stickers"],
        names: ["GIFs", "Stickers"],
        onchange: {
          ref: "mySearchQueryRequest",
          type: "GET",
          url: "{{api}}/giphy-picker?q={{refs.myInput.value}}&type={{refs.giphyType.value}}&limit=24",
          onsuccess: "#success",
          onerror: "#error",
          onloading: "#loading",
        },
      },
      {
        ref: "myInput",
        type: "input",
        placeholder: "Search",
        clearable: true,
        onchange: {
          ref: "mySearchQueryRequest",
          type: "GET",
          url: "{{api}}/giphy-picker?q={{refs.myInput.value}}&type={{refs.giphyType.value}}&limit=24",
          onsuccess: "#success",
          onerror: "#error",
          onloading: "#loading",
        },
      },
      {
        ref: "imageGridList",
        type: "image-grid-list",
        loading: true,
      },
    ],
  },
];

export default loading;
