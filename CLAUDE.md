# CLAUDE.md

## プロジェクト概要
地図データの印税（ロイヤリティ）計算・請求書発行業務システム。
VB.NET + Oracleで動いている既存システムのリプレイス。

## 技術構成
- フロントエンド：Next.js（TypeScript）
- バックエンド：NestJS（TypeScript）
- ORM：Prisma
- DB：SQLite（将来PostgreSQLに移行予定）
- 金額計算ライブラリ：decimal.js

## ディレクトリ構成
monorepo構成でfrontendとbackendを別ディレクトリで管理する。

root/
├── frontend/        # Next.js
├── backend/         # NestJS
├── docs/            # 設計書・マニュアル
├── ai-history/      # AI開発の軌跡（Claude Codeとのやり取りの記録）
└── CLAUDE.md

## 金額計算のルール（最重要）
- DBのカラムはDECIMAL型を使う。FLOAT型は誤差が出るため使用禁止。
- TypeScript側の計算は必ずdecimal.jsライブラリを使う。JavaScriptのnumber型で金額計算をしてはいけない。

## 命名規則
- DBのカラム名：スネークケース（例：created_at）
- TypeScriptの変数名：キャメルケース（例：createdAt）
- Reactコンポーネント名：パスカルケース（例：CompanyList）

## 請求書のビジネスルール
- 一度発行した請求書の金額は変更不可とする。
- 承認状態は以下の3種類で管理する。
  - PENDING（未承認）
  - APPROVED（承認済）
  - REJECTED（差し戻し）
- 印税計算ロジックはNestJSのサービスクラスに集約する。計算ロジックをコントローラーやフロントエンドに書いてはいけない。

## 認証のルール
- 認証にはJWT（JSON Web Token）を使う。
- パスワードはbcryptでハッシュ化してDBに保存する。平文で保存してはいけない。

## コーディングルール
- TypeScriptのany型の使用を禁止する。
- APIのレスポンスの型は必ずinterfaceまたはtypeで定義する。
- エラーハンドリングを必ず実装する。握りつぶしてはいけない。

## 将来の拡張予定
- PostgreSQLへのDB移行（Prismaのproviderをpostgresqlに変更するだけで対応できる構成にしておく）
- 承認フロー（担当者が作成 → 上長が承認 → 請求書発行）
