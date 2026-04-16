import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { searchFlights, fetchPriceCalendar, ApiError } from '../services/api'
import { createLogger } from '../utils/logger'
import { getTotalDurationMinutes } from '../utils/helpers'
import type { FlightOffer, PriceCalendarItem, SearchParams, CabinClass, SortField, SortOrder } from '../types/flight'
import { Header, Footer } from '../components/Header'
import { FlightSearchBar } from '../components/SearchBar'
import { FlightCard } from '../components/FlightCard'
import { FilterSortBar } from '../components/FilterSortBar'
import { PriceCalendar } from '../components/PriceCalendar'
import { useToasts, ToastContainer, NoticeBanner, SkeletonLoading, Sidebar } from '../components/common'
import './index.css'

const log = createLogger('FlightSearch')
const today = new Date()
const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')
const CABIN_LABEL_MAP: Record<CabinClass, string> = { economy: '经济舱', premium_economy: '超级经济舱', business: '商务舱', first: '头等舱' }

function IndexPage({ onNavigateToOrder }: { onNavigateToOrder: (flightId: string) => void }) {
  const { toasts, addToast } = useToasts()
  const [searchParams, setSearchParams] = useState<SearchParams>({
    tripType: 'oneway', from: { code: 'PEK', name: '北京首都国际机场' }, to: { code: 'JFK', name: '纽约肯尼迪国际机场' },
    departDate: todayStr, passengers: { adults: 1, children: 0, infants: 0 }, cabinClass: 'economy',
  })
  const [flights, setFlights] = useState<FlightOffer[]>([])
  const [returnFlights, setReturnFlights] = useState<FlightOffer[]>([])
  const [activeLeg, setActiveLeg] = useState<'depart' | 'return'>('depart')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [calendarItems, setCalendarItems] = useState<PriceCalendarItem[]>([])
  const [dataUpdatedAt, setDataUpdatedAt] = useState('')
  const [sort, setSort] = useState<{ field: SortField; order: SortOrder }>({ field: 'price', order: 'asc' })
  const [onlyDirect, setOnlyDirect] = useState(false)
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([])
  const [filterLoading, setFilterLoading] = useState(false)
  const activeFlights = activeLeg === 'return' && searchParams.tripType === 'roundtrip' ? returnFlights : flights
  const allAirlines = useMemo(() => [...new Set(activeFlights.flatMap((f) => f.segments.map((s) => s.airline)))], [activeFlights])
  const filteredFlights = useMemo(() => {
    let result = [...activeFlights]
    if (onlyDirect) result = result.filter((f) => f.segments.length === 1 && f.segments[0].stops === 0)
    if (selectedAirlines.length > 0) result = result.filter((f) => f.segments.some((s) => selectedAirlines.includes(s.airline)))
    result.sort((a, b) => {
      let cmp = 0
      if (sort.field === 'price') cmp = a.price - b.price
      else if (sort.field === 'departTime') cmp = a.segments[0].departTime.localeCompare(b.segments[0].departTime)
      else if (sort.field === 'arriveTime') cmp = a.segments[a.segments.length - 1].arriveTime.localeCompare(b.segments[b.segments.length - 1].arriveTime)
      else if (sort.field === 'duration') cmp = getTotalDurationMinutes(a.segments) - getTotalDurationMinutes(b.segments)
      return sort.order === 'asc' ? cmp : -cmp
    })
    return result
  }, [activeFlights, onlyDirect, selectedAirlines, sort])
  const doSearch = useCallback(async (params: SearchParams) => {
    if (!params.departDate || !params.from.code || !params.to.code) {
      addToast('请填写完整的搜索条件', 'error')
      return
    }
    if (params.from.code === params.to.code) {
      addToast('出发城市和到达城市不能相同', 'error')
      return
    }
    if (params.tripType === 'roundtrip' && params.returnDate && params.returnDate <= params.departDate) {
      addToast('返程日期必须晚于出发日期', 'error')
      return
    }
    if (params.tripType === 'roundtrip' && !params.returnDate) {
      addToast('往返行程请选择返程日期', 'error')
      return
    }
    setSearchParams(params)
    setLoading(true)
    setSearched(true)
    setSelectedAirlines([])
    setActiveLeg('depart')
    const cabinLabel = CABIN_LABEL_MAP[params.cabinClass]
    log.info('搜索航班 ' + params.from.code + ' -> ' + params.to.code + ' ' + cabinLabel)
    try {
      const promises: Promise<any>[] = [
        searchFlights({ from: params.from.code, to: params.to.code, cabinClass: cabinLabel, date: params.departDate }),
        fetchPriceCalendar({ currentDate: params.departDate, from: params.from.code, to: params.to.code, cabinClass: cabinLabel }),
      ]
      if (params.tripType === 'roundtrip' && params.returnDate) {
        promises.push(searchFlights({ from: params.to.code, to: params.from.code, cabinClass: cabinLabel, date: params.returnDate }))
      }
      const results = await Promise.all(promises)
      const searchRes = results[0]
      const calendarRes = results[1]
      setFlights(searchRes.flights)
      setCalendarItems(calendarRes.items)
      setDataUpdatedAt(searchRes.dataUpdatedAt || '')
      if (params.tripType === 'roundtrip' && results[2]) {
        setReturnFlights(results[2].flights)
        addToast('去程 ' + searchRes.flights.length + ' 个航班，返程 ' + results[2].flights.length + ' 个航班', 'success')
      } else {
        setReturnFlights([])
        addToast('找到 ' + searchRes.flights.length + ' 个航班', searchRes.flights.length > 0 ? 'success' : 'info')
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : '搜索请求失败，请稍后重试'
      log.error('搜索失败', { error: String(err) })
      addToast(msg, 'error')
      setFlights([])
      setCalendarItems([])
      setDataUpdatedAt('')
    } finally {
      setLoading(false)
    }
  }, [addToast])
  const initialSearchDone = useRef(false)
  useEffect(() => {
    if (!initialSearchDone.current) {
      initialSearchDone.current = true
      doSearch(searchParams)
    }
  }, [doSearch, searchParams])
  const handleDateSelect = useCallback(async (date: string) => {
    const newParams = { ...searchParams, departDate: date }
    setSearchParams(newParams)
    setLoading(true)
    setSelectedAirlines([])
    const cabinLabel = CABIN_LABEL_MAP[newParams.cabinClass]
    try {
      const [searchRes, calendarRes] = await Promise.all([
        searchFlights({ from: newParams.from.code, to: newParams.to.code, cabinClass: cabinLabel, date }),
        fetchPriceCalendar({ currentDate: date, from: newParams.from.code, to: newParams.to.code, cabinClass: cabinLabel }),
      ])
      setFlights(searchRes.flights)
      setCalendarItems(calendarRes.items)
      setDataUpdatedAt(searchRes.dataUpdatedAt || '')
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : '加载失败，请稍后重试'
      log.error('日期切换失败', { error: String(err) })
      addToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }, [searchParams, addToast])
  const handleSortChange = useCallback((field: SortField) => {
    setFilterLoading(true)
    setTimeout(() => {
      setSort((prev) => ({ field, order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc' }))
      setFilterLoading(false)
    }, 300)
  }, [])
  const handleDirectChange = useCallback((v: boolean) => {
    setFilterLoading(true)
    setTimeout(() => { setOnlyDirect(v); setFilterLoading(false) }, 300)
  }, [])
  const handleAirlineChange = useCallback((v: string[]) => {
    setFilterLoading(true)
    setTimeout(() => { setSelectedAirlines(v); setFilterLoading(false) }, 300)
  }, [])
  const handleSelectFlight = useCallback((flightId: string) => {
    onNavigateToOrder(flightId)
  }, [onNavigateToOrder])
  const handleNavToast = useCallback((msg: string) => addToast(msg, 'info'), [addToast])
  return (<div className="page-wrapper">
    <Header onToast={handleNavToast} />
    <ToastContainer toasts={toasts} />
    <main className="main-content"><div className="container">
      <FlightSearchBar params={searchParams} onSearch={doSearch} loading={loading} />
      {searched && calendarItems.length > 0 && <PriceCalendar items={calendarItems} selectedDate={searchParams.departDate} onSelect={handleDateSelect} />}
      {searched && <NoticeBanner dataUpdatedAt={dataUpdatedAt} />}
      {searched && !loading && activeFlights.length > 0 && searchParams.tripType === 'roundtrip' && returnFlights.length > 0 && (
        <div className="leg-tabs">
          <button className={'leg-tab' + (activeLeg === 'depart' ? ' leg-tab-active' : '')} onClick={() => { setActiveLeg('depart'); setSelectedAirlines([]) }}>
            去程　{searchParams.from.code} → {searchParams.to.code}　{searchParams.departDate}
          </button>
          <button className={'leg-tab' + (activeLeg === 'return' ? ' leg-tab-active' : '')} onClick={() => { setActiveLeg('return'); setSelectedAirlines([]) }}>
            返程　{searchParams.to.code} → {searchParams.from.code}　{searchParams.returnDate}
          </button>
        </div>
      )}
      {searched && !loading && activeFlights.length > 0 && <FilterSortBar total={filteredFlights.length} sort={sort} onSortChange={handleSortChange} onlyDirect={onlyDirect} onDirectChange={handleDirectChange} airlines={allAirlines} selectedAirlines={selectedAirlines} onAirlineChange={handleAirlineChange} />}
      {loading ? <SkeletonLoading /> : searched ? (
        filteredFlights.length > 0 ? <div className={'flight-list' + (filterLoading ? ' flight-list-updating' : '')}>{filterLoading && <div className="filter-loading-hint"><span className="spinner" /> 更新中...</div>}{filteredFlights.map((f) => <FlightCard key={f.id} flight={f} onSelect={handleSelectFlight} />)}</div>
        : <div className="empty-state"><p>😔 未找到符合条件的航班，请尝试调整搜索条件</p></div>
      ) : null}
    </div></main>
    <Footer onToast={handleNavToast} />
    <Sidebar />
  </div>)
}

export default IndexPage
