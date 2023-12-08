import { ModElement } from "@mod-protocol/core";

const loading: ModElement = {
  type: "horizontal-layout",
  onload: {
    ref: "pollResults",
    type: "GET",
    url: "{{api}}/render-poll",
    searchParams: {
      embedUrl: "{{embed}}",
      fid: "{{user.farcaster.fid}}",
      endDate:
        "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.endDate}}",
    },
    onsuccess: "#results",
    onerror: "#error",
  },
};

export default loading;
