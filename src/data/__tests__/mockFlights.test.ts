import { describe, it, expect } from 'vitest'
import { mockFlights, searchMockFlights, generatePriceCalendar } from '../mockFlights'

describe('mockFlights', () => {
  it('contains 15 flight offers across all cabin classes', () => {
    expect(mockFlights).toHaveLength(15)
  })

  it('each flight has required fields', () => {
    mockFlights.forEach((flight) => {
      expect(flight.id).toBeTruthy()
      expect(flight.segments.length).toBeGreaterThanOrEqual(1)
      expect(flight.price).toBeGreaterThan(0)
      expect(flight.tax).toBeGreaterThan(0)
      expect(flight.totalPrice).toBeGreaterThan(0)
      expect(flight.currency).toBe('CNY')
      expect(flight.cabinClass).toBeTruthy()
      expect(flight.seatsLeft).toBeGreaterThan(0)
      expect(typeof flight.refundable).toBe('boolean')
    })
  })

  it('totalPrice equals price + tax for all flights', () => {
    mockFlights.forEach((flight) => {
      expect(flight.totalPrice).toBe(flight.price + flight.tax)
    })
  })

  it('has unique flight IDs', () => {
    const ids = mockFlights.map((f) => f.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('each segment has valid airport data', () => {
    mockFlights.forEach((flight) => {
      flight.segments.forEach((seg) => {
        expect(seg.departAirport.code.length).toBe(3)
        expect(seg.departAirport.name).toBeTruthy()
        expect(seg.arriveAirport.code.length).toBe(3)
        expect(seg.arriveAirport.name).toBeTruthy()
        expect(seg.airline).toBeTruthy()
        expect(seg.flightNo).toBeTruthy()
        expect(seg.aircraftType).toBeTruthy()
        expect(seg.duration).toMatch(/\d+h\d+m/)
      })
    })
  })

  it('includes direct flights', () => {
    const direct = mockFlights.filter((f) => f.segments.length === 1 && f.segments[0].stops === 0)
    expect(direct.length).toBeGreaterThan(0)
  })

  it('includes transfer flights', () => {
    const transfer = mockFlights.filter((f) => f.segments.length > 1)
    expect(transfer.length).toBeGreaterThan(0)
  })

  it('includes codeshare flights', () => {
    const codeshare = mockFlights.filter((f) => f.segments.some((s) => s.isCodeShare))
    expect(codeshare.length).toBeGreaterThan(0)
    codeshare.forEach((f) => {
      f.segments.filter((s) => s.isCodeShare).forEach((s) => {
        expect(s.operatingAirline).toBeTruthy()
      })
    })
  })

  it('includes all four cabin classes', () => {
    const cabins = new Set(mockFlights.map((f) => f.cabinClass))
    expect(cabins).toContain('经济舱')
    expect(cabins).toContain('超级经济舱')
    expect(cabins).toContain('商务舱')
    expect(cabins).toContain('头等舱')
  })
})

describe('searchMockFlights', () => {
  it('returns all flights when no params', () => {
    expect(searchMockFlights('', '')).toHaveLength(15)
  })

  it('filters by departure airport', () => {
    const results = searchMockFlights('PEK', '')
    expect(results.length).toBeGreaterThan(0)
    results.forEach((f) => {
      expect(f.segments.some((s) => s.departAirport.code === 'PEK')).toBe(true)
    })
  })

  it('filters by cabin class', () => {
    const economy = searchMockFlights('', '', '经济舱')
    const business = searchMockFlights('', '', '商务舱')
    economy.forEach((f) => expect(f.cabinClass).toBe('经济舱'))
    business.forEach((f) => expect(f.cabinClass).toBe('商务舱'))
    expect(economy.length).toBeGreaterThan(business.length)
  })

  it('filters by route and cabin combined', () => {
    const results = searchMockFlights('PEK', 'JFK', '商务舱')
    results.forEach((f) => {
      expect(f.cabinClass).toBe('商务舱')
      expect(f.segments[0].departAirport.code).toBe('PEK')
    })
  })
})

describe('generatePriceCalendar', () => {
  const items = generatePriceCalendar('2024-06-15')

  it('returns 14 items', () => {
    expect(items).toHaveLength(14)
  })

  it('each item has required fields', () => {
    items.forEach((item) => {
      expect(item.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(item.weekday).toBeTruthy()
      expect(typeof item.price).toBe('number')
      expect(typeof item.isLowest).toBe('boolean')
      expect(typeof item.isCurrent).toBe('boolean')
    })
  })

  it('has exactly one current item', () => {
    const current = items.filter((i) => i.isCurrent)
    expect(current).toHaveLength(1)
    expect(current[0].date).toBe('2024-06-15')
  })

  it('has at least one lowest price item', () => {
    const lowest = items.filter((i) => i.isLowest)
    expect(lowest.length).toBeGreaterThanOrEqual(1)
  })

  it('lowest flag matches actual minimum price', () => {
    const prices = items.map((i) => i.price).filter((p): p is number => p !== null)
    const minPrice = Math.min(...prices)
    items.forEach((item) => {
      if (item.isLowest) expect(item.price).toBe(minPrice)
    })
  })

  it('dates are in chronological order', () => {
    for (let i = 1; i < items.length; i++) {
      expect(new Date(items[i].date).getTime()).toBeGreaterThan(new Date(items[i - 1].date).getTime())
    }
  })

  it('weekday label includes date and Chinese weekday', () => {
    items.forEach((item) => {
      expect(item.weekday).toMatch(/\d{2}-\d{2} 周[日一二三四五六]/)
    })
  })

  it('prices vary by route and cabin', () => {
    const economyItems = generatePriceCalendar('2024-06-15', 'PEK', 'JFK', '经济舱')
    const businessItems = generatePriceCalendar('2024-06-15', 'PEK', 'JFK', '商务舱')
    const ecoPrice = economyItems.find((i) => i.isCurrent)!.price!
    const bizPrice = businessItems.find((i) => i.isCurrent)!.price!
    expect(bizPrice).toBeGreaterThan(ecoPrice)
  })
})
