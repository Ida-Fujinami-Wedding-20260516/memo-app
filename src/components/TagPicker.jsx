import { useState } from 'react'

function TagPicker({ options, selected, onToggle, onCreate }) {
  const [newTag, setNewTag] = useState('')

  const submitNewTag = () => {
    if (!newTag.trim()) return
    onCreate(newTag)
    setNewTag('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitNewTag()
    }
  }

  return (
    <div className="tag-picker">
      {options.length > 0 && (
        <div className="tag-picker-options">
          {options.map((tag) => (
            <button
              key={tag}
              type="button"
              className={selected.includes(tag) ? 'tag-option active' : 'tag-option'}
              onClick={() => onToggle(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
      <div className="tag-create">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="新しいタグ名"
        />
        <button type="button" onClick={submitNewTag}>
          作成
        </button>
      </div>
    </div>
  )
}

export default TagPicker
