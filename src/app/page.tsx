'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account, password }),
    });
    const data = await res.json();
    if (data.error) {
      setError(data.error);
      setLoading(false);
      return;
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
        <div className="bg-blue-700 text-white text-center py-3 px-6">
          <h1 className="text-base font-bold">三花文化館盃學生導覽競賽</h1>
        </div>

        <div className="p-6">
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">請輸入學校代碼</label>
              <input
                type="text"
                value={account}
                onChange={e => setAccount(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">密碼</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="預設為承辦人手機號碼，可至資料編輯修改"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '登入中...' : '登入'}
            </button>
          </form>

          <div className="mt-4">
            <Link
              href="/register/school"
              className="w-full block text-center py-2 rounded text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
            >
              承辦人申請
            </Link>
            <p className="text-xs text-gray-500 mt-2 text-center">
              請由學校指定承辦人，擔任本競賽窗口。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
