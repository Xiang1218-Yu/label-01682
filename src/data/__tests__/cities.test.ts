import { describe, it, expect } from 'vitest'
import { searchCities, popularCities } from '../cities'

describe('popularCities', () => {
  it('contains at least 10 airports', () => {
    expect(popularCities.length).toBeGreaterThanOrEqual(10)
  })

  it('each airport has code and name', () => {
    popularCities.forEach((city) => {
      expect(city.code).toBeTruthy()
      expect(city.name).toBeTruthy()
      expect(city.code.length).toBe(3)
    })
  })

  it('has unique airport codes', () => {
    const codes = popularCities.map((c) => c.code)
    expect(new Set(codes).size).toBe(codes.length)
  })
})

describe('searchCities', () => {
  it('returns 8 results for empty keyword', () => {
    const results = searchCities('')
    expect(results).toHaveLength(8)
  })

  it('returns 8 results for whitespace-only keyword', () => {
    const results = searchCities('   ')
    expect(results).toHaveLength(8)
  })

  it('filters by Chinese name', () => {
    const results = searchCities('北京')
    expect(results.length).toBeGreaterThanOrEqual(1)
    results.forEach((r) => {
      expect(r.name).toContain('北京')
    })
  })

  it('filters by airport code (case-insensitive)', () => {
    const results = searchCities('jfk')
    expect(results).toHaveLength(1)
    expect(results[0].code).toBe('JFK')
  })

  it('filters by uppercase code', () => {
    const results = searchCities('PEK')
    expect(results.length).toBeGreaterThanOrEqual(1)
    expect(results[0].code).toBe('PEK')
  })

  it('returns empty array for non-matching keyword', () => {
    const results = searchCities('zzzzzzz')
    expect(results).toHaveLength(0)
  })

  it('matches partial name', () => {
    const results = searchCities('国际')
    expect(results.length).toBeGreaterThan(0)
    results.forEach((r) => {
      expect(r.name.toLowerCase()).toContain('国际')
    })
  })
})
