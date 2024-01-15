import type { JSONSchema7 } from "json-schema";

export type ModConditionalElement = {
  element: ModElement[];
  if: ValueOp;
};

export type ModManifest = {
  /** A unique string identifying this Mod */
  slug: string;
  /** A human readable name for the Mod */
  name: string;
  /** A (temporary) github username to define as the owner */
  custodyGithubUsername: string;
  /** An ethereum address to define as the owner */
  custodyAddress: `0x${string}`;
  /** A valid url pointing to an image file, it should be a square */
  logo: string;
  /** should be the same as the package version */
  version: string;
  /**
   * A Map of unique ids to json-schema.org definitions. Used to define a new standard data model for use in this or other Mods.
   * Most useful when used in conjunction with json-ld that utilizes these data models
   */
  modelDefinitions?: Record<string, JSONSchema7>;
  /** Interface this Mod exposes, if any, for Content Creation */
  creationEntrypoints?: ModElement[];
  /** Interface this Mod exposes, if any, for RichEmbed Rendering */
  richEmbedEntrypoints?: ModConditionalElement[];
  /** A definition map of reusable elements, using their id as the key */
  elements?: Record<string, ModElement[]>;
  /** Permissions requested by the Mod */
  permissions?: Array<"user.wallet.address" | "web3.eth.personal.sign">;
};

export type ModEvent =
  | ModAction
  | string
  | ModElement[]
  | ConditionalFlow<ModAction | string | ModElement[]>;

type BaseAction = {
  ref?: string;
  onsuccess?: ModEvent;
  onerror?: ModEvent;
  onloading?: ModEvent;
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

export type HTTPAction = BaseAction & { url: string } & (
    | {
        type: "GET";
        searchParams?: Record<string, string>;
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
  oncancel?: ModEvent;
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

type SetStateAction = BaseAction & {
  type: "SETSTATE";
  state: { [key: string]: string };
};

export type EthPersonalSignData = {
  statement: string;
  version: string;
  chainId: string;
};

export type EthTransactionData = {
  to: string;
  from: string;
  data?: string;
  value?: string;
};

type EthPersonalSignAction = BaseAction & {
  type: "web3.eth.personal.sign";
  data: EthPersonalSignData;
};

type SendEthTransactionAction = BaseAction & {
  type: "SENDETHTRANSACTION";
  chainId: string;
  txData: EthTransactionData;
  onsubmitted?: ModEvent;
  onconfirmed?: ModEvent;
};

type SetInputAction = BaseAction & {
  type: "SETINPUT";
  value: string;
};

type ExitAction = {
  type: "EXIT";
};

export type ModAction =
  | HTTPAction
  | OpenFileAction
  | AddEmbedAction
  | SetInputAction
  | OpenLinkAction
  | SetStateAction
  | EthPersonalSignAction
  | SendEthTransactionAction
  | ExitAction;

type ElementOrConditionalFlow = ModElement | ConditionalFlow<ModElement>;

export type ModElement =
  | {
      type: "text";
      label: string;
      variant?: "bold" | "secondary" | "regular";
    }
  | {
      type: "image";
      imageSrc: string;
    }
  | {
      type: "link";
      label: string;
      onclick?: ModEvent;
      variant?: "link" | "primary" | "secondary" | "destructive";
      url: string;
    }
  | {
      type: "button";
      label: string;
      loadingLabel?: string;
      variant?: "primary" | "secondary" | "destructive";
      onclick: ModEvent;
    }
  | {
      type: "circular-progress";
    }
  | {
      type: "horizontal-layout";
      elements?: string | ElementOrConditionalFlow[];
      onload?: ModEvent;
    }
  | {
      type: "vertical-layout";
      elements?: string | ElementOrConditionalFlow[];
      onload?: ModEvent;
    }
  | {
      type: "textarea";
      ref?: string;
      placeholder?: string;
      onchange?: ModEvent;
      onsubmit?: ModEvent;
    }
  | {
      type: "select";
      options: Array<{ label: string; value: any }>;
      ref?: string;
      placeholder?: string;
      isClearable?: boolean;
      onchange?: ModEvent;
    }
  | {
      type: "input";
      ref?: string;
      placeholder?: string;
      isClearable?: boolean;
      onchange?: ModEvent;
      onsubmit?: ModEvent;
    }
  | {
      type: "video";
      videoSrc: string;
    }
  | {
      type: "tabs";
      ref?: string;
      values: string[];
      names: string[];
      onload?: ModEvent;
      onchange?: ModEvent;
    }
  | {
      type: "combobox";
      ref?: string;
      isClearable?: boolean;
      placeholder?: string;
      optionsRef?: string;
      valueRef?: string;
      onload?: ModEvent;
      onpick?: ModEvent;
      onchange?: ModEvent;
    }
  | ({
      type: "image-grid-list";
      ref?: string;
      onload?: ModEvent;
      onpick?: ModEvent;
    } & (
      | { loading: boolean; imagesListRef?: never }
      | { loading?: never; imagesListRef: string }
    ))
  | {
      type: "dialog";
      elements?: string | ElementOrConditionalFlow[];
      onclose?: ModEvent;
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
      onclick?: ModEvent;
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
