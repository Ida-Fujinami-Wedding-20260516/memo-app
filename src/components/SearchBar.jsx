function SearchBar({ query, onQueryChange, tags, activeTag, onTagChange }) {
  return (
    <div className="search-bar">
      <input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="メモを検索..."
      />
      {tags.length > 0 && (
        <div className="tag-filters">
          <button
            type="button"
            className={activeTag === null ? 'tag-filter active' : 'tag-filter'}
            onClick={() => onTagChange(null)}
          >
            すべて
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={activeTag === tag ? 'tag-filter active' : 'tag-filter'}
              onClick={() => onTagChange(activeTag === tag ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar
