import { Manifest } from "@packages/core";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export type MiniAppLabel = {
  id: string;
  label: string;
  manifest: Manifest;
};

type Props = {
  miniapps: MiniAppLabel[];
  onSelect: (value: MiniAppLabel["manifest"]) => void;
};

export function CreationMiniAppsSearch(props: Props) {
  const { miniapps, onSelect } = props;

  const [open, setOpen] = React.useState(false);
  const [results, setResults] = React.useState<MiniAppLabel[]>(props.miniapps);
  const handleSelect = React.useCallback(
    (id: string) => {
      const miniapp = miniapps.find((m) => m.id === id);
      if (miniapp) {
        setOpen(false);
        onSelect(miniapp.manifest);
      }
    },
    [onSelect, miniapps]
  );

  const getMiniApps = React.useCallback(
    async (text: string) => {
      return props.miniapps.filter((miniapp) => miniapp.label.includes(text));
    },
    [props.miniapps]
  );

  const onChangeText = React.useCallback(
    async (text: string) => {
      const miniAppResults = await getMiniApps(text);
      setResults(miniAppResults);
    },
    [getMiniApps, setResults]
  );

  return (
    <View className="p-4">
      <TextInput
        onChangeText={onChangeText}
        placeholder="Search Mini-apps..."
      />
      {results.length === 0 ? (
        <View className="py-3">
          <Text>No Mini-app found.</Text>
        </View>
      ) : null}
      {results.map((miniApp) => (
        <Pressable
          key={miniApp.id}
          className="py-3"
          onPress={() => handleSelect(miniApp.id)}
        >
          <Text>{miniApp.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
