type ConditionalElement = {
  element: Element[];
  if: ValueOp;
};

export type Manifest = {
  slug: string;
  name: string;
  custodyGithubUsername: string;
  custodyAddress: string;
  logo: string;
  version: string;
  creationEntrypoints?: Element[];
  contentEntrypoints?: ConditionalElement[];
  elements?: Record<string, Element[]>;
};

export type EventType =
  | Action
  | string
  | Element[]
  | ConditionalFlow<Action | string | Element[]>;

type BaseAction = {
  ref?: string;
  onsuccess?: EventType;
  onerror?: EventType;
  onloading?: EventType;
};

export type Op = {
  AND?: Op | Op[];
  OR?: Op[];
  NOT?: Op | Op[];
  equals?: string;
  oneOf?: string[];
  notOneOf?: string[];
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  regex?: string;
};

type ValueOp = {
  value: string;
  match: Op;
};

export type ConditionalFlow<T> = {
  if: ValueOp | ValueOp[];
  then: T | ConditionalFlow<T>;
  else?: T | ConditionalFlow<T>;
};

export type JsonType =
  | { type: "string"; value: string }
  | { type: "number"; value: number }
  | { type: "boolean"; value: boolean }
  | { type: "array"; value: JsonType[] }
  | { type: "object"; value: Record<string, JsonType> };
type FormDataType =
  | { type: "blobRef"; value: string }
  | { type: "string"; value: string };

type HTTPBody =
  | {
      json: JsonType;
    }
  | {
      formData: Record<string, FormDataType>;
    };

type HTTPAction = BaseAction & { url: string } & (
    | {
        type: "GET";
      }
    | {
        type: "POST";
        body?: HTTPBody;
      }
    | {
        type: "PUT";
        body?: HTTPBody;
      }
    | {
        type: "PATCH";
        body?: HTTPBody;
      }
    | {
        type: "DELETE";
      }
  );

type OpenFileAction = BaseAction & {
  type: "OPENFILE";
  accept: string[];
  maxFiles: number;
  oncancel?: EventType;
};

type AddEmbedAction = BaseAction & {
  type: "ADDEMBED";
  url: string;
  name: string;
  mimeType: string;
};

type OpenLinkAction = BaseAction & {
  type: "OPENLINK";
  url: string;
};

type SetInputAction = BaseAction & {
  type: "SETINPUT";
  value: string;
};

type ExitAction = {
  type: "EXIT";
};

export type Action =
  | HTTPAction
  | OpenFileAction
  | AddEmbedAction
  | SetInputAction
  | OpenLinkAction
  | ExitAction;

type ElementOrConditionalFlow = Element | ConditionalFlow<Element>;

export type Element =
  | {
      type: "text";
      label: string;
    }
  | {
      type: "image";
      imageSrc: string;
    }
  | {
      type: "button";
      label: string;
      onclick: EventType;
    }
  | {
      type: "circular-progress";
    }
  | {
      type: "horizontal-layout";
      elements?: string | ElementOrConditionalFlow[];
      onload?: EventType;
    }
  | {
      type: "vertical-layout";
      elements?: string | ElementOrConditionalFlow[];
      onload?: EventType;
    }
  | {
      ref?: string;
      type: "input";
      placeholder?: string;
      clearable?: boolean;
      onchange?: EventType;
      onsubmit?: EventType;
    }
  | {
      type: "video";
      videoSrc: string;
    }
  | {
      ref?: string;
      type: "tabs";
      values: string[];
      names: string[];
      onload?: EventType;
      onchange?: EventType;
    }
  | ({
      ref?: string;
      type: "image-grid-list";
      onload?: EventType;
      onpick?: EventType;
    } & (
      | { loading: boolean; imagesListRef?: never }
      | { loading?: never; imagesListRef: string }
    ))
  | {
      type: "dialog";
      elements?: string | ElementOrConditionalFlow[];
      onclose?: EventType;
    }
  | {
      type: "alert";
      title: string;
      description: string;
      variant: "success" | "error";
    }
  | {
      type: "avatar";
      src: string;
    }
  | ({
      type: "card";
      elements?: string | ElementOrConditionalFlow[];
      onclick?: EventType;
    } & (
      | {
          imageSrc: string;
          aspectRatio?: number;
          topLeftBadge?: string;
          topRightBadge?: string;
          bottomLeftBadge?: string;
          bottomRightBadge?: string;
        }
      | {
          imageSrc?: never;
          aspectRatio?: never;
          topLeftBadge?: never;
          topRightBadge?: never;
          bottomLeftBadge?: never;
          bottomRightBadge?: never;
        }
    ));
