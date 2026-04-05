'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';

type Contract = {
  id: number;
  mapType: string;
  quantity: number;
  royaltyRate: string;
};

export default function NewInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContractId, setSelectedContractId] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }

    api.get(`/companies/${companyId}`)
      .then((res) => {
        setContracts(res.data.contracts);
        if (res.data.contracts.length > 0) {
          setSelectedContractId(String(res.data.contracts[0].id));
        }
      })
      .catch(() => setError('データの取得に失敗しました'))
      .finally(() => setLoading(false));
  }, [companyId, router]);

  // 選択中の契約を取得
  const selectedContract = contracts.find(
    (c) => c.id === Number(selectedContractId)
  );

  // 印税額のプレビュー計算（表示用のみ・number型で概算）
  const previewAmount = selectedContract && unitPrice
    ? Math.round(selectedContract.quantity * Number(unitPrice) * Number(selectedContract.royaltyRate))
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContractId || !unitPrice) return;
    setError('');
    setSubmitting(true);

    try {
      await api.post(`/companies/${companyId}/invoices`, {
        contractId: Number(selectedContractId),
        unitPrice: unitPrice,
      });
      router.push(`/companies/${companyId}`);
    } catch {
      setError('請求書の発行に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">読み込み中...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">地図販売システム</h1>
        <button
          onClick={() => router.push(`/companies/${companyId}`)}
          className="text-sm text-gray-600 hover:text-blue-500"
        >
          ← 会社詳細に戻る
        </button>
      </header>

      <main className="max-w-lg mx-auto p-6">
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-bold mb-6">請求書発行</h2>

          {contracts.length === 0 ? (
            <p className="text-gray-400 text-sm">契約がないため請求書を発行できません</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* 契約選択 */}
              <div>
                <label className="block text-sm font-medium mb-1">契約を選択</label>
                <select
                  value={selectedContractId}
                  onChange={(e) => setSelectedContractId(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {contracts.map((contract) => (
                    <option key={contract.id} value={contract.id}>
                      {contract.mapType}（数量: {contract.quantity.toLocaleString()}、印税率: {contract.royaltyRate}%）
                    </option>
                  ))}
                </select>
              </div>

              {/* 単価入力 */}
              <div>
                <label className="block text-sm font-medium mb-1">単価（円）</label>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  placeholder="例: 1000"
                  min="1"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* 印税額プレビュー */}
              {previewAmount !== null && (
                <div className="bg-blue-50 rounded p-4 text-sm">
                  <p className="text-gray-600">印税額（概算）</p>
                  <p className="text-2xl font-bold text-blue-700">
                    ¥{previewAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    ※確定金額はサーバー側でdecimal.jsを使って正確に計算されます
                  </p>
                </div>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? '発行中...' : '請求書を発行する'}
              </button>

            </form>
          )}
        </div>
      </main>
    </div>
  );
}
