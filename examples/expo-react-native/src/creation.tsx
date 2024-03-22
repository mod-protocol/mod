import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable, SafeAreaView } from "react-native";
import { useEditor, EditorContent } from "@packages/react-native-editor";
import { MentionsList } from "./mentions-list";
import { BottomModal } from "./bottom-modal";
import { BottomBar } from "./bottom-bar";

import React, { useState } from "react";
import { Manifest } from "@packages/core";
import { MiniApp } from "@packages/react";
import { renderers } from "./renderers";
import {
  CreationMiniAppsSearch,
  MiniAppLabel,
} from "./creation-mini-apps-search";
import ChatGPTMiniText from "@miniapps/chatgpt";

async function getResults() {
  return [
    {
      fid: "1214",
      display_name: "David Furlong",
      username: "df",
      avatar_url:
        "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_168/https%3A%2F%2Flh3.googleusercontent.com%2F-S5cdhOpZtJ_Qzg9iPWELEsRTkIsZ7qGYmVlwEORgFB00WWAtZGefRnS4Bjcz5ah40WVOOWeYfU5pP9Eekikb3cLMW2mZQOMQHlWhg",
    },
    {
      fid: "312",
      display_name: "Tim Reilly",
      username: "tldr.eth",
      avatar_url:
        "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_168/https%3A%2F%2Fi.seadn.io%2Fgae%2FJtOZdbuDX2gmQziB0tJn0W9KR9Ym3OOnI0l53a1ELghw47sOOBJplCdfA-_rXyNBrp3Ula18hFe5gxtLsFY7t5y1VUd8kmNQfNBj%3Fw%3D500%26auto%3Dformat",
    },
  ];
}

const miniapps: MiniAppLabel[] = [ChatGPTMiniText].map((manifest) => ({
  id: manifest.slug,
  label: manifest.name,
  manifest,
}));

export function Creation(props: { onClose: () => void }) {
  const editor = useEditor({
    initialText: "",
    getMentionResults: getResults,
  });
  const [miniAppModalOpen, setMiniAppModalOpen] = useState(false);
  const handleSetInput = React.useCallback(
    (input: any) => {
      // TODO: the app should define how the input is changed
      editor.setText(input);
    },
    [editor.setText]
  );

  const [currentMiniapp, setCurrentMiniapp] = React.useState<Manifest | null>(
    null
  );
  const handleMiniappExit = React.useCallback(
    () => setCurrentMiniapp(null),
    []
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topbar}>
          <Pressable className="p-3 px-4" onPress={props.onClose}>
            <Text>Cancel</Text>
          </Pressable>
          <View style={{ flexGrow: 1 }}></View>
          <Pressable className="rounded p-3 px-4 bg-indigo-500">
            <Text className="text-white">Post</Text>
          </Pressable>
        </View>
        <View
          style={{
            backgroundColor: "white",
            padding: 8,
            borderTopColor: "#ccc",
            borderTopWidth: 1,
            flex: 1,
          }}
        >
          <EditorContent
            style={{ flex: 1 }}
            editor={editor}
            linkStyle={styles.linkStyle}
            placeholder="What's on your mind?"
          />
        </View>

        <BottomBar
          onOpenMiniAppsModal={() => {
            editor.setIsMentionsOpen(false);
            setMiniAppModalOpen(true);
          }}
        />
        <BottomModal
          open={editor.isMentionsOpen || miniAppModalOpen}
          setModalOpen={editor.setIsMentionsOpen}
        >
          {editor.isMentionsOpen ? (
            <MentionsList
              items={editor.mentionResults}
              onChange={editor.onMentionSelect}
            />
          ) : miniAppModalOpen && currentMiniapp ? (
            <View className="p-2">
              <MiniApp
                input={editor.text}
                // FIXME:
                // embeds={editor.getEmbeds()}
                // api={}
                variant="creation"
                manifest={currentMiniapp}
                renderers={renderers}
                onExit={handleMiniappExit}
                onSetInput={handleSetInput}
              />
            </View>
          ) : miniAppModalOpen ? (
            <CreationMiniAppsSearch
              miniapps={miniapps}
              onSelect={setCurrentMiniapp}
            />
          ) : null}
        </BottomModal>
        <StatusBar style="auto" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  topbar: {
    flexGrow: 0,
    padding: 8,
    flexDirection: "row",
  },
  linkStyle: {
    color: "purple",
  },
  container: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "column",
    backgroundColor: "white",
    alignItems: "stretch",
    alignSelf: "stretch",
    // justifyContent: "stretch",
  },
});
