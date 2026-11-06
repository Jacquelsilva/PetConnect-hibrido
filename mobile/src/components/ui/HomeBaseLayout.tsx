import React from "react";
import { View, StyleSheet, SafeAreaView, Platform } from "react-native";
import { Header } from "./Header";

interface HomeBaseLayoutProps {
  title: string;
  children: React.ReactNode;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
}

export function HomeBaseLayout({
  title,
  children,
  onBackPress,
  rightAction,
}: HomeBaseLayoutProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={title} onBackPress={onBackPress} rightAction={rightAction} />
      <View style={styles.container}>
        <View style={styles.content}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: 1080,
    paddingHorizontal: Platform.OS === "web" ? 24 : 16,
    paddingVertical: 16,
  },
});
