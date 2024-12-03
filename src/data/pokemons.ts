import { A1Series } from './series/A1';
import { Pokemon } from '../types';

export const types = ["草", "火", "水", "雷", "鬥", "超", "普", "惡", "龍"] as const;

// 定義 multiPackPokemons 的類型
interface MultiPackPokemons {
  [key: number]: string[];  // 數字作為鍵，字符串數組作為值
}

// 確保 currentSeries 有正確的類型
interface Series {
  multiPackPokemons: MultiPackPokemons;
  pokemons: Array<Pokemon>;  // 假設 Pokemon 類型已存在
  packs: Record<string, string>;
}

// 確保 currentSeries 符合類型定義
export const currentSeries: Series = A1Series;

// 輔助函數：檢查寶可夢是否在特定卡包中
export const isPokemonInPack = (pokemonId: number, packId: string) => {
  // 檢查是否為多卡包寶可夢
  const multiPackPokemon = currentSeries.multiPackPokemons[pokemonId];
  if (multiPackPokemon) {
    return multiPackPokemon.includes(packId); // 如果是多卡包寶可夢，檢查是否包含在該卡包中
  }
  
  // 一般寶可夢的檢查邏輯
  const pokemon = currentSeries.pokemons.find(p => p.id === pokemonId);
  return pokemon?.packId === packId;
};

// 新增函數用於判斷是否為多卡包寶可夢
export const isMultiPackPokemon = (pokemonId: number) => {
  return !!currentSeries.multiPackPokemons[pokemonId];
};

// 導出當前系列的所有數據
export const pokemons = currentSeries.pokemons;
export const packs = currentSeries.packs; 