# 06 ログイン画面実装

## 手順1: 必要パッケージのインストール
- 実行コマンド：`npm install axios`
- 結果：成功
- 備考：

## 手順2: API通信の共通設定ファイルを作成
- 結果：成功
- 備考：`frontend/lib/api.ts` を新規作成。リクエストインターセプターで `localStorage` からトークンを取得し `Authorization` ヘッダーに自動付与する。

## 手順3: ログイン画面の作成
- 結果：成功
- 備考：`frontend/app/page.tsx` をデフォルトの Next.js テンプレートから上書き。ログイン成功後は `/companies` へリダイレクト。

## 手順4: バックエンドのポート設定
- 結果：成功
- 備考：`backend/src/main.ts` を上書き。ポートを 3001 に変更し、フロントエンド（localhost:3000）からのリクエストを許可する CORS 設定を追加した。

## 手順5: ビルド確認
- 実行コマンド：`npm run build`
- 結果：成功
- 備考：Next.js 16.2.2 (Turbopack) でエラーなくビルド完了。
