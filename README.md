# ポケモンコレクション

ポケモンのコレクション管理アプリケーション。Nuxt 3 + Prisma + PostgreSQL で構築。

## セットアップ

依存関係のインストール:

```bash
yarn install
```

## 開発サーバー

開発サーバーを起動（http://localhost:3000）:

```bash
yarn dev
```

## データベース管理

### Prisma コマンド

```bash
# Prismaクライアントを生成
npx prisma generate

# マイグレーションを作成・実行
npx prisma migrate dev --name <migration_name>

# データベースの状態を確認（GUI）
npx prisma studio

# スキーマをデータベースに反映（マイグレーションなし）
npx prisma db push
```

### ポケモンデータの初期投入

```bash
# 第1世代（151匹）のデータを投入
npx tsx scripts/seed-pokemon.ts 1

# 第2世代のデータを投入
npx tsx scripts/seed-pokemon.ts 2

# データ投入状況を確認
npx tsx scripts/check-pokemon-data.ts
```

## テスト実行

### API パフォーマンステスト

```bash
# 開発サーバーを起動した状態で実行
npx tsx scripts/test-api-performance.ts
```

### 手動テスト

```bash
# 特定のポケモンデータを取得
curl http://localhost:3000/api/pokemon/25 | jq

# コレクション一覧を取得
curl http://localhost:3000/api/collection?userId=1 | jq

# コレクションに追加
curl -X POST http://localhost:3000/api/collection \
  -H "Content-Type: application/json" \
  -d '{"pokemonId": 25, "userId": 1}'
```

## ビルド & デプロイ

本番用ビルド:

```bash
yarn build
```

ビルドのプレビュー:

```bash
yarn preview
```

## コード品質

ESLint でコードをチェック:

```bash
yarn lint
```

## プロジェクト構造

```
pokemon-collection/
├── prisma/
│   ├── schema.prisma    # データベーススキーマ
│   └── migrations/      # マイグレーションファイル
├── server/
│   ├── api/            # APIエンドポイント
│   └── utils/          # サーバーユーティリティ
├── pages/              # ページコンポーネント
├── components/         # 共通コンポーネント
├── scripts/            # 管理用スクリプト
│   ├── seed-pokemon.ts # ポケモンデータ投入
│   └── check-pokemon-data.ts # データ確認
└── docs/               # ドキュメント
    └── SOW_*.md        # 機能別仕様書
```

## データベース構成

### Vercel Storage (Prisma Postgres)

本プロジェクトでは、Vercel Storage の Prisma Postgres を使用しています。

#### 環境変数の設定

```bash
# .env ファイル
DATABASE_URL="postgres://username:password@db.prisma.io:5432/?sslmode=require"
```

#### Vercel での設定手順

1. **Vercel Storage でデータベース作成**
   - Vercelプロジェクトの「Storage」タブ
   - 「Create Database」→「Postgres」を選択
   - データベース名とリージョンを設定

2. **環境変数の自動設定**
   - Vercel Storage 作成時に `DATABASE_URL` が自動設定される
   - 本番・プレビュー・開発環境すべてに適用

3. **ローカル開発での接続**
   - Vercel Storage の接続文字列を `.env` ファイルにコピー
   - `npx prisma db push` でスキーマを同期

#### データベース移行履歴

- **v1.0**: MySQL (ローカル環境)
- **v2.0**: PostgreSQL (Vercel Storage/Prisma Postgres) ← 現行

### 無料プランの制限

- **ストレージ**: 512MB まで
- **月間リクエスト**: 300万リクエスト
- **同時接続数**: 60接続
- **データ転送**: 5GB/月

## 開発メモ

- ポケモンデータは Prisma でキャッシュし、PokeAPI への依存を削減
- 開発時は`yarn dev`でホットリロードが有効
- Vercel Storage (Prisma Postgres) で本番運用
- ESLint でコード品質を維持（self-closingルールは無効化）

詳細な仕様は[Nuxt ドキュメント](https://nuxt.com/docs/getting-started/introduction)を参照。
