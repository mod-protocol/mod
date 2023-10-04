import {
  SetInputActionResolverInitType,
  SetInputActionResolverEventsType,
} from "@mod-protocol/core";

// This resolver is called when the miniapp calls the "SETINPUT" action type.
//
// The action expected from the user is to update the current input field with
// the result of this action.
export default function actionResolverSetInput(
  init: SetInputActionResolverInitType,
  events: SetInputActionResolverEventsType
) {
  // eslint-disable-next-line no-console
  console.warn(
    "Please implement 'SetInputActionResolver' and configure the MiniApp to use it"
  );
}
