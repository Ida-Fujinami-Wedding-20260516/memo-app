import { useState } from 'react'

function MemoForm({ onAdd }) {
  const [text, setText] = useState('')
  const [tags, setTags] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed, tags)
    setText('')
    setTags('')
  }

  return (
    <form className="memo-form" onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="メモを入力..."
        rows={3}
      />
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="タグ（カンマ区切り）"
      />
      <button type="submit">追加</button>
    </form>
  )
}

export default MemoForm
