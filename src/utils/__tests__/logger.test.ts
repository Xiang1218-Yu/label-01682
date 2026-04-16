import { describe, it, expect, vi, afterEach } from 'vitest'
import { createLogger, logger } from '../logger'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('createLogger', () => {
  it('creates a logger with all level methods', () => {
    const log = createLogger('Test')
    expect(typeof log.info).toBe('function')
    expect(typeof log.warn).toBe('function')
    expect(typeof log.error).toBe('function')
    expect(typeof log.debug).toBe('function')
  })

  it('info logs to console.log with context', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const log = createLogger('MyModule')
    log.info('hello')
    expect(spy).toHaveBeenCalledTimes(1)
    const msg = spy.mock.calls[0][0] as string
    expect(msg).toContain('[INFO]')
    expect(msg).toContain('[MyModule]')
    expect(msg).toContain('hello')
  })

  it('warn logs to console.warn', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const log = createLogger('Ctx')
    log.warn('caution')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0]).toContain('[WARN]')
  })

  it('error logs to console.error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const log = createLogger('Ctx')
    log.error('fail')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0]).toContain('[ERROR]')
  })

  it('includes JSON data when provided', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const log = createLogger('Ctx')
    log.info('with data', { key: 'value' })
    const msg = spy.mock.calls[0][0] as string
    expect(msg).toContain('{"key":"value"}')
  })

  it('includes ISO timestamp', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const log = createLogger('Ctx')
    log.info('ts test')
    const msg = spy.mock.calls[0][0] as string
    expect(msg).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })
})

describe('default logger', () => {
  it('uses App as context', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    logger.info('default')
    expect(spy.mock.calls[0][0]).toContain('[App]')
  })
})
