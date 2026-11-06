import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { applyMask } from "@/utils/masks";

interface InputProps extends TextInputProps {
  label?: string;
  errorMessage?: string;
  mask?: "cpf" | "cnpj" | "phone" | "cep" | "cpf_cnpj" | "none";
}

export function Input({
  label,
  errorMessage,
  mask = "none",
  value,
  onChangeText,
  style,
  ...rest
}: InputProps) {
  const handleTextChange = (text: string) => {
    if (mask && mask !== "none") {
      const masked = applyMask(text, mask);
      onChangeText?.(masked);
    } else {
      onChangeText?.(text);
    }
  };

  return (
    <View style={styles.wrapper}>
      {!!label && (
        <Text style={styles.label}>{label}</Text>
      )}

      <TextInput
        style={[
          styles.input,
          !!errorMessage && styles.inputError,
          style,
        ]}
        placeholderTextColor="#888"
        value={value}
        onChangeText={handleTextChange}
        {...rest}
      />

      {!!errorMessage && (
        <Text style={styles.error}>{errorMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
    width: "100%",
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "#fff",
  },

  inputError: {
    borderColor: "#D32F2F",
  },

  error: {
    fontSize: 11,
    color: "#D32F2F",
    marginTop: 3,
  },
});
