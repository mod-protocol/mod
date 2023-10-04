"use client";

import * as React from "react";
import {
  Manifest,
  ElementRefType,
  Renderer,
  HttpActionResolver,
  OpenFileActionResolver,
  OpenLinkActionResolver,
  SetInputActionResolver,
  ExitActionResolver,
  AddEmbedActionResolver,
  ContentContextType,
  CreationContextType,
} from "@mod-protocol/core";
import actionResolverHttp from "./action-resolver-http";
import actionResolverOpenFile from "./action-resolver-open-file";
import actionResolverOpenLink from "./action-resolver-open-link";
import actionResolverSetInput from "./action-resolver-set-input";
import actionResolverAddEmbed from "./action-resolver-add-embed";
import actionResolverExit from "./action-resolver-exit";

export type Renderers = {
  Video: React.ComponentType<{
    videoSrc: string;
  }>;
  Image: React.ComponentType<{
    imageSrc: string;
  }>;
  Text: React.ComponentType<{ label: string }>;
  Button: React.ComponentType<{
    label: string;
    isLoading: boolean;
    isDisabled: boolean;
    onClick: () => void;
  }>;
  CircularProgress: React.ComponentType<{}>;
  HorizontalLayout: React.ComponentType<{ children: React.ReactNode }>;
  VerticalLayout: React.ComponentType<{ children: React.ReactNode }>;
  Input: React.ComponentType<{
    isClearable: boolean;
    placeholder?: string;
    onChange: (value: string) => void;
    onSubmit: (value: string) => void;
  }>;
  Tabs: React.ComponentType<{
    children: React.ReactNode;
    values: string[];
    names: string[];
    onChange: (value: string) => void;
  }>;
  ImageGridList: React.ComponentType<{
    images: string[] | null;
    isLoading?: boolean;
    onPick: (value: string) => void;
  }>;
  Dialog: React.ComponentType<{
    children: React.ReactNode;
    onClose: () => void;
  }>;
  Alert: React.ComponentType<{
    title: string;
    description: string;
    variant: "success" | "error";
  }>;
  Avatar: React.ComponentType<{
    src: string;
    size?: "sm" | "md" | "lg";
  }>;
  Card: React.ComponentType<{
    imageSrc?: string;
    aspectRatio?: number;
    topLeftBadge?: string;
    topRightBadge?: string;
    bottomLeftBadge?: string;
    bottomRightBadge?: string;
    children: React.ReactNode;
    onClick: () => void;
  }>;
};

const WrappedVideoRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["Video"];
  element: Extract<ElementRefType<T>, { type: "video" }>;
}) => {
  const { component: Component, element } = props;
  const { type, ...rest } = element;
  return <Component {...rest} />;
};

const WrappedTextRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["Text"];
  element: Extract<ElementRefType<T>, { type: "text" }>;
}) => {
  const { component: Component, element } = props;
  const { events, type, ...rest } = element;
  return <Component {...rest} />;
};

const WrappedButtonRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["Button"];
  element: Extract<ElementRefType<T>, { type: "button" }>;
}) => {
  const { component: Component, element } = props;
  const { events, type, ...rest } = element;

  const onClick = React.useCallback(() => {
    events.onClick();
  }, [events]);

  return <Component {...rest} onClick={onClick} />;
};

const WrappedCircularProgressRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["CircularProgress"];
  element: Extract<ElementRefType<T>, { type: "circular-progress" }>;
}) => {
  const { component: Component, element } = props;
  const { events, type, ...rest } = element;

  return <Component {...rest} />;
};

const WrappedHorizontalLayoutRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["HorizontalLayout"];
  element: Extract<ElementRefType<T>, { type: "horizontal-layout" }>;
}) => {
  const { component: Component, element } = props;
  const { events, type, elements, ...rest } = element;

  React.useEffect(() => {
    events.onLoad();
  }, [events]);

  return <Component {...rest}>{elements}</Component>;
};

const WrappedVerticalLayoutRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["VerticalLayout"];
  element: Extract<ElementRefType<T>, { type: "vertical-layout" }>;
}) => {
  const { component: Component, element } = props;
  const { events, type, elements, ...rest } = element;

  React.useEffect(() => {
    events.onLoad();
  }, [events]);

  return <Component {...rest}>{elements}</Component>;
};

const WrappedInputRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["Input"];
  element: Extract<ElementRefType<T>, { type: "input" }>;
}) => {
  const { component: Component, element } = props;
  const { events, type, ...rest } = element;

  const onChange = React.useCallback(
    (input: string) => {
      events.onChange(input);
    },
    [events]
  );
  const onSubmit = React.useCallback(
    (input: string) => {
      events.onSubmit(input);
    },
    [events]
  );

  return <Component {...rest} onChange={onChange} onSubmit={onSubmit} />;
};

const WrappedTabsRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["Tabs"];
  element: Extract<ElementRefType<T>, { type: "tabs" }>;
}) => {
  const { component: Component, element } = props;
  const { events, type, elements, ...rest } = element;

  React.useEffect(() => {
    events.onLoad();
  }, [events]);

  const onChange = React.useCallback(
    (input: string) => {
      events.onChange(input);
    },
    [events]
  );

  return (
    <Component {...rest} onChange={onChange}>
      {elements}
    </Component>
  );
};

const WrappedImageGridListRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["ImageGridList"];
  element: Extract<ElementRefType<T>, { type: "image-grid-list" }>;
}) => {
  const { component: Component, element } = props;
  const { events, type, ...rest } = element;

  React.useEffect(() => {
    events.onLoad();
  }, [events]);

  const onPick = React.useCallback(
    (value: string) => {
      events.onPick(value);
    },
    [events]
  );

  return <Component {...rest} onPick={onPick} />;
};

const WrappedDialogRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["Dialog"];
  element: Extract<ElementRefType<T>, { type: "dialog" }>;
}) => {
  const { component: Component, element } = props;
  const { events, type, elements, ...rest } = element;

  const onClose = React.useCallback(() => {
    events.onClose();
  }, [events]);

  return (
    <Component {...rest} onClose={onClose}>
      {elements}
    </Component>
  );
};

const WrappedAlertRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["Alert"];
  element: Extract<ElementRefType<T>, { type: "alert" }>;
}) => {
  const { component: Component, element } = props;
  const { events, type, ...rest } = element;

  return <Component {...rest} />;
};

const WrappedImageRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["Image"];
  element: Extract<ElementRefType<T>, { type: "image" }>;
}) => {
  const { component: Component, element } = props;
  const { type, ...rest } = element;

  return <Component {...rest} />;
};

const WrappedAvatarRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["Avatar"];
  element: Extract<ElementRefType<T>, { type: "avatar" }>;
}) => {
  const { component: Component, element } = props;
  const { type, ...rest } = element;

  return <Component {...rest} />;
};

const WrappedCardRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["Card"];
  element: Extract<ElementRefType<T>, { type: "card" }>;
}) => {
  const { component: Component, element } = props;
  const { events, type, elements, ...rest } = element;

  const onClick = React.useCallback(() => {
    events.onClick();
  }, [events]);

  return (
    <Component {...rest} onClick={onClick}>
      {elements}
    </Component>
  );
};

const useForceRerender = () => {
  const [, setValue] = React.useState(0);
  return React.useCallback(() => {
    setValue((prev) => prev + 1);
  }, []);
};

type Props = {
  manifest: Manifest;
  renderers: Renderers;
  onHttpAction?: HttpActionResolver;
  onOpenFileAction?: OpenFileActionResolver;
  onSetInputAction?: SetInputActionResolver;
  onAddEmbedAction?: AddEmbedActionResolver;
  onOpenLinkAction?: OpenLinkActionResolver;
  onExitAction?: ExitActionResolver;
};

export const CreationMiniApp = (
  props: Props & ({ variant: "creation" } & CreationContextType)
) => {
  const {
    manifest,
    variant,
    onHttpAction = actionResolverHttp,
    onOpenFileAction = actionResolverOpenFile,
    onSetInputAction = actionResolverSetInput,
    onAddEmbedAction = actionResolverAddEmbed,
    onOpenLinkAction = actionResolverOpenLink,
    onExitAction = actionResolverExit,
  } = props;

  const forceRerender = useForceRerender();

  const input = variant === "creation" ? props.input : "";
  const context = React.useMemo<CreationContextType>(
    () => ({ input, embeds: props.embeds, api: props.api }),
    [input, props.api, props.embeds]
  );

  const [renderer] = React.useState<Renderer>(
    () =>
      new Renderer({
        manifest,
        context,
        variant: "creation",
        onTreeChange: forceRerender,
        onHttpAction,
        onOpenFileAction,
        onSetInputAction,
        onAddEmbedAction,
        onOpenLinkAction,
        onExitAction,
      })
  );

  React.useEffect(() => {
    renderer.setContext(context);
    forceRerender();
  }, [forceRerender, context, renderer]);

  return <MiniApp {...props} renderer={renderer} />;
};

export const RenderMiniApp = (
  props: Props & ({ variant: "content" } & ContentContextType)
) => {
  const {
    manifest,
    onHttpAction = actionResolverHttp,
    onOpenFileAction = actionResolverOpenFile,
    onSetInputAction = actionResolverSetInput,
    onAddEmbedAction = actionResolverAddEmbed,
    onOpenLinkAction = actionResolverOpenLink,
    onExitAction = actionResolverExit,
  } = props;

  const forceRerender = useForceRerender();

  const context = React.useMemo<ContentContextType>(
    () => ({ embed: props.embed, api: props.api }),
    [props.embed, props.api]
  );

  const [renderer] = React.useState<Renderer>(
    () =>
      new Renderer({
        manifest,
        variant: "content",
        context,
        onTreeChange: forceRerender,
        onHttpAction,
        onOpenFileAction,
        onSetInputAction,
        onAddEmbedAction,
        onOpenLinkAction,
        onExitAction,
      })
  );

  React.useEffect(() => {
    renderer.setContext(context);
    forceRerender();
  }, [forceRerender, context, renderer]);

  return <MiniApp {...props} renderer={renderer} />;
};

export const MiniApp = (props: Props & { renderer: Renderer }) => {
  const {
    renderers,
    renderer,
    onHttpAction = actionResolverHttp,
    onOpenFileAction = actionResolverOpenFile,
    onSetInputAction = actionResolverSetInput,
    onAddEmbedAction = actionResolverAddEmbed,
    onOpenLinkAction = actionResolverOpenLink,
    onExitAction = actionResolverExit,
  } = props;

  const VerticalLayout = renderers["VerticalLayout"];

  React.useEffect(() => {
    renderer.setHttpActionResolver(onHttpAction);
  }, [onHttpAction, renderer]);
  React.useEffect(() => {
    renderer.setOpenFileActionResolver(onOpenFileAction);
  }, [onOpenFileAction, renderer]);
  React.useEffect(() => {
    renderer.setSetInputActionResolver(onSetInputAction);
  }, [onSetInputAction, renderer]);
  React.useEffect(() => {
    renderer.setAddEmbedActionResolver(onAddEmbedAction);
  }, [onAddEmbedAction, renderer]);
  React.useEffect(() => {
    renderer.setOpenLinkActionResolver(onOpenLinkAction);
  }, [onOpenLinkAction, renderer]);
  React.useEffect(() => {
    renderer.setExitActionResolver(onExitAction);
  }, [onExitAction, renderer]);

  return (
    <VerticalLayout>
      {renderer.mapCurrentTree((el: ElementRefType<React.ReactNode>, key) => {
        switch (el.type) {
          // TODO: this switch should enforce completeness via types
          case "image":
            return (
              <WrappedImageRenderer
                key={key}
                component={renderers["Image"]}
                element={el}
              />
            );
          case "text":
            return (
              <WrappedTextRenderer
                key={key}
                component={renderers["Text"]}
                element={el}
              />
            );
          case "video":
            return (
              <WrappedVideoRenderer
                key={key}
                component={renderers["Video"]}
                element={el}
              />
            );
          case "button":
            return (
              <WrappedButtonRenderer
                key={key}
                component={renderers["Button"]}
                element={el}
              />
            );
          case "circular-progress":
            return (
              <WrappedCircularProgressRenderer
                key={key}
                component={renderers["CircularProgress"]}
                element={el}
              />
            );
          case "horizontal-layout":
            return (
              <WrappedHorizontalLayoutRenderer
                key={key}
                component={renderers["HorizontalLayout"]}
                element={el}
              />
            );
          case "vertical-layout":
            return (
              <WrappedVerticalLayoutRenderer
                key={key}
                component={renderers["VerticalLayout"]}
                element={el}
              />
            );
          case "input":
            return (
              <WrappedInputRenderer
                key={key}
                component={renderers["Input"]}
                element={el}
              />
            );
          case "tabs":
            return (
              <WrappedTabsRenderer
                key={key}
                component={renderers["Tabs"]}
                element={el}
              />
            );
          case "image-grid-list":
            return (
              <WrappedImageGridListRenderer
                key={key}
                component={renderers["ImageGridList"]}
                element={el}
              />
            );
          case "dialog":
            return (
              <WrappedDialogRenderer
                key={key}
                component={renderers["Dialog"]}
                element={el}
              />
            );
          case "alert":
            return (
              <WrappedAlertRenderer
                key={key}
                component={renderers["Alert"]}
                element={el}
              />
            );
          case "avatar":
            return (
              <WrappedAvatarRenderer
                key={key}
                component={renderers["Avatar"]}
                element={el}
              />
            );
          case "card":
            return (
              <WrappedCardRenderer
                key={key}
                component={renderers["Card"]}
                element={el}
              />
            );
        }
      })}
    </VerticalLayout>
  );
};
