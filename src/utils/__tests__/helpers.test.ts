import { describe, it, expect } from 'vitest'
import { formatPrice, formatDateCN, getWeekdayCN } from '../helpers'

describe('formatPrice', () => {
  it('formats integer price with ¥ prefix', () => {
    expect(formatPrice(3280)).toBe('¥3,280')
  })

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('¥0')
  })

  it('formats large numbers with commas', () => {
    expect(formatPrice(12345678)).toBe('¥12,345,678')
  })

  it('formats decimal numbers', () => {
    expect(formatPrice(1999.5)).toBe('¥1,999.5')
  })
})

describe('formatDateCN', () => {
  it('formats YYYY-MM-DD to Chinese date', () => {
    expect(formatDateCN('2024-01-15')).toBe('2024年1月15日')
  })

  it('formats month without leading zero', () => {
    expect(formatDateCN('2024-03-05')).toBe('2024年3月5日')
  })

  it('returns empty string for empty input', () => {
    expect(formatDateCN('')).toBe('')
  })

  it('handles December correctly', () => {
    expect(formatDateCN('2024-12-31')).toBe('2024年12月31日')
  })
})

describe('getWeekdayCN', () => {
  it('returns 周一 for a known Monday', () => {
    // 2024-01-15 is a Monday
    expect(getWeekdayCN('2024-01-15')).toBe('周一')
  })

  it('returns 周日 for a known Sunday', () => {
    // 2024-01-14 is a Sunday
    expect(getWeekdayCN('2024-01-14')).toBe('周日')
  })

  it('returns 周六 for a known Saturday', () => {
    // 2024-01-13 is a Saturday
    expect(getWeekdayCN('2024-01-13')).toBe('周六')
  })

  it('returns correct weekday for all days of a week', () => {
    const expected = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    const dates = ['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19', '2024-01-20', '2024-01-21']
    dates.forEach((date, i) => {
      expect(getWeekdayCN(date)).toBe(expected[i])
    })
  })
})
