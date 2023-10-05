import { ModElement } from "@mod-protocol/core";

const action: ModElement[] = [
  {
    type: "vertical-layout",
    onload: {
      ref: "mySearchQueryRequest",
      type: "GET",
      url: "{{api}}/giphy-picker?type=gifs&limit=24",
      onsuccess: "#success",
      onerror: "#error",
      onloading: "#loading",
    },
  },
];

export default action;
