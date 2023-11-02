import { UrlHandler } from "../../types/url-handler";
import caip19 from "./caip-19";
import fallback from "./fallback";
import opensea from "./opensea";
import zora from "./zora";
import imageFileUrl from "./image-file";

const handlers: UrlHandler[] = [opensea, zora, caip19, imageFileUrl, fallback];

export default handlers;
