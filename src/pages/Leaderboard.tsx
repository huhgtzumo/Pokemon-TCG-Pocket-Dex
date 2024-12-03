import { useRankings } from '../hooks/useRankings';
import { useUserStore } from '../stores/userStore';

const PAGE_SIZE = 20;

const maskUserId = (id: string) => {
  if (id.length <= 8) return id;
  const start = id.slice(0, 4);
  const end = id.slice(-4);
  const masked = '*'.repeat(8);
  return `${start}${masked}${end}`;
};

const Leaderboard = () => {
  const currentUser = useUserStore(state => state.user);
  const { 
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useRankings();

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">載入中...</div>;
  }

  const rankings = data?.pages.flatMap((page, pageIndex) => 
    page.rankings.map((ranking, index) => ({
      ...ranking,
      rank: pageIndex * PAGE_SIZE + index + 1
    }))
  ) || [];

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              由於部分玩家登入別人的帳戶和無效帳戶，現在複製好友ID功能關閉
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                排名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                好友ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                收集數量
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                完成度
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rankings.map((user) => (
              <tr 
                key={user.id}
                className={`
                  ${currentUser?.id === user.id ? 'bg-indigo-50' : ''}
                  ${user.progress === 100 ? 'font-semibold' : ''}
                `}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.rank}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {maskUserId(user.id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.collectedCount}/150
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.progress.toFixed(1)}%
                  {user.progress === 100 && " 👑"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasNextPage && (
        <div className="flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isFetchingNextPage ? '載入中...' : '載入更多'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Leaderboard; 