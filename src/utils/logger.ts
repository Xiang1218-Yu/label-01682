type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface Logger {
  info(message: string, data?: Record<string, unknown>): void
  warn(message: string, data?: Record<string, unknown>): void
  error(message: string, data?: Record<string, unknown>): void
  debug(message: string, data?: Record<string, unknown>): void
}

function formatLog(level: LogLevel, context: string, message: string, data?: Record<string, unknown>): string {
  const ts = new Date().toISOString()
  const dataStr = data ? ' ' + JSON.stringify(data) : ''
  return `[${ts}] [${level.toUpperCase()}] [${context}] ${message}${dataStr}`
}

export function createLogger(context: string): Logger {
  return {
    info(message: string, data?: Record<string, unknown>) {
      console.log(formatLog('info', context, message, data))
    },
    warn(message: string, data?: Record<string, unknown>) {
      console.warn(formatLog('warn', context, message, data))
    },
    error(message: string, data?: Record<string, unknown>) {
      console.error(formatLog('error', context, message, data))
    },
    debug(message: string, data?: Record<string, unknown>) {
      console.debug(formatLog('debug', context, message, data))
    },
  }
}

export const logger = createLogger('App')
