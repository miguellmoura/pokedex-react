import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useFavorites } from "../context/FavoritosContext";
import { officialArtworkUrl } from "../utils/utils";

export default function DetalhesScreen({ route }) {
  const { pokemon, id: idFromRoute, img: imgFromRoute } = route.params || {};
  const id = idFromRoute;
  const name = pokemon?.name ?? "Pokémon";

  const [abilities, setAbilities] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const { isFavorite, toggleFavorite } = useFavorites?.() || {
    isFavorite: () => false,
    toggleFavorite: () => {},
  };
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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setErr(null);
        setLoading(true);
        const { data } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${id}/`
        );
        if (!mounted) return;
        setAbilities(data.abilities ?? []);
        setTypes(data.types ?? []);
      } catch (e) {
        if (!mounted) return;
        setErr("Falha ao carregar os dados.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const renderAbility = ({ item }) => {
    const abilityName = item?.ability?.name ?? "—";
    return (
      <View style={styles.abilityCard}>
        <Text style={styles.abilityText}>{abilityName}</Text>
      </View>
    );
  };

  const renderType = ({ item }) => {
    const typeName = item?.type?.name ?? "—";
    return (
      <View style={[styles.abilityCard, styles.typeCard]}>
        <Text style={styles.abilityText}>{typeName}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {name.charAt(0).toUpperCase() + name.slice(1)}
          {id ? ` (#${id})` : ""}
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

      <View style={styles.infoCard}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>HABILIDADES</Text>
          {loading ? (
            <ActivityIndicator />
          ) : err ? (
            <Text style={styles.msg}>{err}</Text>
          ) : (
            <FlatList
              data={abilities}
              keyExtractor={(item) => item.ability.name}
              horizontal
              renderItem={renderAbility}
              contentContainerStyle={styles.chipsRow}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>

        <View style={styles.separator} />

        <View style={styles.row}>
          <Text style={styles.rowLabel}>TIPOS</Text>
          {loading ? (
            <ActivityIndicator />
          ) : err ? (
            <Text style={styles.msg}>{err}</Text>
          ) : (
            <FlatList
              data={types}
              keyExtractor={(item) => String(item.slot)}
              horizontal
              renderItem={renderType}
              contentContainerStyle={styles.chipsRow}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
      </View>
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

  infoCard: {
    marginTop: 12,
    padding: 16,
    backgroundColor: "#F7F9FC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6ECF5",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  rowLabel: { width: 120, fontSize: 14, fontWeight: "800", color: "#2d3436" },
  chipsRow: { alignItems: "center", paddingLeft: 8 },
  separator: { height: 1, backgroundColor: "#E6ECF5", marginVertical: 12 },

  abilityCard: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
    backgroundColor: "#EAF2FF",
    borderWidth: 1,
    borderColor: "#C7DBFF",
  },
  typeCard: {
    backgroundColor: "#FFF1E6",
    borderColor: "#FFD9BF",
  },
  abilityText: {
    textTransform: "capitalize",
    fontWeight: "600",
    color: "#333",
  },
});
