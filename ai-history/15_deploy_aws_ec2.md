# 15 本番デプロイ手順（AWS EC2）

## 概要
本システムをAWS EC2上にデプロイするための手順書です。
以下の構成でデプロイします。
ブラウザ
↓ HTTPS
Nginx（リバースプロキシ）
↓ /api/*        ↓ /*
NestJS:3001    Next.js:3000
↓
SQLite（またはPostgreSQL）

---

## 前提条件

- AWSアカウントを持っている
- EC2インスタンスが作成済みである
- OSはUbuntu 22.04 LTSを想定している
- ドメインは取得済みである（HTTPS化に必要）

---

## 推奨スペック

| 項目 | 推奨値 |
|------|--------|
| インスタンスタイプ | t3.small以上 |
| ストレージ | 20GB以上 |
| OS | Ubuntu 22.04 LTS |

---

## 手順

### 1. EC2インスタンスへの接続
```bash
ssh -i your-key.pem ubuntu@<EC2のIPアドレス>
```

### 2. 基本パッケージのインストール
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl unzip nginx
```

### 3. Node.jsのインストール
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v  # v22以上であることを確認
npm -v
```

### 4. PM2のインストール
PM2はNode.jsアプリをバックグラウンドで常時起動し続けるためのツールです。
サーバーが再起動しても自動的にアプリを起動し直してくれます。
```bash
sudo npm install -g pm2
```

### 5. プロジェクトファイルの配置
ローカルのプロジェクト一式をEC2に転送してください。
```bash
# ローカルのターミナルで実行
scp -i your-key.pem -r ./プロジェクトフォルダ ubuntu@<EC2のIPアドレス>:/home/ubuntu/app
```

### 6. バックエンドのセットアップ
```bash
cd /home/ubuntu/app/backend

# パッケージのインストール（開発用を除く）
npm install --omit=dev

# 環境変数の設定
cp .env.example .env
nano .env
```

.envに以下を設定してください。

| 変数名 | 設定値 |
|--------|--------|
| JWT_SECRET | 長いランダムな文字列（必ず変更すること） |
| DATABASE_URL | file:./dev.db |
| PORT | 3001 |
| FRONTEND_URL | https://your-domain.com |
```bash
# マイグレーションの実行
npx prisma migrate deploy

# ビルド
npm run build

# PM2で起動
pm2 start dist/main.js --name backend
```

> **注意**
> 本番環境では `npx prisma db seed` は実行しないでください。
> テスト用ダミーデータが本番DBに投入されてしまいます。

### 7. フロントエンドのセットアップ
```bash
cd /home/ubuntu/app/frontend

# 環境変数の設定
cp .env.example .env.local
nano .env.local
```

.env.localに以下を設定してください。

| 変数名 | 設定値 |
|--------|--------|
| NEXT_PUBLIC_API_URL | https://your-domain.com/api |
```bash
# パッケージのインストール
npm install --omit=dev

# ビルド
npm run build

# PM2で起動
pm2 start npm --name frontend -- start
```

### 8. PM2の自動起動設定
サーバー再起動時にPM2が自動起動するよう設定します。
```bash
pm2 startup
# 表示されたコマンドをコピーして実行する

pm2 save
```

### 9. Nginxの設定
```bash
sudo nano /etc/nginx/sites-available/mapapp
```

以下の内容を貼り付けてください。
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # フロントエンド
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # バックエンドAPI（/api/以下をNestJSに転送）
    location /api/ {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
```bash
# 設定を有効化
sudo ln -s /etc/nginx/sites-available/mapapp /etc/nginx/sites-enabled/
sudo nginx -t        # 設定ファイルの文法チェック
sudo systemctl restart nginx
```

### 10. HTTPS化（SSL証明書の取得）
Let's Encryptを使って無料でHTTPS化します。
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

指示に従って入力すると、自動的にNginxの設定がHTTPS対応に更新されます。

---

## 動作確認

ブラウザで `https://your-domain.com` を開いてログイン画面が表示されれば完了です。

---

## PM2の主なコマンド

| コマンド | 説明 |
|---------|------|
| `pm2 list` | 起動中のアプリ一覧を表示 |
| `pm2 logs` | ログを表示 |
| `pm2 restart backend` | バックエンドを再起動 |
| `pm2 restart frontend` | フロントエンドを再起動 |
| `pm2 stop all` | 全アプリを停止 |

---

## トラブルシューティング

### アプリが起動しない場合
```bash
pm2 logs backend   # バックエンドのログを確認
pm2 logs frontend  # フロントエンドのログを確認
```

### Nginxが起動しない場合
```bash
sudo nginx -t                  # 設定ファイルの文法チェック
sudo systemctl status nginx    # Nginxの状態を確認
```

### ポートが使用中の場合
```bash
sudo lsof -i :3000   # 3000番ポートを使っているプロセスを確認
sudo lsof -i :3001   # 3001番ポートを使っているプロセスを確認
```
