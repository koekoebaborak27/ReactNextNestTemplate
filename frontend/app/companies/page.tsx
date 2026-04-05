'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

type Company = {
  id: number;
  name: string;
  address: string;
  contactName: string;
  createdAt: string;
};

export default function CompanyListPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCompanies = async (searchWord: string) => {
    try {
      const res = await api.get('/companies', {
        params: searchWord ? { search: searchWord } : {},
      });
      setCompanies(res.data);
    } catch {
      setError('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }
    fetchCompanies('');
  }, [router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetchCompanies(search);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">地図販売システム</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-red-500"
        >
          ログアウト
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-lg font-bold mb-4">契約会社一覧</h2>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="会社名で検索"
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            検索
          </button>
        </form>

        {loading && <p className="text-gray-500">読み込み中...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3">会社名</th>
                  <th className="text-left px-4 py-3">担当者名</th>
                  <th className="text-left px-4 py-3">住所</th>
                </tr>
              </thead>
              <tbody>
                {companies.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-gray-400">
                      該当する会社がありません
                    </td>
                  </tr>
                ) : (
                  companies.map((company) => (
                    <tr
                      key={company.id}
                      onClick={() => router.push(`/companies/${company.id}`)}
                      className="border-b hover:bg-blue-50 cursor-pointer"
                    >
                      <td className="px-4 py-3 text-blue-600 font-medium">
                        {company.name}
                      </td>
                      <td className="px-4 py-3">{company.contactName}</td>
                      <td className="px-4 py-3">{company.address}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
