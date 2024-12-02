import { useRankings } from '../hooks/useRankings';
import { useUserStore } from '../stores/userStore';
import { ClipboardIcon } from '@heroicons/react/24/outline';

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

  const rankings = data?.pages.flatMap(page => page.rankings) || [];

  return (
    <div className="space-y-6">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                最後更新
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rankings.map((user) => (
              <tr 
                key={user.id}
                className={currentUser?.id === user.id ? 'bg-indigo-50' : ''}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.rank}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center">
                  {user.id}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(user.id);
                    }}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <ClipboardIcon className="h-4 w-4" />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.collectedCount}/150
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.progress.toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.lastUpdated).toLocaleString()}
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