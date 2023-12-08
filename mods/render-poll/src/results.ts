// rendered if: poll closed, or has voted
import { ModElement } from "@mod-protocol/core";

const results: ModElement[] = [
  {
    type: "vertical-layout",
    elements: [
      {
        type: "progress",
        value: "{{refs.pollResults.response.data.results.choice1}}",
        label:
          "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.choice1}}",
      },
      {
        type: "progress",
        value: "{{refs.pollResults.response.data.results.choice2}}",

        label:
          "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.choice2}}",
      },
      {
        if: {
          value:
            "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.choice3}}",
          match: {
            NOT: {
              equals: "",
            },
          },
        },
        then: {
          type: "progress",
          value: "{{refs.pollResults.response.data.results.choice3}}",

          label:
            "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.choice3}}",
        },
      },
      {
        if: {
          value:
            "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.choice4}}",
          match: {
            NOT: {
              equals: "",
            },
          },
        },
        then: {
          type: "progress",
          value: "{{refs.pollResults.response.data.results.choice4}}",

          label:
            "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.choice4}}",
        },
      },
      {
        type: "text",
        label:
          "{{refs.pollResults.response.data.number_respondents}} responses",
      },
      {
        if: {
          // ISO 8601 strings are sortable lexicographically
          value:
            "{{embed.metadata.json-ld.WebPage[0].mod:model.payload.endDate}}",
          match: {
            greaterThan: "{{date.now.iso}}",
          },
        },
        then: {
          type: "text",
          label:
            "Poll closes on {{embed.metadata.json-ld.WebPage[0].mod:model.payload.endDate}}",
        },
        else: {
          type: "text",
          label:
            "Poll closed on {{embed.metadata.json-ld.WebPage[0].mod:model.payload.endDate}}",
        },
      },
    ],
  },
];

export default results;
