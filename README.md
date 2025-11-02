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

## CSS Architecture

このプロジェクトでは、**Tailwind v4 Design Tokens** を活用した保守性の高いCSS設計を採用しています。

### 設計方針

- **YAGNI原則**: 使用中のトークンとクラスのみを実装
- **読み込み順序の最適化**: Design Tokens → Tailwind → Components の順で読み込み
- **コンポーネント指向**: 各UIパーツを独立したCSSファイルで管理

### ファイル構造

```
assets/css/
├── tokens/              # Design Tokens (CSS変数)
│   ├── _spacing.css     # 間隔・境界半径
│   ├── _colors.css      # カラーパレット・タイプカラー
│   ├── _components.css  # コンポーネントトークン
│   └── index.css        # トークンのエントリーポイント
├── components/          # コンポーネント固有のスタイル
│   ├── _button.css      # ボタンコンポーネント (.btn)
│   ├── _nav.css         # ナビゲーション (.navigation)
│   ├── _pokemon-card.css # ポケモンカード (.pokemon-card)
│   └── _type-badge.css  # タイプバッジ (.type-badge, .type-*)
└── main.css             # メインエントリーポイント
```

### Design Tokens

#### Spacing Tokens
- `--radius-md`: 標準の角丸半径

#### Color Tokens
- `--gbc-green-*`: ゲームボーイカラー風パレット（4色）
- `--color-primary-*`: プライマリカラー
- `--color-gray-*`: グレースケール（5段階）
- `--type-*`: ポケモンタイプカラー（18タイプ）

#### Component Tokens
- `--transition-*`: アニメーション速度
- `--btn-*`: ボタン専用トークン

### 主要コンポーネント

#### Button (`.btn`)
```html
<NuxtLink to="/" class="btn">ポケモン図鑑</NuxtLink>
```
Design Tokensを使用した統一的なボタンスタイル。

#### Pokemon Card (`.pokemon-card`)
```html
<div class="pokemon-card" :data-type="pokemon.types[0]?.type.name">
  <div class="pokemon-card-inner">
    <!-- カードコンテンツ -->
  </div>
</div>
```
タイプ別の背景グラデーション、ホバーエフェクト、キラキラアニメーションを実装。

#### Type Badge (`.type-badge` + `.type-*`)
```html
<span class="type-badge type-fire">ほのお</span>
```
ポケモンタイプを表示するバッジ。18タイプすべてに対応。

### 拡張方法

#### 新しいトークンの追加
1. 適切なトークンファイル (`_colors.css`, `_spacing.css` など) に変数を追加
2. `:root` 内でCSS変数として定義

#### 新しいコンポーネントの追加
1. `assets/css/components/` に新しいファイルを作成
2. コンポーネントクラスを直接定義（`@layer`は不要）
3. `main.css` でインポート

### 設計上の注意点

- コンポーネントはTailwind読み込み後にインポートすることで優先度を確保
- Scoped CSSと組み合わせて使用可能
- Design Tokensを活用して一貫性を保つ

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
