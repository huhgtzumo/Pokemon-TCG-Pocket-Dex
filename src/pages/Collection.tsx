import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../stores/userStore';
import { getUserData, updateUserCollection } from '../services/firebase';
import { pokemons, types, isPokemonInPack, currentSeries } from '../data/pokemons';
import type { PackId } from '../types';

// 使用 A1.ts 中定義的包名稱
const packsMap: Record<PackId, string> = {
  'A1-1': '皮卡丘包',
  'A1-2': '超夢包',
  'A1-3': '噴火龍包'
};

const Collection = () => {
  const user = useUserStore(state => state.user);
  const [packFilter, setPackFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [collectionFilter, setCollectionFilter] = useState<string>('all');

  const { data: userData, isLoading, refetch } = useQuery({
    queryKey: ['userData', user?.id],
    queryFn: () => getUserData(user?.id || ''),
    enabled: !!user?.id
  });

  const handleCollectionToggle = async (pokemonId: number) => {
    if (!user?.id) return;
    try {
      await updateUserCollection(user.id, pokemonId);
      refetch();
    } catch (error) {
      console.error('Failed to update collection:', error);
    }
  };

  const filteredPokemons = pokemons.filter(pokemon => {
    if (packFilter !== 'all' && !isPokemonInPack(pokemon.id, packFilter)) return false;
    if (typeFilter !== 'all' && pokemon.type !== typeFilter) return false;
    if (collectionFilter !== 'all') {
      const isCollected = userData?.collections.A1.collectedPokemon.includes(pokemon.id);
      if (collectionFilter === 'collected' && !isCollected) return false;
      if (collectionFilter === 'uncollected' && isCollected) return false;
    }
    return true;
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">載入中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 進度條 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between mb-2">
          <span>總進度</span>
          <span>{userData?.collections.A1.collectedPokemon.length || 0}/150</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${(userData?.collections.A1.collectedPokemon.length || 0) / 150 * 100}%` }}
          />
        </div>
      </div>

      {/* 篩選器 */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <select 
            value={packFilter}
            onChange={(e) => setPackFilter(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="all">全部卡包</option>
            {Object.entries(packsMap).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="all">全部屬性</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select 
            value={collectionFilter}
            onChange={(e) => setCollectionFilter(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="all">全部</option>
            <option value="collected">已收集</option>
            <option value="uncollected">未收集</option>
          </select>
        </div>
      </div>

      {/* 寶可夢列表 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredPokemons.map(pokemon => {
          const isCollected = userData?.collections.A1.collectedPokemon.includes(pokemon.id);
          const isMultiPack = currentSeries.multiPackPokemons[pokemon.id];
          
          return (
            <div 
              key={pokemon.id}
              className={`bg-white p-4 rounded-lg shadow cursor-pointer transition-transform hover:scale-105
                ${isCollected ? 'ring-2 ring-indigo-500' : ''}`}
              onClick={() => handleCollectionToggle(pokemon.id)}
            >
              <div className="text-center">
                <div className="text-lg font-medium">{pokemon.name}</div>
                <div className="text-sm text-gray-500">#{String(pokemon.id).padStart(3, '0')}</div>
                <div className="text-sm">{pokemon.type}</div>
                {isMultiPack ? (
                  <div className="text-sm text-gray-500">全部卡包</div>
                ) : (
                  <div className="text-sm text-gray-500">
                    {packsMap[pokemon.packId as PackId]}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Collection; 