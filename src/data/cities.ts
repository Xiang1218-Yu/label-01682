import type { Airport } from '../types/flight'

export const popularCities: Airport[] = [
  { code: 'PEK', name: '北京首都国际机场' },
  { code: 'PKX', name: '北京大兴国际机场' },
  { code: 'PVG', name: '上海浦东国际机场' },
  { code: 'SHA', name: '上海虹桥国际机场' },
  { code: 'CAN', name: '广州白云国际机场' },
  { code: 'SZX', name: '深圳宝安国际机场' },
  { code: 'CTU', name: '成都天府国际机场' },
  { code: 'HKG', name: '香港国际机场' },
  { code: 'NRT', name: '东京成田国际机场' },
  { code: 'ICN', name: '首尔仁川国际机场' },
  { code: 'SIN', name: '新加坡樟宜机场' },
  { code: 'BKK', name: '曼谷素万那普机场' },
  { code: 'JFK', name: '纽约肯尼迪国际机场' },
  { code: 'LAX', name: '洛杉矶国际机场' },
  { code: 'LHR', name: '伦敦希思罗机场' },
  { code: 'CDG', name: '巴黎戴高乐机场' },
  { code: 'SYD', name: '悉尼金斯福德机场' },
  { code: 'DXB', name: '迪拜国际机场' },
  { code: 'KIX', name: '大阪关西国际机场' },
  { code: 'TPE', name: '台北桃园国际机场' },
]

export function searchCities(keyword: string): Airport[] {
  if (!keyword.trim()) return popularCities.slice(0, 8)
  const kw = keyword.toLowerCase()
  return popularCities.filter(
    (c) =>
      c.name.toLowerCase().includes(kw) ||
      c.code.toLowerCase().includes(kw)
  )
}
