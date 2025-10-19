// util.js
export const extractIdFromUrl = (url) => {
  // ex: https://pokeapi.co/api/v2/pokemon/25/
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
};

export const officialArtworkUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
