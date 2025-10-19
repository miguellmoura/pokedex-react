import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { extractIdFromUrl, officialArtworkUrl } from "../utils/utils";

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Botão no header para abrir Favoritos
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Pokédex",
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Favoritos")}
          style={{ marginRight: 12 }}
          accessibilityLabel="Abrir favoritos"
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#f39c12" }}>
            ⭐ Favoritos
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=10&offset=0"
        );
        setData(response.data.results);
      } catch (err) {
        console.error("Erro ao buscar Pokémons:", err);
        setError("Falha ao carregar os dados.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.msg}>Carregando Pokémons...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const id = extractIdFromUrl(item.url);
    const img = officialArtworkUrl(id);

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Detalhes", {
            pokemon: item,
            id,
            img,
          })
        }
        activeOpacity={0.8}
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

  return (
    <View style={styles.container}>
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.name}
        numColumns={3}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.msg}>Nenhum Pokémon encontrado.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContent: { padding: 12, paddingBottom: 24 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  msg: { marginTop: 8, color: "#555" },
  error: { color: "#C0392B", textAlign: "center" },

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
