# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code (claude.ai/code) にガイダンスを提供します。

## コマンド

- `npm run dev` — Vite の開発サーバーを起動 (デフォルト http://localhost:5173)
- `npm run build` — 本番ビルド (`dist/` に出力)
- `npm run preview` — 本番ビルドをローカルで配信
- `npm run lint` — oxlint でリント (ルールは `.oxlintrc.json`)

テストランナーはまだ設定されていません。

## アーキテクチャ

最小構成の Vite + React (TypeScript ではなくプレーンな JS) スキャフォールドで、Vite のデフォルトのスターターデモの内容は削除済みです。

- `src/main.jsx` — エントリーポイント。`StrictMode` 配下で `<App />` を `#root` にマウントする。
- `src/App.jsx` — メモの状態 (`memos`, `query`, `activeTag`) と、そこから導出される `allTags`/`filteredMemos` (`useMemo`) を一括管理する。変更のたびに `memos` を `localStorage` のキー `memo-app:memos` に永続化する (`loadMemos`/`useEffect` を参照)。`loadMemos` は旧バージョンで保存されたメモに `tags`/`updatedAt` を補完するため、マイグレーション処理なしでストレージのスキーマにフィールドを追加できる。`parseTags` はカンマ区切りの文字列を重複排除したタグ配列に変換する唯一の箇所 (作成・更新の両方で使用)。
- `src/components/MemoForm.jsx` — 作成フォーム (本文 + カンマ区切りのタグ)。
- `src/components/SearchBar.jsx` — フリーワード検索の入力欄と、`allTags` から導出されるタグ絞り込みボタン列。アクティブなタグを再度クリックすると絞り込みが解除される。
- `src/components/MemoList.jsx` — 絞り込み後のメモを描画し、各行の表示は `MemoItem` に委譲する。
- `src/components/MemoItem.jsx` — 1件のメモの表示状態を管理する。自身の `isEditing` ローカル状態を持ち、閲覧表示とインライン編集フォーム (本文 + タグ) を切り替える。編集内容は `App` の `updateMemo` に対してコールバックされる。
- `src/App.css` / `src/index.css` — グローバル/アプリレベルのスタイル。CSS フレームワークは未使用。
- `vite.config.js` — `@vitejs/plugin-react` を使った標準的な Vite 設定。

データは `App` から子コンポーネントへ一方向に流れる (メモ、絞り込み結果、コールバック)。子コンポーネントが直接 `localStorage` に触れることはない。ルーティングや外部の状態管理ライブラリは使用しておらず、状態は `App` 内の `useState`/`useMemo` で十分な規模。バックエンドはなく、永続化はすべてクライアント側の `localStorage` で行う。
