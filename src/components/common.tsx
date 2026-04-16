import { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'

export interface ToastItem { id: number; message: string; type: 'success' | 'error' | 'info'; exiting?: boolean }

export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const addToast = useCallback((message: string, type: ToastItem['type'] = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.map((t) => t.id === id ? { ...t, exiting: true } : t)), 2500)
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }, [])
  return { toasts, addToast }
}

export function ToastContainer({ toasts }: { toasts: ToastItem[] }) {
  return (<div className="toast-container" role="alert" aria-live="polite">{toasts.map((t) => (
    <div key={t.id} className={'toast toast-' + t.type + (t.exiting ? ' toast-exiting' : '')}><span className="toast-icon">{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}</span>{t.message}</div>
  ))}</div>)
}

export function ConfirmModal({ visible, title, message, onConfirm, onCancel }: { visible: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  if (!visible) return null
  return (<div className="modal-overlay" onClick={onCancel}><div className="modal-card" onClick={(e) => e.stopPropagation()}>
    <div className="modal-icon modal-icon-info">✈</div><div className="modal-title">{title}</div><div className="modal-message">{message}</div>
    <div className="modal-actions"><button className="modal-btn modal-btn-secondary" onClick={onCancel}>取消</button><button className="modal-btn modal-btn-primary" onClick={onConfirm}>确认预订</button></div>
  </div></div>)
}

export function NoticeBanner({ dataUpdatedAt }: { dataUpdatedAt?: string }) {
  const updateTime = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleString('zh-CN', { hour12: false }) : ''
  return (<div className="notice-banner"><span className="notice-icon"><svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="8" stroke="#ff9800" strokeWidth="1.5" fill="none" /><text x="7" y="13" fontSize="12" fill="#ff9800" fontWeight="bold">!</text></svg></span><span className="notice-text">温馨提示：国际航班请提前3小时到达机场办理值机手续，请确认护照及签证有效期。部分航线价格含税费，具体以订单页为准。{updateTime && <><br/>数据更新时间：{updateTime}　价格与余票由系统实时计算，以实际支付时为准。</>}</span></div>)
}

export function SkeletonLoading() {
  return (<div className="skeleton-list">{[1, 2, 3].map((i) => (<div key={i} className="skeleton-card" style={{ animationDelay: i * 0.1 + 's' }}>
    <div className="skeleton-row"><div className="skeleton-circle" /><div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, gap: 8 }}><div className="skeleton-block" style={{ width: '40%', height: 14 }} /><div className="skeleton-block" style={{ width: '25%', height: 10 }} /></div>
      <div className="skeleton-block" style={{ width: 60, height: 28 }} /><div className="skeleton-block" style={{ width: 80, height: 12 }} /><div className="skeleton-block" style={{ width: 60, height: 28 }} />
      <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end', gap: 6 }}><div className="skeleton-block" style={{ width: 80, height: 24 }} /><div className="skeleton-block" style={{ width: 60, height: 12 }} /><div className="skeleton-block" style={{ width: 72, height: 34, borderRadius: 6 }} /></div>
    </div></div>))}</div>)
}

interface ChatMsg { id: number; role: 'user' | 'agent'; text: string }

const QUICK_QUESTIONS = ['如何退改签？', '行李额度是多少？', '如何选座？', '航班延误怎么办？']

const AUTO_REPLIES: Record<string, string> = {
  '如何退改签？': '您好！退改签规则因航司和票价类型不同而异。一般经济舱特价票不可退改，全价票可免费退改。具体费用请在订单详情页查看退改签规则，或拨打客服热线 400-820-6666。',
  '行李额度是多少？': '国内航班经济舱通常免费托运20kg，商务舱30kg，头等舱40kg。国际航班一般允许托运1-2件（每件≤23kg）。具体以您购票时的行李政策为准。',
  '如何选座？': '您可以在订单完成后，前往航司官网或APP进行在线选座。部分航班支持值机时免费选座，也可在机场柜台办理。',
  '航班延误怎么办？': '航班延误时，航司会通过短信通知最新动态。延误超过4小时可申请改签或退票。如需协助，请联系客服热线 400-820-6666，我们将为您优先处理。',
}

const DEFAULT_REPLY = '感谢您的咨询！您的问题已记录，客服专员将在5分钟内为您解答。如需紧急帮助，请拨打24小时客服热线：400-820-6666。'

function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: 1, role: 'agent', text: '您好！我是智能客服小程，很高兴为您服务。请问有什么可以帮您？' },
  ])
  const [input, setInput] = useState('')
  const listRef = useCallback((node: HTMLDivElement | null) => {
    if (node) node.scrollTop = node.scrollHeight
  }, [messages]) // eslint-disable-line react-hooks/exhaustive-deps

  const sendMsg = useCallback((text: string) => {
    if (!text.trim()) return
    const userMsg: ChatMsg = { id: Date.now(), role: 'user', text: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTimeout(() => {
      const reply = AUTO_REPLIES[text.trim()] || DEFAULT_REPLY
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'agent', text: reply }])
    }, 600)
  }, [])

  return (<div className="chat-panel">
    <div className="chat-header">
      <span className="chat-header-title">在线客服</span>
      <button className="chat-close-btn" onClick={onClose} aria-label="关闭客服">✕</button>
    </div>
    <div className="chat-messages" ref={listRef}>
      {messages.map((m) => (
        <div key={m.id} className={'chat-msg chat-msg-' + m.role}>
          <div className="chat-bubble">{m.text}</div>
        </div>
      ))}
    </div>
    <div className="chat-quick">{QUICK_QUESTIONS.map((q) => (
      <button key={q} className="chat-quick-btn" onClick={() => sendMsg(q)}>{q}</button>
    ))}</div>
    <div className="chat-input-bar">
      <input className="chat-input" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') sendMsg(input) }} placeholder="请输入您的问题..." />
      <button className="chat-send-btn" onClick={() => sendMsg(input)}>发送</button>
    </div>
  </div>)
}

export function Sidebar() {
  const [chatOpen, setChatOpen] = useState(false)
  return (<div className="sidebar-float">
    {chatOpen && createPortal(<ChatPanel onClose={() => setChatOpen(false)} />, document.body)}
    <button className="sidebar-btn" title="在线客服" aria-label="在线客服" onClick={() => setChatOpen((v) => !v)}><svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 2a7 7 0 00-7 7v1a2 2 0 002 2h1v-3a5 5 0 0110 0v3h1a2 2 0 002-2V9a7 7 0 00-7-7z" fill="#00b894" /><rect x="5" y="10" width="3" height="5" rx="1.5" fill="#00b894" /><rect x="12" y="10" width="3" height="5" rx="1.5" fill="#00b894" /><path d="M7 17a3 3 0 003 3h0a3 3 0 003-3" stroke="#00b894" strokeWidth="1.5" fill="none" /></svg><span className="sidebar-label">客服</span></button>
    <button className="sidebar-btn" title="返回顶部" aria-label="返回顶部" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 16V4M5 9l5-5 5 5" stroke="#00b894" strokeWidth="2" fill="none" /></svg><span className="sidebar-label">顶部</span></button>
  </div>)
}
