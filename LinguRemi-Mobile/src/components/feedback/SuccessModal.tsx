import React from "react";
import { Text, View } from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";

interface SuccessModalProps {
  visible: boolean;
  message: string;
}

export default function SuccessModal({
  visible,
  message
}: SuccessModalProps) {
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
          name="checkmark-circle"
          size={70}
          color="green"
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