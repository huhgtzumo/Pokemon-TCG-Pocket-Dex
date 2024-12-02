import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link
                to="/collection"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                ${location.pathname === '/collection' 
                  ? 'border-indigo-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                收集清單
              </Link>
              <Link
                to="/analysis"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                ${location.pathname === '/analysis' 
                  ? 'border-indigo-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                分析
              </Link>
              <Link
                to="/leaderboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                ${location.pathname === '/leaderboard' 
                  ? 'border-indigo-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                排行榜
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 