export interface Airport {
  code: string
  name: string
  terminal?: string
}

export interface FlightSegment {
  airline: string
  airlineLogo: string
  flightNo: string
  aircraftType: string
  departTime: string
  arriveTime: string
  departAirport: Airport
  arriveAirport: Airport
  duration: string
  stops: number
  stopCities?: string[]
  isCodeShare: boolean
  operatingAirline?: string
}

export interface FlightOffer {
  id: string
  segments: FlightSegment[]
  price: number
  tax: number
  totalPrice: number
  currency: string
  cabinClass: string
  seatsLeft: number
  refundable: boolean
  tags?: string[]
}

export interface PriceCalendarItem {
  date: string
  weekday: string
  price: number | null
  isLowest?: boolean
  isCurrent?: boolean
}

export type TripType = 'oneway' | 'roundtrip'
export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first'
export type SortField = 'price' | 'departTime' | 'arriveTime' | 'duration' | 'airline'
export type SortOrder = 'asc' | 'desc'

export interface SearchParams {
  tripType: TripType
  from: Airport
  to: Airport
  departDate: string
  returnDate?: string
  passengers: {
    adults: number
    children: number
    infants: number
  }
  cabinClass: CabinClass
  // 多条件搜索扩展字段
  filters?: {
    airlines: string[] // 选中的航空公司列表
    priceRange: [number, number] // 价格范围 [最小值, 最大值]
    departTimeRange: [number, number] // 出发时间段 [开始小时, 结束小时] 0-23
    arriveTimeRange: [number, number] // 到达时间段 [开始小时, 结束小时] 0-23
    stops: number[] // 经停次数 0=直飞,1=经停1次,2=经停2次及以上
    onlyDirect: boolean // 是否只看直飞
  }
}

export interface FilterOptions {
  airlines: string[]
  departTimeRange: [number, number]
  arriveTimeRange: [number, number]
  stops: number[]
  onlyDirect: boolean
  priceRange: [number, number]
}

// 搜索历史项接口
export interface SearchHistoryItem {
  id: string
  params: SearchParams
  timestamp: number
  label: string // 搜索项展示文本
}

export interface SortOption {
  field: SortField
  order: SortOrder
}
