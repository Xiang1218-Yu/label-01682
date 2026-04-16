import { useState, useRef, useEffect, useMemo } from 'react'
import { searchCities } from '../data/cities'
import type { SearchParams, TripType, CabinClass, Airport } from '../types/flight'

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

export function FlightSearchBar({ params, onSearch, loading }: { params: SearchParams; onSearch: (p: SearchParams) => void; loading: boolean }) {
  const [local, setLocal] = useState<SearchParams>(params)
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
      <button className="search-btn" disabled={loading} onClick={() => onSearch(local)}>{loading ? <span className="btn-loading"><span className="spinner spinner-white" />搜索中...</span> : '搜索'}</button>
    </div>
  </div>)
}
