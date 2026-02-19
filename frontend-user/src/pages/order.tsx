import { useState, useEffect } from 'react'
import { fetchFlightDetail } from '../services/api'
import { formatPrice } from '../utils/helpers'
import type { FlightOffer, FlightSegment } from '../types/flight'
import './order.css'

function OrderPage({ flightId, onBack }: { flightId: string; onBack: () => void }) {
  const [flight, setFlight] = useState<FlightOffer | null>(null)
  const [flightLoading, setFlightLoading] = useState(true)
  const [flightError, setFlightError] = useState('')
  const [form, setForm] = useState({ name: '', idType: 'passport' as 'passport' | 'idcard', idNumber: '', phone: '', email: '' })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    window.scrollTo({ top: 0 })
    let cancelled = false
    setFlightLoading(true)
    setFlightError('')
    fetchFlightDetail(flightId)
      .then((res) => { if (!cancelled) setFlight(res.flight) })
      .catch((err) => { if (!cancelled) setFlightError(err.message || '加载航班信息失败') })
      .finally(() => { if (!cancelled) setFlightLoading(false) })
    return () => { cancelled = true }
  }, [flightId])

  if (flightLoading) {
    return (
      <div className="order-page">
        <div className="order-container">
          <div className="order-empty">
            <p>正在加载航班信息...</p>
          </div>
        </div>
      </div>
    )
  }

  if (flightError || !flight) {
    return (
      <div className="order-page">
        <div className="order-container">
          <div className="order-empty">
            <p>{flightError || '未找到航班信息'}</p>
            <button className="order-back-btn" onClick={onBack}>返回搜索</button>
          </div>
        </div>
      </div>
    )
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = '请输入乘客姓名'
    if (!form.idNumber.trim()) errs.idNumber = '请输入证件号码'
    if (!form.phone.trim()) errs.phone = '请输入手机号码'
    else if (!/^1\d{10}$/.test(form.phone)) errs.phone = '手机号格式不正确'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = '邮箱格式不正确'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    setSubmitted(true)
  }

  const seg0 = flight.segments[0]
  const segLast = flight.segments[flight.segments.length - 1]

  if (submitted) {
    return (
      <div className="order-page">
        <div className="order-container">
          <div className="order-success-card">
            <div className="order-success-icon">✓</div>
            <h2 className="order-success-title">订单提交成功</h2>
            <p className="order-success-desc">您的机票订单已提交，订单号：{'ORD' + Date.now().toString(36).toUpperCase()}</p>
            <div className="order-success-flight">
              <span>{seg0.departAirport.name}</span>
              <span className="order-success-arrow">→</span>
              <span>{segLast.arriveAirport.name}</span>
            </div>
            <p className="order-success-price">支付金额：{formatPrice(flight.totalPrice)}</p>
            <p className="order-success-tip">请在30分钟内完成支付，超时订单将自动取消。</p>
            <button className="order-back-btn" onClick={onBack}>返回搜索</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="order-page">
      <div className="order-container">
        <div className="order-header">
          <button className="order-back-link" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
            返回搜索结果
          </button>
          <h1 className="order-title">订单填写</h1>
        </div>

        <div className="order-flight-summary">
          <h3 className="order-section-title">航班信息</h3>
          {flight.segments.map((seg: FlightSegment, i: number) => (
            <div key={i} className="order-segment">
              <div className="order-seg-airline">
                <span className="order-airline-badge">{seg.airline.slice(0, 2)}</span>
                <div>
                  <div className="order-airline-name">{seg.airline} {seg.flightNo}</div>
                  <div className="order-aircraft">{seg.aircraftType}</div>
                </div>
              </div>
              <div className="order-seg-route">
                <div className="order-seg-point">
                  <span className="order-seg-time">{seg.departTime}</span>
                  <span className="order-seg-airport">{seg.departAirport.name}</span>
                </div>
                <div className="order-seg-duration">
                  <span>{seg.duration}</span>
                  <div className="order-seg-line" />
                  <span className="order-seg-stops">{seg.stops === 0 ? '直飞' : '经停' + seg.stops + '站'}</span>
                </div>
                <div className="order-seg-point">
                  <span className="order-seg-time">{seg.arriveTime}</span>
                  <span className="order-seg-airport">{seg.arriveAirport.name}</span>
                </div>
              </div>
              {i < flight.segments.length - 1 && <div className="order-transfer-tag">✈ 中转换乘</div>}
            </div>
          ))}
        </div>

        <div className="order-passenger-form">
          <h3 className="order-section-title">乘客信息</h3>
          <div className="order-form-grid">
            <div className="order-field">
              <label className="order-label">乘客姓名 <span className="order-required">*</span></label>
              <input className={'order-input' + (errors.name ? ' order-input-error' : '')} placeholder="请输入姓名（与证件一致）" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              {errors.name && <span className="order-error">{errors.name}</span>}
            </div>
            <div className="order-field">
              <label className="order-label">证件类型</label>
              <select className="order-select" value={form.idType} onChange={(e) => setForm((f) => ({ ...f, idType: e.target.value as 'passport' | 'idcard' }))}>
                <option value="passport">护照</option>
                <option value="idcard">身份证</option>
              </select>
            </div>
            <div className="order-field">
              <label className="order-label">证件号码 <span className="order-required">*</span></label>
              <input className={'order-input' + (errors.idNumber ? ' order-input-error' : '')} placeholder="请输入证件号码" value={form.idNumber} onChange={(e) => setForm((f) => ({ ...f, idNumber: e.target.value }))} />
              {errors.idNumber && <span className="order-error">{errors.idNumber}</span>}
            </div>
            <div className="order-field">
              <label className="order-label">手机号码 <span className="order-required">*</span></label>
              <input className={'order-input' + (errors.phone ? ' order-input-error' : '')} placeholder="请输入手机号码" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              {errors.phone && <span className="order-error">{errors.phone}</span>}
            </div>
            <div className="order-field order-field-full">
              <label className="order-label">电子邮箱</label>
              <input className={'order-input' + (errors.email ? ' order-input-error' : '')} placeholder="选填，用于接收行程单" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              {errors.email && <span className="order-error">{errors.email}</span>}
            </div>
          </div>
        </div>

        <div className="order-price-summary">
          <h3 className="order-section-title">价格明细</h3>
          <div className="order-price-rows">
            <div className="order-price-row"><span>机票价格</span><span>{formatPrice(flight.price)}</span></div>
            <div className="order-price-row"><span>税费</span><span>{formatPrice(flight.tax)}</span></div>
            <div className="order-price-row"><span>舱位</span><span>{flight.cabinClass}</span></div>
            <div className="order-price-row"><span>退改签</span><span>{flight.refundable ? '支持退改签' : '不可退改签'}</span></div>
            <div className="order-price-row order-price-total"><span>应付总额</span><span>{formatPrice(flight.totalPrice)}</span></div>
          </div>
        </div>

        <div className="order-actions">
          <button className="order-cancel-btn" onClick={onBack}>取消</button>
          <button className="order-submit-btn" onClick={handleSubmit}>提交订单　{formatPrice(flight.totalPrice)}</button>
        </div>
      </div>
    </div>
  )
}

export default OrderPage
