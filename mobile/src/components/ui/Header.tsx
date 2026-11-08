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
            <Ionicons name="arrow-back" size={22} color="#047857" />
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
    width: 44,
    alignItems: "flex-start",
  },
  rightContainer: {
    width: 44,
    alignItems: "flex-end",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6F4EA",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.8,
    backgroundColor: "#D1E7DD",
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    textAlign: "center",
  },
});
