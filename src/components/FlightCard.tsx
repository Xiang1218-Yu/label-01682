import { useState } from 'react'
import { formatPrice } from '../utils/helpers'
import type { FlightOffer, FlightSegment } from '../types/flight'

function SegmentDisplay({ seg, isLast }: { seg: FlightSegment; isLast: boolean }) {
  return (<div className="segment-row">
    <div className="seg-airline"><div className="airline-logo-placeholder">{seg.airline.slice(0, 2)}</div><div className="airline-info"><span className="airline-name">{seg.airline}</span><span className="flight-no">{seg.flightNo} · {seg.aircraftType}</span>{seg.isCodeShare && <span className="code-share-tag">共享 | 实际承运: {seg.operatingAirline}</span>}</div></div>
    <div className="seg-time-depart"><span className="time-big">{seg.departTime}</span><span className="airport-name">{seg.departAirport.name}</span>{seg.departAirport.terminal && <span className="terminal">{seg.departAirport.terminal}</span>}</div>
    <div className="seg-duration"><span className="duration-text">{seg.duration}</span><div className="duration-line"><span className="duration-dot" /><span className="duration-bar" />{seg.stops > 0 && seg.stopCities?.map((c, i) => <span key={i} className="stop-dot" title={c} />)}<span className="duration-dot" /></div>{seg.stops > 0 && <span className="stops-text">{'经停' + seg.stops + '站'}</span>}</div>
    <div className="seg-time-arrive"><span className="time-big">{seg.arriveTime}</span><span className="airport-name">{seg.arriveAirport.name}</span>{seg.arriveAirport.terminal && <span className="terminal">{seg.arriveAirport.terminal}</span>}</div>
    {!isLast && <div className="segment-connector">中转</div>}
  </div>)
}

function FlightDetailPanel({ flight }: { flight: FlightOffer }) {
  return (<div className="flight-detail-panel">
    <div className="detail-section"><h4 className="detail-title">航班详情</h4>{flight.segments.map((seg, i) => (<div key={i} className="detail-segment">
      <div className="detail-row"><span className="detail-label">航空公司</span><span className="detail-value">{seg.airline}</span></div>
      <div className="detail-row"><span className="detail-label">航班号</span><span className="detail-value">{seg.flightNo}</span></div>
      <div className="detail-row"><span className="detail-label">机型</span><span className="detail-value">{seg.aircraftType}</span></div>
      <div className="detail-row"><span className="detail-label">出发</span><span className="detail-value">{seg.departTime} {seg.departAirport.name} {seg.departAirport.terminal || ''}</span></div>
      <div className="detail-row"><span className="detail-label">到达</span><span className="detail-value">{seg.arriveTime} {seg.arriveAirport.name} {seg.arriveAirport.terminal || ''}</span></div>
      <div className="detail-row"><span className="detail-label">飞行时长</span><span className="detail-value">{seg.duration}</span></div>
      {seg.isCodeShare && <div className="detail-row"><span className="detail-label">实际承运</span><span className="detail-value">{seg.operatingAirline}</span></div>}
      {i < flight.segments.length - 1 && <div className="detail-transfer">✈ 中转换乘</div>}
    </div>))}</div>
    <div className="detail-section"><h4 className="detail-title">价格明细</h4>
      <div className="detail-row"><span className="detail-label">票价</span><span className="detail-value">{formatPrice(flight.price)}</span></div>
      <div className="detail-row"><span className="detail-label">税费</span><span className="detail-value">{formatPrice(flight.tax)}</span></div>
      <div className="detail-row detail-row-total"><span className="detail-label">合计</span><span className="detail-value price-total">{formatPrice(flight.totalPrice)}</span></div>
    </div>
    <div className="detail-section"><h4 className="detail-title">退改签规则</h4><div className="detail-row"><span className="detail-value">{flight.refundable ? '支持退改签（具体费用以航司规定为准）' : '不可退改签'}</span></div></div>
  </div>)
}

export function FlightCard({ flight, onSelect }: { flight: FlightOffer; onSelect: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false); const [selecting, setSelecting] = useState(false)
  const handleSelect = () => { setSelecting(true); setTimeout(() => { setSelecting(false); onSelect(flight.id) }, 800) }
  const totalDuration = flight.segments.length === 1 ? flight.segments[0].duration : flight.segments.map((s) => s.duration).join(' + ')
  const isDirect = flight.segments.length === 1 && flight.segments[0].stops === 0
  return (<div className={'flight-card' + (expanded ? ' flight-card-expanded' : '')}>
    <div className="flight-card-main">
      <div className="card-segments">{flight.segments.map((seg, i) => <SegmentDisplay key={i} seg={seg} isLast={i === flight.segments.length - 1} />)}</div>
      <div className="card-right">
        <div className="card-tags">{flight.tags?.map((tag) => (<span key={tag} className={'flight-tag' + (tag === '最低价' ? ' tag-lowest' : tag === '可退改' ? ' tag-refund' : tag === '五星航司' ? ' tag-star' : '')}>{tag}</span>))}</div>
        <div className="card-price-area"><span className="price-main">{formatPrice(flight.price)}</span><span className="price-tax">含税 {formatPrice(flight.totalPrice)}</span></div>
        <div className="card-meta"><span>{flight.seatsLeft <= 5 ? <span className="seats-warning">仅剩{flight.seatsLeft}张</span> : '余票' + flight.seatsLeft + '张'}</span><span>{flight.cabinClass}</span></div>
        <button className="select-btn" disabled={selecting} onClick={handleSelect}>{selecting ? <span className="spinner spinner-white" /> : '选择'}</button>
      </div>
    </div>
    <div className="card-footer"><button className="detail-toggle" onClick={() => setExpanded(!expanded)}>{expanded ? '收起详情' : '航班详情'}<svg width="12" height="12" viewBox="0 0 12 12" className={'toggle-arrow' + (expanded ? ' toggle-arrow-up' : '')}><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg></button>
      <div className="card-footer-info">{!isDirect && <span className="transfer-badge">中转 {flight.segments.length - 1} 次</span>}<span>总时长 {totalDuration}</span></div></div>
    {expanded && <FlightDetailPanel flight={flight} />}
  </div>)
}
