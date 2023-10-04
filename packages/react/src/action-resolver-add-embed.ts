import {
  AddEmbedActionResolverInitType,
  AddEmbedActionResolverEventsType,
} from "@packages/core";

// This resolver is called when the miniapp calls the "ADDEMBED" action type.
//
// The action expected from the user is to update the current input field
// (or equivalent) to embed the file specified in the init.
export default function actionResolverAddEmbed(
  init: AddEmbedActionResolverInitType,
  events: AddEmbedActionResolverEventsType
) {
  // eslint-disable-next-line no-console
  console.warn(
    "Please implement 'AddEmbedActionResolver' and configure the MiniApp to use it"
  );
}
