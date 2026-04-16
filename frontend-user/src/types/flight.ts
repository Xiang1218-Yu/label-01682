/**
 * 机场信息接口
 * 描述机场的基本信息
 */
export interface Airport {
  code: string
  name: string
  terminal?: string
}

/**
 * 航班航段接口
 * 描述航班的一个具体航段信息
 */
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

/**
 * 航班报价接口
 * 描述一个完整的航班报价信息
 */
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

/**
 * 价格日历项接口
 * 描述价格日历中某一天的价格信息
 */
export interface PriceCalendarItem {
  date: string
  weekday: string
  price: number | null
  isLowest?: boolean
  isCurrent?: boolean
}

/**
 * 行程类型
 * oneway: 单程, roundtrip: 往返
 */
export type TripType = 'oneway' | 'roundtrip'

/**
 * 舱位等级类型
 */
export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first'

/**
 * 排序字段类型
 * 支持按价格、起飞时间、到达时间、飞行时长、航空公司排序
 */
export type SortField = 'price' | 'departTime' | 'arriveTime' | 'duration' | 'airline'

/**
 * 排序顺序类型
 * asc: 升序, desc: 降序
 */
export type SortOrder = 'asc' | 'desc'

/**
 * 价格范围接口
 * 用于价格筛选
 */
export interface PriceRange {
  min: number | null
  max: number | null
}

/**
 * 时间范围接口
 * 用于起飞/到达时间段筛选
 */
export interface TimeRange {
  start: number | null
  end: number | null
}

/**
 * 搜索参数接口
 * 包含所有搜索条件
 */
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
  airlines: string[]
  priceRange: PriceRange
  departTimeRange: TimeRange
  arriveTimeRange: TimeRange
  stops: number[]
  onlyDirect: boolean
}

/**
 * 搜索历史项接口
 * 用于存储和展示用户的搜索历史
 */
export interface SearchHistoryItem {
  id: string
  params: SearchParams
  searchTime: string
  label: string
}

/**
 * 筛选选项接口
 * 用于搜索结果的二次筛选
 */
export interface FilterOptions {
  airlines: string[]
  departTimeRange: [number, number]
  arriveTimeRange: [number, number]
  stops: number[]
  onlyDirect: boolean
}

/**
 * 排序选项接口
 * 用于搜索结果排序
 */
export interface SortOption {
  field: SortField
  order: SortOrder
}
