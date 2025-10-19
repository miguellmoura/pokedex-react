// src/screens/FavoritesScreen.js
import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import { useFavorites } from "../context/FavoritosContext";
import { officialArtworkUrl } from "../utils/utils";

export default function FavoritesScreen({ navigation }) {
  const { favorites } = useFavorites();

  const renderItem = ({ item }) => {
    const img = officialArtworkUrl(item.id);
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Detalhes", {
            pokemon: { name: item.name },
            id: item.id,
            img,
          })
        }
      >
        <View style={styles.card}>
          <Image
            source={{ uri: img }}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.name}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>
          Você ainda não favoritou nenhum Pokémon.
        </Text>
        <Button
          title="Ir para Pokédex"
          onPress={() => navigation.navigate("Home")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        numColumns={3}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  empty: { color: "#666", textAlign: "center", marginBottom: 12 },
  card: {
    flex: 1,
    padding: 12,
    margin: 6,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: { width: 80, height: 80 },
  name: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
