// This resolver is called when the mod calls the "EXIT" action type.
//
// The action expected from the user is to close the mod and clear
// any state related to it. For example, in react implementation, the user
// can simply toggle a flag that chooses which mod is rendering atm.
export default function actionResolverExit() {
  // eslint-disable-next-line no-console
  console.warn(
    "Please implement 'ExitActionResolver' and configure the Mod to use it"
  );
}
