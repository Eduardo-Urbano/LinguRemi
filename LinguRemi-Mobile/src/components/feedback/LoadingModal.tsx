import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Modal from "react-native-modal";

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

export default function LoadingModal({
  visible,
  message = "Carregando..."
}: LoadingModalProps) {
  return (
    <Modal isVisible={visible} backdropOpacity={0.5}>
      <View
        style={{
          backgroundColor: "#fff",
          padding: 24,
          borderRadius: 16,
          alignItems: "center"
        }}
      >
        <ActivityIndicator size="large" />

        <Text
          style={{
            marginTop: 16,
            fontSize: 16
          }}
        >
          {message}
        </Text>
      </View>
    </Modal>
  );
}