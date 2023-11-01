import get from "lodash.get";
import set from "lodash.set";
import isArray from "lodash.isarray";
import isString from "lodash.isstring";
import mapValues from "lodash.mapvalues";
import {
  ModAction,
  ModEvent,
  ModElement,
  ModManifest,
  JsonType,
  Op,
  ConditionalFlow,
} from "./manifest";
import { Embed } from "./embeds";

export type ModElementRef<T> =
  | {
      type: "text";
      label: string;
      events?: undefined;
    }
  | {
      type: "image";
      imageSrc: string;
    }
  | {
      type: "video";
      videoSrc: string;
    }
  | {
      type: "link";
      label: string;
      variant?: "link" | "primary" | "secondary" | "destructive";
      url: string;
      events: {
        onClick?: () => void;
      };
    }
  | {
      type: "button";
      label: string;
      variant?: "primary" | "secondary" | "destructive";
      isLoading: boolean;
      isDisabled: boolean;
      events: {
        onClick: () => void;
      };
    }
  | {
      type: "circular-progress";
      events?: undefined;
    }
  | {
      type: "horizontal-layout";
      events: {
        onLoad: () => void;
      };
      elements?: T[];
    }
  | {
      type: "vertical-layout";
      events: {
        onLoad: () => void;
      };
      elements?: T[];
    }
  | {
      type: "input";
      isClearable: boolean;
      placeholder?: string;
      events: {
        onChange: (input: string) => void;
        onSubmit: (input: string) => void;
      };
    }
  | {
      type: "tabs";
      values: string[];
      names: string[];
      elements?: T[];
      events: {
        onLoad: () => void;
        onChange: (value: string) => void;
      };
    }
  | {
      type: "image-grid-list";
      isLoading?: boolean;
      images: string[] | null;
      events: {
        onLoad: () => void;
        onPick: (image: string) => void;
      };
    }
  | {
      type: "dialog";
      elements?: T[];
      events: {
        onClose: () => void;
      };
    }
  | {
      type: "alert";
      title: string;
      description: string;
      variant: "success" | "error";
      events?: undefined;
    }
  | {
      type: "avatar";
      src: string;
    }
  | {
      type: "card";
      imageSrc?: string;
      aspectRatio?: number;
      topLeftBadge?: string;
      topRightBadge?: string;
      bottomLeftBadge?: string;
      bottomRightBadge?: string;
      elements?: T[];
      events: {
        onClick: () => void;
      };
    };

export type CreationContext = {
  input: any;
  embeds: Embed[];
  /** The url of the api hosting the mini-app backends. (including /api) **/
  api: string;
};

// Render mini apps only are triggered by a single embed right now
export type ContentContext = {
  embed: Embed;
  api: string;
};

export type ContextType = CreationContext | ContentContext;

function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
function hasDefinedProperty<T extends Record<any, any>, K extends keyof T>(
  obj: T,
  property: K
): obj is Required<T> {
  return property in obj && typeof obj[property] !== "undefined";
}

export type HttpActionResolverInit = {
  url: string;
  method: string;
  body?: any;
  headers?: Record<string, string>;
};
export type HttpActionResolverEvents = {
  onUploadProgress: (progress: number) => void;
  onAbort: () => void;
  onSuccess: (response: {
    status: number;
    statusText: string;
    data: any;
  }) => void;
  onError: (error: { status: number; statusText: string; error: any }) => void;
};
export interface HttpActionResolver {
  (init: HttpActionResolverInit, events: HttpActionResolverEvents): void;
}

export type OpenFileActionResolverInit = {
  maxFiles: number;
  accept: string[];
};
export type OpenFileActionResolverEvents = {
  onAbort: () => void;
  onSuccess: (files: { name: string; mimeType: string; blob: any }[]) => void;
  onError: (error: { message: string }) => void;
};
export interface OpenFileActionResolver {
  (
    init: OpenFileActionResolverInit,
    events: OpenFileActionResolverEvents
  ): void;
}

export type SetInputActionResolverInit = {
  input: any;
};

export type SetInputActionResolverEvents = {
  onSuccess: (input: any) => void;
};

export interface SetInputActionResolver {
  (
    init: SetInputActionResolverInit,
    events: SetInputActionResolverEvents
  ): void;
}

export type AddEmbedActionResolverInit = {
  url: string;
  name: string;
  mimeType: string;
};
export type AddEmbedActionResolverEvents = {
  onSuccess: () => void;
};
export interface AddEmbedActionResolver {
  (
    init: AddEmbedActionResolverInit,
    events: AddEmbedActionResolverEvents
  ): void;
}

export type OpenLinkActionResolverInit = {
  url: string;
};
export type OpenLinkActionResolverEvents = {
  onSuccess: () => void;
};
export interface OpenLinkActionResolver {
  (
    init: OpenLinkActionResolverInit,
    events: OpenLinkActionResolverEvents
  ): void;
}

export interface ExitActionResolver {
  (): void;
}

function replaceInlineContext(target: string, context: any): string {
  return target.replace(/{{([^{{}}]+)}}/g, (_, key) => get(context, key, ``));
}

function matchesOp(value: string, op: Op, context: any): boolean {
  const replaceInlineContext_ = (v: string) => replaceInlineContext(v, context);
  if (
    hasDefinedProperty(op, "equals") &&
    value !== replaceInlineContext_(op.equals)
  ) {
    return false;
  }

  if (
    hasDefinedProperty(op, "oneOf") &&
    !op.oneOf.map(replaceInlineContext_).includes(value)
  ) {
    return false;
  }

  if (
    hasDefinedProperty(op, "notOneOf") &&
    op.notOneOf.map(replaceInlineContext_).includes(value)
  ) {
    return false;
  }

  if (
    hasDefinedProperty(op, "contains") &&
    !value.includes(replaceInlineContext_(op.contains))
  ) {
    return false;
  }

  if (
    hasDefinedProperty(op, "startsWith") &&
    !value.startsWith(replaceInlineContext_(op.startsWith))
  ) {
    return false;
  }

  if (
    hasDefinedProperty(op, "endsWith") &&
    !value.endsWith(replaceInlineContext_(op.endsWith))
  ) {
    return false;
  }

  if (
    hasDefinedProperty(op, "regex") &&
    !value.match(new RegExp(op.regex, "ig"))
  ) {
    return false;
  }

  if (op.AND) {
    const AND = isArray(op.AND) ? op.AND : [op.AND];

    for (const andOp of AND) {
      if (!matchesOp(value, andOp, context)) {
        return false;
      }
    }
  }

  if (op.NOT) {
    const NOT = isArray(op.NOT) ? op.NOT : [op.NOT];

    for (const notOp of NOT) {
      if (matchesOp(value, notOp, context)) {
        return false;
      }
    }
  }

  if (op.OR) {
    const OR = isArray(op.OR) ? op.OR : [op.OR];
    let matchAny = false;

    for (const orOp of OR) {
      if (matchesOp(value, orOp, context)) {
        matchAny = true;
        break;
      }
    }

    if (!matchAny) {
      return false;
    }
  }

  return true;
}

export function canRenderEntrypointWithContext(
  entrypoint: NonNullable<ModManifest["contentEntrypoints"]>[number],
  context: ContentContext
) {
  const arrayOfIfs = isArray(entrypoint.if) ? entrypoint.if : [entrypoint.if];

  return !arrayOfIfs.find(
    ({ value, match }) =>
      !matchesOp(replaceInlineContext(value, context), match, context)
  );
}

export type RendererOptions = {
  manifest: ModManifest;
  onTreeChange: () => void;
  onHttpAction: HttpActionResolver;
  onOpenFileAction: OpenFileActionResolver;
  onSetInputAction: SetInputActionResolver;
  onAddEmbedAction: AddEmbedActionResolver;
  onOpenLinkAction: OpenLinkActionResolver;
  onExitAction: ExitActionResolver;
} & (
  | {
      variant: "creation";
      context: CreationContext;
    }
  | {
      variant: "content";
      context: ContentContext;
    }
);

export class Renderer {
  private interrupted: boolean = false;
  private currentTree: ModElement[] = [];
  private asyncAction: {
    promise: Promise<any>;
    ref: ModAction;
  } | null = null;
  private refs: Record<string, any> = {};
  private context: Readonly<ContextType>;
  private manifestContext: Record<string, any> = {};
  private readonly manifest: ModManifest;
  private onTreeChange: () => void;
  private onHttpAction: HttpActionResolver;
  private onOpenFileAction: OpenFileActionResolver;
  private onSetInputAction: SetInputActionResolver;
  private onAddEmbedAction: AddEmbedActionResolver;
  private onOpenLinkAction: OpenLinkActionResolver;
  private onExitAction: ExitActionResolver;

  constructor(options: RendererOptions) {
    this.context = options.context;
    this.manifest = options.manifest;
    this.onTreeChange = options.onTreeChange;
    this.onHttpAction = options.onHttpAction;
    this.onOpenFileAction = options.onOpenFileAction;
    this.onSetInputAction = options.onSetInputAction;
    this.onAddEmbedAction = options.onAddEmbedAction;
    this.onOpenLinkAction = options.onOpenLinkAction;
    this.onExitAction = options.onExitAction;

    if (options.variant === "creation") {
      this.currentTree = options.manifest.creationEntrypoints || [];
    } else {
      const entrypoints = options.manifest.contentEntrypoints;

      for (const entrypoint of entrypoints || []) {
        if (canRenderEntrypointWithContext(entrypoint, options.context)) {
          this.currentTree = entrypoint.element;
          break;
        }
      }
    }
  }

  setContext(context: ContextType) {
    this.context = context;
  }

  setHttpActionResolver(resolver: HttpActionResolver) {
    this.onHttpAction = resolver;
  }

  setOpenFileActionResolver(resolver: OpenFileActionResolver) {
    this.onOpenFileAction = resolver;
  }

  setOpenLinkActionResolver(resolver: OpenLinkActionResolver) {
    this.onOpenLinkAction = resolver;
  }

  setSetInputActionResolver(resolver: SetInputActionResolver) {
    this.onSetInputAction = resolver;
  }

  setAddEmbedActionResolver(resolver: AddEmbedActionResolver) {
    this.onAddEmbedAction = resolver;
  }

  setExitActionResolver(resolver: ExitActionResolver) {
    this.onExitAction = resolver;
  }

  private replaceInlineContext(target: string): string {
    return replaceInlineContext(target, {
      ...this.context,
      ...this.manifestContext,
      refs: this.refs,
    });
  }

  private matchesOp(value: string, op: Op): boolean {
    return matchesOp(value, op, {
      ...this.context,
      ...this.manifestContext,
      refs: this.refs,
    });
  }

  private executeAction(action: ModAction) {
    switch (action.type) {
      case "GET":
      case "POST":
      case "PUT":
      case "PATCH":
      case "DELETE": {
        let options: HttpActionResolverInit = {
          url: this.replaceInlineContext(action.url),
          method: action.type,
        };
        if (
          (action.type === "POST" ||
            action.type === "PUT" ||
            action.type === "PATCH") &&
          action.body
        ) {
          if ("json" in action.body) {
            const interpretJson = (json: JsonType): any => {
              if (json.type === "object") {
                return mapValues(json.value, (val) => interpretJson(val));
              }
              if (json.type === "array") {
                return json.value.map((val) => interpretJson(val));
              }
              if (json.type === "string") {
                return this.replaceInlineContext(json.value);
              }
              return json.value;
            };
            options.body = JSON.stringify(interpretJson(action.body.json));
            options.headers = {
              "content-type": "application/json",
            };
          } else {
            const formData = new FormData();

            for (const name in action.body.formData) {
              const l = action.body.formData[name];

              if (l.type === "string") {
                formData.append(name, this.replaceInlineContext(l.value));
              } else {
                formData.append(name, get({ refs: this.refs }, l.value));
              }
            }

            options.body = formData;
          }
        }

        if (action.ref) {
          set(this.refs, action.ref, { progress: 0 });
        }

        const promise = new Promise<void>((resolve) => {
          setTimeout(() => {
            this.onHttpAction(options, {
              onAbort: () => {
                // TODO: we should probably support this
                resolve();
                if (this.asyncAction?.promise !== promise) {
                  return;
                }
                // CODE GOES HERE
              },
              onSuccess: (response) => {
                resolve();

                if (this.asyncAction?.promise !== promise) {
                  return;
                }

                this.asyncAction = null;

                if (action.ref) {
                  set(this.refs, action.ref, { response, progress: 100 });
                }

                if (action.onsuccess) {
                  this.stepIntoOrTriggerAction(action.onsuccess);
                }
              },
              onUploadProgress: (progress) => {
                if (action.ref && this.asyncAction?.promise === promise) {
                  set(this.refs, action.ref, { progress });
                  this.onTreeChange();
                }
              },
              onError: (error) => {
                resolve();

                if (this.asyncAction?.promise !== promise) {
                  return;
                }

                if (action.ref) {
                  set(this.refs, action.ref, { error });
                }

                this.asyncAction = null;

                if (action.onerror) {
                  this.stepIntoOrTriggerAction(action.onerror);
                }
              },
            });
          }, 1);
        });

        this.asyncAction = {
          promise,
          ref: action,
        };

        break;
      }
      case "OPENFILE": {
        const promise = new Promise<void>((resolve) => {
          setTimeout(() => {
            this.onOpenFileAction(
              {
                accept: action.accept,
                maxFiles: Math.max(action.maxFiles, 1),
              },
              {
                onAbort: () => {
                  resolve();

                  if (this.asyncAction?.promise !== promise) {
                    return;
                  }

                  this.asyncAction = null;

                  if (action.oncancel) {
                    this.stepIntoOrTriggerAction(action.oncancel);
                  }
                },
                onSuccess: (files) => {
                  resolve();

                  if (this.asyncAction?.promise !== promise) {
                    return;
                  }

                  this.asyncAction = null;

                  if (!files.length) {
                    if (action.oncancel) {
                      this.stepIntoOrTriggerAction(action.oncancel);
                    } else {
                      return;
                    }
                  }

                  if (action.ref) {
                    set(this.refs, action.ref, { files });
                  }

                  if (action.onsuccess) {
                    this.stepIntoOrTriggerAction(action.onsuccess);
                  }
                },
                onError: (error) => {
                  resolve();

                  if (this.asyncAction?.promise !== promise) {
                    return;
                  }

                  if (action.ref) {
                    set(this.refs, action.ref, { error });
                  }

                  this.asyncAction = null;

                  if (action.onerror) {
                    this.stepIntoOrTriggerAction(action.onerror);
                  }
                },
              }
            );
          }, 1);
        });

        this.asyncAction = {
          promise,
          ref: action,
        };
        break;
      }
      case "SETINPUT": {
        const promise = new Promise<void>((resolve) => {
          setTimeout(() => {
            this.onSetInputAction(
              {
                input: this.replaceInlineContext(action.value),
              },
              {
                onSuccess: (input) => {
                  resolve();

                  if (this.asyncAction?.promise !== promise) {
                    return;
                  }

                  this.asyncAction = null;

                  if (action.ref) {
                    set(this.refs, action.ref, input);
                  }

                  if (action.onsuccess) {
                    this.stepIntoOrTriggerAction(action.onsuccess);
                  }
                },
              }
            );
          }, 1);
        });

        this.asyncAction = {
          promise,
          ref: action,
        };
        break;
      }
      case "ADDEMBED": {
        const promise = new Promise<void>((resolve) => {
          setTimeout(() => {
            this.onAddEmbedAction(
              {
                url: this.replaceInlineContext(action.url),
                name: this.replaceInlineContext(action.name),
                mimeType: this.replaceInlineContext(action.mimeType),
              },
              {
                onSuccess: () => {
                  resolve();

                  if (this.asyncAction?.promise !== promise) {
                    return;
                  }

                  this.asyncAction = null;

                  if (action.onsuccess) {
                    this.stepIntoOrTriggerAction(action.onsuccess);
                  }
                },
              }
            );
          }, 1);
        });

        this.asyncAction = {
          promise,
          ref: action,
        };
        break;
      }
      case "OPENLINK": {
        const url = this.replaceInlineContext(action.url);

        if (!url) {
          break;
        }

        const promise = new Promise<void>((resolve) => {
          setTimeout(() => {
            this.onOpenLinkAction(
              {
                url,
              },
              {
                onSuccess: () => {
                  resolve();

                  if (this.asyncAction?.promise !== promise) {
                    return;
                  }

                  this.asyncAction = null;

                  if (action.onsuccess) {
                    this.stepIntoOrTriggerAction(action.onsuccess);
                  }
                },
              }
            );
          }, 1);
        });

        this.asyncAction = {
          promise,
          ref: action,
        };
        break;
      }
      case "EXIT": {
        this.onExitAction();
        this.interrupted = true;
        break;
      }
    }

    if (this.asyncAction) {
      if (
        "onloading" in this.asyncAction.ref &&
        this.asyncAction.ref.onloading
      ) {
        this.stepIntoOrTriggerAction(this.asyncAction.ref.onloading);
      } else {
        // Maybe we need to re-render
        this.onTreeChange();
      }
    }
  }

  private stepIntoOrTriggerAction(maybeElementTreeOrAction: ModEvent): void {
    if (this.interrupted) {
      return;
    }

    if (typeof maybeElementTreeOrAction === "string") {
      const elementRef = this.manifest.elements?.[maybeElementTreeOrAction];

      if (!elementRef) {
        this.interrupted = true;
        // eslint-disable-next-line no-console
        console.warn(
          `Couldn't find element with id: '${maybeElementTreeOrAction}'`
        );
        return;
      }

      this.currentTree = elementRef;
      this.onTreeChange();
      return;
    }

    if ("type" in maybeElementTreeOrAction) {
      if (this.asyncAction) {
        // eslint-disable-next-line no-console
        console.warn(
          `Aborted in-flight action with type '${this.asyncAction.ref.type}' in favor of ` +
            `action with type '${maybeElementTreeOrAction.type}'`
        );
      }

      this.asyncAction = null;

      return this.executeAction(maybeElementTreeOrAction);
    }

    // Check conditions
    if ("if" in maybeElementTreeOrAction) {
      const { if: if_, then: then_, else: else_ } = maybeElementTreeOrAction;
      const arrayOfIfs = isArray(if_) ? if_ : [if_];

      if (
        // lazy eval, fail on first missmatch
        !arrayOfIfs.find(
          ({ value, match }) =>
            !this.matchesOp(this.replaceInlineContext(value), match)
        )
      ) {
        return this.stepIntoOrTriggerAction(then_);
      } else if (else_) {
        return this.stepIntoOrTriggerAction(else_);
      } else {
        return;
      }
    }

    this.currentTree = maybeElementTreeOrAction;
    this.onTreeChange();
  }

  mapCurrentTree<T = any>(fn: (element: ModElementRef<T>, key: string) => T) {
    const mapper = (
      el: ModElement | ConditionalFlow<ModElement>,
      index: number
    ): T | null => {
      const key = index + "";

      if ("if" in el) {
        const { if: if_, then: then_, else: else_ } = el;
        const arrayOfIfs = isArray(if_) ? if_ : [if_];

        if (
          // lazy eval, fail on first missmatch
          !arrayOfIfs.find(
            ({ value, match }) =>
              !this.matchesOp(this.replaceInlineContext(value), match)
          )
        ) {
          return mapper(then_, index);
        } else if (else_) {
          return mapper(else_, index);
        } else {
          return null;
        }
      }

      switch (el.type) {
        case "text": {
          return fn(
            {
              type: "text",
              label: this.replaceInlineContext(el.label),
            },
            key
          );
        }
        case "link": {
          return fn(
            {
              type: "link",
              label: this.replaceInlineContext(el.label),
              variant: el.variant,
              url: this.replaceInlineContext(el.url),
              events: {
                onClick: el.onclick
                  ? () => {
                      this.stepIntoOrTriggerAction(el.onclick!);
                    }
                  : undefined,
              },
            },
            key
          );
        }
        case "button": {
          return fn(
            {
              type: "button",
              label: this.replaceInlineContext(el.label),
              isLoading: this.asyncAction?.ref === el.onclick,
              isDisabled: Boolean(this.asyncAction),
              variant: el.variant,
              events: {
                onClick: () => {
                  this.stepIntoOrTriggerAction(el.onclick);
                },
              },
            },
            key
          );
        }
        case "image": {
          return fn(
            {
              type: "image",
              imageSrc: this.replaceInlineContext(el.imageSrc),
            },
            key
          );
        }
        case "circular-progress": {
          return fn(
            {
              type: "circular-progress",
            },
            key
          );
        }
        case "video": {
          return fn(
            {
              type: "video",
              videoSrc: this.replaceInlineContext(el.videoSrc),
            },
            key
          );
        }
        case "horizontal-layout":
        case "vertical-layout": {
          return fn(
            {
              type: el.type,
              elements:
                el.elements && isArray(el.elements)
                  ? el.elements.map(mapper).filter(nonNullable)
                  : undefined, // TODO reference
              events: {
                onLoad: () => {
                  if (el.onload) {
                    this.stepIntoOrTriggerAction(el.onload);
                  }
                },
              },
            },
            key
          );
        }
        case "input": {
          return fn(
            {
              type: "input",
              isClearable: el.clearable || false,
              placeholder: el.placeholder,
              events: {
                onChange: (value: string) => {
                  if (el.ref) {
                    set(this.refs, el.ref, { value });
                  }

                  if (el.onchange) {
                    this.stepIntoOrTriggerAction(el.onchange);
                  }
                },
                onSubmit: (value: string) => {
                  if (el.ref) {
                    set(this.refs, el.ref, { value });
                  }

                  if (el.onchange) {
                    this.stepIntoOrTriggerAction(el.onchange);
                  }
                },
              },
            },
            key
          );
        }
        case "tabs": {
          if (el.ref && !get(this.refs, el.ref)) {
            set(this.refs, el.ref, { value: el.values[0] });
          }
          return fn(
            {
              type: "tabs",
              values: el.values,
              names: el.names,
              events: {
                onLoad: () => {
                  if (el.onload) {
                    this.stepIntoOrTriggerAction(el.onload);
                  }
                },
                onChange: (value: string) => {
                  if (el.ref) {
                    set(this.refs, el.ref, { value });
                  }

                  if (el.onchange) {
                    this.stepIntoOrTriggerAction(el.onchange);
                  }
                },
              },
            },
            key
          );
        }
        case "image-grid-list": {
          const resolvedImages: string[] | null = isString(el.imagesListRef)
            ? get({ refs: this.refs }, el.imagesListRef, null)
            : null;

          return fn(
            {
              type: "image-grid-list",
              isLoading: el.loading,
              images: el.loading
                ? null
                : isArray(resolvedImages)
                ? (resolvedImages as any[]).find((img) => !isString(img))
                  ? null
                  : resolvedImages
                : isString(resolvedImages)
                ? [resolvedImages]
                : null,
              events: {
                onLoad: () => {
                  if (el.onload) {
                    this.stepIntoOrTriggerAction(el.onload);
                  }
                },
                onPick: (url: string) => {
                  if (el.ref) {
                    set(this.refs, el.ref, { url });
                  }
                  if (el.onpick) {
                    this.stepIntoOrTriggerAction(el.onpick);
                  }
                },
              },
            },
            key
          );
        }
        case "dialog": {
          return fn(
            {
              type: "dialog",
              elements:
                el.elements && isArray(el.elements)
                  ? el.elements.map(mapper).filter(nonNullable)
                  : undefined, // TODO reference
              events: {
                onClose: () => {
                  if (el.onclose) {
                    this.stepIntoOrTriggerAction(el.onclose);
                  }
                },
              },
            },
            key
          );
        }
        case "alert": {
          return fn(
            {
              type: "alert",
              title: this.replaceInlineContext(el.title),
              description: this.replaceInlineContext(el.description),
              variant: el.variant,
            },
            key
          );
        }
        case "avatar": {
          return fn(
            {
              type: "avatar",
              src: this.replaceInlineContext(el.src),
            },
            key
          );
        }
        case "card": {
          return fn(
            {
              type: "card",
              imageSrc: el.imageSrc
                ? this.replaceInlineContext(el.imageSrc)
                : undefined,
              aspectRatio: el.aspectRatio,
              topLeftBadge: el.topLeftBadge
                ? this.replaceInlineContext(el.topLeftBadge)
                : undefined,
              topRightBadge: el.topRightBadge
                ? this.replaceInlineContext(el.topRightBadge)
                : undefined,
              bottomLeftBadge: el.bottomLeftBadge
                ? this.replaceInlineContext(el.bottomLeftBadge)
                : undefined,
              bottomRightBadge: el.bottomRightBadge
                ? this.replaceInlineContext(el.bottomRightBadge)
                : undefined,
              elements:
                el.elements && isArray(el.elements)
                  ? el.elements.map(mapper).filter(nonNullable)
                  : undefined, // TODO reference
              events: {
                onClick: () => {
                  if (el.onclick) {
                    this.stepIntoOrTriggerAction(el.onclick);
                  }
                },
              },
            },
            key
          );
        }
      }
    };
    return this.currentTree.map(mapper).filter(nonNullable);
  }
}
