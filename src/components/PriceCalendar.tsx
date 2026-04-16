import { useRef } from 'react'
import { formatPrice, formatDateCN, getWeekdayCN } from '../utils/helpers'
import type { PriceCalendarItem } from '../types/flight'

export function PriceCalendar({ items, selectedDate, onSelect }: { items: PriceCalendarItem[]; selectedDate: string; onSelect: (date: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  return (<div className="price-calendar-card">
    <div className="price-calendar-header"><span className="price-calendar-title">临近日期最低价</span><span className="price-calendar-tip">当前：{formatDateCN(selectedDate)} {getWeekdayCN(selectedDate)}　点击日期查看对应航班</span></div>
    <div className="price-calendar-body">
      <button className="cal-arrow cal-arrow-left" onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })} aria-label="向左"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M10 3l-5 5 5 5" stroke="#666" strokeWidth="1.5" fill="none" /></svg></button>
      <div className="cal-scroll" ref={scrollRef}>{items.map((item) => (
        <div key={item.date} className={'cal-item' + (item.isCurrent ? ' cal-item-current' : '') + (item.isLowest ? ' cal-item-lowest' : '')} onClick={() => onSelect(item.date)}>
          <div className="cal-date">{item.weekday}</div><div className={'cal-price' + (item.isLowest ? ' cal-price-lowest' : '')}>{item.price ? formatPrice(item.price) : '—'}</div>{item.isLowest && <span className="cal-badge">低价</span>}
        </div>))}</div>
      <button className="cal-arrow cal-arrow-right" onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })} aria-label="向右"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M6 3l5 5-5 5" stroke="#666" strokeWidth="1.5" fill="none" /></svg></button>
    </div>
  </div>)
}
