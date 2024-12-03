import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../stores/userStore';
import { getUserData } from '../services/firebase';
import { currentSeries, isPokemonInPack, isMultiPackPokemon } from '../data/pokemons';
import { A1Series } from '../data/series/A1';
import { useMemo } from 'react';

interface PackAnalysis {
  packId: string;
  packName: string;
  total: number;
  collected: number;
  uncollected: number;
  percentage: number;
  uncollectedPokemons: Array<{
    id: number;
    name: string;
    type: string;
  }>;
}

const Analysis = () => {
  const user = useUserStore(state => state.user);
  
  const { data: userData, isLoading } = useQuery({
    queryKey: ['userData', user?.id],
    queryFn: () => getUserData(user?.id || ''),
    enabled: !!user?.id
  });

  const packAnalysis = Object.entries(currentSeries.packs).map(([packId, packName]): PackAnalysis => {
    // 找出屬於這個卡包的所有寶可夢，排除多卡包寶可夢
    const packPokemons = currentSeries.pokemons.filter(pokemon => 
      isPokemonInPack(pokemon.id, packId) && !isMultiPackPokemon(pokemon.id)
    );

    // 計算已收集的寶可夢
    const collectedPokemons = packPokemons.filter(pokemon => 
      userData?.collections.A1.collectedPokemon.includes(pokemon.id)
    );

    // 未收集的寶可夢詳情
    const uncollectedPokemons = packPokemons
      .filter(pokemon => !userData?.collections.A1.collectedPokemon.includes(pokemon.id))
      .map(({ id, name, type }) => ({ id, name, type }));

    return {
      packId,
      packName,
      total: packPokemons.length,
      collected: collectedPokemons.length,
      uncollected: packPokemons.length - collectedPokemons.length,
      percentage: (collectedPokemons.length / packPokemons.length) * 100,
      uncollectedPokemons
    };
  });

  // 計算最佳抽卡建議
  const getBestPack = () => {
    return packAnalysis.reduce((best, current) => {
      if (current.percentage === 100) return best;
      if (!best) return current;
      if (current.uncollected > best.uncollected) return current;
      if (current.uncollected === best.uncollected && current.percentage < best.percentage) {
        return current;
      }
      return best;
    }, null as PackAnalysis | null);
  };

  const bestPack = getBestPack();

  // 多卡包寶可夢分析
  const multiPackAnalysis = useMemo(() => {
    // 找出所有多卡包寶可夢
    const multiPackPokemons = currentSeries.pokemons.filter(pokemon => 
      isMultiPackPokemon(pokemon.id)
    );

    // 計算已收集的寶可夢
    const collectedPokemons = multiPackPokemons.filter(pokemon => 
      userData?.collections.A1.collectedPokemon.includes(pokemon.id)
    );

    // 未收集的寶可夢詳情
    const uncollectedPokemons = multiPackPokemons
      .filter(pokemon => !userData?.collections.A1.collectedPokemon.includes(pokemon.id))
      .map(({ id, name, type }) => ({ id, name, type }));

    return {
      total: multiPackPokemons.length,
      collected: collectedPokemons.length,
      uncollected: multiPackPokemons.length - collectedPokemons.length,
      percentage: (collectedPokemons.length / multiPackPokemons.length) * 100,
      uncollectedPokemons
    };
  }, [userData?.collections.A1.collectedPokemon]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">載入中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 最佳建議 */}
      {bestPack && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-2">抽卡建議</h2>
          <p className="text-gray-600">
            建議抽取 <span className="text-indigo-600 font-medium">{bestPack.packName}</span>
            ，還有 {bestPack.uncollected} 隻未收集的寶可夢
          </p>
        </div>
      )}

      {/* 解鎖夢幻說明 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-purple-600">解鎖夢幻：</h3>
        <p className="mt-2 text-gray-600">
          當玩家收集齊關都 150 種寶可夢，即會完成「關都圖鑑成就」並解鎖一張實境卡「夢幻」。
        </p>
      </div>

      {/* 各卡包分析 */}
      <div className="grid gap-6">
        {packAnalysis.map(pack => (
          <div key={pack.packId} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{pack.packName}</h3>
              <span className="text-gray-500">
                {pack.collected}/{pack.total} ({pack.percentage.toFixed(1)}%)
              </span>
            </div>
            
            {/* 進度條 */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${pack.percentage}%` }}
              />
            </div>

            {/* 未收集列表 */}
            {pack.uncollectedPokemons.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">未收集：</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {pack.uncollectedPokemons.map(pokemon => (
                    <div 
                      key={pokemon.id}
                      className="text-sm p-2 bg-gray-50 rounded"
                    >
                      #{String(pokemon.id).padStart(3, '0')} {pokemon.name}
                      <span className="text-gray-500 ml-1">({pokemon.type})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 多卡包寶可夢分析 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">多卡包寶可夢</h3>
          <span className="text-gray-500">
            {multiPackAnalysis.collected}/{multiPackAnalysis.total} ({multiPackAnalysis.percentage.toFixed(1)}%)
          </span>
        </div>
        
        {/* 進度條 */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${multiPackAnalysis.percentage}%` }}
          />
        </div>

        {/* 未收集列表 */}
        {multiPackAnalysis.uncollectedPokemons.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">未收集：</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {multiPackAnalysis.uncollectedPokemons.map(pokemon => (
                <div 
                  key={pokemon.id}
                  className="text-sm p-2 bg-gray-50 rounded"
                >
                  #{String(pokemon.id).padStart(3, '0')} {pokemon.name}
                  <span className="text-gray-500 ml-1">({pokemon.type})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis; 