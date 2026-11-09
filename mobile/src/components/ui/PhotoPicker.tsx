import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

type Props = {
  value: string | null | undefined; // data URI ou URL já existente
  onChange: (uri: string | null) => void;
  label?: string;
};

function aviso(titulo: string, msg: string) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") window.alert(`${titulo}\n\n${msg}`);
  } else {
    Alert.alert(titulo, msg);
  }
}

export function PhotoPicker({ value, onChange, label = "Foto do animal" }: Props) {
  const escolher = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.4,
        base64: true,
      });

      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      const uri = asset.base64
        ? `data:${asset.mimeType || "image/jpeg"};base64,${asset.base64}`
        : asset.uri;

      onChange(uri);
    } catch (e) {
      console.error("Erro ao escolher foto:", e);
      aviso("Erro", "Não foi possível abrir a galeria.");
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <Pressable onPress={escolher} style={styles.box}>
        {value ? (
          <Image source={{ uri: value }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera-outline" size={36} color="#9CA3AF" />
            <Text style={styles.placeholderText}>Toque para escolher uma foto</Text>
          </View>
        )}
      </Pressable>

      {value ? (
        <View style={styles.actions}>
          <Pressable onPress={escolher}>
            <Text style={styles.change}>Trocar foto</Text>
          </Pressable>
          <Pressable onPress={() => onChange(null)}>
            <Text style={styles.remove}>Remover</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
  box: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F1F3F5",
    borderWidth: 1,
    borderColor: "#E1E4E8",
  },
  image: { width: "100%", height: "100%" },
  placeholder: { flex: 1, alignItems: "center", justifyContent: "center", gap: 6 },
  placeholderText: { fontSize: 13, color: "#7F8C8D" },
  actions: { flexDirection: "row", gap: 20, marginTop: 8 },
  change: { fontSize: 14, fontWeight: "600", color: "#0F766E" },
  remove: { fontSize: 14, color: "#D32F2F" },
});