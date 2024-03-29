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

    if (!req.ok) {
      throw new Error(reqJson.message);
    }

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

async function blobToBase64(blob: File): Promise<string> {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

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

  inputElement.addEventListener("change", async (arg) => {
    const inputElement = arg.target as HTMLInputElement;
    const files = inputElement.files ? Array.from(inputElement.files) : [];

    const processedFiles = await Promise.all(
      files.map(async (file) => {
        const base64 = await blobToBase64(file);
        return {
          name: file.name,
          mimeType: file.type,
          blob: file,
          base64,
        };
      })
    );

    events.onSuccess(processedFiles);

    document.body.removeChild(inputElement);
  });

  inputElement.dispatchEvent(new MouseEvent("click"));
};
