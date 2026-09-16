import { TextInput, StyleSheet, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  // Espaço reservado para props customizadas futuras (ex: errorMessage, label)
}

export function Input({ style, ...rest }: InputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="#888"
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});
