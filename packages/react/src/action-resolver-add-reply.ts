import {
  AddReplyActionResolverInit,
  AddReplyActionResolverEvents,
} from "@mod-protocol/core";

// This resolver is called when the mod calls the "ADDREPLY" action type.
export default function actionResolverAddEmbed(
  init: AddReplyActionResolverInit,
  events: AddReplyActionResolverEvents
) {
  // eslint-disable-next-line no-console
  console.warn(
    "Please implement 'AddReplyActionResolver' and configure the Mod to use it"
  );
}
