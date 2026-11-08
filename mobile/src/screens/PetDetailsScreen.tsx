import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Alert } from "react-native";
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { getDatabase } from "@/database/Database";
import { buscarAnimal } from "@/database/AnimalDAO";
import type { Animal } from "@/models/types";

type Props = NativeStackScreenProps<RootStackParamList, "PetDetails">;

function textoIdade(idade: number): string {
  if (idade === 0) return "Menos de 1 ano";
  return idade === 1 ? "1 ano" : `${idade} anos`;
}

export function PetDetailsScreen({ navigation, route }: Props) {
  const routeParams = (route?.params as any) || {};
  const initialPet = routeParams.pet;
  const petId = routeParams.id;

  const [animal, setAnimal] = useState<Animal | null>(initialPet || null);
  const [carregando, setCarregando] = useState<boolean>(!initialPet && !!petId);

  useEffect(() => {
    let ativo = true;
    if (!initialPet && petId) {
      (async () => {
        try {
          const db = await getDatabase();
          const resultado = await buscarAnimal(db, Number(petId));
          if (ativo) setAnimal(resultado);
        } catch (e) {
          console.error("Erro ao carregar detalhes do pet:", e);
        } finally {
          if (ativo) setCarregando(false);
        }
      })();
    }
    return () => {
      ativo = false;
    };
  }, [petId, initialPet]);

  const pet = animal
    ? {
        nome: animal.nome,
        especie: animal.especie,
        idade: textoIdade(animal.idade),
        porte: animal.porte,
        sexo: animal.sexo,
        descricao: animal.descricao || "Sem descrição informada.",
        ongNome: "ONG Parceira PetConnect",
        ongTelefone: "(11) 99999-9999",
        foto: animal.foto_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
      }
    : routeParams.pet || {
        nome: "Thor",
        especie: "Cachorro",
        idade: "2 anos",
        porte: "Médio",
        sexo: "Macho",
        descricao: "Thor é um cãozinho muito alegre, brincalhão e cheio de energia.",
        ongNome: "ONG Amigo dos Bichos",
        ongTelefone: "(11) 98765-4321",
        foto: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
      };

  const handleSolicitacao = () => {
    navigation.navigate("solicitaradocao", { petId: petId || animal?.id });
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
              <Ionicons name="time-outline" size={14} color="#047857" />
              <Text style={styles.chipText}>{pet.idade}</Text>
            </View>
            <View style={styles.chip}>
              <Ionicons name="resize-outline" size={14} color="#047857" />
              <Text style={styles.chipText}>{pet.porte}</Text>
            </View>
            <View style={styles.chip}>
              <Ionicons name="male-female-outline" size={14} color="#047857" />
              <Text style={styles.chipText}>{pet.sexo}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Sobre o Pet</Text>
          <Text style={styles.description}>{pet.descricao}</Text>

          <Text style={styles.sectionTitle}>ONG Responsável</Text>
          <View style={styles.ongCard}>
            <View style={styles.ongInfo}>
              <Ionicons name="business-outline" size={24} color="#047857" />
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
    fontSize: 24,
    fontWeight: "700",
    color: "#2C3E50",
  },
  species: {
    fontSize: 16,
    fontWeight: "600",
    color: "#047857",
    backgroundColor: "#E6F4EA",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chipsRow: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 12,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  chipText: {
    fontSize: 14,
    color: "#047857",
    marginLeft: 6,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 8,
    marginTop: 16,
  },
  description: {
    fontSize: 15,
    color: "#555555",
    lineHeight: 22,
  },
  ongCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  ongInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  ongTextContainer: {
    marginLeft: 16,
  },
  ongName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  ongPhone: {
    fontSize: 14,
    color: "#666666",
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
    borderTopColor: "#E0E0E0",
    alignItems: "center",
  },
});
