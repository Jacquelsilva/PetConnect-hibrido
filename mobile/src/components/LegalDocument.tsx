import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Header } from "@/components/ui/Header";

export interface LegalSection {
  title: string;
  paragraphs: string[];
}

interface LegalDocumentProps {
  title: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
  onBackPress: () => void;
}

export function LegalDocument({
  title,
  updatedAt,
  intro,
  sections,
  onBackPress,
}: LegalDocumentProps) {
  return (
    <View style={styles.container}>
      <Header title={title} onBackPress={onBackPress} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.updated}>Última atualização: {updatedAt}</Text>
          <Text style={styles.intro}>{intro}</Text>

          {sections.map((section, index) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>
                {index + 1}. {section.title}
              </Text>
              {section.paragraphs.map((paragraph, i) => (
                <Text key={i} style={styles.paragraph}>
                  {paragraph}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    maxWidth: 720,
    alignSelf: "center",
    width: "100%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  updated: {
    fontSize: 12,
    color: "#7F8C8D",
    marginBottom: 12,
  },
  intro: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 21,
    marginBottom: 8,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    color: "#555555",
    lineHeight: 21,
    marginBottom: 6,
  },
});