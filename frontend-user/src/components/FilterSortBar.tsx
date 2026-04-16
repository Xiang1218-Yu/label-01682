import { useState, useRef, useEffect } from 'react'
import type { SortField, SortOrder } from '../types/flight'

/**
 * 筛选和排序工具栏组件
 * 显示搜索结果数量，提供仅直飞筛选、航空公司筛选、多维排序功能
 */
export function FilterSortBar({
  total,
  sort,
  onSortChange,
  onlyDirect,
  onDirectChange,
  airlines,
  selectedAirlines,
  onAirlineChange,
}: {
  /** 搜索结果总数 */
  total: number
  /** 当前排序配置（字段和顺序） */
  sort: { field: SortField; order: SortOrder }
  /** 排序字段变更回调 */
  onSortChange: (f: SortField) => void
  /** 是否仅显示直飞 */
  onlyDirect: boolean
  /** 仅直飞选项变更回调 */
  onDirectChange: (v: boolean) => void
  /** 所有可用航空公司列表 */
  airlines: string[]
  /** 已选中的航空公司列表 */
  selectedAirlines: string[]
  /** 选中航空公司变更回调 */
  onAirlineChange: (v: string[]) => void
}) {
  /** 航空公司筛选下拉框展开状态 */
  const [showAF, setShowAF] = useState(false)
  /** 筛选区域引用，用于点击外部关闭下拉框 */
  const filterRef = useRef<HTMLDivElement>(null)

  /**
   * 监听外部点击事件，点击组件外部时关闭航空公司筛选下拉框
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowAF(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  /** 排序选项配置（价格、起飞时间、到达时间、飞行时长、航空公司） */
  const sortItems: { field: SortField; label: string }[] = [
    { field: 'price', label: '价格' },
    { field: 'departTime', label: '起飞时间' },
    { field: 'arriveTime', label: '到达时间' },
    { field: 'duration', label: '飞行时长' },
    { field: 'airline', label: '航空公司' },
  ]

  return (
    <div className="filter-sort-bar">
      <div className="filter-left">
        <span className="result-count">
          共找到 <strong>{total}</strong> 个航班
        </span>
        <label className="direct-filter">
          <input
            type="checkbox"
            checked={onlyDirect}
            onChange={(e) => onDirectChange(e.target.checked)}
          />
          <span>仅看直飞</span>
        </label>
        <div className="airline-filter-wrap" ref={filterRef}>
          <button
            className={'filter-btn' + (selectedAirlines.length > 0 ? ' filter-btn-active' : '')}
            onClick={() => setShowAF(!showAF)}
          >
            航空公司筛选
            {selectedAirlines.length > 0 ? ' (' + selectedAirlines.length + ')' : ''}
            <svg width="12" height="12" viewBox="0 0 12 12" className="arrow-icon">
              <path
                d="M2 4l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </button>
          {showAF && (
            <div className="airline-dropdown">
              <div className="airline-dropdown-header">
                <span>选择航空公司</span>
                <button className="airline-clear" onClick={() => onAirlineChange([])}>
                  清除全部
                </button>
              </div>
              {airlines.map((a) => (
                <label key={a} className="airline-option">
                  <input
                    type="checkbox"
                    checked={selectedAirlines.includes(a)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onAirlineChange([...selectedAirlines, a])
                      } else {
                        onAirlineChange(selectedAirlines.filter((x) => x !== a))
                      }
                    }}
                  />
                  <span>{a}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="sort-right">
        <span className="sort-label">排序：</span>
        {sortItems.map((s) => (
          <button
            key={s.field}
            className={'sort-btn' + (sort.field === s.field ? ' sort-btn-active' : '')}
            onClick={() => onSortChange(s.field)}
          >
            {s.label}
            <span
              className={
                'sort-arrow' + (sort.field === s.field ? ' sort-arrow-active' : '')
              }
            >
              {sort.field === s.field ? (sort.order === 'asc' ? '↑' : '↓') : '↕'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
