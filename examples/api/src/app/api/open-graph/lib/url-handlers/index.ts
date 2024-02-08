import { UrlHandler } from "../../types/url-handler";
import caip19 from "./caip-19";
import opensea from "./opensea";
import zora from "./zora";
import zoraPremint from "./zora-premint";
import imageFileUrl from "./image-file";
import ipfs from "./ipfs";
import metascraper from "./metascraper";
import localFetch from "./local-fetch";

const handlers: UrlHandler[] = [
  opensea,
  zoraPremint,
  zora,
  caip19,
  imageFileUrl,
  ipfs,
  localFetch,
  metascraper,
];

export default handlers;
