import {
  OpenFileActionResolverEvents,
  OpenFileActionResolverInit,
} from "@mod-protocol/core";

// This resolver is called when the mod calls the "OPENFILE" action type.
//
// The action expected from the user is to open a native file picker and select
// file(s). The app should make sure that it only chooses the files with mime-types
// specified in the accepts array and the app should also pick up to maxFiles amount
// of files. The format the app should return is:
//
// { name: string; type: string; blob: any }
//
export default function actionResolverOpenFile(
  init: OpenFileActionResolverInit,
  events: OpenFileActionResolverEvents
) {
  // eslint-disable-next-line no-console
  console.warn(
    "Please implement 'OpenFileActionResolver' and configure the Mod to use it"
  );
}
