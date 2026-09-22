import { useState } from 'react'
import TagPicker from './TagPicker'

function MemoForm({ onAdd, allTags, onCreateTag }) {
  const [text, setText] = useState('')
  const [selectedTags, setSelectedTags] = useState([])

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const createAndSelectTag = (name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    onCreateTag(trimmed)
    setSelectedTags((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed, selectedTags)
    setText('')
    setSelectedTags([])
  }

  return (
    <form className="memo-form" onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="メモを入力..."
        rows={3}
      />
      <TagPicker
        options={allTags}
        selected={selectedTags}
        onToggle={toggleTag}
        onCreate={createAndSelectTag}
      />
      <button type="submit">追加</button>
    </form>
  )
}

export default MemoForm
