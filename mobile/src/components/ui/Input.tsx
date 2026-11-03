import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  errorMessage?: string;
}

export function Input({ label, errorMessage, style, ...rest }: InputProps) {
  return (
    <View style={styles.wrapper}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, !!errorMessage && styles.inputError, style]}
        placeholderTextColor="#888"
        {...rest}
      />
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#D32F2F",
  },
  error: {
    fontSize: 12,
    color: "#D32F2F",
    marginTop: 4,
  },
});