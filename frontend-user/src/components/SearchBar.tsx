import { useState, useRef, useEffect, useMemo } from 'react'
import { searchCities } from '../data/cities'
import type { SearchParams, TripType, CabinClass, Airport, PriceRange, TimeRange } from '../types/flight'
import './SearchBar.css'

/** 今天的日期对象 */
const today = new Date()
/** 今天的日期字符串，格式：YYYY-MM-DD */
const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')

/** 舱位选项配置 */
const CABIN_OPTIONS: { label: string; value: CabinClass }[] = [
  { label: '经济舱', value: 'economy' },
  { label: '超级经济舱', value: 'premium_economy' },
  { label: '商务舱', value: 'business' },
  { label: '头等舱', value: 'first' },
]

/** 航空公司选项列表 */
const AIRLINE_OPTIONS = [
  '中国国际航空', '中国东方航空', '中国南方航空', '国泰航空',
  '全日空航空', '大韩航空', '新加坡航空', '美国联合航空'
]

/** 经停次数选项配置 */
const STOP_OPTIONS = [
  { label: '不限', value: -1 },
  { label: '直飞', value: 0 },
  { label: '1次经停', value: 1 },
  { label: '2次及以上', value: 2 },
]

/** 时间段选项配置（凌晨、上午、下午、晚上） */
const TIME_SLOTS = [
  { label: '凌晨', value: [0, 6] },
  { label: '上午', value: [6, 12] },
  { label: '下午', value: [12, 18] },
  { label: '晚上', value: [18, 24] },
]

/**
 * 城市选择器组件
 * 支持搜索和选择出发/到达城市
 */
function CityPicker({ value, onChange, placeholder }: { value: Airport; onChange: (a: Airport) => void; placeholder: string }) {
  /** 下拉框展开状态 */
  const [open, setOpen] = useState(false)
  /** 搜索关键词 */
  const [keyword, setKeyword] = useState('')
  /** 组件引用，用于点击外部关闭下拉框 */
  const ref = useRef<HTMLDivElement>(null)
  /** 根据关键词搜索得到的城市列表 */
  const results = useMemo(() => searchCities(keyword), [keyword])

  /**
   * 监听外部点击事件，点击组件外部时关闭下拉框
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="city-picker" ref={ref}>
      <input
        className="city-input"
        placeholder={placeholder}
        value={open ? keyword : (value.name ? value.name + ' (' + value.code + ')' : '')}
        onFocus={() => { setOpen(true); setKeyword('') }}
        onChange={(e) => setKeyword(e.target.value)}
      />
      {open && (
        <div className="city-dropdown">
          {results.length === 0 ? (
            <div className="city-empty">未找到匹配城市</div>
          ) : (
            results.map((c) => (
              <div
                key={c.code}
                className={'city-option' + (c.code === value.code ? ' city-option-active' : '')}
                onClick={() => { onChange(c); setOpen(false) }}
              >
                <span className="city-name">{c.name}</span>
                <span className="city-code">{c.code}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

/**
 * 简单日期选择器组件
 * 提供日历选择功能，支持最小日期限制
 */
function SimpleDatePicker({ value, onChange, label, minDate }: { value: string; onChange: (v: string) => void; label: string; minDate?: string }) {
  /** 日历弹窗展开状态 */
  const [open, setOpen] = useState(false)
  /** 当前显示的年份 */
  const [viewYear, setViewYear] = useState(() => value ? parseInt(value.split('-')[0]) : today.getFullYear())
  /** 当前显示的月份（0-11） */
  const [viewMonth, setViewMonth] = useState(() => value ? parseInt(value.split('-')[1]) - 1 : today.getMonth())
  /** 组件引用，用于点击外部关闭弹窗 */
  const ref = useRef<HTMLDivElement>(null)
  /** 最小可选日期 */
  const min = minDate || todayStr

  /**
   * 监听外部点击事件，点击组件外部时关闭弹窗
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  /**
   * 当选中值变化时，更新日历显示的年月
   */
  useEffect(() => {
    if (value) {
      setViewYear(parseInt(value.split('-')[0]))
      setViewMonth(parseInt(value.split('-')[1]) - 1)
    }
  }, [value])

  /** 星期标题 */
  const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
  /** 当前月份的天数 */
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  /** 当前月份第一天是星期几（0-6） */
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()
  /** 日历显示的日期数组，包含月初空白填充 */
  const days: (number | null)[] = []
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)

  /**
   * 格式化日期为 YYYY-MM-DD 格式
   */
  const formatDate = (d: number) =>
    viewYear + '-' + String(viewMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0')
  /** 判断日期是否不可选（小于最小日期） */
  const isDisabled = (d: number) => formatDate(d) < min
  /** 判断日期是否已选中 */
  const isSelected = (d: number) => formatDate(d) === value
  /** 判断日期是否是今天 */
  const isToday = (d: number) => formatDate(d) === todayStr

  /** 切换到上一个月 */
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1)
      setViewMonth(11)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }
  /** 切换到下一个月 */
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1)
      setViewMonth(0)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  /** 格式化显示的日期文本 */
  const displayText = value ? value.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$1年$2月$3日') : ''

  return (
    <div className="date-picker-wrap" ref={ref}>
      <label className="date-label">{label}</label>
      <div className={'date-display' + (open ? ' date-display-active' : '')} onClick={() => setOpen(!open)}>
        <span className={value ? '' : 'date-placeholder'}>{displayText || '请选择日期'}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" className="date-icon">
          <rect x="2" y="3" width="12" height="11" rx="2" stroke="#999" strokeWidth="1.2" fill="none" />
          <line x1="5" y1="1" x2="5" y2="5" stroke="#999" strokeWidth="1.2" />
          <line x1="11" y1="1" x2="11" y2="5" stroke="#999" strokeWidth="1.2" />
          <line x1="2" y1="7" x2="14" y2="7" stroke="#999" strokeWidth="1.2" />
        </svg>
      </div>
      {open && (
        <div className="calendar-popup">
          <div className="cal-header">
            <button className="cal-nav-btn" onClick={prevMonth} type="button">‹</button>
            <span className="cal-month-label">{viewYear}年{viewMonth + 1}月</span>
            <button className="cal-nav-btn" onClick={nextMonth} type="button">›</button>
          </div>
          <div className="cal-weekdays">
            {WEEKDAYS.map((w) => <span key={w} className="cal-weekday">{w}</span>)}
          </div>
          <div className="cal-days">
            {days.map((d, i) =>
              d === null ? (
                <span key={'e' + i} className="cal-day-empty" />
              ) : (
                <button
                  key={d}
                  type="button"
                  disabled={isDisabled(d)}
                  className={
                    'cal-day' +
                    (isSelected(d) ? ' cal-day-selected' : '') +
                    (isToday(d) ? ' cal-day-today' : '') +
                    (isDisabled(d) ? ' cal-day-disabled' : '')
                  }
                  onClick={() => { onChange(formatDate(d)); setOpen(false) }}
                >
                  {d}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * 乘客选择器组件
 * 支持选择成人、儿童、婴儿的数量
 */
function PassengerSelector({ passengers, onChange }: { passengers: SearchParams['passengers']; onChange: (p: SearchParams['passengers']) => void }) {
  /** 下拉框展开状态 */
  const [open, setOpen] = useState(false)
  /** 组件引用，用于点击外部关闭下拉框 */
  const ref = useRef<HTMLDivElement>(null)
  /** 乘客总数 */
  const total = passengers.adults + passengers.children + passengers.infants

  /**
   * 监听外部点击事件，点击组件外部时关闭下拉框
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  /**
   * 调整乘客数量
   * @param key - 乘客类型（adults/children/infants）
   * @param delta - 增减数量（+1或-1）
   */
  const adjust = (key: keyof typeof passengers, delta: number) => {
    const next = { ...passengers }
    next[key] = Math.max(key === 'adults' ? 1 : 0, Math.min(9, next[key] + delta))
    onChange(next)
  }

  return (
    <div className="passenger-selector" ref={ref}>
      <div className="passenger-display" onClick={() => setOpen(!open)}>
        <span>{total} 位乘客</span>
        <svg width="12" height="12" viewBox="0 0 12 12" className="arrow-icon">
          <path d="M2 4l4 4 4-4" stroke="#999" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
      {open && (
        <div className="passenger-dropdown">
          {([
            { key: 'adults' as const, label: '成人', desc: '12岁及以上' },
            { key: 'children' as const, label: '儿童', desc: '2-11岁' },
            { key: 'infants' as const, label: '婴儿', desc: '0-2岁' },
          ]).map(({ key, label, desc }) => (
            <div key={key} className="passenger-row">
              <div>
                <div className="passenger-type">{label}</div>
                <div className="passenger-desc">{desc}</div>
              </div>
              <div className="passenger-counter">
                <button className="counter-btn" disabled={passengers[key] <= (key === 'adults' ? 1 : 0)} onClick={() => adjust(key, -1)}>
                  −
                </button>
                <span className="counter-val">{passengers[key]}</span>
                <button className="counter-btn" disabled={passengers[key] >= 9} onClick={() => adjust(key, 1)}>
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * 多选下拉框组件
 * 支持多选，用于航空公司等需要多选的场景
 */
function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder,
  label,
}: {
  options: string[]
  selected: string[]
  onChange: (v: string[]) => void
  placeholder: string
  label: string
}) {
  /** 下拉框展开状态 */
  const [open, setOpen] = useState(false)
  /** 组件引用，用于点击外部关闭下拉框 */
  const ref = useRef<HTMLDivElement>(null)

  /**
   * 监听外部点击事件，点击组件外部时关闭下拉框
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  /**
   * 切换选项的选中状态
   * @param option - 要切换的选项值
   */
  const toggleOption = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter((s) => s !== option)
      : [...selected, option]
    onChange(newSelected)
  }

  return (
    <div className="multi-select-dropdown" ref={ref}>
      <label className="dropdown-label">{label}</label>
      <div className="dropdown-display" onClick={() => setOpen(!open)}>
        <span className={selected.length > 0 ? '' : 'dropdown-placeholder'}>
          {selected.length > 0 ? `已选 ${selected.length} 家` : placeholder}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" className="arrow-icon">
          <path d="M2 4l4 4 4-4" stroke="#999" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
      {open && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <div
              key={option}
              className={'dropdown-option' + (selected.includes(option) ? ' dropdown-option-selected' : '')}
              onClick={() => toggleOption(option)}
            >
              <span className="checkbox">{selected.includes(option) ? '✓' : ''}</span>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * 价格范围输入组件
 * 用于输入最低和最高价格筛选条件
 */
function PriceRangeInput({ value, onChange, label }: { value: PriceRange; onChange: (v: PriceRange) => void; label: string }) {
  return (
    <div className="price-range-input">
      <label className="range-label">{label}</label>
      <div className="price-inputs">
        <input
          type="number"
          className="price-input"
          placeholder="最低"
          value={value.min ?? ''}
          onChange={(e) => onChange({ ...value, min: e.target.value ? Number(e.target.value) : null })}
        />
        <span className="price-separator">—</span>
        <input
          type="number"
          className="price-input"
          placeholder="最高"
          value={value.max ?? ''}
          onChange={(e) => onChange({ ...value, max: e.target.value ? Number(e.target.value) : null })}
        />
      </div>
    </div>
  )
}

/**
 * 时间范围选择器组件
 * 用于选择出发或到达的时间段（凌晨、上午、下午、晚上）
 */
function TimeRangeSelector({ value, onChange, label }: { value: TimeRange; onChange: (v: TimeRange) => void; label: string }) {
  /** 下拉框展开状态 */
  const [open, setOpen] = useState(false)
  /** 组件引用，用于点击外部关闭下拉框 */
  const ref = useRef<HTMLDivElement>(null)

  /**
   * 监听外部点击事件，点击组件外部时关闭下拉框
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  /**
   * 切换时间段选择
   * @param start - 开始小时
   * @param end - 结束小时
   */
  const toggleSlot = (start: number, end: number) => {
    if (value.start === start && value.end === end) {
      onChange({ start: null, end: null })
    } else {
      onChange({ start, end })
    }
  }

  /**
   * 获取显示的时间段文本
   */
  const getDisplayText = () => {
    if (value.start === null || value.end === null) return '不限'
    for (const slot of TIME_SLOTS) {
      if (slot.value[0] === value.start && slot.value[1] === value.end) {
        return slot.label
      }
    }
    return `${value.start}:00-${value.end}:00`
  }

  return (
    <div className="time-range-selector" ref={ref}>
      <label className="range-label">{label}</label>
      <div className="time-display" onClick={() => setOpen(!open)}>
        <span>{getDisplayText()}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" className="arrow-icon">
          <path d="M2 4l4 4 4-4" stroke="#999" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
      {open && (
        <div className="time-slots">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot.label}
              type="button"
              className={
                'time-slot-btn' +
                (value.start === slot.value[0] && value.end === slot.value[1] ? ' time-slot-active' : '')
              }
              onClick={() => toggleSlot(slot.value[0], slot.value[1])}
            >
              {slot.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * 经停次数选择器组件
 * 用于选择航班的经停次数（不限、直飞、1次经停、2次及以上）
 */
function StopsSelector({ value, onChange, label }: { value: number[]; onChange: (v: number[]) => void; label: string }) {
  /** 下拉框展开状态 */
  const [open, setOpen] = useState(false)
  /** 组件引用，用于点击外部关闭下拉框 */
  const ref = useRef<HTMLDivElement>(null)

  /**
   * 监听外部点击事件，点击组件外部时关闭下拉框
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  /**
   * 切换经停次数选项
   * 选择"不限"时清空所有选择
   * @param stopValue - 经停次数值（-1表示不限，0表示直飞，1表示1次经停，2表示2次及以上）
   */
  const toggleStop = (stopValue: number) => {
    if (stopValue === -1) {
      onChange([])
      return
    }
    const newStops = value.includes(stopValue)
      ? value.filter((s) => s !== stopValue)
      : [...value, stopValue]
    onChange(newStops)
  }

  /**
   * 获取显示的经停次数文本
   * 根据选中的数量返回不同的显示格式
   */
  const getDisplayText = () => {
    if (value.length === 0) return '不限'
    if (value.length === 1) {
      const opt = STOP_OPTIONS.find((o) => o.value === value[0])
      return opt ? opt.label : '不限'
    }
    return `已选 ${value.length} 项`
  }

  return (
    <div className="stops-selector" ref={ref}>
      <label className="range-label">{label}</label>
      <div className="stops-display" onClick={() => setOpen(!open)}>
        <span>{getDisplayText()}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" className="arrow-icon">
          <path d="M2 4l4 4 4-4" stroke="#999" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
      {open && (
        <div className="stops-options">
          {STOP_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={
                'stop-option-btn' +
                ((opt.value === -1 && value.length === 0) || value.includes(opt.value) ? ' stop-option-active' : '')
              }
              onClick={() => toggleStop(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * 航班搜索栏主组件
 * 集成所有搜索条件输入，包括基础搜索和高级搜索
 * 支持单程/往返、出发/到达城市、日期、乘客、舱位、航空公司、经停次数、价格范围、时间范围等多条件搜索
 */
export function FlightSearchBar({
  params,
  onSearch,
  loading,
}: {
  /** 搜索参数初始值 */
  params: SearchParams
  /** 搜索回调函数，点击搜索按钮时触发 */
  onSearch: (p: SearchParams) => void
  /** 是否正在加载中 */
  loading: boolean
}) {
  /** 本地搜索参数状态，用于实时更新用户输入 */
  const [local, setLocal] = useState<SearchParams>(params)
  /** 高级搜索选项展开状态 */
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <div className="search-bar-card">
      <div className="search-trip-tabs">
        {(['oneway', 'roundtrip'] as TripType[]).map((t) => (
          <button
            key={t}
            className={'trip-tab' + (local.tripType === t ? ' trip-tab-active' : '')}
            onClick={() => setLocal((p) => ({ ...p, tripType: t }))}
          >
            {t === 'oneway' ? '单程' : '往返'}
          </button>
        ))}
      </div>

      <div className="search-fields">
        <CityPicker value={local.from} onChange={(a) => setLocal((p) => ({ ...p, from: a }))} placeholder="出发城市" />
        <button className="swap-btn" onClick={() => setLocal((p) => ({ ...p, from: p.to, to: p.from }))} title="交换">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 3l4 4-4 4" stroke="#00b894" strokeWidth="2" />
            <line x1="4" y1="7" x2="20" y2="7" stroke="#00b894" strokeWidth="2" />
            <path d="M8 13l-4 4 4 4" stroke="#00b894" strokeWidth="2" />
            <line x1="20" y1="17" x2="4" y2="17" stroke="#00b894" strokeWidth="2" />
          </svg>
        </button>
        <CityPicker value={local.to} onChange={(a) => setLocal((p) => ({ ...p, to: a }))} placeholder="到达城市" />
        <SimpleDatePicker value={local.departDate} onChange={(v) => setLocal((p) => ({ ...p, departDate: v }))} label="出发日期" />
        {local.tripType === 'roundtrip' && (
          <SimpleDatePicker
            value={local.returnDate || ''}
            onChange={(v) => setLocal((p) => ({ ...p, returnDate: v }))}
            label="返回日期"
            minDate={local.departDate}
          />
        )}
        <PassengerSelector passengers={local.passengers} onChange={(p) => setLocal((prev) => ({ ...prev, passengers: p }))} />
        <div className="cabin-select-wrap">
          <select
            className="cabin-select"
            value={local.cabinClass}
            onChange={(e) => setLocal((p) => ({ ...p, cabinClass: e.target.value as CabinClass }))}
          >
            {CABIN_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <button className="search-btn" disabled={loading} onClick={() => onSearch(local)}>
          {loading ? (
            <span className="btn-loading">
              <span className="spinner spinner-white" />
              搜索中...
            </span>
          ) : (
            '搜索'
          )}
        </button>
      </div>

      <div className="advanced-search-toggle">
        <button type="button" className="toggle-btn" onClick={() => setShowAdvanced(!showAdvanced)}>
          <span>{showAdvanced ? '收起' : '展开'}高级搜索选项</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            className={'arrow-icon' + (showAdvanced ? ' arrow-rotated' : '')}
          >
            <path d="M2 4l4 4 4-4" stroke="#00b894" strokeWidth="1.5" fill="none" />
          </svg>
        </button>
      </div>

      {showAdvanced && (
        <div className="advanced-search-fields">
          <div className="advanced-row">
            <MultiSelectDropdown
              options={AIRLINE_OPTIONS}
              selected={local.airlines}
              onChange={(v) => setLocal((p) => ({ ...p, airlines: v }))}
              placeholder="选择航空公司"
              label="航空公司"
            />
            <StopsSelector
              value={local.stops}
              onChange={(v) => setLocal((p) => ({ ...p, stops: v }))}
              label="经停次数"
            />
            <label className="direct-flight-label">
              <input
                type="checkbox"
                checked={local.onlyDirect}
                onChange={(e) => setLocal((p) => ({ ...p, onlyDirect: e.target.checked }))}
              />
              仅直飞
            </label>
          </div>
          <div className="advanced-row">
            <PriceRangeInput
              value={local.priceRange}
              onChange={(v) => setLocal((p) => ({ ...p, priceRange: v }))}
              label="价格范围 (¥)"
            />
            <TimeRangeSelector
              value={local.departTimeRange}
              onChange={(v) => setLocal((p) => ({ ...p, departTimeRange: v }))}
              label="出发时间"
            />
            <TimeRangeSelector
              value={local.arriveTimeRange}
              onChange={(v) => setLocal((p) => ({ ...p, arriveTimeRange: v }))}
              label="到达时间"
            />
          </div>
        </div>
      )}
    </div>
  )
}
