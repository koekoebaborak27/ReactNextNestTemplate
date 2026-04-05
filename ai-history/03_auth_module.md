# 03 認証モジュール実装

## 手順1: 必要パッケージのインストール
- 実行コマンド：
  1. `npm install @nestjs/jwt @nestjs/passport passport passport-local passport-jwt bcrypt`
  2. `npm install -D @types/passport-local @types/passport-jwt @types/bcrypt`
- 結果：成功
- 備考：Node.js バージョン不一致の WARN は出たが正常完了。

## 手順2: Prismaサービスの作成
- 実行コマンド：`backend/src/prisma.service.ts` を新規作成
- 結果：成功
- 備考：`PrismaClient` を継承し、`OnModuleInit` で DB 接続を初期化する実装。

## 手順3: Prismaモジュールの作成
- 実行コマンド：`backend/src/prisma.module.ts` を新規作成
- 結果：成功
- 備考：`@Global()` デコレータにより、他モジュールでのインポート不要で `PrismaService` を利用可能にした。

## 手順4: 認証モジュールのファイル群を作成
- 実行コマンド：以下5ファイルを新規作成
  - `backend/src/auth/auth.module.ts`
  - `backend/src/auth/auth.service.ts`
  - `backend/src/auth/auth.controller.ts`
  - `backend/src/auth/strategies/local.strategy.ts`
  - `backend/src/auth/strategies/jwt.strategy.ts`
- 結果：成功
- 備考：JWT の secret は環境変数 `JWT_SECRET` から取得し、未設定の場合は `'dev-secret'` をフォールバックとして使用。

## 手順5: AppModuleの更新
- 実行コマンド：`backend/src/app.module.ts` を上書き
- 結果：成功
- 備考：デフォルトの `AppController` / `AppService` を削除し、`PrismaModule` と `AuthModule` のみをインポートするシンプルな構成に変更した。

## 手順6: ビルド確認
- 実行コマンド：`npm run build`
- 結果：成功
- 備考：エラーなし。
