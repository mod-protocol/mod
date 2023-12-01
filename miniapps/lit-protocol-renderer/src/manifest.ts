import { ModManifest } from "@mod-protocol/core";
import loading from "./loading";
import rendering from "./rendering";
import error from "./error";
import success from "./success";
import decrypt from "./decrypt";

const manifest: ModManifest = {
  slug: "lit-protocol-renderer",
  name: "Read token gated casts",
  custodyAddress: "furlong.eth",
  logo: "https://openseauserdata.com/files/2105703ca9fbe5116c26b9967a596abe.png",
  custodyGithubUsername: "davidfurlong",
  version: "0.0.1",
  contentEntrypoints: rendering,
  elements: {
    "#loading": loading,
    "#decrypt": decrypt,
    "#error": error,
    "#success": success,
  },
};

export default manifest;
