# 09 請求書発行画面実装

## 手順1: 請求書発行画面の作成
- 結果：成功
- 備考：`frontend/app/companies/[id]/invoices/new/page.tsx` を新規作成。契約セレクトボックスと単価入力欄から印税額プレビューをリアルタイム表示。確定計算はサーバー側（decimal.js）に委ねる旨を注記した。

## 手順2: ビルド確認
- 実行コマンド：`npm run build`
- 結果：成功
- 備考：Next.js 16.2.2 (Turbopack) でエラーなくビルド完了。`/companies/[id]/invoices/new` が Dynamic ルートとして生成されていることを確認。
