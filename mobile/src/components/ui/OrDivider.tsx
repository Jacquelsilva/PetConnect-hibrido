import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface OrDividerProps {
  text?: string;
}

export function OrDivider({ text = "ou" }: OrDividerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  text: {
    marginHorizontal: 12,
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "500",
    textTransform: "lowercase",
  },
});
