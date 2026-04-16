import type { FlightOffer, PriceCalendarItem } from '../types/flight'

export const allMockFlights: FlightOffer[] = [
  // ===== 经济舱 =====
  {
    id: 'FL001', segments: [{
      airline: '中国国际航空', airlineLogo: '', flightNo: 'CA983', aircraftType: 'Boeing 777-300ER',
      departTime: '13:50', arriveTime: '14:30',
      departAirport: { code: 'PEK', name: '北京首都国际机场', terminal: 'T3' },
      arriveAirport: { code: 'JFK', name: '纽约肯尼迪国际机场', terminal: 'T1' },
      duration: '12h40m', stops: 0, isCodeShare: false,
    }],
    price: 3280, tax: 1652, totalPrice: 4932, currency: 'CNY',
    cabinClass: '经济舱', seatsLeft: 6, refundable: false, tags: ['最低价'],
  },
  {
    id: 'FL002', segments: [{
      airline: '中国东方航空', airlineLogo: '', flightNo: 'MU587', aircraftType: 'Boeing 777-300ER',
      departTime: '18:05', arriveTime: '19:50',
      departAirport: { code: 'PVG', name: '上海浦东国际机场', terminal: 'T1' },
      arriveAirport: { code: 'JFK', name: '纽约肯尼迪国际机场', terminal: 'T1' },
      duration: '13h45m', stops: 0, isCodeShare: false,
    }],
    price: 3560, tax: 1680, totalPrice: 5240, currency: 'CNY',
    cabinClass: '经济舱', seatsLeft: 12, refundable: true, tags: ['可退改'],
  },
  {
    id: 'FL003', segments: [{
      airline: '全日空航空', airlineLogo: '', flightNo: 'NH960', aircraftType: 'Boeing 787-9',
      departTime: '08:35', arriveTime: '13:10',
      departAirport: { code: 'PEK', name: '北京首都国际机场', terminal: 'T3' },
      arriveAirport: { code: 'NRT', name: '东京成田国际机场', terminal: 'T1' },
      duration: '3h35m', stops: 0, isCodeShare: false,
    }, {
      airline: '全日空航空', airlineLogo: '', flightNo: 'NH10', aircraftType: 'Boeing 777-300ER',
      departTime: '17:25', arriveTime: '16:30',
      departAirport: { code: 'NRT', name: '东京成田国际机场', terminal: 'T1' },
      arriveAirport: { code: 'JFK', name: '纽约肯尼迪国际机场', terminal: 'T1' },
      duration: '12h05m', stops: 0, isCodeShare: false,
    }],
    price: 2980, tax: 1520, totalPrice: 4500, currency: 'CNY',
    cabinClass: '经济舱', seatsLeft: 3, refundable: false, tags: ['中转'],
  },
  {
    id: 'FL004', segments: [{
      airline: '国泰航空', airlineLogo: '', flightNo: 'CX347', aircraftType: 'Airbus A350-900',
      departTime: '07:25', arriveTime: '11:15',
      departAirport: { code: 'PEK', name: '北京首都国际机场', terminal: 'T3' },
      arriveAirport: { code: 'HKG', name: '香港国际机场', terminal: 'T1' },
      duration: '3h50m', stops: 0, isCodeShare: false,
    }, {
      airline: '国泰航空', airlineLogo: '', flightNo: 'CX840', aircraftType: 'Boeing 777-300ER',
      departTime: '14:00', arriveTime: '16:55',
      departAirport: { code: 'HKG', name: '香港国际机场', terminal: 'T1' },
      arriveAirport: { code: 'JFK', name: '纽约肯尼迪国际机场', terminal: 'T1' },
      duration: '15h55m', stops: 0, isCodeShare: false,
    }],
    price: 3150, tax: 1580, totalPrice: 4730, currency: 'CNY',
    cabinClass: '经济舱', seatsLeft: 8, refundable: true, tags: ['中转', '可退改'],
  },
  {
    id: 'FL005', segments: [{
      airline: '大韩航空', airlineLogo: '', flightNo: 'KE856', aircraftType: 'Boeing 787-9',
      departTime: '09:10', arriveTime: '12:30',
      departAirport: { code: 'PEK', name: '北京首都国际机场', terminal: 'T2' },
      arriveAirport: { code: 'ICN', name: '首尔仁川国际机场', terminal: 'T2' },
      duration: '2h20m', stops: 0, isCodeShare: false,
    }, {
      airline: '大韩航空', airlineLogo: '', flightNo: 'KE81', aircraftType: 'Airbus A380-800',
      departTime: '15:50', arriveTime: '15:40',
      departAirport: { code: 'ICN', name: '首尔仁川国际机场', terminal: 'T2' },
      arriveAirport: { code: 'JFK', name: '纽约肯尼迪国际机场', terminal: 'T1' },
      duration: '13h50m', stops: 0, isCodeShare: false,
    }],
    price: 2850, tax: 1490, totalPrice: 4340, currency: 'CNY',
    cabinClass: '经济舱', seatsLeft: 15, refundable: false, tags: ['中转'],
  },
  {
    id: 'FL006', segments: [{
      airline: '中国南方航空', airlineLogo: '', flightNo: 'CZ327', aircraftType: 'Airbus A380-800',
      departTime: '23:50', arriveTime: '05:30+1',
      departAirport: { code: 'CAN', name: '广州白云国际机场', terminal: 'T2' },
      arriveAirport: { code: 'JFK', name: '纽约肯尼迪国际机场', terminal: 'T1' },
      duration: '15h40m', stops: 0, isCodeShare: false,
    }],
    price: 3680, tax: 1720, totalPrice: 5400, currency: 'CNY',
    cabinClass: '经济舱', seatsLeft: 4, refundable: true, tags: ['红眼航班'],
  },
  {
    id: 'FL007', segments: [{
      airline: '美国联合航空', airlineLogo: '', flightNo: 'UA808', aircraftType: 'Boeing 777-300ER',
      departTime: '15:20', arriveTime: '16:10',
      departAirport: { code: 'PEK', name: '北京首都国际机场', terminal: 'T3' },
      arriveAirport: { code: 'EWR', name: '纽约纽瓦克国际机场', terminal: 'C' },
      duration: '12h50m', stops: 0, isCodeShare: true, operatingAirline: '中国国际航空',
    }],
    price: 3420, tax: 1650, totalPrice: 5070, currency: 'CNY',
    cabinClass: '经济舱', seatsLeft: 9, refundable: false, tags: ['共享航班'],
  },
  {
    id: 'FL008', segments: [{
      airline: '新加坡航空', airlineLogo: '', flightNo: 'SQ807', aircraftType: 'Airbus A350-900',
      departTime: '01:10', arriveTime: '07:15',
      departAirport: { code: 'PEK', name: '北京首都国际机场', terminal: 'T3' },
      arriveAirport: { code: 'SIN', name: '新加坡樟宜机场', terminal: 'T3' },
      duration: '6h05m', stops: 0, isCodeShare: false,
    }, {
      airline: '新加坡航空', airlineLogo: '', flightNo: 'SQ24', aircraftType: 'Airbus A350-900ULR',
      departTime: '11:35', arriveTime: '15:20',
      departAirport: { code: 'SIN', name: '新加坡樟宜机场', terminal: 'T3' },
      arriveAirport: { code: 'JFK', name: '纽约肯尼迪国际机场', terminal: 'T1' },
      duration: '18h45m', stops: 0, isCodeShare: false,
    }],
    price: 4200, tax: 1850, totalPrice: 6050, currency: 'CNY',
    cabinClass: '经济舱', seatsLeft: 20, refundable: true, tags: ['中转', '五星航司'],
  },
  // ===== 超级经济舱 =====
  {
    id: 'FL009', segments: [{
      airline: '中国国际航空', airlineLogo: '', flightNo: 'CA983', aircraftType: 'Boeing 777-300ER',
      departTime: '13:50', arriveTime: '14:30',
      departAirport: { code: 'PEK', name: '北京首都国际机场', terminal: 'T3' },
      arriveAirport: { code: 'JFK', name: '纽约肯尼迪国际机场', terminal: 'T1' },
      duration: '12h40m', stops: 0, isCodeShare: false,
    }],
    price: 5280, tax: 1652, totalPrice: 6932, currency: 'CNY',
    cabinClass: '超级经济舱', seatsLeft: 4, refundable: true, tags: ['可退改'],
  },
  {
    id: 'FL010', segments: [{
      airline: '新加坡航空', airlineLogo: '', flightNo: 'SQ807', aircraftType: 'Airbus A350-900',
      departTime: '01:10', arriveTime: '07:15',
      departAirport: { code: 'PEK', name: '北京首都国际机场', terminal: 'T3' },
      arriveAirport: { code: 'SIN', name: '新加坡樟宜机场', terminal: 'T3' },
      duration: '6h05m', stops: 0, isCodeShare: false,
    }, {
      airline: '新加坡航空', airlineLogo: '', flightNo: 'SQ24', aircraftType: 'Airbus A350-900ULR',
      departTime: '11:35', arriveTime: '15:20',
      departAirport: { code: 'SIN', name: '新加坡樟宜机场', terminal: 'T3' },
      arriveAirport: { code: 'JFK', name: '纽约肯尼迪国际机场', terminal: 'T1' },
      duration: '18h45m', stops: 0, isCodeShare: false,
    }],
    price: 6500, tax: 1850, totalPrice: 8350, currency: 'CNY',
    cabinClass: '超级经济舱', seatsLeft: 10, refundable: true, tags: ['中转', '五星航司'],
  },
  // ===== 商务舱 =====
  {
    id: 'FL011', segments: [{
      airline: '中国国际航空', airlineLogo: '', flightNo: 'CA983', aircraftType: 'Boeing 777-300ER',
      departTime: '13:50', arriveTime: '14:30',
      departAirport: { code: 'PEK', name: '北京首都国际机场', terminal: 'T3' },
      arriveAirport: { code: 'JFK', name: '纽约肯尼迪国际机场', terminal: 'T1' },
      duration: '12h40m', stops: 0, isCodeShare: false,
    }],
    price: 18600, tax: 1652, totalPrice: 20252, currency: 'CNY',
    cabinClass: '商务舱', seatsLeft: 2, refundable: true, tags: ['可退改'],
  },
  {
    id: 'FL012', segments: [{
      airline: '国泰航空', airlineLogo: '', flightNo: 'CX347', aircraftType: 'Airbus A350-900',
      departTime: '07:25', arriveTime: '11:15',
      departAirport: { code: 'PEK', name: '北京首都国际机场', terminal: 'T3' },
      arriveAirport: { code: 'HKG', name: '香港国际机场', terminal: 'T1' },
      duration: '3h50m', stops: 0, isCodeShare: false,
    }, {
      airline: '国泰航空', airlineLogo: '', flightNo: 'CX840', aircraftType: 'Boeing 777-300ER',
      departTime: '14:00', arriveTime: '16:55',
      departAirport: { code: 'HKG', name: '香港国际机场', terminal: 'T1' },
      arriveAirport: { code: 'JFK', name: '纽约肯尼迪国际机场', terminal: 'T1' },
      duration: '15h55m', stops: 0, isCodeShare: false,
    }],
    price: 22800, tax: 1580, totalPrice: 24380, currency: 'CNY',
    cabinClass: '商务舱', seatsLeft: 3, refundable: true, tags: ['中转', '五星航司', '可退改'],
  },
  {
    id: 'FL013', segments: [{
      airline: '中国东方航空', airlineLogo: '', flightNo: 'MU587', aircraftType: 'Boeing 777-300ER',
      departTime: '18:05', arriveTime: '19:50',
      departAirport: { code: 'PVG', name: '上海浦东国际机场', terminal: 'T1' },
      arriveAirport: { code: 'JFK', name: '纽约肯尼迪国际机场', terminal: 'T1' },
      duration: '13h45m', stops: 0, isCodeShare: false,
    }],
    price: 19200, tax: 1680, totalPrice: 20880, currency: 'CNY',
    cabinClass: '商务舱', seatsLeft: 5, refundable: true, tags: ['可退改'],
  },
  // ===== 头等舱 =====
  {
    id: 'FL014', segments: [{
      airline: '中国国际航空', airlineLogo: '', flightNo: 'CA983', aircraftType: 'Boeing 777-300ER',
      departTime: '13:50', arriveTime: '14:30',
      departAirport: { code: 'PEK', name: '北京首都国际机场', terminal: 'T3' },
      arriveAirport: { code: 'JFK', name: '纽约肯尼迪国际机场', terminal: 'T1' },
      duration: '12h40m', stops: 0, isCodeShare: false,
    }],
    price: 38500, tax: 1652, totalPrice: 40152, currency: 'CNY',
    cabinClass: '头等舱', seatsLeft: 1, refundable: true, tags: ['可退改'],
  },
  {
    id: 'FL015', segments: [{
      airline: '新加坡航空', airlineLogo: '', flightNo: 'SQ807', aircraftType: 'Airbus A350-900',
      departTime: '01:10', arriveTime: '07:15',
      departAirport: { code: 'PEK', name: '北京首都国际机场', terminal: 'T3' },
      arriveAirport: { code: 'SIN', name: '新加坡樟宜机场', terminal: 'T3' },
      duration: '6h05m', stops: 0, isCodeShare: false,
    }, {
      airline: '新加坡航空', airlineLogo: '', flightNo: 'SQ24', aircraftType: 'Airbus A350-900ULR',
      departTime: '11:35', arriveTime: '15:20',
      departAirport: { code: 'SIN', name: '新加坡樟宜机场', terminal: 'T3' },
      arriveAirport: { code: 'JFK', name: '纽约肯尼迪国际机场', terminal: 'T1' },
      duration: '18h45m', stops: 0, isCodeShare: false,
    }],
    price: 45000, tax: 1850, totalPrice: 46850, currency: 'CNY',
    cabinClass: '头等舱', seatsLeft: 2, refundable: true, tags: ['中转', '五星航司', '可退改'],
  },
]

export const mockFlights: FlightOffer[] = allMockFlights

/** Filter mock flights by departure/arrival airport codes and cabin class.
 *  When a date is provided, prices and seats vary by date to simulate real data. */
export function searchMockFlights(from: string, to: string, cabinClass?: string, date?: string): FlightOffer[] {
  if (!from && !to && !cabinClass) return [...allMockFlights]
  const filtered = allMockFlights.filter((f) => {
    const departCode = f.segments[0].departAirport.code
    const arriveCode = f.segments[f.segments.length - 1].arriveAirport.code
    const fromMatch = !from || departCode === from || f.segments.some((s) => s.departAirport.code === from)
    const toMatch = !to || arriveCode === to || f.segments.some((s) => s.arriveAirport.code === to)
    const cabinMatch = !cabinClass || f.cabinClass === cabinClass
    return fromMatch && toMatch && cabinMatch
  })
  // Apply date-based price/seat variation
  if (!date) return filtered
  const d = new Date(date)
  if (isNaN(d.getTime())) return filtered
  const dayHash = d.getDate() * 7 + d.getMonth() * 13 + d.getFullYear()
  const dayOfWeek = d.getDay()
  const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) ? 1.12 : 1.0
  return filtered.map((f, idx) => {
    const seed = (dayHash + idx * 17) % 20
    const priceFactor = weekendFactor * (0.88 + seed * 0.015) // 0.88 ~ 1.18
    const newPrice = Math.round(f.price * priceFactor)
    const newTax = f.tax
    const seatDelta = ((dayHash + idx * 3) % 7) - 3 // -3 ~ +3
    const newSeats = Math.max(1, Math.min(30, f.seatsLeft + seatDelta))
    return { ...f, price: newPrice, totalPrice: newPrice + newTax, seatsLeft: newSeats }
  })
}

/** Generate price calendar derived from actual mock flight data.
 *  Prices based on lowest matching flight with daily fluctuation. */
export function generatePriceCalendar(currentDate: string, from?: string, to?: string, cabinClass?: string): PriceCalendarItem[] {
  let current = new Date(currentDate)
  if (!currentDate || isNaN(current.getTime())) current = new Date()
  const items: PriceCalendarItem[] = []
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const matchingFlights = searchMockFlights(from || '', to || '', cabinClass)
  const basePrice = matchingFlights.length > 0 ? Math.min(...matchingFlights.map((f) => f.price)) : 2980
  const allPrices: number[] = []
  for (let i = -3; i <= 10; i++) {
    const d = new Date(current); d.setDate(d.getDate() + i)
    const dayOfWeek = d.getDay()
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) ? 1.15 : 1.0
    const dayHash = (d.getDate() * 7 + d.getMonth() * 13 + i * 3) % 10
    const fluctuation = 0.9 + dayHash * 0.03
    allPrices.push(Math.round(basePrice * weekendFactor * fluctuation))
  }
  const minPrice = Math.min(...allPrices)
  for (let i = -3; i <= 10; i++) {
    const d = new Date(current); d.setDate(d.getDate() + i)
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const price = allPrices[i + 3]
    items.push({
      date: `${d.getFullYear()}-${mm}-${dd}`,
      weekday: `${mm}-${dd} ${weekdays[d.getDay()]}`,
      price,
      isLowest: price === minPrice,
      isCurrent: i === 0,
    })
  }
  return items
}
