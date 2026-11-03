import { View, Text, Pressable, StyleSheet, PressableProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface OptionCardProps extends Omit<PressableProps, "style" | "children"> {
  icone: keyof typeof Ionicons.glyphMap;
  titulo: string;
  descricao: string;
  cor: string;
  corFundo: string;
}

export function OptionCard({
  icone,
  titulo,
  descricao,
  cor,
  corFundo,
  ...rest
}: OptionCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={titulo}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      {...rest}
    >
      <View style={[styles.iconeBox, { backgroundColor: corFundo }]}>
        <Ionicons name={icone} size={28} color={cor} />
      </View>

      <View style={styles.texto}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.descricao}>{descricao}</Text>
      </View>

      <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  iconeBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  texto: {
    flex: 1,
    marginRight: 8,
  },
  titulo: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 2,
  },
  descricao: {
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
  },
});