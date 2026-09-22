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
- `src/App.jsx` — メモの状態 (`memos`, `query`, `activeTag`) と、タグの状態 (`allTags`) を一括管理する。`memos` と `allTags` はそれぞれ独立して `localStorage` のキー `memo-app:memos` / `memo-app:tags` に永続化される (`loadMemos`/`loadTags`/`useEffect` を参照)。タグはメモから導出されるのではなく独立したエンティティであり、`createTag` で明示的に作成する。メモから使われなくなっても一覧に残り続ける。`loadMemos` は旧バージョンで保存されたメモに `tags`/`updatedAt` を補完し、`loadTags` は初回読み込み時に既存メモが使っているタグを独立タグ一覧に取り込む。`parseTags` はカンマ区切りの文字列を重複排除したタグ配列に変換する箇所 (一括編集フォームの保存時に使用。パース結果は `createTag` 経由で独立タグ一覧にも登録される)。
- `src/components/MemoForm.jsx` — 作成フォーム。本文に加え、`TagPicker` で既存タグから選択、または新規タグを作成してその場で選択状態にできる。
- `src/components/TagPicker.jsx` — 既存タグのトグルボタン列と新規タグ作成欄を持つ共通コンポーネント。`MemoForm` (作成前の選択) と `MemoItem` (作成済みメモへの付与) の両方から使われる。ネストした `<form>` を避けるため送信はボタンクリック/Enterキーで行う。
- `src/components/SearchBar.jsx` — フリーワード検索の入力欄と、`allTags` から導出されるタグ絞り込みボタン列。アクティブなタグを再度クリックすると絞り込みが解除される。
- `src/components/MemoList.jsx` — 絞り込み後のメモを描画し、各行の表示は `MemoItem` に委譲する。
- `src/components/MemoItem.jsx` — 1件のメモの表示状態を管理する。自身の `isEditing` ローカル状態を持ち、閲覧表示とインライン編集フォーム (本文 + カンマ区切りのタグ) を切り替える。編集内容は `App` の `updateMemo` に対してコールバックされる。閲覧表示では各タグに削除ボタン (`onRemoveTag`) があり、未付与の既存タグを選ぶ/新規作成して付与する `TagPicker` (`onAddTag`) も表示する。
- `src/App.css` / `src/index.css` — グローバル/アプリレベルのスタイル。CSS フレームワークは未使用。
- `vite.config.js` — `@vitejs/plugin-react` を使った標準的な Vite 設定。

データは `App` から子コンポーネントへ一方向に流れる (メモ、タグ、絞り込み結果、コールバック)。子コンポーネントが直接 `localStorage` に触れることはない。ルーティングや外部の状態管理ライブラリは使用しておらず、状態は `App` 内の `useState`/`useMemo` で十分な規模。バックエンドはなく、永続化はすべてクライアント側の `localStorage` で行う。
