# 10 シードデータ投入

## 手順1: シードスクリプトの作成
- 結果：成功
- 備考：`backend/prisma/seed.ts` を新規作成。

## 手順2: package.jsonにseedコマンドを追加
- 結果：成功
- 備考：`scripts` に `"seed": "ts-node prisma/seed.ts"` を追加。トップレベルに `"prisma": { "seed": "ts-node prisma/seed.ts" }` を追加。なお `ts-node` は NestJS プロジェクト生成時に `devDependencies` に既に含まれていたため、手順3のインストールは不要だった。

## 手順3: ts-nodeのインストール
- 実行コマンド：`npm install -D ts-node`
- 結果：成功
- 備考：`ts-node@10.9.2` は NestJS 生成時に既にインストール済みだったため、追加パッケージのインストールは発生しなかった。

## 手順4: シードの実行
- 実行コマンド：`npx prisma db seed`
- 結果：成功（1回目はエラー、修正後に成功）
- 備考：
  - 1回目のエラー原因：`createMany` の `skipDuplicates: true` は SQLite 非対応（PostgreSQL/MySQL のみ）のため TypeScript エラー `Type 'true' is not assignable to type 'never'` が発生。該当オプションを削除して再実行したところ成功した。
  - `package.json#prisma` キーは Prisma v7 で廃止予定の WARN が出たが、動作に問題はない。将来的には `prisma.config.ts` への移行が必要。

## 確認結果
- 実行コマンド：`node -e` で Prisma Client を使い各テーブルのレコード数を確認
- 結果：
  - users: 1件（admin@example.com）
  - companies: 2件（株式会社地図太郎、有限会社マップ商事）
  - contracts: 3件（道路地図・観光地図・住宅地図）
  - invoices: 0件（初期状態）
- 備考：期待通りのデータが投入されていることを確認した。
