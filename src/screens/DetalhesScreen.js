// src/screens/DetalhesScreen.js
import React, { useMemo, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useFavorites } from "../context/FavoritosContext";
import { officialArtworkUrl } from "../utils/utils";

export default function DetalhesScreen({ route }) {
  const { pokemon, id: idFromRoute, img: imgFromRoute } = route.params || {};
  const id = idFromRoute; // garantimos id numérico vindo da Home
  const name = pokemon?.name;

  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(id);

  const primaryUrl = useMemo(
    () =>
      typeof id === "number" ? officialArtworkUrl(id) : imgFromRoute || null,
    [id, imgFromRoute]
  );
  const [src, setSrc] = useState(primaryUrl);
  const fallbackUrl = useMemo(
    () =>
      typeof id === "number"
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
        : null,
    [id]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {name ? name.charAt(0).toUpperCase() + name.slice(1) : "Pokémon"}
        </Text>
        <TouchableOpacity
          onPress={() => toggleFavorite({ id, name })}
          accessibilityLabel={fav ? "Desfavoritar" : "Favoritar"}
          style={[styles.favBtn, fav && styles.favActive]}
        >
          <Text style={styles.favIcon}>{fav ? "★" : "☆"}</Text>
        </TouchableOpacity>
      </View>

      {src ? (
        <Image
          source={{ uri: src }}
          style={styles.image}
          resizeMode="contain"
          onError={() => {
            if (fallbackUrl && src !== fallbackUrl) setSrc(fallbackUrl);
          }}
        />
      ) : (
        <Text style={styles.msg}>Imagem não disponível</Text>
      )}

      <Text style={styles.idText}>#{id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 22, fontWeight: "700", textTransform: "capitalize" },
  favBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  favActive: { backgroundColor: "#FFEAA7", borderColor: "#FDCB6E" },
  favIcon: { fontSize: 22 },
  image: { width: "100%", height: 220, marginVertical: 16 },
  idText: { fontSize: 16, color: "#555" },
  msg: { color: "#888" },
});
