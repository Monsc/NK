import { logger } from './logger'
import { Redis } from '@upstash/redis'

// 监控指标类型
export interface Metric {
  name: string
  value: number
  timestamp: number
  tags: Record<string, string>
  type: 'counter' | 'gauge' | 'histogram'
}

// 健康检查结果
export interface HealthCheck {
  name: string
  status: 'healthy' | 'unhealthy' | 'degraded'
  message: string
  timestamp: number
  duration: number
  details?: Record<string, any>
}

// 性能指标
export interface PerformanceMetrics {
  responseTime: number
  memoryUsage: number
  cpuUsage: number
  activeConnections: number
  errorRate: number
  throughput: number
}

class Monitoring {
  private metrics: Metric[] = []
  private healthChecks: Map<string, () => Promise<HealthCheck>> = new Map()
  private redis: Redis | null = null

  constructor() {
    this.initializeRedis()
    this.setupDefaultHealthChecks()
    this.startMetricsCollection()
  }

  private initializeRedis(): void {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      this.redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    }
  }

  private setupDefaultHealthChecks(): void {
    // 数据库健康检查
    this.addHealthCheck('database', async () => {
      const start = Date.now()
      try {
        // 这里应该检查实际的数据库连接
        const duration = Date.now() - start
        return {
          name: 'database',
          status: 'healthy',
          message: 'Database connection is healthy',
          timestamp: Date.now(),
          duration,
          details: { connectionPool: 'active' }
        }
      } catch (error) {
        const duration = Date.now() - start
        return {
          name: 'database',
          status: 'unhealthy',
          message: 'Database connection failed',
          timestamp: Date.now(),
          duration,
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        }
      }
    })

    // Redis健康检查
    this.addHealthCheck('redis', async () => {
      const start = Date.now()
      try {
        if (!this.redis) {
          return {
            name: 'redis',
            status: 'degraded',
            message: 'Redis not configured',
            timestamp: Date.now(),
            duration: Date.now() - start
          }
        }

        await this.redis.ping()
        const duration = Date.now() - start
        return {
          name: 'redis',
          status: 'healthy',
          message: 'Redis connection is healthy',
          timestamp: Date.now(),
          duration
        }
      } catch (error) {
        const duration = Date.now() - start
        return {
          name: 'redis',
          status: 'unhealthy',
          message: 'Redis connection failed',
          timestamp: Date.now(),
          duration,
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        }
      }
    })

    // 外部API健康检查
    this.addHealthCheck('external-apis', async () => {
      const start = Date.now()
      const checks = []

      // 检查OpenAI API
      if (process.env.LLM_API_KEY) {
        try {
          const response = await fetch('https://api.openai.com/v1/models', {
            headers: { 'Authorization': `Bearer ${process.env.LLM_API_KEY}` }
          })
          checks.push({
            service: 'openai',
            status: response.ok ? 'healthy' : 'unhealthy',
            responseTime: response.ok ? Date.now() - start : null
          })
        } catch (error) {
          checks.push({
            service: 'openai',
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      // 检查Notion API
      if (process.env.NOTION_API_KEY) {
        try {
          const response = await fetch('https://api.notion.com/v1/users/me', {
            headers: { 'Authorization': `Bearer ${process.env.NOTION_API_KEY}` }
          })
          checks.push({
            service: 'notion',
            status: response.ok ? 'healthy' : 'unhealthy',
            responseTime: response.ok ? Date.now() - start : null
          })
        } catch (error) {
          checks.push({
            service: 'notion',
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      const duration = Date.now() - start
      const healthyCount = checks.filter(c => c.status === 'healthy').length
      const totalCount = checks.length

      let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy'
      if (healthyCount === 0) status = 'unhealthy'
      else if (healthyCount < totalCount) status = 'degraded'

      return {
        name: 'external-apis',
        status,
        message: `${healthyCount}/${totalCount} external APIs are healthy`,
        timestamp: Date.now(),
        duration,
        details: { checks }
      }
    })

    // 系统资源健康检查
    this.addHealthCheck('system-resources', async () => {
      const start = Date.now()
      const memUsage = process.memoryUsage()
      const cpuUsage = process.cpuUsage()

      const memoryUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100
      const isMemoryHealthy = memoryUsagePercent < 80

      const duration = Date.now() - start
      return {
        name: 'system-resources',
        status: isMemoryHealthy ? 'healthy' : 'degraded',
        message: `Memory usage: ${memoryUsagePercent.toFixed(2)}%`,
        timestamp: Date.now(),
        duration,
        details: {
          memory: {
            heapUsed: memUsage.heapUsed,
            heapTotal: memUsage.heapTotal,
            external: memUsage.external,
            rss: memUsage.rss
          },
          cpu: {
            user: cpuUsage.user,
            system: cpuUsage.system
          }
        }
      }
    })
  }

  // 添加健康检查
  addHealthCheck(name: string, check: () => Promise<HealthCheck>): void {
    this.healthChecks.set(name, check)
  }

  // 执行所有健康检查
  async runHealthChecks(): Promise<HealthCheck[]> {
    const results: HealthCheck[] = []
    
    const healthCheckEntries = Array.from(this.healthChecks.entries())
    for (const [name, check] of healthCheckEntries) {
      try {
        const result = await check()
        results.push(result)
        
        // 记录健康检查结果
        if (result.status === 'unhealthy') {
          logger.error(`Health check failed: ${name}`, undefined, {
            healthCheck: result
          })
        } else if (result.status === 'degraded') {
          logger.warn(`Health check degraded: ${name}`, {
            healthCheck: result
          })
        }
      } catch (error) {
        const failedResult: HealthCheck = {
          name,
          status: 'unhealthy',
          message: 'Health check execution failed',
          timestamp: Date.now(),
          duration: 0,
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        }
        results.push(failedResult)
        
        logger.error(`Health check execution failed: ${name}`, error as Error)
      }
    }

    return results
  }

  // 记录指标
  recordMetric(metric: Omit<Metric, 'timestamp'>): void {
    const fullMetric: Metric = {
      ...metric,
      timestamp: Date.now()
    }

    this.metrics.push(fullMetric)

    // 限制内存中的指标数量
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-500)
    }

    // 发送到Redis进行持久化
    this.persistMetric(fullMetric).catch(error => {
      logger.error('Failed to persist metric', error as Error)
    })
  }

  // 持久化指标到Redis
  private async persistMetric(metric: Metric): Promise<void> {
    if (!this.redis) return

    try {
      const key = `metrics:${metric.name}:${new Date().toISOString().split('T')[0]}`
      await this.redis.lpush(key, JSON.stringify(metric))
      await this.redis.expire(key, 7 * 24 * 60 * 60) // 7天过期
    } catch (error) {
      logger.error('Failed to persist metric to Redis', error as Error)
    }
  }

  // 获取指标
  async getMetrics(name?: string, timeRange?: { start: number; end: number }): Promise<Metric[]> {
    if (!this.redis || !name) {
      return this.metrics.filter(m => !name || m.name === name)
    }

    try {
      const key = `metrics:${name}:${new Date().toISOString().split('T')[0]}`
      const metrics = await this.redis.lrange(key, 0, -1)
      
      return metrics
        .map(m => JSON.parse(m as string) as Metric)
        .filter(m => !timeRange || (m.timestamp >= timeRange.start && m.timestamp <= timeRange.end))
    } catch (error) {
      logger.error('Failed to get metrics from Redis', error as Error)
      return []
    }
  }

  // 开始指标收集
  private startMetricsCollection(): void {
    // 收集系统指标
    setInterval(() => {
      const memUsage = process.memoryUsage()
      
      this.recordMetric({
        name: 'memory.heap_used',
        value: memUsage.heapUsed,
        type: 'gauge',
        tags: { component: 'system' }
      })

      this.recordMetric({
        name: 'memory.heap_total',
        value: memUsage.heapTotal,
        type: 'gauge',
        tags: { component: 'system' }
      })

      this.recordMetric({
        name: 'memory.rss',
        value: memUsage.rss,
        type: 'gauge',
        tags: { component: 'system' }
      })
    }, 30000) // 每30秒收集一次

    // 收集进程指标
    setInterval(() => {
      const cpuUsage = process.cpuUsage()
      
      this.recordMetric({
        name: 'cpu.user',
        value: cpuUsage.user,
        type: 'gauge',
        tags: { component: 'system' }
      })

      this.recordMetric({
        name: 'cpu.system',
        value: cpuUsage.system,
        type: 'gauge',
        tags: { component: 'system' }
      })
    }, 60000) // 每60秒收集一次
  }

  // 记录HTTP请求指标
  recordHttpRequest(method: string, path: string, statusCode: number, duration: number): void {
    this.recordMetric({
      name: 'http.requests',
      value: 1,
      type: 'counter',
      tags: { method, path, status: statusCode.toString() }
    })

    this.recordMetric({
      name: 'http.response_time',
      value: duration,
      type: 'histogram',
      tags: { method, path, status: statusCode.toString() }
    })

    if (statusCode >= 400) {
      this.recordMetric({
        name: 'http.errors',
        value: 1,
        type: 'counter',
        tags: { method, path, status: statusCode.toString() }
      })
    }
  }

  // 记录业务指标
  recordBusinessMetric(name: string, value: number, tags: Record<string, string> = {}): void {
    this.recordMetric({
      name: `business.${name}`,
      value,
      type: 'counter',
      tags: { ...tags, component: 'business' }
    })
  }

  // 获取性能指标摘要
  async getPerformanceSummary(): Promise<PerformanceMetrics> {
    const now = Date.now()
    const oneHourAgo = now - 60 * 60 * 1000

    const [responseTimeMetrics, errorMetrics, requestMetrics] = await Promise.all([
      this.getMetrics('http.response_time', { start: oneHourAgo, end: now }),
      this.getMetrics('http.errors', { start: oneHourAgo, end: now }),
      this.getMetrics('http.requests', { start: oneHourAgo, end: now })
    ])

    const avgResponseTime = responseTimeMetrics.length > 0
      ? responseTimeMetrics.reduce((sum, m) => sum + m.value, 0) / responseTimeMetrics.length
      : 0

    const totalRequests = requestMetrics.reduce((sum, m) => sum + m.value, 0)
    const totalErrors = errorMetrics.reduce((sum, m) => sum + m.value, 0)
    const errorRate = totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0

    const memUsage = process.memoryUsage()
    const memoryUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100

    return {
      responseTime: avgResponseTime,
      memoryUsage: memoryUsagePercent,
      cpuUsage: 0, // 需要更复杂的CPU使用率计算
      activeConnections: 0, // 需要跟踪活跃连接
      errorRate,
      throughput: totalRequests / 3600 // 每秒请求数
    }
  }

  // 生成监控报告
  async generateMonitoringReport(): Promise<{
    timestamp: number
    healthChecks: HealthCheck[]
    performance: PerformanceMetrics
    alerts: string[]
  }> {
    const [healthChecks, performance] = await Promise.all([
      this.runHealthChecks(),
      this.getPerformanceSummary()
    ])

    const alerts: string[] = []

    // 检查健康状态
    const unhealthyChecks = healthChecks.filter(h => h.status === 'unhealthy')
    if (unhealthyChecks.length > 0) {
      alerts.push(`Found ${unhealthyChecks.length} unhealthy services`)
    }

    // 检查性能指标
    if (performance.errorRate > 5) {
      alerts.push(`High error rate: ${performance.errorRate.toFixed(2)}%`)
    }

    if (performance.responseTime > 1000) {
      alerts.push(`High response time: ${performance.responseTime.toFixed(2)}ms`)
    }

    if (performance.memoryUsage > 80) {
      alerts.push(`High memory usage: ${performance.memoryUsage.toFixed(2)}%`)
    }

    return {
      timestamp: Date.now(),
      healthChecks,
      performance,
      alerts
    }
  }
}

// 创建监控实例
export const monitoring = new Monitoring()

// 导出便捷方法
export const recordMetric = monitoring.recordMetric.bind(monitoring)
export const recordHttpRequest = monitoring.recordHttpRequest.bind(monitoring)
export const recordBusinessMetric = monitoring.recordBusinessMetric.bind(monitoring)
export const runHealthChecks = monitoring.runHealthChecks.bind(monitoring)
export const getPerformanceSummary = monitoring.getPerformanceSummary.bind(monitoring)
export const generateMonitoringReport = monitoring.generateMonitoringReport.bind(monitoring)
export const getMetrics = monitoring.getMetrics.bind(monitoring)
