import { Renderers } from "@packages/react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

const TextRenderer = (props: React.ComponentProps<Renderers["Text"]>) => {
  const { label } = props;
  return <Text className="my-0 flex-1">{label}</Text>;
};

const ButtonRenderer = (props: React.ComponentProps<Renderers["Button"]>) => {
  const { label, isDisabled, isLoading, onClick } = props;
  return (
    <Pressable
      className="flex-1 bg-slate-700 rounded p-2"
      disabled={isDisabled || isLoading}
      onPress={onClick}
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Text className="text-white font-bold text-center">{label}</Text>
      )}
    </Pressable>
  );
};

const CircularProgressRenderer = (
  props: React.ComponentProps<Renderers["CircularProgress"]>
) => {
  return <ActivityIndicator />;
};

const HorizontalLayoutRenderer = (
  props: React.ComponentProps<Renderers["HorizontalLayout"]>
) => {
  return <View className="flex flex-row space-x-2">{props.children}</View>;
};

const VerticalLayoutRenderer = (
  props: React.ComponentProps<Renderers["VerticalLayout"]>
) => {
  return <View className="flex flex-col space-y-2">{props.children}</View>;
};

export const renderers: Renderers = {
  Text: TextRenderer,
  Button: ButtonRenderer,
  CircularProgress: CircularProgressRenderer,
  HorizontalLayout: HorizontalLayoutRenderer,
  VerticalLayout: VerticalLayoutRenderer,
};
