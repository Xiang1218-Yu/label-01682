import { useState, useRef, useEffect } from 'react'
import type { SortField, SortOrder } from '../types/flight'

export function FilterSortBar({ total, sort, onSortChange, onlyDirect, onDirectChange, airlines, selectedAirlines, onAirlineChange }: { total: number; sort: { field: SortField; order: SortOrder }; onSortChange: (f: SortField) => void; onlyDirect: boolean; onDirectChange: (v: boolean) => void; airlines: string[]; selectedAirlines: string[]; onAirlineChange: (v: string[]) => void }) {
  const [showAF, setShowAF] = useState(false); const filterRef = useRef<HTMLDivElement>(null)
  useEffect(() => { const h = (e: MouseEvent) => { if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowAF(false) }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h) }, [])
  const sortItems: { field: SortField; label: string }[] = [{ field: 'price', label: '价格' }, { field: 'departTime', label: '起飞时间' }, { field: 'arriveTime', label: '到达时间' }, { field: 'duration', label: '飞行时长' }]
  return (<div className="filter-sort-bar">
    <div className="filter-left"><span className="result-count">共找到 <strong>{total}</strong> 个航班</span>
      <label className="direct-filter"><input type="checkbox" checked={onlyDirect} onChange={(e) => onDirectChange(e.target.checked)} /><span>仅看直飞</span></label>
      <div className="airline-filter-wrap" ref={filterRef}><button className={'filter-btn' + (selectedAirlines.length > 0 ? ' filter-btn-active' : '')} onClick={() => setShowAF(!showAF)}>航空公司筛选{selectedAirlines.length > 0 ? ' (' + selectedAirlines.length + ')' : ''}<svg width="12" height="12" viewBox="0 0 12 12" className="arrow-icon"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg></button>
        {showAF && <div className="airline-dropdown"><div className="airline-dropdown-header"><span>选择航空公司</span><button className="airline-clear" onClick={() => onAirlineChange([])}>清除全部</button></div>{airlines.map((a) => (<label key={a} className="airline-option"><input type="checkbox" checked={selectedAirlines.includes(a)} onChange={(e) => { if (e.target.checked) onAirlineChange([...selectedAirlines, a]); else onAirlineChange(selectedAirlines.filter((x) => x !== a)) }} /><span>{a}</span></label>))}</div>}</div></div>
    <div className="sort-right"><span className="sort-label">排序：</span>{sortItems.map((s) => (<button key={s.field} className={'sort-btn' + (sort.field === s.field ? ' sort-btn-active' : '')} onClick={() => onSortChange(s.field)}>{s.label}<span className={'sort-arrow' + (sort.field === s.field ? ' sort-arrow-active' : '')}>{sort.field === s.field ? (sort.order === 'asc' ? '↑' : '↓') : '↕'}</span></button>))}</div>
  </div>)
}
