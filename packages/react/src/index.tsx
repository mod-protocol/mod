"use client";

import * as React from "react";
import {
  ModManifest,
  ModElementRef,
  Renderer,
  HttpActionResolver,
  OpenFileActionResolver,
  OpenLinkActionResolver,
  SetInputActionResolver,
  ExitActionResolver,
  AddEmbedActionResolver,
  RichEmbedContext,
  CreationContext,
  EthPersonalSignActionResolver,
  SendEthTransactionActionResolver,
} from "@mod-protocol/core";
import actionResolverHttp from "./action-resolver-http";
import actionResolverOpenFile from "./action-resolver-open-file";
import actionResolverOpenLink from "./action-resolver-open-link";
import actionResolverSetInput from "./action-resolver-set-input";
import actionResolverAddEmbed from "./action-resolver-add-embed";
import actionResolverEthPersonalSign from "./action-resolver-eth-personal-sign";
import actionResolverExit from "./action-resolver-exit";
import actionResolverSendEthTransaction from "./action-resolver-send-eth-transaction";
export * from "./render-embed";

export type Renderers = {
  Container: React.ComponentType<{ children: React.ReactNode }>;
  Padding: React.ComponentType<{ children: React.ReactNode }>;
  Video: React.ComponentType<{
    videoSrc: string;
  }>;
  Image: React.ComponentType<{
    imageSrc: string;
  }>;
  Select: React.ComponentType<{
    isClearable: boolean;
    placeholder?: string;
    options: Array<{ value: any; label: string }>;
    onChange: (value: string) => void;
  }>;
  Combobox: React.ComponentType<{
    placeholder?: string;
    options: Array<{ value: any; label: string }> | null;
    onChange: (value: string) => void;
    onPick: (value: any) => void;
  }>;
  Text: React.ComponentType<{
    label: string;
    variant?: "bold" | "regular" | "secondary";
  }>;
  Link: React.ComponentType<{
    label: string;
    url: string;
    variant?: "link" | "primary" | "secondary" | "destructive";
    onClick: () => void;
  }>;
  Button: React.ComponentType<{
    label: string;
    isLoading: boolean;
    loadingLabel?: string;
    variant?: "primary" | "secondary" | "destructive";
    isDisabled: boolean;
    onClick: () => void;
  }>;
  CircularProgress: React.ComponentType<{}>;
  HorizontalLayout: React.ComponentType<{
    children: React.ReactNode;
    isLoading?: boolean;
  }>;
  VerticalLayout: React.ComponentType<{
    children: React.ReactNode;
    isLoading?: boolean;
  }>;
  Input: React.ComponentType<{
    isClearable: boolean;
    placeholder?: string;
    onChange: (value: string) => void;
    onSubmit: (value: string) => void;
  }>;
  Textarea: React.ComponentType<{
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
    href?: string;
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
  element: Extract<ModElementRef<T>, { type: "video" }>;
}) => {
  const { component: Component, element } = props;
  const { type, ...rest } = element;
  return <Component {...rest} />;
};

const WrappedTextRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["Text"];
  element: Extract<ModElementRef<T>, { type: "text" }>;
}) => {
  const { component: Component, element } = props;
  const { events, type, ...rest } = element;
  return <Component {...rest} />;
};

const WrappedLinkRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["Link"];
  element: Extract<ModElementRef<T>, { type: "link" }>;
}) => {
  const { component: Component, element } = props;
  const { events, type, ...rest } = element;

  const onClick = React.useCallback(() => {
    events.onClick?.();
  }, [events]);

  return <Component {...rest} onClick={onClick} />;
};

const WrappedButtonRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["Button"];
  element: Extract<ModElementRef<T>, { type: "button" }>;
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
  element: Extract<ModElementRef<T>, { type: "circular-progress" }>;
}) => {
  const { component: Component, element } = props;
  const { events, type, ...rest } = element;

  return <Component {...rest} />;
};

const WrappedHorizontalLayoutRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["HorizontalLayout"];
  element: Extract<ModElementRef<T>, { type: "horizontal-layout" }>;
}) => {
  const { component: Component, element } = props;
  const { type, elements, ...rest } = element;
  const [events] = React.useState(element.events);

  React.useEffect(() => {
    events.onLoad();
  }, [events]);

  return <Component {...rest}>{elements}</Component>;
};

const WrappedVerticalLayoutRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["VerticalLayout"];
  element: Extract<ModElementRef<T>, { type: "vertical-layout" }>;
}) => {
  const { component: Component, element } = props;
  const { type, elements, ...rest } = element;
  const [events] = React.useState(element.events);

  React.useEffect(() => {
    events.onLoad();
  }, [events]);

  return <Component {...rest}>{elements}</Component>;
};

const WrappedSelectRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["Select"];
  element: Extract<ModElementRef<T>, { type: "select" }>;
}) => {
  const { component: Component, element } = props;
  const { events, type, ...rest } = element;

  const onChange = React.useCallback(
    (input: string) => {
      events.onChange(input);
    },
    [events]
  );

  return <Component {...rest} onChange={onChange} />;
};

const WrappedInputRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["Input"];
  element: Extract<ModElementRef<T>, { type: "input" }>;
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

const WrappedComboboxRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["Combobox"];
  element: Extract<ModElementRef<T>, { type: "combobox" }>;
}) => {
  const { component: Component, element } = props;
  const { events, type, options, ...rest } = element;

  const onChange = React.useCallback(
    (input: string) => {
      events.onChange(input);
    },
    [events]
  );

  React.useEffect(() => {
    events.onLoad();
  }, []);

  const onPick = React.useCallback(
    (value: string) => {
      events.onPick(value);
    },
    [events]
  );

  return (
    <Component
      {...rest}
      onChange={onChange}
      options={options}
      onPick={onPick}
    />
  );
};

const WrappedTextareaRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["Textarea"];
  element: Extract<ModElementRef<T>, { type: "textarea" }>;
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
  element: Extract<ModElementRef<T>, { type: "tabs" }>;
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
  element: Extract<ModElementRef<T>, { type: "image-grid-list" }>;
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
  element: Extract<ModElementRef<T>, { type: "dialog" }>;
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
  element: Extract<ModElementRef<T>, { type: "alert" }>;
}) => {
  const { component: Component, element } = props;
  const { events, type, ...rest } = element;

  return <Component {...rest} />;
};

const WrappedImageRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["Image"];
  element: Extract<ModElementRef<T>, { type: "image" }>;
}) => {
  const { component: Component, element } = props;
  const { type, ...rest } = element;

  return <Component {...rest} />;
};

const WrappedAvatarRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["Avatar"];
  element: Extract<ModElementRef<T>, { type: "avatar" }>;
}) => {
  const { component: Component, element } = props;
  const { type, ...rest } = element;

  return <Component {...rest} />;
};

const WrappedCardRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["Card"];
  element: Extract<ModElementRef<T>, { type: "card" }>;
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

const WrappedPaddingRenderer = <T extends React.ReactNode>(props: {
  component: Renderers["Padding"];
  element: Extract<ModElementRef<T>, { type: "padding" }>;
}) => {
  const { component: Component, element } = props;
  const { type, elements, ...rest } = element;

  return <Component {...rest}>{elements}</Component>;
};

const useForceRerender = () => {
  const [, setValue] = React.useState(0);
  return React.useCallback(() => {
    setValue((prev) => prev + 1);
  }, []);
};

export type ResolverTypes = {
  onHttpAction?: HttpActionResolver;
  onOpenFileAction?: OpenFileActionResolver;
  onSetInputAction?: SetInputActionResolver;
  onAddEmbedAction?: AddEmbedActionResolver;
  onOpenLinkAction?: OpenLinkActionResolver;
  onEthPersonalSignAction?: EthPersonalSignActionResolver;
  onSendEthTransactionAction?: SendEthTransactionActionResolver;
  onExitAction?: ExitActionResolver;
};

type Props = ResolverTypes & {
  manifest: ModManifest;
  renderers: Renderers;
};

export const CreationMod = (
  props: Props & ({ variant: "creation" } & CreationContext)
) => {
  const {
    manifest,
    variant,
    onHttpAction = actionResolverHttp,
    onOpenFileAction = actionResolverOpenFile,
    onSetInputAction = actionResolverSetInput,
    onAddEmbedAction = actionResolverAddEmbed,
    onOpenLinkAction = actionResolverOpenLink,
    onSendEthTransactionAction = actionResolverSendEthTransaction,
    onEthPersonalSignAction = actionResolverEthPersonalSign,
    onExitAction = actionResolverExit,
  } = props;

  const forceRerender = useForceRerender();

  const input = variant === "creation" ? props.input : "";
  const context = React.useMemo<CreationContext>(
    () => ({
      input,
      embeds: props.embeds,
      api: props.api,
      user: props.user,
      clientReferralAddress: props.clientReferralAddress,
    }),
    [input, props.api, props.embeds, props.user, props.clientReferralAddress]
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
        onEthPersonalSignAction,
        onSendEthTransactionAction,
        onExitAction,
      })
  );

  React.useEffect(() => {
    renderer.setContext(context);
    forceRerender();
  }, [forceRerender, context, renderer]);

  return <Mod {...props} renderer={renderer} />;
};

export const RenderMod = (
  props: Props & ({ variant: "richEmbed" } & RichEmbedContext)
) => {
  const {
    manifest,
    onHttpAction = actionResolverHttp,
    onOpenFileAction = actionResolverOpenFile,
    onSetInputAction = actionResolverSetInput,
    onAddEmbedAction = actionResolverAddEmbed,
    onOpenLinkAction = actionResolverOpenLink,
    onEthPersonalSignAction = actionResolverEthPersonalSign,
    onSendEthTransactionAction = actionResolverSendEthTransaction,
    onExitAction = actionResolverExit,
  } = props;

  const forceRerender = useForceRerender();

  const context = React.useMemo<RichEmbedContext>(
    () => ({
      embed: props.embed,
      api: props.api,
      user: props.user,
      clientReferralAddress: props.clientReferralAddress,
    }),
    [props.embed, props.api, props.user, props.clientReferralAddress]
  );

  const [renderer] = React.useState<Renderer>(
    () =>
      new Renderer({
        manifest,
        variant: "richEmbed",
        context,
        onTreeChange: forceRerender,
        onHttpAction,
        onOpenFileAction,
        onSetInputAction,
        onAddEmbedAction,
        onOpenLinkAction,
        onEthPersonalSignAction,
        onSendEthTransactionAction,
        onExitAction,
      })
  );

  React.useEffect(() => {
    renderer.setContext(context);
    forceRerender();
  }, [forceRerender, context, renderer]);
  const Container = props.renderers["Container"];

  return (
    <Container>
      <Mod {...props} renderer={renderer} />
    </Container>
  );
};

export const Mod = (props: Props & { renderer: Renderer }) => {
  const {
    renderers,
    renderer,
    onHttpAction = actionResolverHttp,
    onOpenFileAction = actionResolverOpenFile,
    onSetInputAction = actionResolverSetInput,
    onAddEmbedAction = actionResolverAddEmbed,
    onOpenLinkAction = actionResolverOpenLink,
    onEthPersonalSignAction = actionResolverEthPersonalSign,
    onSendEthTransactionAction = actionResolverSendEthTransaction,
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
    renderer.setEthPersonalSignActionResolver(onEthPersonalSignAction);
  }, [onEthPersonalSignAction, renderer]);
  React.useEffect(() => {
    renderer.setSendEthTransactionActionResolver(onSendEthTransactionAction);
  }, [onSendEthTransactionAction, renderer]);
  React.useEffect(() => {
    renderer.setExitActionResolver(onExitAction);
  }, [onExitAction, renderer]);

  return (
    <VerticalLayout>
      {renderer.mapCurrentTree((el: ModElementRef<React.ReactNode>, key) => {
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
          case "link":
            return (
              <WrappedLinkRenderer
                key={key}
                component={renderers["Link"]}
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
          case "combobox":
            return (
              <WrappedComboboxRenderer
                key={key}
                component={renderers["Combobox"]}
                element={el}
              />
            );
          case "textarea":
            return (
              <WrappedTextareaRenderer
                key={key}
                component={renderers["Textarea"]}
                element={el}
              />
            );
          case "select":
            return (
              <WrappedSelectRenderer
                key={key}
                component={renderers["Select"]}
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
          case "padding":
            return (
              <WrappedPaddingRenderer
                key={key}
                component={renderers["Padding"]}
                element={el}
              />
            );
        }
      })}
    </VerticalLayout>
  );
};
