import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react'
import IndexPage from '../index'
import { searchMockFlights, generatePriceCalendar } from '../../data/mockFlights'

Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true })

const noop = vi.fn()

const mockSearchResponse = {
  flights: searchMockFlights('PEK', 'JFK', '经济舱', undefined),
  timestamp: new Date().toISOString(),
}
const mockCalendarResponse = {
  items: generatePriceCalendar(new Date().toISOString().slice(0, 10), 'PEK', 'JFK', '经济舱'),
  timestamp: new Date().toISOString(),
}

function setupFetchMock() {
  global.fetch = vi.fn((url: string | URL | Request) => {
    const u = typeof url === 'string' ? url : url.toString()
    let body: unknown = {}
    if (u.includes('/api/flights/search')) body = { ...mockSearchResponse, dataUpdatedAt: new Date().toISOString(), total: mockSearchResponse.flights.length }
    else if (u.includes('/api/flights/calendar')) body = { ...mockCalendarResponse, dataUpdatedAt: new Date().toISOString() }
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) } as Response)
  })
}

async function waitForAutoSearch() {
  await waitFor(() => { expect(screen.queryByText(/CA983/)).toBeInTheDocument() })
}

describe('IndexPage', () => {
  beforeEach(() => { setupFetchMock() })
  afterEach(() => { vi.restoreAllMocks() })

  it('renders without crashing', () => {
    render(<IndexPage onNavigateToOrder={noop} />)
    expect(screen.getByText('同程旅行 — 让旅行更简单')).toBeInTheDocument()
  })

  it('renders the header with navigation', () => {
    render(<IndexPage onNavigateToOrder={noop} />)
    expect(screen.getByText('机票')).toBeInTheDocument()
    expect(screen.getByText('酒店')).toBeInTheDocument()
    expect(screen.getByText('国际·港澳机票')).toBeInTheDocument()
  })

  it('renders search bar with trip type tabs', () => {
    render(<IndexPage onNavigateToOrder={noop} />)
    expect(screen.getByText('单程')).toBeInTheDocument()
    expect(screen.getByText('往返')).toBeInTheDocument()
  })

  it('auto-searches on mount and shows results', async () => {
    render(<IndexPage onNavigateToOrder={noop} />)
    await waitForAutoSearch()
    expect(screen.getByText(/CA983/)).toBeInTheDocument()
  })

  it('renders footer', () => {
    render(<IndexPage onNavigateToOrder={noop} />)
    expect(screen.getByText(/© 2024 同程旅行/)).toBeInTheDocument()
    expect(screen.getByText('关于同程')).toBeInTheDocument()
  })

  it('renders sidebar', () => {
    render(<IndexPage onNavigateToOrder={noop} />)
    expect(screen.getByLabelText('在线客服')).toBeInTheDocument()
  })
})

describe('IndexPage search flow', () => {
  beforeEach(() => { setupFetchMock() })
  afterEach(() => { vi.restoreAllMocks() })

  it('shows flights with price calendar and notice', async () => {
    render(<IndexPage onNavigateToOrder={noop} />)
    await waitForAutoSearch()
    expect(screen.getByText(/CA983/)).toBeInTheDocument()
    expect(screen.getByText('临近日期最低价')).toBeInTheDocument()
    expect(screen.getByText(/温馨提示/)).toBeInTheDocument()
  })

  it('shows filter and sort after search', async () => {
    render(<IndexPage onNavigateToOrder={noop} />)
    await waitForAutoSearch()
    expect(screen.getByText('仅看直飞')).toBeInTheDocument()
    expect(screen.getByText(/航空公司筛选/)).toBeInTheDocument()
    expect(screen.getByText('价格')).toBeInTheDocument()
    expect(screen.getByText('起飞时间')).toBeInTheDocument()
  })

  it('expands flight detail on click', async () => {
    render(<IndexPage onNavigateToOrder={noop} />)
    await waitForAutoSearch()
    const detailButtons = screen.getAllByRole('button', { name: /航班详情/ })
    fireEvent.click(detailButtons[0])
    expect(screen.getByText('价格明细')).toBeInTheDocument()
    expect(screen.getByText('退改签规则')).toBeInTheDocument()
  })

  it('toggles direct-only filter', async () => {
    render(<IndexPage onNavigateToOrder={noop} />)
    await waitForAutoSearch()
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    fireEvent.click(checkbox)
    await waitFor(() => { expect(checkbox).toBeChecked() })
  })

  it('switches trip type to roundtrip', () => {
    render(<IndexPage onNavigateToOrder={noop} />)
    fireEvent.click(screen.getByText('往返'))
    expect(screen.getByText('返回日期')).toBeInTheDocument()
  })

  it('cabin class selector has all options', () => {
    render(<IndexPage onNavigateToOrder={noop} />)
    const select = screen.getByDisplayValue('经济舱')
    const options = within(select as HTMLElement).getAllByRole('option')
    expect(options).toHaveLength(4)
  })
})
