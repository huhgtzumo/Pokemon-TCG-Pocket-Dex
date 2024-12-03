import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateUser, getUserData } from '../services/firebase';
import { useUserStore } from '../stores/userStore';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useUserStore(state => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 驗證用戶ID格式
    if (!/^\d{16}$/.test(userId)) {
      setError('請輸入16位數字好友ID');
      setLoading(false);
      return;
    }

    try {
      await authenticateUser(userId);
      const userData = await getUserData(userId);
      setUser(userData);
      navigate('/collection');
    } catch (error) {
      console.error('Login error:', error);
      setError('登入失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-2">Pokemon TCG Pocket 圖鑑追蹤（A1夢幻）</h1>
        <p className="text-gray-500 text-sm text-center mb-6">提供高 CP 值抽卡策略，助你快速獲得夢幻</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
              使用你的好友ID進入
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="請輸入16位數字好友ID"
              maxLength={16}
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? '登入中...' : '進入'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 