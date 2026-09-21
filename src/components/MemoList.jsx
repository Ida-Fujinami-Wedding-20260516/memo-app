import MemoItem from './MemoItem'

function MemoList({ memos, onUpdate, onDelete }) {
  if (memos.length === 0) {
    return <p className="memo-empty">メモが見つかりません</p>
  }

  return (
    <ul className="memo-list">
      {memos.map((memo) => (
        <MemoItem key={memo.id} memo={memo} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </ul>
  )
}

export default MemoList
