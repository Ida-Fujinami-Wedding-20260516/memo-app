import { useState } from 'react'

function MemoItem({ memo, onUpdate, onDelete, onAddTag }) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(memo.text)
  const [tags, setTags] = useState(memo.tags.join(', '))
  const [newTag, setNewTag] = useState('')

  const submitNewTag = (e) => {
    e.preventDefault()
    onAddTag(memo.id, newTag)
    setNewTag('')
  }

  const startEdit = () => {
    setText(memo.text)
    setTags(memo.tags.join(', '))
    setIsEditing(true)
  }

  const saveEdit = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onUpdate(memo.id, trimmed, tags)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <li className="memo-item">
        <textarea
          className="memo-edit-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="タグ（カンマ区切り）"
        />
        <div className="memo-actions">
          <button type="button" onClick={saveEdit}>
            保存
          </button>
          <button type="button" onClick={() => setIsEditing(false)}>
            キャンセル
          </button>
        </div>
      </li>
    )
  }

  return (
    <li className="memo-item">
      <p className="memo-text">{memo.text}</p>
      {memo.tags.length > 0 && (
        <ul className="memo-tags">
          {memo.tags.map((tag) => (
            <li key={tag} className="memo-tag">
              {tag}
            </li>
          ))}
        </ul>
      )}
      <form className="add-tag-form" onSubmit={submitNewTag}>
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="タグを追加"
        />
        <button type="submit">追加</button>
      </form>
      <div className="memo-meta">
        <time>{new Date(memo.updatedAt).toLocaleString('ja-JP')}</time>
        <div className="memo-actions">
          <button type="button" onClick={startEdit}>
            編集
          </button>
          <button type="button" onClick={() => onDelete(memo.id)}>
            削除
          </button>
        </div>
      </div>
    </li>
  )
}

export default MemoItem
