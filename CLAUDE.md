# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server (default http://localhost:5173)
- `npm run build` — production build (output to `dist/`)
- `npm run preview` — serve the production build locally
- `npm run lint` — lint with oxlint (rules in `.oxlintrc.json`)

There is no test runner configured yet.

## Architecture

Minimal Vite + React (plain JS, not TypeScript) scaffold, cleaned of the default Vite starter demo content.

- `src/main.jsx` — entry point, mounts `<App />` into `#root` under `StrictMode`.
- `src/App.jsx` — owns all memo state (`memos`, `query`, `activeTag`) and the derived `allTags`/`filteredMemos` (`useMemo`). Persists `memos` to `localStorage` under the key `memo-app:memos` on every change (see `loadMemos`/`useEffect`). `loadMemos` back-fills `tags`/`updatedAt` for memos saved by older versions of the app, so the storage schema can gain fields without a migration step. `parseTags` turns a comma-separated string into a deduped tag array — the single place tag parsing happens (used for both create and update).
- `src/components/MemoForm.jsx` — create form (text + comma-separated tags).
- `src/components/SearchBar.jsx` — free-text search input plus a tag-filter button row derived from `allTags`; clicking the active tag again clears the filter.
- `src/components/MemoList.jsx` — renders filtered memos, delegating each row to `MemoItem`.
- `src/components/MemoItem.jsx` — one memo's display state; owns its own `isEditing` local state and switches between read view and an inline edit form (text + tags) that calls back up to `App`'s `updateMemo`.
- `src/App.css` / `src/index.css` — global and app-level styles, no CSS framework in use.
- `vite.config.js` — standard Vite config using `@vitejs/plugin-react`.

Data flows one-directionally from `App` down (memos, filtered results, callbacks); child components never touch `localStorage` directly. No routing or external state-management library — state is small enough that `useState`/`useMemo` in `App` is sufficient. No backend — all persistence is client-side `localStorage`.
