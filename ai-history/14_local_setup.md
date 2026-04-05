# 14 ローカル環境実行手順

## 概要
新しくプロジェクトに参加したメンバーが、ローカル環境でシステムを
動かせるようになるまでの手順書です。

---

## 必要な環境

| ツール | 推奨バージョン | 確認コマンド |
|--------|--------------|-------------|
| Node.js | v20.19以上 または v22.12以上 | `node -v` |
| npm | v10以上 | `npm -v` |

> **注意**
> 本プロジェクトはNode.js v21.6.1 + Prisma v6で開発・動作確認済みです。
> Node.jsをv20.19以上にアップグレードした場合はPrismaもv7に上げることを検討してください。

---

## 手順

### 1. リポジトリの取得
プロジェクトのファイル一式を受け取り、任意のフォルダに配置してください。

### 2. 環境変数ファイルの作成

**バックエンド**
```bash
cd backend
cp .env.example .env
```
`.env`を開いて以下を設定してください。

| 変数名 | 設定値 | 説明 |
|--------|--------|------|
| JWT_SECRET | 任意の文字列 | JWT署名キー（開発環境では何でも可） |
| DATABASE_URL | file:./dev.db | SQLiteのパス（そのままでOK） |
| PORT | 3001 | バックエンドのポート番号 |
| FRONTEND_URL | http://localhost:3000 | フロントエンドのURL |

**フロントエンド**
```bash
cd frontend
cp .env.example .env.local
```
`.env.local`を開いて以下を設定してください。

| 変数名 | 設定値 | 説明 |
|--------|--------|------|
| NEXT_PUBLIC_API_URL | http://localhost:3001 | バックエンドのURL |

### 3. バックエンドのセットアップ
```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
```

| コマンド | 説明 |
|---------|------|
| npm install | 必要なパッケージをインストールする |
| npx prisma migrate dev | DBのテーブルを作成する |
| npx prisma db seed | テスト用データを投入する |

### 4. フロントエンドのセットアップ
```bash
cd frontend
npm install
```

### 5. 起動

**ターミナル1（バックエンド）**
```bash
cd backend
npm run start:dev
```
以下のメッセージが表示されれば起動成功です。
Application is running on: http://localhost:3001

**ターミナル2（フロントエンド）**
```bash
cd frontend
npm run dev
```
以下のメッセージが表示されれば起動成功です。
Local: http://localhost:3000

### 6. ブラウザで確認
http://localhost:3000 を開いてログイン画面が表示されれば完了です。

**テスト用ログイン情報**

| 項目 | 値 |
|------|----|
| メールアドレス | admin@example.com |
| パスワード | password123 |

---

## ディレクトリ構成
root/
├── frontend/        # Next.js（TypeScript）
├── backend/         # NestJS（TypeScript）
│   └── prisma/
│       ├── schema.prisma  # テーブル定義
│       ├── seed.ts        # テストデータ投入スクリプト
│       └── dev.db         # SQLiteのDBファイル
├── docs/            # 設計書・マニュアル
├── ai-history/      # AI開発の軌跡
└── CLAUDE.md        # AI向けプロジェクト説明書

---

## トラブルシューティング

### `npx prisma migrate dev` でエラーになる場合
既存のdev.dbが壊れている可能性があります。以下を実行してください。
```bash
rm prisma/dev.db
npx prisma migrate dev
```

### `npx prisma db seed` でエラーになる場合
ts-nodeがインストールされているか確認してください。
```bash
npm install -D ts-node
npx prisma db seed
```

### ログインできない場合
シードデータが正しく投入されているか確認してください。
```bash
npx prisma studio
```
ブラウザが開いたらUsersテーブルに`admin@example.com`が存在するか確認してください。
存在しない場合は再度シードを実行してください。
```bash
npx prisma db seed
```
