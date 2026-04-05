'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';

type Contract = {
  id: number;
  mapType: string;
  quantity: number;
  royaltyRate: string;
  createdAt: string;
};

type Invoice = {
  id: number;
  amount: string;
  issuedAt: string;
  status: string;
  createdAt: string;
};

type Company = {
  id: number;
  name: string;
  address: string;
  contactName: string;
  createdAt: string;
  contracts: Contract[];
  invoices: Invoice[];
};

const statusLabel: Record<string, string> = {
  PENDING: '承認待ち',
  APPROVED: '承認済み',
  REJECTED: '却下',
};

const statusColor: Record<string, string> = {
  PENDING: 'text-yellow-600',
  APPROVED: 'text-green-600',
  REJECTED: 'text-red-600',
};

export default function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }

    api.get(`/companies/${id}`)
      .then((res) => setCompany(res.data))
      .catch(() => setError('データの取得に失敗しました'))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <p className="p-6 text-gray-500">読み込み中...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!company) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">地図販売システム</h1>
        <button
          onClick={() => router.push('/companies')}
          className="text-sm text-gray-600 hover:text-blue-500"
        >
          ← 一覧に戻る
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">

        {/* 会社情報 */}
        <section className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-bold mb-4">会社情報</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">会社名</dt>
              <dd className="font-medium">{company.name}</dd>
            </div>
            <div>
              <dt className="text-gray-500">担当者名</dt>
              <dd>{company.contactName}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-gray-500">住所</dt>
              <dd>{company.address}</dd>
            </div>
          </dl>
        </section>

        {/* 契約一覧 */}
        <section className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-bold mb-4">契約一覧</h2>
          {company.contracts.length === 0 ? (
            <p className="text-gray-400 text-sm">契約がありません</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3">地図種別</th>
                  <th className="text-left px-4 py-3">数量</th>
                  <th className="text-left px-4 py-3">印税率</th>
                </tr>
              </thead>
              <tbody>
                {company.contracts.map((contract) => (
                  <tr key={contract.id} className="border-b">
                    <td className="px-4 py-3">{contract.mapType}</td>
                    <td className="px-4 py-3">{contract.quantity.toLocaleString()}</td>
                    <td className="px-4 py-3">{contract.royaltyRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* 請求書一覧 */}
        <section className="bg-white rounded shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">請求書一覧</h2>
            <button
              onClick={() => router.push(`/companies/${id}/invoices/new`)}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              請求書を発行する
            </button>
          </div>
          {company.invoices.length === 0 ? (
            <p className="text-gray-400 text-sm">請求書がありません</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3">発行日</th>
                  <th className="text-left px-4 py-3">金額</th>
                  <th className="text-left px-4 py-3">ステータス</th>
                </tr>
              </thead>
              <tbody>
                {company.invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b">
                    <td className="px-4 py-3">
                      {new Date(invoice.issuedAt).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-4 py-3">
                      ¥{Number(invoice.amount).toLocaleString()}
                    </td>
                    <td className={`px-4 py-3 font-medium ${statusColor[invoice.status]}`}>
                      {statusLabel[invoice.status] ?? invoice.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

      </main>
    </div>
  );
}
