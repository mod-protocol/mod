import React from "react";
import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native";

export interface MentionResult {
  fid: string;
  display_name: string;
  username: string;
  avatar_url: string;
}

export const MentionsList = (props: {
  items: Array<MentionResult | null>;
  onChange: (value: MentionResult) => void;
}) => {
  const noResults = props.items.length === 1 && props.items[0] === null;
  if (props.items.length && !noResults) {
    return props.items.map((item, index) =>
      !item ? null : (
        <MentionItem
          item={item}
          onChange={props.onChange}
          key={item.username}
        />
      )
    );
  }
  if (noResults)
    return (
      <>
        <Text>Not found</Text>
      </>
    );

  return (
    <View style={styles.listItemContainerStyle}>
      <View style={[styles.image, styles.skeletonImage]}></View>
      <View style={[styles.primaryText, styles.skeletonText]}></View>
      <View style={[styles.secondaryText, styles.skeletonText]}></View>
    </View>
  );
};

export const MentionItem = (props: {
  item: MentionResult;
  onChange: (value: MentionResult) => void;
}) => {
  return (
    <TouchableOpacity
      style={styles.listItemContainerStyle}
      onPress={() => props.onChange(props.item)}
    >
      <Image
        source={{ uri: props.item.avatar_url ?? "" }}
        style={styles.image}
      />
      <View style={styles.mentionLabels}>
        <Text style={styles.primaryText}>@{props.item.username}</Text>
        <Text style={styles.secondaryText}>{props.item.display_name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryText: {
    fontWeight: "bold",
    marginLeft: 8,
  },
  mentionLabels: {},
  skeletonText: {
    backgroundColor: "#ccc",
    width: 100,
    height: 20,
  },
  skeletonImage: {
    backgroundColor: "#ccc",
  },
  secondaryText: {
    marginLeft: 8,
  },
  image: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  listItemContainerStyle: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
