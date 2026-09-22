import { useEffect, useMemo, useState } from 'react'
import MemoForm from './components/MemoForm'
import MemoList from './components/MemoList'
import SearchBar from './components/SearchBar'
import './App.css'

const STORAGE_KEY = 'memo-app:memos'
const TAGS_STORAGE_KEY = 'memo-app:tags'

function loadMemos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return parsed.map((memo) => ({ tags: [], updatedAt: memo.createdAt, ...memo }))
  } catch {
    return []
  }
}

function loadTags(memos) {
  let saved = []
  try {
    const raw = localStorage.getItem(TAGS_STORAGE_KEY)
    saved = raw ? JSON.parse(raw) : []
  } catch {
    saved = []
  }
  const fromMemos = memos.flatMap((memo) => memo.tags)
  return [...new Set([...saved, ...fromMemos])].sort()
}

function App() {
  const [memos, setMemos] = useState(loadMemos)
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState(null)
  const [allTags, setAllTags] = useState(() => loadTags(memos))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos))
  }, [memos])

  useEffect(() => {
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(allTags))
  }, [allTags])

  const filteredMemos = useMemo(() => {
    const q = query.trim().toLowerCase()
    return memos.filter((memo) => {
      const matchesQuery = !q || memo.text.toLowerCase().includes(q)
      const matchesTag = !activeTag || memo.tags.includes(activeTag)
      return matchesQuery && matchesTag
    })
  }, [memos, query, activeTag])

  const createTag = (name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setAllTags((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed].sort()))
  }

  const addMemo = (text, tags) => {
    const now = Date.now()
    const memo = {
      id: crypto.randomUUID(),
      text,
      tags,
      createdAt: now,
      updatedAt: now,
    }
    setMemos((prev) => [memo, ...prev])
  }

  const updateMemo = (id, text, tags) => {
    setMemos((prev) =>
      prev.map((memo) => (memo.id === id ? { ...memo, text, tags, updatedAt: Date.now() } : memo))
    )
  }

  const deleteMemo = (id) => {
    setMemos((prev) => prev.filter((memo) => memo.id !== id))
  }

  const removeTag = (id, tag) => {
    setMemos((prev) =>
      prev.map((memo) =>
        memo.id === id
          ? { ...memo, tags: memo.tags.filter((t) => t !== tag), updatedAt: Date.now() }
          : memo
      )
    )
  }

  return (
    <div id="app">
      <h1>Memo App</h1>
      <MemoForm onAdd={addMemo} allTags={allTags} onCreateTag={createTag} />
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        tags={allTags}
        activeTag={activeTag}
        onTagChange={setActiveTag}
      />
      <MemoList
        memos={filteredMemos}
        onUpdate={updateMemo}
        onDelete={deleteMemo}
        onRemoveTag={removeTag}
        allTags={allTags}
      />
    </div>
  )
}

export default App
