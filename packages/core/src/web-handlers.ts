import { Embed, UrlMetadata } from "./embeds";
import {
  AddEmbedActionResolverEvents,
  AddEmbedActionResolverInit,
  OpenFileActionResolverEvents,
  OpenFileActionResolverInit,
  SetInputActionResolverEvents,
  SetInputActionResolverInit,
} from "./renderer";

export const handleSetInput =
  (setText: (text: string) => void) =>
  (init: SetInputActionResolverInit, events: SetInputActionResolverEvents) => {
    setText(init.input);
    events.onSuccess(init.input);
  };

export const fetchUrlMetadata = (api_url: string) => {
  return async (url: string) => {
    const req = await fetch(
      `${api_url}/open-graph?url=${encodeURIComponent(url)}`
    );

    const reqJson = await req.json();

    return reqJson as UrlMetadata;
  };
};

export const handleAddEmbed =
  (addEmbed: (embed: Embed) => void) =>
  (init: AddEmbedActionResolverInit, events: AddEmbedActionResolverEvents) => {
    addEmbed({
      url: init.url,
      status: "loading",
      metadata: { mimeType: init.mimeType },
    });
    events.onSuccess();
  };

export const handleOpenFile = (
  init: OpenFileActionResolverInit,
  events: OpenFileActionResolverEvents
) => {
  const inputElement = document.createElement("input");

  inputElement.style.display = "none";
  document.body.appendChild(inputElement);

  inputElement.type = "file";
  inputElement.accept = init.accept.join(",");
  inputElement.multiple = init.maxFiles > 1;

  inputElement.addEventListener("change", (arg) => {
    const inputElement = arg.target as HTMLInputElement;
    const files = inputElement.files ? Array.from(inputElement.files) : [];

    events.onSuccess(
      files.map((file) => ({
        name: file.name,
        mimeType: file.type,
        blob: file,
      }))
    );

    document.body.removeChild(inputElement);
  });

  inputElement.dispatchEvent(new MouseEvent("click"));
};
