
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  errorMessage?: string;
}

export function Input({
  label,
  errorMessage,
  style,
  ...rest
}: InputProps) {
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
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },

  input: {
    height: 42,
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
