import { Element } from "@mod-protocol/core";

const action: Element[] = [
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
