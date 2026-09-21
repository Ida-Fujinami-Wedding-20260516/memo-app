# memo-app

React (Vite) で作成するメモアプリ。データはブラウザの `localStorage` に保存され、バックエンドはありません。

## 機能

- メモの作成・編集・削除
- カンマ区切りのタグ付け、タグによる絞り込み
- フリーワード検索

## セットアップ

```bash
npm install
npm run dev
```

## コマンド

- `npm run dev` — 開発サーバーを起動 (http://localhost:5173)
- `npm run build` — 本番用ビルド (`dist/` に出力)
- `npm run preview` — 本番ビルドをローカルで確認
- `npm run lint` — oxlint によるリント
