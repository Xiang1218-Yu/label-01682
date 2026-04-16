/**
 * API 服务层 — 前端通过 HTTP 调用后端 REST API。
 *
 * 所有请求发往 /api/* ，开发环境由 Vite proxy 转发到后端 :3001，
 * 生产环境由 Nginx 反向代理。
 *
 * 当后端不可用时，自动降级到本地 mock 数据，确保前端独立可用。
 */

import { createLogger } from '../utils/logger'
import { searchMockFlights, generatePriceCalendar as generateMockCalendar, allMockFlights } from '../data/mockFlights'
import type { FlightOffer, PriceCalendarItem } from '../types/flight'

const log = createLogger('API')

const API_BASE = '/api'

// ─── 类型定义 ───

export interface SearchFlightsParams {
  from: string
  to: string
  cabinClass?: string
  date?: string
}

export interface SearchFlightsResponse {
  flights: FlightOffer[]
  timestamp: string
  dataUpdatedAt: string
  total: number
}

export interface PriceCalendarParams {
  currentDate: string
  from?: string
  to?: string
  cabinClass?: string
}

export interface PriceCalendarResponse {
  items: PriceCalendarItem[]
  timestamp: string
  dataUpdatedAt: string
}

export interface FlightDetailResponse {
  flight: FlightOffer
  timestamp: string
  dataUpdatedAt: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ─── 内部工具 ───

async function request<T>(path: string, params?: Record<string, string | undefined>): Promise<T> {
  const url = new URL(API_BASE + path, window.location.origin)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') url.searchParams.set(k, v)
    })
  }

  log.info('请求 ' + url.pathname + url.search)

  let res: Response
  try {
    res = await fetch(url.toString())
  } catch (err) {
    log.error('网络错误', { error: String(err) })
    throw new ApiError('网络连接失败，请检查网络后重试', 'NETWORK_ERROR')
  }

  const body = await res.json().catch(() => null)

  if (!res.ok) {
    const msg = body?.error || `请求失败 (${res.status})`
    const code = body?.code || 'HTTP_' + res.status
    log.error('接口错误', { status: res.status, code, msg })
    throw new ApiError(msg, code, res.status)
  }

  return body as T
}

// ─── 公开 API（含本地降级） ───

/** 搜索航班 — 后端不可用时降级到本地 mock 数据 */
export async function searchFlights(params: SearchFlightsParams): Promise<SearchFlightsResponse> {
  if (!params.from || !params.to) {
    throw new ApiError('出发地和目的地不能为空', 'INVALID_PARAMS')
  }
  if (params.from === params.to) {
    throw new ApiError('出发城市和到达城市不能相同', 'SAME_CITY')
  }
  try {
    return await request<SearchFlightsResponse>('/flights/search', {
      from: params.from,
      to: params.to,
      cabinClass: params.cabinClass,
      date: params.date,
    })
  } catch (err) {
    if (err instanceof ApiError && (err.code === 'NETWORK_ERROR' || err.code === 'HTTP_502' || err.code === 'HTTP_503' || err.code === 'HTTP_504')) {
      log.warn('后端不可用，降级到本地数据')
      const flights = searchMockFlights(params.from, params.to, params.cabinClass, params.date)
      const now = new Date().toISOString()
      return { flights, timestamp: now, dataUpdatedAt: now, total: flights.length }
    }
    throw err
  }
}

/** 获取价格日历 — 后端不可用时降级到本地 mock 数据 */
export async function fetchPriceCalendar(params: PriceCalendarParams): Promise<PriceCalendarResponse> {
  try {
    return await request<PriceCalendarResponse>('/flights/calendar', {
      currentDate: params.currentDate,
      from: params.from,
      to: params.to,
      cabinClass: params.cabinClass,
    })
  } catch (err) {
    if (err instanceof ApiError && (err.code === 'NETWORK_ERROR' || err.code === 'HTTP_502' || err.code === 'HTTP_503' || err.code === 'HTTP_504')) {
      log.warn('后端不可用，降级到本地价格日历')
      const items = generateMockCalendar(params.currentDate, params.from, params.to, params.cabinClass)
      const now = new Date().toISOString()
      return { items, timestamp: now, dataUpdatedAt: now }
    }
    throw err
  }
}

/** 获取航班详情 — 后端不可用时降级到本地 mock 数据 */
export async function fetchFlightDetail(flightId: string): Promise<FlightDetailResponse> {
  if (!flightId) {
    throw new ApiError('航班 ID 不能为空', 'INVALID_PARAMS')
  }
  try {
    return await request<FlightDetailResponse>('/flights/' + encodeURIComponent(flightId))
  } catch (err) {
    if (err instanceof ApiError && (err.code === 'NETWORK_ERROR' || err.code === 'HTTP_502' || err.code === 'HTTP_503' || err.code === 'HTTP_504')) {
      log.warn('后端不可用，降级到本地航班详情')
      const flight = allMockFlights.find((f) => f.id === flightId)
      if (!flight) throw new ApiError('航班不存在', 'NOT_FOUND')
      const now = new Date().toISOString()
      return { flight, timestamp: now, dataUpdatedAt: now }
    }
    throw err
  }
}
