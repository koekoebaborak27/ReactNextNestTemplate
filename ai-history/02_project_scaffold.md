# 02 プロジェクト雛形作成

## 手順1: backendの作成
- 実行コマンド：`npx @nestjs/cli new backend --package-manager npm --skip-git`
- 結果：成功
- 備考：Node.js v21.6.1 はサポート外（推奨は ^18.19.1 || ^20.11.1 || >=22.0.0）のため WARN が出たが、インストール自体は正常完了。

## 手順2: frontendの作成
- 実行コマンド：`npx create-next-app@latest frontend --typescript --eslint --tailwind --app --no-src-dir --import-alias "@/*"`
- 結果：成功
- 備考：create-next-app v16.2.2 がインストールされた。Node.js バージョン不一致の WARN は出たが正常完了。`--no-src-dir` オプションはデフォルト扱いで処理された。

## 手順3: backendにPrismaをセットアップ
- 実行コマンド：
  1. `npm install prisma@6 @prisma/client@6`（Prisma v7 は Node.js v21 非対応のため v6 を使用）
  2. `npx prisma init --datasource-provider sqlite`
- 結果：成功
- 備考：最新の Prisma v7 は Node.js ^20.19 || ^22.12 || >=24.0 が必要。現環境の Node.js v21.6.1 では動作しないため、Node.js v18+ 対応の Prisma v6 をインストールした。

## 手順4: Prismaのスキーマ定義
- 実行コマンド：`backend/prisma/schema.prisma` を上書き編集
- 結果：成功
- 備考：`prisma init` が生成したデフォルト内容（`provider = "prisma-client"`）を、指定のスキーマ（User / Company / Contract / Invoice モデル）に上書きした。

## 手順5: マイグレーションの実行
- 実行コマンド：`npx prisma migrate dev --name init`
- 結果：成功
- 備考：`dev.db` が作成され、マイグレーション `20260404145040_init` が適用された。Prisma Client v6.19.3 が生成された。

## 手順6: decimal.jsのインストール
- 実行コマンド：`npm install decimal.js`
- 結果：成功
- 備考：Node.js バージョン不一致の WARN は出たが正常完了。
