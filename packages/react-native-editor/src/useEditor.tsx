import { useState, useMemo, useCallback, useRef } from "react";
import {
  NativeSyntheticEvent,
  TextInputSelectionChangeEventData,
} from "react-native";

export interface MentionResult {
  fid: string;
  display_name: string;
  username: string;
  avatar_url: string;
}

export type useEditorParameter = {
  initialText?: string;
  getMentionResults: ({ q }: { q: string }) => Promise<MentionResult[]>;
};

export type Editor = {
  text: string;
  mentionResults: MentionResult[];
  setText: (s: string) => void;
  onSelectionChange: (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>
  ) => void;
  isMentionsOpen: boolean;
  onMentionSelect: (m: MentionResult) => void;
  setIsMentionsOpen: (newValue: boolean) => void;
};

export type useEditorReturn = Editor;

function isSelectionInMention(cursorIndex: number, text: string): boolean {
  const stringBefore = text.slice(0, cursorIndex);

  // text before string is continuous valid mention letters and then an @
  const isValidMentionBefore =
    // TODO: namespace specific
    /^(.|\s)*(?:^|\s)@([a-z0-9-]{0,15}(?:\.)?(?:e)?(?:t)?(?:h)?)$/.test(
      stringBefore
    );

  // text after string is either valid mention or space
  return isValidMentionBefore;
}

function getCurrentSelectedToken(
  cursorIndex: number,
  text: string
): false | { startIndex: number; endIndex: number; text: string } {
  const isMention = isSelectionInMention(cursorIndex, text);
  if (!isMention) return false;

  const startIndex = text.lastIndexOf("@");

  let endIndex = cursorIndex;
  while (endIndex < text.length + 1) {
    // TODO: namespace specific
    if (/[a-zA-Z-_\.]/i.test(text[endIndex])) {
    } else {
      break;
    }

    endIndex = endIndex + 1;
  }

  return {
    text: text.slice(startIndex, endIndex),
    startIndex: startIndex,
    endIndex: endIndex,
  };
}

export function useEditor({
  initialText = "",
  getMentionResults,
}: useEditorParameter): useEditorReturn {
  const [text, setText] = useState(initialText);
  const [isMentionsOpen, setIsMentionsOpen] = useState(false);
  const [mentionResults, setMentionResults] = useState<MentionResult[]>([]);
  const currentMentionRef = useRef<
    { startIndex: number; endIndex: number; text: string } | false
  >();

  const fetchMentionResults = useCallback(
    async ({ q }: { q: string }) => {
      const results = await getMentionResults({ q });
      setMentionResults(results);
    },
    [getMentionResults, setMentionResults]
  );

  const onMentionSelect = useCallback(
    (mention: MentionResult) => {
      if (!currentMentionRef.current) {
        return;
      }
      setText(
        `${text.slice(0, currentMentionRef.current.startIndex)}@${
          mention.username
        } ${text.slice(currentMentionRef.current.endIndex)}`
      );
    },
    [text]
  );

  const onSelectionChange = useCallback(
    (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      const selection = event.nativeEvent.selection;
      if (selection.start === selection.end) {
        const structuredMention = getCurrentSelectedToken(
          selection.start,
          text
        );
        currentMentionRef.current = structuredMention;
        if (!structuredMention) {
          setIsMentionsOpen(false);
        } else {
          setIsMentionsOpen(true);
          fetchMentionResults({ q: structuredMention.text });
        }
      } else {
        setIsMentionsOpen(false);
      }
    },
    [text]
  );

  const editor = useMemo(
    () => ({
      text,
      setText,
      onSelectionChange,
      isMentionsOpen,
      mentionResults,
      onMentionSelect,
      setIsMentionsOpen,
    }),
    [
      text,
      setText,
      onSelectionChange,
      isMentionsOpen,
      onMentionSelect,
      setIsMentionsOpen,
      mentionResults,
    ]
  );
  return editor;
}
