# 16 PostgreSQL移行手順

## 概要
開発環境のSQLiteから本番環境のPostgreSQLへ移行するための手順書です。
以下の作業が必要になります。

1. PostgreSQLのセットアップ
2. schema.prismaの変更
3. マイグレーションの再実行
4. seed.tsの修正
5. 環境変数の更新

---

## 注意事項

> **既存データについて**
> SQLiteのデータはPostgreSQLに自動移行されません。
> 本番運用中にデータがある場合は、別途データ移行作業が必要です。
> 開発環境の切り替えであればデータの移行は不要です。

---

## 手順

### 1. PostgreSQLのインストール（EC2の場合）
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. PostgreSQLのデータベースとユーザーの作成
```bash
sudo -u postgres psql
```

psqlのプロンプトで以下を実行してください。
```sql
CREATE DATABASE mapdb;
CREATE USER mapuser WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE mapdb TO mapuser;
\q
```

### 3. schema.prismaの変更
backend/prisma/schema.prismaの以下の2行を変更してください。

**変更前**
datasource db {
provider = "sqlite"
url      = "file:./dev.db"
}

**変更後**
datasource db {
provider = "postgresql"
url      = env("DATABASE_URL")
}

### 4. 環境変数の更新
backend/.envのDATABASE_URLを以下のように変更してください。

**変更前**
DATABASE_URL="file:./dev.db"

**変更後**
DATABASE_URL="postgresql://mapuser:your-password@localhost:5432/mapdb"

DATABASE_URLの書式は以下の通りです。
postgresql://ユーザー名:パスワード@ホスト名:ポート番号/データベース名

### 5. マイグレーションの再実行
```bash
cd backend
npx prisma migrate dev --name switch-to-postgresql
```

### 6. seed.tsのskipDuplicates修正
SQLite対応のためにskipDuplicatesを削除していた箇所を復活させます。
backend/prisma/seed.tsのcreateMany呼び出しに`skipDuplicates: true`を追記してください。

**変更前**
```typescript
await prisma.contract.createMany({
  data: [...],
});
```

**変更後**
```typescript
await prisma.contract.createMany({
  data: [...],
  skipDuplicates: true,
});
```

### 7. Prisma Clientの再生成
```bash
npx prisma generate
```

### 8. ビルドと動作確認
```bash
npm run build
npm run start:dev
```

ログイン画面が表示され、正常にログインできれば移行完了です。

---

## 移行後のチェックリスト

| 確認項目 | 結果 |
|---------|------|
| schema.prismaのproviderがpostgresqlになっている | |
| DATABASE_URLがPostgreSQL形式になっている | |
| マイグレーションがエラーなく完了している | |
| ビルドがエラーなく完了している | |
| ログインが正常にできる | |
| 会社一覧が表示される | |
| 請求書が発行できる | |

---

## トラブルシューティング

### データベースに接続できない場合
```bash
# PostgreSQLが起動しているか確認
sudo systemctl status postgresql

# 接続情報が正しいか確認
psql -U mapuser -d mapdb -h localhost
```

### マイグレーションが失敗する場合
既存のマイグレーション履歴とPostgreSQLの型が合わない場合があります。
以下を実行してマイグレーションをリセットしてください。
```bash
npx prisma migrate reset
npx prisma migrate dev --name init
```

> **注意**
> `migrate reset`を実行するとDBのデータがすべて削除されます。
> 本番環境では絶対に実行しないでください。

### Node.jsのバージョンアップとPrisma v7への移行
PostgreSQL移行のタイミングでNode.jsもv22以上にアップグレードした場合は、
合わせてPrismaもv7に上げることを推奨します。
```bash
npm install prisma@latest @prisma/client@latest
npx prisma generate
```
