import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const CODE_LENGTH = 6;

type VerificationModalProps = {
  visible: boolean;
  email: string;
  onVerify: (code: string) => Promise<{ error?: string } | void>;
  onClose: () => void;
};

export function VerificationModal({ visible, email, onVerify, onClose }: VerificationModalProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleShow = () => {
    setCode("");
    setError(null);
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const handleChangeCode = async (text: string) => {
    const digits = text.replace(/[^0-9]/g, "").slice(0, CODE_LENGTH);
    setCode(digits);
    setError(null);

    if (digits.length === CODE_LENGTH) {
      setIsSubmitting(true);
      const result = await onVerify(digits);
      setIsSubmitting(false);

      if (result?.error) {
        setError(result.error);
        setCode("");
        return;
      }

      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onShow={handleShow}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <View className="gap-6 rounded-t-card bg-background px-screen pb-10 pt-6">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 gap-2 pr-4">
              <Text className="font-poppins-bold text-h3 text-ink">Verify your email</Text>
              <Text className="text-body-md text-ink-muted">
                We sent a 6-digit code to{" "}
                <Text className="font-poppins-medium text-ink">{email}</Text>
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={24} color="#64748b" />
            </Pressable>
          </View>

          <Pressable
            onPress={() => inputRef.current?.focus()}
            className="flex-row justify-center gap-3"
          >
            {Array.from({ length: CODE_LENGTH }).map((_, index) => {
              let borderClassName = "border-border";
              if (error) {
                borderClassName = "border-error";
              } else if (index === code.length) {
                borderClassName = "border-tucana-teal-deep";
              }

              return (
                <View
                  key={index}
                  className={`h-14 w-11 items-center justify-center rounded-input border ${borderClassName}`}
                >
                  <Text className="font-poppins-semibold text-h3 text-ink">{code[index] ?? ""}</Text>
                </View>
              );
            })}
          </Pressable>

          {error && <Text className="text-center text-caption text-error">{error}</Text>}

          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={handleChangeCode}
            editable={!isSubmitting}
            keyboardType="number-pad"
            maxLength={CODE_LENGTH}
            style={styles.hiddenInput}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(16, 21, 31, 0.5)",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    height: 0,
    width: 0,
  },
});
