import React from "react";

import {
  Modal,
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

export const BottomModal = ({
  open,
  setModalOpen,
  onRequestClose,
  modalBackgroundStyle,
  modalOptionsContainerStyle,
  modalProps,
  children,
}: any) => {
  if (!open) return null;
  return (
    <TouchableOpacity
      onPress={() => setModalOpen?.(false)}
      style={[
        styles.modalContainer,
        styles.modalOptionsContainer,
        modalBackgroundStyle,
      ]}
    >
      <SafeAreaView style={[modalOptionsContainerStyle]}>
        {children}
      </SafeAreaView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  // modalBackgroundStyle: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalOptionsContainer: {
    maxHeight: "50%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderBottomWidth: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});
