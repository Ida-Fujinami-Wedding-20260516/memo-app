import { useState } from 'react'
import TagPicker from './TagPicker'

function MemoItem({ memo, onUpdate, onDelete, onRemoveTag, allTags }) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(memo.text)
  const [tags, setTags] = useState(memo.tags)

  const startEdit = () => {
    setText(memo.text)
    setTags(memo.tags)
    setIsEditing(true)
  }

  const toggleEditTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
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
        <TagPicker options={allTags} selected={tags} onToggle={toggleEditTag} allowCreate={false} />
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
              <button
                type="button"
                className="memo-tag-remove"
                aria-label={`${tag} を削除`}
                onClick={() => onRemoveTag(memo.id, tag)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
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
