export interface User {
  id: string;
  collections: {
    [seriesId: string]: {
      collectedPokemon: number[];
      progress: number;
    }
  };
  lastUpdated: Date;
} 