import { useState } from 'react'
import type { SearchHistoryItem, SearchParams } from '../types/flight'
import './SearchHistory.css'

/**
 * 搜索历史组件属性接口
 */
interface SearchHistoryProps {
  history: SearchHistoryItem[]
  onSelect: (params: SearchParams) => void
  onRemove: (id: string) => void
  onClear: () => void
}

/**
 * 搜索历史组件
 * 显示用户的搜索历史记录，支持展开/收起
 * 点击历史记录可直接触发搜索
 */
export function SearchHistory({ history, onSelect, onRemove, onClear }: SearchHistoryProps) {
  /** 历史记录列表展开状态 */
  const [expanded, setExpanded] = useState(true)

  /**
   * 格式化搜索时间显示
   * 将ISO时间字符串转换为相对时间描述
   * @param isoString - ISO格式时间字符串
   * @returns 格式化的相对时间字符串
   */
  const formatSearchTime = (isoString: string): string => {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return '刚刚'
    if (diffMins < 60) return `${diffMins}分钟前`
    if (diffHours < 24) return `${diffHours}小时前`
    if (diffDays < 7) return `${diffDays}天前`

    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  /**
   * 获取高级筛选条件摘要
   * 将搜索参数中的高级筛选条件转换为简洁的文字描述
   * @param params - 搜索参数
   * @returns 筛选条件摘要字符串
   */
  const getAdvancedFiltersSummary = (params: SearchParams): string => {
    const filters: string[] = []

    if (params.airlines.length > 0) {
      filters.push(`${params.airlines.length}家航司`)
    }
    if (params.priceRange.min !== null || params.priceRange.max !== null) {
      filters.push('价格筛选')
    }
    if (params.stops.length > 0 || params.onlyDirect) {
      filters.push(params.onlyDirect ? '仅直飞' : '经停筛选')
    }
    if (params.departTimeRange.start !== null || params.arriveTimeRange.start !== null) {
      filters.push('时段筛选')
    }

    return filters.join(' · ')
  }

  if (history.length === 0) {
    return null
  }

  return (
    <div className="search-history-card">
      <div className="history-header">
        <div className="history-title-row">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="#00b894" strokeWidth="1.5" />
            <path d="M8 4v4l2.5 2.5" stroke="#00b894" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <h3 className="history-title">搜索历史</h3>
          <span className="history-count">{history.length}条记录</span>
        </div>
        <div className="history-actions">
          <button
            type="button"
            className="toggle-expand-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '收起' : '展开'}
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              className={'arrow-icon' + (expanded ? ' arrow-rotated' : '')}
            >
              <path d="M2 4l4 4 4-4" stroke="#999" strokeWidth="1.5" fill="none" />
            </svg>
          </button>
          <button type="button" className="clear-btn" onClick={onClear}>
            清空历史
          </button>
        </div>
      </div>

      {expanded && (
        <div className="history-list">
          {history.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-item-content" onClick={() => onSelect(item.params)}>
                <div className="history-main-info">
                  <span className="history-route">
                    {item.params.from.name}({item.params.from.code}) → {item.params.to.name}({item.params.to.code})
                  </span>
                  <span className="history-type">
                    {item.params.tripType === 'oneway' ? '单程' : '往返'}
                  </span>
                  <span className="history-date">{item.params.departDate}</span>
                </div>
                <div className="history-sub-info">
                  <span className="history-cabin">
                    {item.params.cabinClass === 'economy'
                      ? '经济舱'
                      : item.params.cabinClass === 'premium_economy'
                      ? '超级经济舱'
                      : item.params.cabinClass === 'business'
                      ? '商务舱'
                      : '头等舱'}
                  </span>
                  <span className="history-passengers">
                    {item.params.passengers.adults +
                      item.params.passengers.children +
                      item.params.passengers.infants}{' '}
                    人
                  </span>
                  {getAdvancedFiltersSummary(item.params) && (
                    <span className="history-filters">
                      {getAdvancedFiltersSummary(item.params)}
                    </span>
                  )}
                </div>
                <span className="history-time">{formatSearchTime(item.searchTime)}</span>
              </div>
              <button
                type="button"
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(item.id)
                }}
                title="删除此条记录"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M11 3.5l-.618 6.803a1 1 0 01-.992.883H4.61a1 1 0 01-.992-.883L3 3.5"
                    stroke="#999"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path d="M1 3.5h12" stroke="#999" strokeWidth="1.2" strokeLinecap="round" />
                  <path
                    d="M5 3.5v-.75a1 1 0 011-1h2a1 1 0 011 1V3.5"
                    stroke="#999"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
