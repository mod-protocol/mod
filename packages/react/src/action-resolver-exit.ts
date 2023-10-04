// This resolver is called when the miniapp calls the "EXIT" action type.
//
// The action expected from the user is to close the miniapp and clear
// any state related to it. For example, in react implementation, the user
// can simply toggle a flag that chooses which miniapp is rendering atm.
export default function actionResolverExit() {
  // eslint-disable-next-line no-console
  console.warn(
    "Please implement 'ExitActionResolver' and configure the MiniApp to use it"
  );
}
