import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
}

export function Header({ title, onBackPress, rightAction }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {onBackPress && (
          <Pressable
            onPress={onBackPress}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back" size={24} color="#2C3E50" />
          </Pressable>
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <View style={styles.rightContainer}>
        {rightAction}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    width: "100%",
    maxWidth: 1080,
    alignSelf: "center",
  },
  leftContainer: {
    width: 40,
    alignItems: "flex-start",
  },
  rightContainer: {
    width: 40,
    alignItems: "flex-end",
  },
  backButton: {
    padding: 4,
    borderRadius: 20,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    textAlign: "center",
  },
});
