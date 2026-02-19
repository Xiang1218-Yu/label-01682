/**
 * 航班搜索后端服务 — Express REST API
 *
 * 端点：
 *   GET  /api/flights/search?from=PEK&to=JFK&cabinClass=经济舱&date=2026-02-19
 *   GET  /api/flights/:id
 *   GET  /api/flights/calendar?currentDate=...&from=...&to=...&cabinClass=...
 *   GET  /api/cities?keyword=北京
 *   GET  /api/health
 */

import express from 'express'
import cors from 'cors'
import { searchFlights, generatePriceCalendar, getFlightById, searchCities } from './data.js'

const app = express()
const PORT = parseInt(process.env.PORT || '3001', 10)

app.use(cors())
app.use(express.json())

// ─── 健康检查 ───
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── 航班搜索 ───
app.get('/api/flights/search', (req, res) => {
  const { from, to, cabinClass, date } = req.query
  if (!from || !to) {
    res.status(400).json({ error: '出发地和目的地不能为空', code: 'INVALID_PARAMS' })
    return
  }
  if (from === to) {
    res.status(400).json({ error: '出发城市和到达城市不能相同', code: 'SAME_CITY' })
    return
  }
  const flights = searchFlights(
    String(from), String(to),
    cabinClass ? String(cabinClass) : undefined,
    date ? String(date) : undefined,
  )
  res.json({
    flights,
    timestamp: new Date().toISOString(),
    dataUpdatedAt: new Date().toISOString(),
    total: flights.length,
  })
})

// ─── 价格日历 ───
app.get('/api/flights/calendar', (req, res) => {
  const { currentDate, from, to, cabinClass } = req.query
  if (!currentDate) {
    res.status(400).json({ error: '日期参数不能为空', code: 'INVALID_PARAMS' })
    return
  }
  const items = generatePriceCalendar(
    String(currentDate),
    from ? String(from) : undefined,
    to ? String(to) : undefined,
    cabinClass ? String(cabinClass) : undefined,
  )
  res.json({ items, timestamp: new Date().toISOString(), dataUpdatedAt: new Date().toISOString() })
})

// ─── 航班详情 ───
app.get('/api/flights/:id', (req, res) => {
  const flight = getFlightById(req.params.id)
  if (!flight) {
    res.status(404).json({ error: '航班不存在', code: 'NOT_FOUND' })
    return
  }
  res.json({ flight, timestamp: new Date().toISOString(), dataUpdatedAt: new Date().toISOString() })
})

// ─── 城市搜索 ───
app.get('/api/cities', (req, res) => {
  const keyword = req.query.keyword ? String(req.query.keyword) : ''
  const cities = searchCities(keyword)
  res.json({ cities, timestamp: new Date().toISOString() })
})

// ─── 启动 ───
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Flight API] 后端服务已启动 http://0.0.0.0:${PORT}`)
  console.log(`[Flight API] 健康检查 http://localhost:${PORT}/api/health`)
})

export default app
