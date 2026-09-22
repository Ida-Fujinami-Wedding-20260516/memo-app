import MemoItem from './MemoItem'

function MemoList({ memos, onUpdate, onDelete, onRemoveTag, allTags }) {
  if (memos.length === 0) {
    return <p className="memo-empty">メモが見つかりません</p>
  }

  return (
    <ul className="memo-list">
      {memos.map((memo) => (
        <MemoItem
          key={memo.id}
          memo={memo}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onRemoveTag={onRemoveTag}
          allTags={allTags}
        />
      ))}
    </ul>
  )
}

export default MemoList
