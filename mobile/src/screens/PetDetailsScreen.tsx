import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, Alert } from "react-native";
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import type { PetDetailsScreenProps } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";

export function PetDetailsScreen({ navigation, route }: PetDetailsScreenProps) {
  const pet = (route?.params as any)?.pet || {
    nome: "Thor",
    especie: "Cachorro",
    idade: "2 anos",
    porte: "Médio",
    sexo: "Macho",
    descricao: "Thor é um cãozinho muito alegre, brincalhão e cheio de energia. Adora correr no parque e se dá super bem com crianças e outros pets. Vacinado e castrado.",
    ongNome: "ONG Amigo dos Bichos",
    ongTelefone: "(11) 98765-4321",
    foto: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
  };

  const handleSolicitacao = () => {
    Alert.alert(
      "Solicitação Enviada!",
      `Sua solicitação de adoção para ${pet.nome} foi enviada com sucesso para ${pet.ongNome}. A ONG entrará em contato em breve!`,
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={styles.container}>
      <Header title={pet.nome} onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={{ uri: pet.foto }} style={styles.image} />

        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.petName}>{pet.nome}</Text>
            <Text style={styles.species}>{pet.especie}</Text>
          </View>

          <View style={styles.chipsRow}>
            <View style={styles.chip}>
              <Ionicons name="time-outline" size={14} color="#4CAF50" />
              <Text style={styles.chipText}>{pet.idade}</Text>
            </View>
            <View style={styles.chip}>
              <Ionicons name="resize-outline" size={14} color="#4CAF50" />
              <Text style={styles.chipText}>{pet.porte}</Text>
            </View>
            <View style={styles.chip}>
              <Ionicons name="male-female-outline" size={14} color="#4CAF50" />
              <Text style={styles.chipText}>{pet.sexo}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Sobre o Pet</Text>
          <Text style={styles.description}>{pet.descricao}</Text>

          <Text style={styles.sectionTitle}>ONG Responsável</Text>
          <View style={styles.ongCard}>
            <View style={styles.ongInfo}>
              <Ionicons name="business-outline" size={24} color="#4CAF50" />
              <View style={styles.ongTextContainer}>
                <Text style={styles.ongName}>{pet.ongNome}</Text>
                <Text style={styles.ongPhone}>{pet.ongTelefone}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Solicitar Adoção"
          variant="primary"
          onPress={handleSolicitacao}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scroll: {
    paddingBottom: 100,
    maxWidth: 720,
    alignSelf: "center",
    width: "100%",
  },
  image: {
    width: "100%",
    height: 320,
    backgroundColor: "#E0E0E0",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  petName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  species: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipsRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F8F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 10,
  },
  chipText: {
    fontSize: 13,
    color: "#2C3E50",
    marginLeft: 6,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: "#555555",
    lineHeight: 22,
    marginBottom: 20,
  },
  ongCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  ongInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  ongTextContainer: {
    marginLeft: 12,
  },
  ongName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2C3E50",
  },
  ongPhone: {
    fontSize: 13,
    color: "#7F8C8D",
    marginTop: 2,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
  },
});
