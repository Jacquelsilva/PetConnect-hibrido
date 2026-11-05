import React from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";

interface InputGroupProps extends TextInputProps {
  label: string;
  errorMessage?: string;
  mask?: "cpf_cnpj" | "none";
}

export function InputGroup({
  label,
  errorMessage,
  mask = "none",
  value,
  onChangeText,
  style,
  ...rest
}: InputGroupProps) {
  const handleTextChange = (text: string) => {
    if (mask === "cpf_cnpj") {
      // Remove non-digits
      const digits = text.replace(/\D/g, "");
      let formatted = digits;

      if (digits.length <= 11) {
        // CPF: 000.000.000-00
        formatted = digits
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d{1,2})/, "$1-$2")
          .replace(/(-\d{2})\d+?$/, "$1");
      } else {
        // CNPJ: 00.000.000/0000-00
        formatted = digits
          .slice(0, 14)
          .replace(/^(\d{2})(\d)/, "$1.$2")
          .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
          .replace(/\.(\d{3})(\d)/, ".$1/$2")
          .replace(/(\d{4})(\d)/, "$1-$2");
      }
      onChangeText?.(formatted);
    } else {
      onChangeText?.(text);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !!errorMessage && styles.inputError, style]}
        placeholderTextColor="#999"
        value={value}
        onChangeText={handleTextChange}
        {...rest}
      />
      {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
    color: "#333",
  },
  inputError: {
    borderColor: "#D32F2F",
    backgroundColor: "#FDEDED",
  },
  errorText: {
    fontSize: 12,
    color: "#D32F2F",
    marginTop: 4,
  },
});
