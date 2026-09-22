import { useEffect, useMemo, useState } from 'react'
import MemoForm from './components/MemoForm'
import MemoList from './components/MemoList'
import SearchBar from './components/SearchBar'
import './App.css'

const STORAGE_KEY = 'memo-app:memos'

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

function parseTags(input) {
  return [...new Set(
    input
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  )]
}

function App() {
  const [memos, setMemos] = useState(loadMemos)
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos))
  }, [memos])

  const allTags = useMemo(() => {
    const tags = new Set()
    memos.forEach((memo) => memo.tags.forEach((tag) => tags.add(tag)))
    return [...tags].sort()
  }, [memos])

  const filteredMemos = useMemo(() => {
    const q = query.trim().toLowerCase()
    return memos.filter((memo) => {
      const matchesQuery = !q || memo.text.toLowerCase().includes(q)
      const matchesTag = !activeTag || memo.tags.includes(activeTag)
      return matchesQuery && matchesTag
    })
  }, [memos, query, activeTag])

  const addMemo = (text, tagsInput) => {
    const now = Date.now()
    const memo = {
      id: crypto.randomUUID(),
      text,
      tags: parseTags(tagsInput),
      createdAt: now,
      updatedAt: now,
    }
    setMemos((prev) => [memo, ...prev])
  }

  const updateMemo = (id, text, tagsInput) => {
    setMemos((prev) =>
      prev.map((memo) =>
        memo.id === id
          ? { ...memo, text, tags: parseTags(tagsInput), updatedAt: Date.now() }
          : memo
      )
    )
  }

  const deleteMemo = (id) => {
    setMemos((prev) => prev.filter((memo) => memo.id !== id))
  }

  const addTag = (id, tag) => {
    const trimmed = tag.trim()
    if (!trimmed) return
    setMemos((prev) =>
      prev.map((memo) =>
        memo.id === id && !memo.tags.includes(trimmed)
          ? { ...memo, tags: [...memo.tags, trimmed], updatedAt: Date.now() }
          : memo
      )
    )
  }

  return (
    <div id="app">
      <h1>Memo App</h1>
      <MemoForm onAdd={addMemo} />
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
        onAddTag={addTag}
      />
    </div>
  )
}

export default App
