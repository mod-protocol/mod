import { ModConditionalElement } from "@mod-protocol/core";
import vote from "./vote";
import loading from "./loading";

const rendering: ModConditionalElement[] = [
  {
    if: {
      value: "{{embed.metadata.json-ld.WebPage[0].mod:model.@type}}",
      match: {
        equals: "schema.modprotocol.org/create-poll/0.0.1/Poll",
      },
    },
    element: [
      {
        type: "vertical-layout",
        elements: [
          {
            if: {
              // ISO 8601 strings are sortable lexicographically
              value:
                "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.endDate}}",
              match: {
                greaterThan: "{{date.now.iso}}",
              },
            },
            then: loading,
            else: vote,
          },
        ],
      },
    ],
  },
];
export default rendering;
