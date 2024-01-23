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
import ZoraNftMinter from "@mods/zora-nft-minter";
import ImgurUpload from "@mods/imgur-upload";
import DALLE from "@mods/dall-e";
import ZoraCreate from "@mods/zora-create";
import TipEthMod from "@mods/tip-eth";

/** All - Stable, suitable for use  */

export const allMods = [
  ImgurUpload,
  ZoraCreate,
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

export const actionMods: ModManifest[] = allMods.filter(
  (manifest) =>
    manifest.actionEntrypoints && manifest.actionEntrypoints.length !== 0
);

/** All + Experimental - Potentially unstable, unsuitable for production use  */

export const allModsExperimental = [
  ImgurUpload,
  InfuraIPFSUpload,
  ZoraCreate,
  LivepeerVideo,
  GiphyPicker,
  VideoRender,
  ZoraNftMinter,
  NFTMinter,
  ImageRender,
  ChatGPTShorten,
  ChatGPT,
  DALLE,
  TipEthMod,
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

export const actionModsExperimental: ModManifest[] = allModsExperimental.filter(
  (manifest) =>
    manifest.actionEntrypoints && manifest.actionEntrypoints.length !== 0
);

/** When no renderMod matches an embed, this one will be used **/
export const defaultRichEmbedMod: ModManifest = UrlRender;
