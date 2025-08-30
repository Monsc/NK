import { logger } from './logger'

// 错误码定义
export enum ErrorCode {
  // 通用错误 (1000-1999)
  UNKNOWN_ERROR = 1000,
  VALIDATION_ERROR = 1001,
  NOT_FOUND = 1002,
  UNAUTHORIZED = 1003,
  FORBIDDEN = 1004,
  RATE_LIMIT_EXCEEDED = 1005,
  INVALID_INPUT = 1006,
  
  // 数据库错误 (2000-2999)
  DATABASE_CONNECTION_ERROR = 2000,
  DATABASE_QUERY_ERROR = 2001,
  DATABASE_TRANSACTION_ERROR = 2002,
  RECORD_NOT_FOUND = 2003,
  DUPLICATE_RECORD = 2004,
  
  // 外部服务错误 (3000-3999)
  EXTERNAL_API_ERROR = 3000,
  PAYMENT_SERVICE_ERROR = 3001,
  EMAIL_SERVICE_ERROR = 3002,
  NOTION_API_ERROR = 3003,
  OPENAI_API_ERROR = 3004,
  REDIS_ERROR = 3005,
  
  // 业务逻辑错误 (4000-4999)
  INSUFFICIENT_FUNDS = 4000,
  INVALID_DONATION_AMOUNT = 4001,
  SUBSCRIPTION_EXPIRED = 4002,
  CAMPAIGN_NOT_ACTIVE = 4003,
  
  // 安全错误 (5000-5999)
  INVALID_TOKEN = 5000,
  TOKEN_EXPIRED = 5001,
  INVALID_SIGNATURE = 5002,
  CSRF_TOKEN_MISMATCH = 5003,
  XSS_ATTEMPT = 5004,
  SQL_INJECTION_ATTEMPT = 5005
}

// 错误严重程度
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// 基础错误类
export abstract class BaseError extends Error {
  public readonly code: ErrorCode
  public readonly severity: ErrorSeverity
  public readonly isOperational: boolean
  public readonly context?: Record<string, any>
  public readonly timestamp: string
  public readonly requestId?: string

  constructor(
    message: string,
    code: ErrorCode,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message)
    
    this.name = this.constructor.name
    this.code = code
    this.severity = severity
    this.isOperational = isOperational
    this.context = context
    this.timestamp = new Date().toISOString()
    
    // 确保错误堆栈正确
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      severity: this.severity,
      timestamp: this.timestamp,
      requestId: this.requestId,
      context: this.context,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined
    }
  }
}

// 验证错误
export class ValidationError extends BaseError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCode.VALIDATION_ERROR, ErrorSeverity.LOW, true, context)
  }
}

// 未找到错误
export class NotFoundError extends BaseError {
  constructor(resource: string, context?: Record<string, any>) {
    super(`${resource} not found`, ErrorCode.NOT_FOUND, ErrorSeverity.LOW, true, context)
  }
}

// 未授权错误
export class UnauthorizedError extends BaseError {
  constructor(message: string = 'Unauthorized', context?: Record<string, any>) {
    super(message, ErrorCode.UNAUTHORIZED, ErrorSeverity.MEDIUM, true, context)
  }
}

// 禁止访问错误
export class ForbiddenError extends BaseError {
  constructor(message: string = 'Forbidden', context?: Record<string, any>) {
    super(message, ErrorCode.FORBIDDEN, ErrorSeverity.MEDIUM, true, context)
  }
}

// 速率限制错误
export class RateLimitError extends BaseError {
  constructor(message: string = 'Rate limit exceeded', context?: Record<string, any>) {
    super(message, ErrorCode.RATE_LIMIT_EXCEEDED, ErrorSeverity.MEDIUM, true, context)
  }
}

// 数据库错误
export class DatabaseError extends BaseError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCode.DATABASE_QUERY_ERROR, ErrorSeverity.HIGH, true, context)
  }
}

// 外部API错误
export class ExternalApiError extends BaseError {
  constructor(service: string, message: string, context?: Record<string, any>) {
    super(`${service} API error: ${message}`, ErrorCode.EXTERNAL_API_ERROR, ErrorSeverity.HIGH, true, {
      service,
      ...context
    })
  }
}

// 支付服务错误
export class PaymentServiceError extends BaseError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCode.PAYMENT_SERVICE_ERROR, ErrorSeverity.HIGH, true, context)
  }
}

// 安全错误
export class SecurityError extends BaseError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCode.INVALID_TOKEN, ErrorSeverity.HIGH, true, context)
  }
}

// 业务逻辑错误
export class BusinessLogicError extends BaseError {
  constructor(message: string, code: ErrorCode, context?: Record<string, any>) {
    super(message, code, ErrorSeverity.MEDIUM, true, context)
  }
}

// 错误处理器
export class ErrorHandler {
  private static instance: ErrorHandler

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  // 处理错误并记录日志
  handleError(error: Error | BaseError, context?: Record<string, any>): void {
    if (error instanceof BaseError) {
      this.handleOperationalError(error, context)
    } else {
      this.handleProgrammerError(error, context)
    }
  }

  private handleOperationalError(error: BaseError, context?: Record<string, any>): void {
    // 记录操作错误
    logger.warn('Operational error occurred', {
      error: error.toJSON(),
      context
    })

    // 根据严重程度决定是否需要告警
    if (error.severity === ErrorSeverity.CRITICAL) {
      this.sendAlert(error, context)
    }
  }

  private handleProgrammerError(error: Error, context?: Record<string, any>): void {
    // 记录程序错误
    logger.error('Programmer error occurred', error, {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context
    })

    // 程序错误总是需要告警
    this.sendAlert(error, context)
  }

  private sendAlert(error: Error | BaseError, context?: Record<string, any>): void {
    // 在生产环境中，这里应该发送到告警服务
    if (process.env.NODE_ENV === 'production') {
      // 发送到告警服务（如Sentry、PagerDuty等）
      logger.error('Alert: Critical error occurred', error, {
        error: error instanceof BaseError ? error.toJSON() : {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        context
      })
    }
  }

  // 优雅关闭处理
  setupGracefulShutdown(): void {
    process.on('uncaughtException', (error: Error) => {
      logger.fatal('Uncaught Exception', error)
      this.handleError(error)
      process.exit(1)
    })

    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      logger.fatal('Unhandled Rejection', new Error(String(reason)), {
        promise: promise.toString()
      })
      this.handleError(new Error(String(reason)))
      process.exit(1)
    })

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully')
      process.exit(0)
    })

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully')
      process.exit(0)
    })
  }
}

// 错误响应格式化
export function formatErrorResponse(error: Error | BaseError): {
  success: false
  error: {
    code: number
    message: string
    details?: any
  }
} {
  if (error instanceof BaseError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.toJSON() : undefined
      }
    }
  }

  return {
    success: false,
    error: {
      code: ErrorCode.UNKNOWN_ERROR,
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : error.message,
      details: process.env.NODE_ENV === 'development' ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    }
  }
}

// 异步错误包装器
export function asyncHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (..._args: T): Promise<R> => {
    try {
      return await fn(..._args)
    } catch (error) {
      ErrorHandler.getInstance().handleError(error as Error)
      throw error
    }
  }
}

// 创建错误处理器的单例实例
export const errorHandler = ErrorHandler.getInstance()

// 设置优雅关闭
errorHandler.setupGracefulShutdown()
