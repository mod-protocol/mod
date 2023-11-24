import { Renderers } from "@mod-protocol/react";
import { TextRenderer } from "./text";
import { ButtonRenderer } from "./button";
import { CircularProgressRenderer } from "./circular-progress";
import { HorizontalLayoutRenderer } from "./horizontal-layout";
import { VerticalLayoutRenderer } from "./vertical-layout";
import { TabsRenderer } from "./tabs";
import { InputRenderer } from "./input";
import { LinkRenderer } from "./link";
import { ImageGridListRenderer } from "./image-grid-list";
import { DialogRenderer } from "./dialog";
import { AlertRenderer } from "./alert";
import { VideoRenderer } from "./video";
import { CardRenderer } from "./card";
import { AvatarRenderer } from "./avatar";
import { ImageRenderer } from "./image";
import { ContainerRenderer } from "./container";
import { SelectRenderer } from "./select";
import { TextareaRenderer } from "./textarea";
import { ComboboxRenderer } from "./combobox";

export const renderers: Renderers = {
  Select: SelectRenderer,
  Link: LinkRenderer,
  Combobox: ComboboxRenderer,
  Textarea: TextareaRenderer,
  Container: ContainerRenderer,
  Text: TextRenderer,
  Image: ImageRenderer,
  Card: CardRenderer,
  Avatar: AvatarRenderer,
  Video: VideoRenderer,
  Button: ButtonRenderer,
  CircularProgress: CircularProgressRenderer,
  HorizontalLayout: HorizontalLayoutRenderer,
  VerticalLayout: VerticalLayoutRenderer,
  Tabs: TabsRenderer,
  Input: InputRenderer,
  ImageGridList: ImageGridListRenderer,
  Dialog: DialogRenderer,
  Alert: AlertRenderer,
};
