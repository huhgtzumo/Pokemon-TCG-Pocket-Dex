export interface User {
  id: string;
  collections: {
    A1: {
      collectedPokemon: number[];
      progress: number;
    }
  };
  lastUpdated: Date;
}

export interface Pokemon {
  id: number;
  name: string;
  type: string;
  packId: string;
}

export interface Ranking {
  id: string;
  collectedCount: number;
  progress: number;
  lastUpdated: Date;
  rank: number;
}

export type PackId = 'A1-1' | 'A1-2' | 'A1-3'; 