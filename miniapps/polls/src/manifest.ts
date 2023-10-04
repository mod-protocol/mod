import { Manifest } from "@packages/core";
import content from "./content";
import creation from "./creation";

const manifest: Manifest = {
  slug: "polls",
  name: "Polls",
  custodyAddress: "0x12321323",
  version: "0.0.1",
  author: "@xyz",
  creationEntrypoints: creation,
  contentEntrypoints: content,
};

export default manifest;
