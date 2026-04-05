# 01 プロジェクトセットアップ

## 概要
プロジェクトの雛形作成とPrismaのセットアップを行う。

## 実施内容

### 技術構成
- フロントエンド：Next.js（TypeScript）
- バックエンド：NestJS（TypeScript）
- ORM：Prisma
- DB：SQLite（将来PostgreSQLに移行予定）
- 金額計算ライブラリ：decimal.js

### 作成するテーブル
- users（ユーザー）
- companies（契約会社）
- contracts（契約）
- invoices（請求書）

### ディレクトリ構成の決定
- monorepo構成（frontend / backend を別ディレクトリで管理）
- docs/ に設計書・マニュアルを置く
- ai-history/ にAI開発の軌跡を置く
- フォルダ名はkebab-caseで統一

### Prismaの設定方針
- 最初はSQLiteで動作させる
- PostgreSQLに移行する場合はschema.prismaの以下2行を変更するだけでよい
  - provider = "sqlite" → "postgresql"
  - url = "file:./dev.db" → env("DATABASE_URL")

## 使用するコマンド
```bash
# NestJSプロジェクト作成
nest new backend --package-manager npm

# Next.jsプロジェクト作成
npx create-next-app@latest frontend --typescript --eslint --tailwind --app --no-src-dir --import-alias "@/*"

# Prismaセットアップ
npm install prisma @prisma/client
npx prisma init --datasource-provider sqlite
npx prisma migrate dev --name init

# decimal.jsインストール
npm install decimal.js
```

## 決定事項・メモ
- JavaScriptのnumber型では金額計算に誤差が出るためdecimal.jsを使う
- 一度発行した請求書の金額は変更不可にする
- 承認状態はPENDING / APPROVED / REJECTEDの3種類
- 印税計算ロジックはNestJSのサービスクラスに集約する
