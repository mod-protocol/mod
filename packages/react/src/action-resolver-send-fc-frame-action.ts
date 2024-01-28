import {
  SendFcFrameActionResolverInit,
  SendFcFrameActionResolverEvents,
} from "@mod-protocol/core";

export default function actionResolverSendFcFrame(
  init: SendFcFrameActionResolverInit,
  events: SendFcFrameActionResolverEvents
) {
  // eslint-disable-next-line no-console
  console.warn(
    "Please implement 'SendFcFrameActionResolver' and configure the Mod to use it, using https://github.com/mod-protocol/mod/blob/a96dc6b4482d6ede3fee7baada9d5abe8bb430a1/examples/nextjs-shadcn/src/app/embeds.tsx#L51 as reference code."
  );
}
