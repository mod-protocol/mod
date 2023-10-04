import { Element } from "@mod-protocol/core";

const success: Element[] = [
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
        imagesListRef: "refs.mySearchQueryRequest.response.data.list",
        onpick: {
          type: "ADDEMBED",
          url: "{{refs.imageGridList.url}}",
          name: "GIF",
          mimeType: "image/gif",
          onsuccess: {
            type: "EXIT",
          },
        },
      },
      {
        type: "image",
        imageSrc: "https://i.imgur.com/rGB2Uev.png",
      },
    ],
  },
];

export default success;
