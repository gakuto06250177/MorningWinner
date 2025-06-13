# 朝活出席チェッカー (Morning Winner)

朝のGoogle Meet参加状況をチェックし、遅刻ペナルティを管理するWebアプリケーションです。

## 機能

- ✅ 4人のメンバー管理（名前は編集可能）
- ✅ 毎日の出席状況記録（出席/遅刻/休み/欠席）
- ✅ **正確なペナルティ計算**（遅刻者は出席者数×500円を支払う）
- ✅ 休みの日はペナルティ対象外
- ✅ 個人別総支払金額表示
- ✅ 日付選択機能（過去・未来の記録も可能）
- ✅ **LocalStorage/Supabase対応**（環境変数で切り替え）
- ✅ レスポンシブデザイン
- ✅ 見やすいUI（メンバー名や統計情報のコントラスト改善）

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データ保存**: LocalStorage または Supabase
- **デプロイ**: Vercel

## ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start
```

開発サーバー起動後、[http://localhost:3000](http://localhost:3000) でアプリケーションにアクセスできます。

## Vercelデプロイ

1. GitHub等にリポジトリをプッシュ
2. Vercelアカウントでリポジトリを連携
3. 自動デプロイが実行されます

または、Vercel CLIを使用：

```bash
npx vercel
```

## 使用方法

1. **メンバー名の設定**: メンバー名をクリックして編集
2. **出席記録**: 各メンバーの出席状況ボタンをクリック
3. **日付変更**: 上部の日付入力で過去・未来の記録を管理
4. **ペナルティ確認**: 下部のサマリーテーブルで個人別支払金額を確認

## Supabase設定（オプション）

複数端末でのデータ共有や永続的なデータ保存が必要な場合は、Supabaseを設定できます：

### 1. Supabaseプロジェクト作成
1. [Supabase](https://supabase.com/)でアカウント作成
2. 新しいプロジェクトを作成
3. データベースのパスワードを設定

### 2. データベースセットアップ
プロジェクトのSQL Editorで`supabase-schema.sql`の内容を実行：

```sql
-- src/supabase-schema.sqlの内容をコピー&ペースト
```

### 3. 環境変数設定
`.env.local`ファイルを更新：

```bash
# あなたのSupabaseプロジェクトの認証情報
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 設定確認
アプリケーション起動後、右上に「✓ Supabase連携」と表示されれば設定完了です。

## データについて

### LocalStorage版（デフォルト）
- 全てのデータはブラウザのLocalStorageに保存
- サーバーにデータは送信されないため、プライバシーが保護
- ブラウザデータを削除すると記録も削除される

### Supabase版（オプション）
- クラウドデータベースにデータを保存
- 複数端末からアクセス可能
- データのバックアップが自動的に行われる
- 複数ユーザーでの共有が可能

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。