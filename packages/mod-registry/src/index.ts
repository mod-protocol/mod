import { ModManifest } from "@mod-protocol/core";

import ChatGPT from "@mods/chatgpt";
import InfuraIPFSUpload from "@mods/infura-ipfs-upload";
import GiphyPicker from "@mods/giphy-picker";
import LivepeerVideo from "@mods/livepeer-video";
import VideoRender from "@mods/video-render";
import NFTMinter from "@mods/nft-minter";
import UrlRender from "@mods/url-render";
import ImageRender from "@mods/image-render";
import ChatGPTShorten from "@mods/chatgpt-shorten";
// import ZoraNftMinter from "@mods/zora-nft-minter";
// import DALLE from "@mods/dall-e";
import ImgurUpload from "@mods/imgur-upload";

export const allMods = [
  ImgurUpload,
  InfuraIPFSUpload,
  LivepeerVideo,
  GiphyPicker,
  VideoRender,
  // ZoraNftMinter,
  NFTMinter,
  ImageRender,
  ChatGPTShorten,
  ChatGPT,
  // DALLE,
];

export const creationMods: ModManifest[] = allMods.filter(
  (manifest) =>
    manifest.creationEntrypoints && manifest.creationEntrypoints.length !== 0
);

export const richEmbedMods: ModManifest[] = allMods.filter(
  (manifest) =>
    manifest.richEmbedEntrypoints && manifest.richEmbedEntrypoints.length !== 0
);

/** When no renderMod matches an embed, this one will be used **/
export const defaultRichEmbedMod: ModManifest = UrlRender;
