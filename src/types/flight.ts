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
export type SortField = 'price' | 'departTime' | 'arriveTime' | 'duration'
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
}

export interface FilterOptions {
  airlines: string[]
  departTimeRange: [number, number]
  arriveTimeRange: [number, number]
  stops: number[]
  onlyDirect: boolean
}

export interface SortOption {
  field: SortField
  order: SortOrder
}
