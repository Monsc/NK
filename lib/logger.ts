export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, any>
  error?: Error
  requestId?: string
  userId?: string
  ip?: string
  userAgent?: string
  path?: string
  method?: string
  duration?: number
}

export interface LoggerConfig {
  level: LogLevel
  enableConsole: boolean
  enableFile: boolean
  enableRemote: boolean
  remoteEndpoint?: string
  remoteApiKey?: string
  maxFileSize: number
  maxFiles: number
  logDirectory: string
}

class Logger {
  private config: LoggerConfig
  private requestId: string | null = null

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableFile: false,
      enableRemote: false,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      logDirectory: './logs',
      ...config
    }
  }

  setRequestId(requestId: string): void {
    this.requestId = requestId
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level
  }

  private formatLogEntry(entry: Omit<LogEntry, 'timestamp'>): LogEntry {
    return {
      ...entry,
      timestamp: new Date().toISOString(),
      requestId: this.requestId || undefined
    }
  }

  private async writeToFile(entry: LogEntry): Promise<void> {
    if (!this.config.enableFile) return

    try {
      const fs = await import('fs/promises')
      const path = await import('path')
      
      const logFile = path.join(this.config.logDirectory, `${new Date().toISOString().split('T')[0]}.log`)
      
      // 确保日志目录存在
      await fs.mkdir(this.config.logDirectory, { recursive: true })
      
      const logLine = JSON.stringify(entry) + '\n'
      await fs.appendFile(logFile, logLine)
      
      // 检查文件大小，如果超过限制则轮转
      const stats = await fs.stat(logFile)
      if (stats.size > this.config.maxFileSize) {
        await this.rotateLogFile(logFile)
      }
    } catch (error) {
      console.error('Failed to write to log file:', error)
    }
  }

  private async rotateLogFile(logFile: string): Promise<void> {
    try {
      const fs = await import('fs/promises')
      const path = await import('path')
      
      const dir = path.dirname(logFile)
      const ext = path.extname(logFile)
      const base = path.basename(logFile, ext)
      
      // 删除最旧的文件
      for (let i = this.config.maxFiles - 1; i >= 0; i--) {
        const oldFile = path.join(dir, `${base}.${i}${ext}`)
        try {
          await fs.unlink(oldFile)
        } catch {
          // 文件不存在，忽略
        }
      }
      
      // 重命名现有文件
      for (let i = this.config.maxFiles - 2; i >= 0; i--) {
        const oldFile = path.join(dir, `${base}.${i}${ext}`)
        const newFile = path.join(dir, `${base}.${i + 1}${ext}`)
        try {
          await fs.rename(oldFile, newFile)
        } catch {
          // 文件不存在，忽略
        }
      }
      
      // 重命名当前文件
      const newFile = path.join(dir, `${base}.0${ext}`)
      await fs.rename(logFile, newFile)
    } catch (error) {
      console.error('Failed to rotate log file:', error)
    }
  }

  private async sendToRemote(entry: LogEntry): Promise<void> {
    if (!this.config.enableRemote || !this.config.remoteEndpoint) return

    try {
      const response = await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.remoteApiKey}`,
        },
        body: JSON.stringify(entry)
      })

      if (!response.ok) {
        throw new Error(`Remote logging failed: ${response.status}`)
      }
    } catch (error) {
      console.error('Failed to send log to remote:', error)
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) return

    const entry = this.formatLogEntry({
      level,
      message,
      context,
      error
    })

    // 控制台输出
    if (this.config.enableConsole) {
      const levelName = LogLevel[level]
      const timestamp = entry.timestamp
      const contextStr = context ? ` ${JSON.stringify(context)}` : ''
      const errorStr = error ? `\n${error.stack}` : ''
      
      const logMessage = `[${timestamp}] ${levelName}: ${message}${contextStr}${errorStr}`
      
      switch (level) {
        case LogLevel.DEBUG:
        case LogLevel.INFO:
          console.log(logMessage)
          break
        case LogLevel.WARN:
          console.warn(logMessage)
          break
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(logMessage)
          break
      }
    }

    // 文件输出
    this.writeToFile(entry).catch(console.error)

    // 远程输出
    this.sendToRemote(entry).catch(console.error)
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context)
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error)
  }

  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.FATAL, message, context, error)
  }

  // HTTP请求日志
  logRequest(req: any, res: any, duration: number): void {
    const context = {
      method: req.method,
      path: req.url,
      statusCode: res.statusCode,
      duration,
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers?.['user-agent']
    }

    const level = res.statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO
    this.log(level, `${req.method} ${req.url} - ${res.statusCode}`, context)
  }

  // 性能日志
  logPerformance(operation: string, duration: number, context?: Record<string, any>): void {
    const level = duration > 1000 ? LogLevel.WARN : LogLevel.INFO
    this.log(level, `${operation} took ${duration}ms`, { ...context, duration })
  }

  // 安全日志
  logSecurity(event: string, details: Record<string, any>, level: LogLevel = LogLevel.INFO): void {
    this.log(level, `Security event: ${event}`, details)
  }

  // 业务日志
  logBusiness(event: string, details: Record<string, any>): void {
    this.log(LogLevel.INFO, `Business event: ${event}`, details)
  }
}

// 安全地转换环境变量到LogLevel
function getLogLevelFromEnv(): LogLevel {
  const envLevel = process.env.LOG_LEVEL
  if (envLevel) {
    const levelMap: Record<string, LogLevel> = {
      'DEBUG': LogLevel.DEBUG,
      'INFO': LogLevel.INFO,
      'WARN': LogLevel.WARN,
      'ERROR': LogLevel.ERROR,
      'FATAL': LogLevel.FATAL
    }
    if (levelMap[envLevel.toUpperCase()]) {
      return levelMap[envLevel.toUpperCase()]
    }
  }
  return LogLevel.INFO
}

// 创建默认logger实例
export const logger = new Logger({
  level: getLogLevelFromEnv(),
  enableConsole: process.env.NODE_ENV !== 'production',
  enableFile: process.env.NODE_ENV === 'production',
  enableRemote: !!process.env.LOG_REMOTE_ENDPOINT,
  remoteEndpoint: process.env.LOG_REMOTE_ENDPOINT,
  remoteApiKey: process.env.LOG_REMOTE_API_KEY
})

// 中间件函数
export function loggerMiddleware(req: any, res: any, next: () => void): void {
  const start = Date.now()
  
  // 生成请求ID
  const requestId = crypto.randomUUID()
  logger.setRequestId(requestId)
  
  // 添加请求ID到响应头
  res.setHeader('X-Request-ID', requestId)
  
  // 记录请求开始
  logger.info(`Request started: ${req.method} ${req.url}`, {
    method: req.method,
    path: req.url,
    ip: req.ip || req.connection?.remoteAddress,
    userAgent: req.headers?.['user-agent']
  })
  
  // 重写res.end来记录响应
  const originalEnd = res.end
  res.end = function(chunk: any, encoding: any) {
    const duration = Date.now() - start
    logger.logRequest(req, res, duration)
    originalEnd.call(this, chunk, encoding)
  }
  
  next()
}

export default logger
