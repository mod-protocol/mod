import { ModManifest } from "@mod-protocol/core";

import ChatGPTMiniText from "@miniapps/chatgpt";
import InfuraIPFSUpload from "@miniapps/infura-ipfs-upload";
import GiphyPicker from "@miniapps/giphy-picker";
import LivepeerVideo from "@miniapps/livepeer-video";
import VideoRender from "@miniapps/video-render";
import NFTMinter from "@miniapps/nft-minter";
import UrlRender from "@miniapps/url-render";
import ImageRender from "@miniapps/image-render";

export const allMiniApps = [
  ChatGPTMiniText,
  InfuraIPFSUpload,
  GiphyPicker,
  LivepeerVideo,
  VideoRender,
  NFTMinter,
  ImageRender,
];

export const creationMiniApps: ModManifest[] = allMiniApps.filter(
  (manifest) =>
    manifest.creationEntrypoints && manifest.creationEntrypoints.length !== 0
);

export const contentMiniApps: ModManifest[] = allMiniApps.filter(
  (manifest) =>
    manifest.contentEntrypoints && manifest.contentEntrypoints.length !== 0
);

/** When no renderMiniApp matches an embed, this one will be used **/
export const defaultContentMiniApp: ModManifest = UrlRender;
