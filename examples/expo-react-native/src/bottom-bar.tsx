import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function BottomBar(props: { onOpenMiniAppsModal: () => void }) {
  return (
    <View className="border-t-2 border-t-slate-300 flex flex-col bg-white px-2">
      <Pressable
        className="p-2"
        onPress={() => {
          props.onOpenMiniAppsModal();
        }}
      >
        <Text className="text-xl">+</Text>
      </Pressable>
    </View>
  );
}
