import React from "react";
import { Text, View } from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";

interface ErrorModalProps {
  visible: boolean;
  message: string;
}

export default function ErrorModal({
  visible,
  message
}: ErrorModalProps) {
  return (
    <Modal isVisible={visible}>
      <View
        style={{
          backgroundColor: "#fff",
          padding: 24,
          borderRadius: 16,
          alignItems: "center"
        }}
      >
        <Ionicons
          name="alert-circle"
          size={70}
          color="red"
        />

        <Text
          style={{
            marginTop: 12,
            fontSize: 16,
            textAlign: "center"
          }}
        >
          {message}
        </Text>
      </View>
    </Modal>
  );
}