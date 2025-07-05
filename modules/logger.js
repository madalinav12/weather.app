import { CONFIG } from './config.js';

class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = CONFIG.LOGGING.MAX_LOGS || 100;
    this.levels = ['debug', 'info', 'warn', 'error'];
    this.enabled = CONFIG.LOGGING.ENABLED;
    this.level = CONFIG.LOGGING.LEVEL;
  }

  _log(level, message, data = null) {
    if (!this.enabled || !this._shouldLog(level)) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) this.logs.shift();

    console[level](`[${logEntry.timestamp}] [${level.toUpperCase()}] ${message}`, data || '');
  }

  _shouldLog(level) {
    const currentIndex = this.levels.indexOf(this.level);
    const messageIndex = this.levels.indexOf(level);
    return messageIndex >= currentIndex;
  }

  debug(message, data) {
    this._log('debug', message, data);
  }

  info(message, data) {
    this._log('info', message, data);
  }

  warn(message, data) {
    this._log('warn', message, data);
  }

  error(message, data) {
    this._log('error', message, data);
  }

  getLogs() {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
    console.clear();
  }

  exportLogs(format = 'text') {
    if (format === 'json') {
      return JSON.stringify(this.logs, null, 2);
    }
    return this.logs
      .map(log => `【${log.timestamp}】 [${log.level.toUpperCase()}] ${log.message}${log.data ? ` | ${JSON.stringify(log.data)}` : ''}`)
      .join('\n');
  }
}

export const logger = new Logger();