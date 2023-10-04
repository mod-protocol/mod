import {
  OpenLinkActionResolverInitType,
  OpenLinkActionResolverEventsType,
} from "@mod-protocol/core";

export default function actionResolverOpenLink(
  init: OpenLinkActionResolverInitType,
  events: OpenLinkActionResolverEventsType
) {
  window.open(init.url, "_blank");
  events.onSuccess();
}
