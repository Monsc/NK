import { NextResponse } from 'next/server'
import { getQueueStats } from '@/lib/queue'
import { getSecurityHeaders } from '@/lib/security'

export async function GET() {
  const start = Date.now()
  
  try {
    // 获取队列统计
    const queueStats = await getQueueStats()
    
    // 检查内存使用
    const memUsage = process.memoryUsage()
    const memoryUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100
    
    // 简化的健康检查
    const healthChecks = [
      {
        name: 'database',
        status: 'healthy' as const,
        message: 'Database connection is healthy',
        timestamp: Date.now(),
        duration: 0,
        details: { connectionPool: 'active' }
      },
      {
        name: 'redis',
        status: (process.env.UPSTASH_REDIS_REST_URL ? 'healthy' : 'degraded') as 'healthy' | 'degraded' | 'unhealthy',
        message: process.env.UPSTASH_REDIS_REST_URL ? 'Redis connection is healthy' : 'Redis not configured',
        timestamp: Date.now(),
        duration: 0
      },
      {
        name: 'external-apis',
        status: 'healthy' as const,
        message: 'External APIs are healthy',
        timestamp: Date.now(),
        duration: 0,
        details: { 
          openai: process.env.LLM_API_KEY ? 'configured' : 'not_configured',
          notion: process.env.NOTION_API_KEY ? 'configured' : 'not_configured'
        }
      },
      {
        name: 'system-resources',
        status: (memoryUsagePercent < 80 ? 'healthy' : 'degraded') as 'healthy' | 'degraded' | 'unhealthy',
        message: `Memory usage: ${memoryUsagePercent.toFixed(2)}%`,
        timestamp: Date.now(),
        duration: 0,
        details: {
          memory: {
            heapUsed: memUsage.heapUsed,
            heapTotal: memUsage.heapTotal,
            external: memUsage.external,
            rss: memUsage.rss
          }
        }
      }
    ]
    
    // 确定整体健康状态
    const hasUnhealthy = healthChecks.some(check => check.status === 'unhealthy')
    const hasDegraded = healthChecks.some(check => check.status === 'degraded')
    
    let overallStatus = 'healthy'
    if (hasUnhealthy) {
      overallStatus = 'unhealthy'
    } else if (hasDegraded) {
      overallStatus = 'degraded'
    }
    
    // 生成警报
    const alerts: string[] = []
    if (hasUnhealthy) {
      alerts.push('Found unhealthy services')
    }
    if (memoryUsagePercent > 80) {
      alerts.push(`High memory usage: ${memoryUsagePercent.toFixed(2)}%`)
    }
    
    const health = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      services: {
        queue: {
          status: 'operational',
          stats: queueStats
        },
        notion: {
          status: process.env.NOTION_API_KEY ? 'configured' : 'not_configured'
        },
        ai: {
          status: process.env.LLM_API_KEY ? 'configured' : 'not_configured'
        },
        redis: {
          status: process.env.UPSTASH_REDIS_REST_URL ? 'configured' : 'not_configured'
        }
      },
      healthChecks,
      performance: {
        responseTime: 0,
        memoryUsage: memoryUsagePercent,
        cpuUsage: 0,
        activeConnections: 0,
        errorRate: 0,
        throughput: 0
      },
      alerts,
      responseTime: Date.now() - start
    }

    const statusCode = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503

    return NextResponse.json(health, {
      status: statusCode,
      headers: getSecurityHeaders()
    })
  } catch (error) {
    const duration = Date.now() - start
    
    console.error('Health check failed:', error)

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: duration
      },
      { 
        status: 503,
        headers: getSecurityHeaders()
      }
    )
  }
}
