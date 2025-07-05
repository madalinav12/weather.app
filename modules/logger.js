import { CONFIG } from './config.js'

export class Logger {
  constructor() {
    this.enabled = CONFIG.LOGGING.ENABLED
    this.level = CONFIG.LOGGING.LEVEL
    this.maxLogs = CONFIG.LOGGING.MAX_LOGS
    this.logs = []
  }

  log(level, message, data) {
    if (!this.enabled) return

    const timestamp = new Date().toISOString()
    const logEntry = { level, message, data, timestamp }

    // Salvează în memorie
    this.logs.push(logEntry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Mapare sigură pentru console
    const methodMap = {
      debug: 'log',
      info: 'info',
      warn: 'warn',
      error: 'error',
    }

    const method = methodMap[level] || 'log'
    const output = `[${timestamp}] [${level.toUpperCase()}] ${message}`

    try {
      if (data !== undefined) {
        console[method](output, data)
      } else {
        console[method](output)
      }
    } catch (err) {
      console.log('Logger fallback:', output, data)
    }
  }

  debug(msg, data) {
    if (['debug'].includes(this.level)) this.log('debug', msg, data)
  }

  info(msg, data) {
    if (['debug', 'info'].includes(this.level)) this.log('info', msg, data)
  }

  warn(msg, data) {
    if (['debug', 'info', 'warn'].includes(this.level)) this.log('warn', msg, data)
  }

  error(msg, data) {
    this.log('error', msg, data)
  }

  getLogs() {
    return this.logs
  }

  clearLogs() {
    this.logs = []
    console.clear()
  }

  exportLogs() {
    return this.logs
      .map(log => `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}${log.data ? ' | ' + JSON.stringify(log.data) : ''}`)
      .join('\n')
  }
}

export const logger = new Logger()
