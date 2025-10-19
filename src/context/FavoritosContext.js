// src/context/FavoritesContext.js
import React, { createContext, useContext, useMemo, useState } from "react";

const FavoritosContext = createContext();

export function FavoritosProvider({ children }) {
  const [favorites, setFavorites] = useState([]); // cada item: { id, name }

  const isFavorite = (id) => favorites.some((f) => f.id === id);

  const toggleFavorite = (poke) => {
    setFavorites((prev) =>
      prev.some((p) => p.id === poke.id)
        ? prev.filter((p) => p.id !== poke.id)
        : [...prev, poke]
    );
  };

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite }),
    [favorites]
  );
  return (
    <FavoritosContext.Provider value={value}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritosContext);
  if (!ctx)
    throw new Error("useFavorites deve ser usado dentro de FavoritesProvider");
  return ctx;
}
