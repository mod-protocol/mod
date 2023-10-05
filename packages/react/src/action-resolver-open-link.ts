import {
  OpenLinkActionResolverInit,
  OpenLinkActionResolverEvents,
} from "@mod-protocol/core";

export default function actionResolverOpenLink(
  init: OpenLinkActionResolverInit,
  events: OpenLinkActionResolverEvents
) {
  window.open(init.url, "_blank");
  events.onSuccess();
}
