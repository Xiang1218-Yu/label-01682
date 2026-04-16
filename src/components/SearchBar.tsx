import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { searchCities } from '../data/cities'
import type { SearchParams, TripType, CabinClass, Airport, SearchHistoryItem } from '../types/flight'

// 本地存储搜索历史的key
const SEARCH_HISTORY_KEY = 'flight_search_history'
// 最多保存10条历史记录
const MAX_HISTORY_COUNT = 10

// 航空公司选项（实际项目中应该从API获取）
const AIRLINE_OPTIONS = [
  { label: '中国国航', value: 'CA' },
  { label: '东方航空', value: 'MU' },
  { label: '南方航空', value: 'CZ' },
  { label: '海南航空', value: 'HU' },
  { label: '深圳航空', value: 'ZH' },
  { label: '四川航空', value: '3U' },
  { label: '厦门航空', value: 'MF' },
]

// 时间段选项
const TIME_RANGE_OPTIONS = [
  { label: '凌晨 (00:00-06:00)', value: [0, 6] as [number, number] },
  { label: '上午 (06:00-12:00)', value: [6, 12] as [number, number] },
  { label: '下午 (12:00-18:00)', value: [12, 18] as [number, number] },
  { label: '晚上 (18:00-24:00)', value: [18, 24] as [number, number] },
]

const today = new Date()
const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')
const CABIN_OPTIONS: { label: string; value: CabinClass }[] = [
  { label: '经济舱', value: 'economy' }, { label: '超级经济舱', value: 'premium_economy' },
  { label: '商务舱', value: 'business' }, { label: '头等舱', value: 'first' },
]

function CityPicker({ value, onChange, placeholder }: { value: Airport; onChange: (a: Airport) => void; placeholder: string }) {
  const [open, setOpen] = useState(false); const [keyword, setKeyword] = useState(''); const ref = useRef<HTMLDivElement>(null)
  const results = useMemo(() => searchCities(keyword), [keyword])
  useEffect(() => { const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h) }, [])
  return (<div className="city-picker" ref={ref}>
    <input className="city-input" placeholder={placeholder} value={open ? keyword : (value.name ? value.name + ' (' + value.code + ')' : '')} onFocus={() => { setOpen(true); setKeyword('') }} onChange={(e) => setKeyword(e.target.value)} />
    {open && <div className="city-dropdown">{results.length === 0 ? <div className="city-empty">未找到匹配城市</div> : results.map((c) => (
      <div key={c.code} className={'city-option' + (c.code === value.code ? ' city-option-active' : '')} onClick={() => { onChange(c); setOpen(false) }}><span className="city-name">{c.name}</span><span className="city-code">{c.code}</span></div>
    ))}</div>}
  </div>)
}

function SimpleDatePicker({ value, onChange, label, minDate }: { value: string; onChange: (v: string) => void; label: string; minDate?: string }) {
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(() => value ? parseInt(value.split('-')[0]) : today.getFullYear())
  const [viewMonth, setViewMonth] = useState(() => value ? parseInt(value.split('-')[1]) - 1 : today.getMonth())
  const ref = useRef<HTMLDivElement>(null)
  const min = minDate || todayStr

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [])

  useEffect(() => {
    if (value) { setViewYear(parseInt(value.split('-')[0])); setViewMonth(parseInt(value.split('-')[1]) - 1) }
  }, [value])

  const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()
  const days: (number | null)[] = []
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)

  const fmtDate = (d: number) => viewYear + '-' + String(viewMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0')
  const isDisabled = (d: number) => fmtDate(d) < min
  const isSelected = (d: number) => fmtDate(d) === value
  const isToday = (d: number) => fmtDate(d) === todayStr

  const prevMonth = () => { if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11) } else setViewMonth(viewMonth - 1) }
  const nextMonth = () => { if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0) } else setViewMonth(viewMonth + 1) }

  const displayText = value ? value.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$1年$2月$3日') : ''

  return (<div className="date-picker-wrap" ref={ref}>
    <label className="date-label">{label}</label>
    <div className={'date-display' + (open ? ' date-display-active' : '')} onClick={() => setOpen(!open)}>
      <span className={value ? '' : 'date-placeholder'}>{displayText || '请选择日期'}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" className="date-icon"><rect x="2" y="3" width="12" height="11" rx="2" stroke="#999" strokeWidth="1.2" fill="none" /><line x1="5" y1="1" x2="5" y2="5" stroke="#999" strokeWidth="1.2" /><line x1="11" y1="1" x2="11" y2="5" stroke="#999" strokeWidth="1.2" /><line x1="2" y1="7" x2="14" y2="7" stroke="#999" strokeWidth="1.2" /></svg>
    </div>
    {open && <div className="calendar-popup">
      <div className="cal-header">
        <button className="cal-nav-btn" onClick={prevMonth} type="button">‹</button>
        <span className="cal-month-label">{viewYear}年{viewMonth + 1}月</span>
        <button className="cal-nav-btn" onClick={nextMonth} type="button">›</button>
      </div>
      <div className="cal-weekdays">{WEEKDAYS.map((w) => <span key={w} className="cal-weekday">{w}</span>)}</div>
      <div className="cal-days">{days.map((d, i) => d === null
        ? <span key={'e' + i} className="cal-day-empty" />
        : <button key={d} type="button" disabled={isDisabled(d)} className={'cal-day' + (isSelected(d) ? ' cal-day-selected' : '') + (isToday(d) ? ' cal-day-today' : '') + (isDisabled(d) ? ' cal-day-disabled' : '')} onClick={() => { onChange(fmtDate(d)); setOpen(false) }}>{d}</button>
      )}</div>
    </div>}
  </div>)
}


function PassengerSelector({ passengers, onChange }: { passengers: SearchParams['passengers']; onChange: (p: SearchParams['passengers']) => void }) {
  const [open, setOpen] = useState(false); const ref = useRef<HTMLDivElement>(null)
  const total = passengers.adults + passengers.children + passengers.infants
  useEffect(() => { const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h) }, [])
  const adjust = (key: keyof typeof passengers, delta: number) => { const next = { ...passengers }; next[key] = Math.max(key === 'adults' ? 1 : 0, Math.min(9, next[key] + delta)); onChange(next) }
  return (<div className="passenger-selector" ref={ref}>
    <div className="passenger-display" onClick={() => setOpen(!open)}><span>{total} 位乘客</span><svg width="12" height="12" viewBox="0 0 12 12" className="arrow-icon"><path d="M2 4l4 4 4-4" stroke="#999" strokeWidth="1.5" fill="none" /></svg></div>
    {open && <div className="passenger-dropdown">{([{ key: 'adults' as const, label: '成人', desc: '12岁及以上' }, { key: 'children' as const, label: '儿童', desc: '2-11岁' }, { key: 'infants' as const, label: '婴儿', desc: '0-2岁' }]).map(({ key, label, desc }) => (
      <div key={key} className="passenger-row"><div><div className="passenger-type">{label}</div><div className="passenger-desc">{desc}</div></div>
        <div className="passenger-counter"><button className="counter-btn" disabled={passengers[key] <= (key === 'adults' ? 1 : 0)} onClick={() => adjust(key, -1)}>−</button><span className="counter-val">{passengers[key]}</span><button className="counter-btn" disabled={passengers[key] >= 9} onClick={() => adjust(key, 1)}>+</button></div>
      </div>))}</div>}
  </div>)
}

// 价格范围滑块组件
function PriceRangeSlider({ value, onChange }: { value: [number, number], onChange: (v: [number, number]) => void }) {
  const [min, max] = value
  return (
    <div className="filter-section">
      <div className="filter-label">价格范围: ¥{min} - ¥{max}</div>
      <div className="slider-container">
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={min}
          onChange={(e) => onChange([parseInt(e.target.value), max])}
          className="slider"
        />
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={max}
          onChange={(e) => onChange([min, parseInt(e.target.value)])}
          className="slider"
        />
      </div>
    </div>
  )
}

// 航空公司多选组件
function AirlineMultiSelect({ selected, onChange }: { selected: string[], onChange: (v: string[]) => void }) {
  const toggleAirline = (code: string) => {
    if (selected.includes(code)) {
      onChange(selected.filter(i => i !== code))
    } else {
      onChange([...selected, code])
    }
  }
  return (
    <div className="filter-section">
      <div className="filter-label">航空公司</div>
      <div className="checkbox-group">
        {AIRLINE_OPTIONS.map(airline => (
          <label key={airline.value} className="checkbox-item">
            <input
              type="checkbox"
              checked={selected.includes(airline.value)}
              onChange={() => toggleAirline(airline.value)}
            />
            <span>{airline.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

// 时间段选择组件
function TimeRangeSelector({ 
  label, 
  selected, 
  onChange 
}: { 
  label: string, 
  selected: [number, number], 
  onChange: (v: [number, number]) => void 
}) {
  return (
    <div className="filter-section">
      <div className="filter-label">{label}</div>
      <div className="time-range-options">
        {TIME_RANGE_OPTIONS.map(range => (
          <button
            key={range.label}
            type="button"
            className={`time-range-btn ${selected[0] === range.value[0] && selected[1] === range.value[1] ? 'active' : ''}`}
            onClick={() => onChange(range.value)}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// 搜索历史组件
function SearchHistoryList({ onSelect, refreshTrigger }: { onSelect: (params: SearchParams) => void, refreshTrigger?: number }) {
  const [history, setHistory] = useState<SearchHistoryItem[]>([])
  
  // 加载历史记录
  const loadHistory = useCallback(() => {
    const saved = localStorage.getItem(SEARCH_HISTORY_KEY)
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (e) {
        console.error('加载搜索历史失败', e)
      }
    } else {
      setHistory([])
    }
  }, [])

  // 组件挂载时加载
  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  // 当刷新触发器变化时重新加载历史
  useEffect(() => {
    if (refreshTrigger) {
      loadHistory()
    }
  }, [refreshTrigger, loadHistory])
  
  // 删除单条历史
  const deleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newHistory = history.filter(item => item.id !== id)
    setHistory(newHistory)
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
  }
  
  // 清空所有历史
  const clearAll = () => {
    setHistory([])
    localStorage.removeItem(SEARCH_HISTORY_KEY)
  }
  
  // 开发阶段临时注释，方便测试
  // if (history.length === 0) {
  //   return null
  // }
  
  return (
      <div className="search-history">
        <div className="history-header">
          <span>最近搜索</span>
          <button type="button" className="clear-history-btn" onClick={clearAll}>清空</button>
        </div>
        {history.length === 0 ? (
          <div className="history-empty">暂无搜索历史</div>
        ) : (
          <div className="history-list">
            {history.map(item => (
              <div
                key={item.id}
                className="history-item"
                onClick={() => onSelect(item.params)}
              >
                <span className="history-text">{item.label}</span>
                <button
                  type="button"
                  className="delete-history-btn"
                  onClick={(e) => deleteItem(item.id, e)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
}

// 保存搜索历史到本地存储
export const saveSearchHistory = (params: SearchParams) => {
  try {
    const saved = localStorage.getItem(SEARCH_HISTORY_KEY)
    let history: SearchHistoryItem[] = saved ? JSON.parse(saved) : []
    
    // 生成搜索项展示文本
    const label = `${params.from.name} → ${params.to.name} ${params.departDate}` + 
      (params.tripType === 'roundtrip' ? ` 往返 ${params.returnDate}` : '')
    
    // 避免重复历史
    history = history.filter(item => 
      !(item.params.from.code === params.from.code && 
        item.params.to.code === params.to.code && 
        item.params.departDate === params.departDate &&
        item.params.tripType === params.tripType)
    )
    
    // 添加新历史到最前面
    const newItem: SearchHistoryItem = {
      id: Date.now().toString(),
      params,
      timestamp: Date.now(),
      label
    }
    
    history.unshift(newItem)
    
    // 限制最多保存10条
    if (history.length > MAX_HISTORY_COUNT) {
      history = history.slice(0, MAX_HISTORY_COUNT)
    }
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history))
  } catch (e) {
    console.error('保存搜索历史失败', e)
  }
}

export function FlightSearchBar({ params, onSearch, loading }: { params: SearchParams; onSearch: (p: SearchParams) => void; loading: boolean }) {
  const [local, setLocal] = useState<SearchParams>({
    ...params,
    // 初始化默认筛选条件
    filters: params.filters || {
      airlines: [],
      priceRange: [0, 10000],
      departTimeRange: [0, 24],
      arriveTimeRange: [0, 24],
      stops: [],
      onlyDirect: false
    }
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  // 历史记录刷新触发器
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0)
  
  // 处理搜索点击，先保存历史再执行搜索
  const handleSearch = () => {
    saveSearchHistory(local)
    // 刷新历史记录
    setHistoryRefreshTrigger(prev => prev + 1)
    onSearch(local)
  }
  
  // 处理历史项选择
  const handleHistorySelect = (params: SearchParams) => {
    setLocal(params)
    onSearch(params)
  }
  
  return (<div className="search-bar-card">
    <div className="search-trip-tabs">{(['oneway', 'roundtrip'] as TripType[]).map((t) => (<button key={t} className={'trip-tab' + (local.tripType === t ? ' trip-tab-active' : '')} onClick={() => setLocal((p) => ({ ...p, tripType: t }))}>{t === 'oneway' ? '单程' : '往返'}</button>))}</div>
    <div className="search-fields">
      <CityPicker value={local.from} onChange={(a) => setLocal((p) => ({ ...p, from: a }))} placeholder="出发城市" />
      <button className="swap-btn" onClick={() => setLocal((p) => ({ ...p, from: p.to, to: p.from }))} title="交换"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3l4 4-4 4" stroke="#00b894" strokeWidth="2" /><line x1="4" y1="7" x2="20" y2="7" stroke="#00b894" strokeWidth="2" /><path d="M8 13l-4 4 4 4" stroke="#00b894" strokeWidth="2" /><line x1="20" y1="17" x2="4" y2="17" stroke="#00b894" strokeWidth="2" /></svg></button>
      <CityPicker value={local.to} onChange={(a) => setLocal((p) => ({ ...p, to: a }))} placeholder="到达城市" />
      <SimpleDatePicker value={local.departDate} onChange={(v) => setLocal((p) => ({ ...p, departDate: v }))} label="出发日期" />
      {local.tripType === 'roundtrip' && <SimpleDatePicker value={local.returnDate || ''} onChange={(v) => setLocal((p) => ({ ...p, returnDate: v }))} label="返回日期" />}
      <PassengerSelector passengers={local.passengers} onChange={(p) => setLocal((prev) => ({ ...prev, passengers: p }))} />
      <div className="cabin-select-wrap"><select className="cabin-select" value={local.cabinClass} onChange={(e) => setLocal((p) => ({ ...p, cabinClass: e.target.value as CabinClass }))}>{CABIN_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
      <button 
        type="button"
        className="advanced-filter-btn"
        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
      >
        {showAdvancedFilters ? '收起筛选' : '更多筛选'}
      </button>
      <button className="search-btn" disabled={loading} onClick={handleSearch}>{loading ? <span className="btn-loading"><span className="spinner spinner-white" />搜索中...</span> : '搜索'}</button>
    </div>
    
    {/* 高级筛选区域 */}
    {showAdvancedFilters && (
      <div className="advanced-filters">
        <div className="filter-row">
          <div className="filter-col">
            <AirlineMultiSelect
              selected={local.filters?.airlines || []}
              onChange={(airlines) => setLocal(p => ({ ...p, filters: { ...p.filters!, airlines } }))}
            />
          </div>
          <div className="filter-col">
            <PriceRangeSlider
              value={local.filters?.priceRange || [0, 10000]}
              onChange={(priceRange) => setLocal(p => ({ ...p, filters: { ...p.filters!, priceRange } }))}
            />
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-col">
            <TimeRangeSelector
              label="出发时间段"
              selected={local.filters?.departTimeRange || [0, 24]}
              onChange={(departTimeRange) => setLocal(p => ({ ...p, filters: { ...p.filters!, departTimeRange } }))}
            />
          </div>
          <div className="filter-col">
            <TimeRangeSelector
              label="到达时间段"
              selected={local.filters?.arriveTimeRange || [0, 24]}
              onChange={(arriveTimeRange) => setLocal(p => ({ ...p, filters: { ...p.filters!, arriveTimeRange } }))}
            />
          </div>
        </div>
        <div className="filter-row">
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={local.filters?.onlyDirect || false}
              onChange={(e) => setLocal(p => ({ ...p, filters: { ...p.filters!, onlyDirect: e.target.checked } }))}
            />
            <span>仅显示直飞航班</span>
          </label>
        </div>
      </div>
    )}
    
    {/* 搜索历史 */}
    <SearchHistoryList onSelect={handleHistorySelect} refreshTrigger={historyRefreshTrigger} />
  </div>)
}
