import {
  AddEmbedActionResolverInit,
  AddEmbedActionResolverEvents,
} from "@mod-protocol/core";

// This resolver is called when the mod calls the "ADDEMBED" action type.
//
// The action expected from the user is to update the current input field
// (or equivalent) to embed the file specified in the init.
export default function actionResolverAddEmbed(
  init: AddEmbedActionResolverInit,
  events: AddEmbedActionResolverEvents
) {
  // eslint-disable-next-line no-console
  console.warn(
    "Please implement 'AddEmbedActionResolver' and configure the Mod to use it"
  );
}
