import { Editor } from "./useEditor";
import { useCallback, useMemo } from "react";
import { TextInput } from "react-native";
import { convertCastPlainTextToStructured } from "@packages/farcaster";
import { convertStructuredCastToReactDOMComponents } from "./structure-cast";

export function EditorContent(props: { editor: Editor; linkStyle?: string }) {
  const { editor, ...restProps } = props;

  return (
    <TextInput
      autoFocus
      onChangeText={props.editor.setText}
      onSelectionChange={props.editor.onSelectionChange}
      // value={props.editor.text}
      multiline
      {...restProps}
    >
      {convertStructuredCastToReactDOMComponents(
        convertCastPlainTextToStructured({ text: props.editor.text }),
        { linkStyle: props.linkStyle }
      )}
    </TextInput>
  );
}
