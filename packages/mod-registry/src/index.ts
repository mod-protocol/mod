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
import CreatePoll from "@mods/create-poll";
import RenderPoll from "@mods/render-poll";
import ZoraNftMinter from "@mods/zora-nft-minter";
import ImgurUpload from "@mods/imgur-upload";
import DALLE from "@mods/dall-e";

/** All - Stable, suitable for use  */

export const allMods = [
  ImgurUpload,
  InfuraIPFSUpload,
  LivepeerVideo,
  GiphyPicker,
  VideoRender,
  NFTMinter,
  ImageRender,
  ChatGPTShorten,
  ChatGPT,
];

export const creationMods: ModManifest[] = allMods.filter(
  (manifest) =>
    manifest.creationEntrypoints && manifest.creationEntrypoints.length !== 0
);

export const richEmbedMods: ModManifest[] = allMods.filter(
  (manifest) =>
    manifest.richEmbedEntrypoints && manifest.richEmbedEntrypoints.length !== 0
);

/** All + Experimental - Potentially unstable, unsuitable for production use  */
export const allModsExperimental = [
  CreatePoll,
  RenderPoll,
  ImgurUpload,
  InfuraIPFSUpload,
  LivepeerVideo,
  GiphyPicker,
  VideoRender,
  ZoraNftMinter,
  NFTMinter,
  ImageRender,
  ChatGPTShorten,
  ChatGPT,
  DALLE,
];

export const creationModsExperimental: ModManifest[] =
  allModsExperimental.filter(
    (manifest) =>
      manifest.creationEntrypoints && manifest.creationEntrypoints.length !== 0
  );

export const richEmbedModsExperimental: ModManifest[] =
  allModsExperimental.filter(
    (manifest) =>
      manifest.richEmbedEntrypoints &&
      manifest.richEmbedEntrypoints.length !== 0
  );

/** When no renderMod matches an embed, this one will be used **/
export const defaultRichEmbedMod: ModManifest = UrlRender;
