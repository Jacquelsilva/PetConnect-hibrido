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
  const [ongNome, setOngNome] = useState<string>("ONG Parceira PetConnect");
  const [ongTelefone, setOngTelefone] = useState<string>("(11) 99999-9999");
  const [carregando, setCarregando] = useState<boolean>(!initialPet && !!petId);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const db = await getDatabase();
        let targetAnimal = animal;
        if (!targetAnimal && petId) {
          targetAnimal = await buscarAnimal(db, Number(petId));
          if (ativo && targetAnimal) setAnimal(targetAnimal);
        }

        if (targetAnimal?.id_ong) {
          const ong = await db.getFirstAsync<{ nome: string; telefone: string }>(
            "SELECT nome, telefone FROM ongs WHERE id = ?",
            [targetAnimal.id_ong]
          );
          if (ong && ativo) {
            if (ong.nome) setOngNome(ong.nome);
            if (ong.telefone) setOngTelefone(ong.telefone);
          }
        }
      } catch (e) {
        console.error("Erro ao carregar detalhes do pet ou ONG:", e);
      } finally {
        if (ativo) setCarregando(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, [petId]);

  const pet = animal
    ? {
        nome: animal.nome,
        especie: animal.especie,
        idade: textoIdade(animal.idade),
        porte: animal.porte,
        sexo: animal.sexo,
        descricao: animal.descricao || "Sem descrição informada.",
        ongNome,
        ongTelefone,
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
    backgroundColor: "#F9FAFB",
  },
  scroll: {
    paddingBottom: 32,
  },
  image: {
    width: "100%",
    height: 300,
    backgroundColor: "#E5E7EB",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
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
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
  },
  species: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  chipText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
    marginTop: 16,
  },
  description: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 22,
  },
  ongCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 8,
  },
  ongInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  ongTextContainer: {
    flex: 1,
  },
  ongName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  ongPhone: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  footer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
});
