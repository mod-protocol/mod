import { Manifest } from "@packages/core";

import ChatGPTMiniText from "@miniapps/chatgpt";
import InfuraIPFSUpload from "@miniapps/infura-ipfs-upload";
import GiphyPicker from "@miniapps/giphy-picker";
import LivepeerVideo from "@miniapps/livepeer-video";
import VideoRender from "@miniapps/video-render";
import NFTMinter from "@miniapps/nft-minter";
import UrlRender from "@miniapps/url-render";
import ImageRender from "@miniapps/image-render";
import PollMiniApp from "@miniapps/polls";

export const allMiniApps = [
  ChatGPTMiniText,
  InfuraIPFSUpload,
  GiphyPicker,
  LivepeerVideo,
  VideoRender,
  NFTMinter,
  ImageRender,
  PollMiniApp,
];

export const creationMiniApps: Manifest[] = allMiniApps.filter(
  (manifest) =>
    manifest.creationEntrypoints && manifest.creationEntrypoints.length !== 0
);

export const renderMiniApps: Manifest[] = allMiniApps.filter(
  (manifest) =>
    manifest.contentEntrypoints && manifest.contentEntrypoints.length !== 0
);

/** When no renderMiniApp matches an embed, this one will be used **/
export const fallbackRenderMiniApp: Manifest = UrlRender;
