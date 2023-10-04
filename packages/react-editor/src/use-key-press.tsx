import { useCallback, useEffect, useRef } from "react";

export const useKeyPress = ({
  metaKey,
  shiftKey,
  keys,
  callback,
  node = null,
}: {
  metaKey?: boolean;
  shiftKey?: boolean;
  keys: string[];
  callback: (ev: KeyboardEvent) => void;
  node?: HTMLElement | null;
}) => {
  // implement the callback ref pattern
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // check if one of the key is part of the ones we want
      if (
        keys.every((key) => event.key === key) &&
        (!metaKey || event.metaKey || event.ctrlKey) &&
        (!shiftKey || event.shiftKey)
      ) {
        callbackRef.current(event);
      }
    },
    [keys, metaKey, shiftKey]
  );

  useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document;
    // attach the event listener
    targetNode && targetNode.addEventListener("keydown", handleKeyPress as any);

    // remove the event listener
    return () =>
      targetNode &&
      targetNode.removeEventListener("keydown", handleKeyPress as any);
  }, [handleKeyPress, node]);
};
