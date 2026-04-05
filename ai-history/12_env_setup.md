# 12 環境変数の管理

## 手順1: バックエンドの.envファイル作成
- 結果：成功
- 備考：`prisma init` が生成した既存の `.env`（`DATABASE_URL` のみ）を上書きし、`JWT_SECRET`・`PORT`・`FRONTEND_URL` を追加した。

## 手順2: バックエンドの.env.exampleファイル作成
- 結果：成功
- 備考：値を空にしたテンプレートを新規作成。

## 手順3: バックエンドのmain.tsを環境変数対応に更新
- 結果：成功
- 備考：CORS の origin と listen ポートをハードコードから環境変数（`FRONTEND_URL`・`PORT`）参照に変更した。

## 手順4: フロントエンドの.env.localファイル作成
- 結果：成功
- 備考：`NEXT_PUBLIC_` プレフィックスにより Next.js がブラウザ側でも参照できる環境変数として設定。

## 手順5: フロントエンドの.env.exampleファイル作成
- 結果：成功
- 備考：`.env.local` と同内容のテンプレートを新規作成。

## 手順6: フロントエンドのAPI設定ファイルを環境変数対応に更新
- 結果：成功
- 備考：`baseURL` をハードコードから `process.env.NEXT_PUBLIC_API_URL` 参照に変更した。

## 手順7: .gitignoreの確認と更新
- 結果：成功
- 備考：
  - backend: `.env` は既に記載済み。`prisma/dev.db` と `prisma/migrations/` を追記した。
  - frontend: `.env*` が既に記載されており `.env.local` / `.env*.local` を網羅しているため追記不要。

## 手順8: ビルド確認
- 実行コマンド：backend `npm run build`、frontend `npm run build`
- 結果：両方とも成功
- 備考：フロントエンドのビルドログに `Environments: .env.local` と表示され、環境変数ファイルが正しく読み込まれていることを確認した。
