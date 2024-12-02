import { A1Series } from './series/A1';

export const types = ["草", "火", "水", "雷", "鬥", "超", "普", "惡", "龍"] as const;

export const currentSeries = A1Series;

// 輔助函數：檢查寶可夢是否在特定卡包中
export const isPokemonInPack = (pokemonId: number, packId: string) => {
  // 檢查是否是多卡包寶可夢（標記為「全」的寶可夢）
  if (currentSeries.multiPackPokemons[pokemonId]) {
    return true; // 如果是「全」的寶可夢，在任何卡包篩選下都應該顯示
  }
  
  // 如果不是「全」的寶可夢，則檢查是否屬於特定卡包
  const pokemon = currentSeries.pokemons.find(p => p.id === pokemonId);
  return pokemon?.packId === packId;
};

// 導出當前系列的所有數據
export const pokemons = currentSeries.pokemons;
export const packs = currentSeries.packs; 