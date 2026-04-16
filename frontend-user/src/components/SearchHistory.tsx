import { useState } from 'react'
import type { SearchHistoryItem, SearchParams } from '../types/flight'

interface SearchHistoryProps {
  history: SearchHistoryItem[]
  onHistoryClick: (params: SearchParams) => void
  onDeleteHistory: (id: string) => void
  onClearHistory: () => void
}

export function SearchHistory({ 
  history, 
  onHistoryClick, 
  onDeleteHistory, 
  onClearHistory 
}: SearchHistoryProps) {
  const [showHistory, setShowHistory] = useState(false)

  if (history.length === 0) {
    return null
  }

  return (
    <div className="search-history-card">
      <div className="search-history-header">
        <h3 className="search-history-title">
          🔍 最近搜索
          <button 
            className="toggle-history-btn"
            onClick={() => setShowHistory(!showHistory)}
            type="button"
          >
            {showHistory ? '收起' : '展开'}
          </button>
        </h3>
        <button 
          className="clear-history-btn"
          onClick={onClearHistory}
          type="button"
        >
          清空历史
        </button>
      </div>

      {showHistory && (
        <div className="search-history-list">
          {history.map(item => (
            <div key={item.id} className="search-history-item">
              <button
                className="history-item-content"
                onClick={() => onHistoryClick(item.params)}
                type="button"
              >
                <span className="history-description">{item.description}</span>
                <span className="history-time">
                  {new Date(item.timestamp).toLocaleString('zh-CN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </button>
              <button
                className="delete-history-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteHistory(item.id)
                }}
                type="button"
                title="删除"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
