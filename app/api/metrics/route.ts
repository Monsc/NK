import { NextResponse } from 'next/server'
import { getMetrics } from '@/lib/monitoring'
import { getSecurityHeaders } from '@/lib/security'

export async function GET() {
  const start = Date.now()

  try {
    const mem = process.memoryUsage()
    const memoryUsagePercent = (mem.heapUsed / mem.heapTotal) * 100

    const now = Date.now()
    const tenMinutesAgo = now - 10 * 60 * 1000

    const [heapUsed, heapTotal, rss] = await Promise.all([
      getMetrics('memory.heap_used', { start: tenMinutesAgo, end: now }),
      getMetrics('memory.heap_total', { start: tenMinutesAgo, end: now }),
      getMetrics('memory.rss', { start: tenMinutesAgo, end: now })
    ])

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        memory: {
          heapUsed: mem.heapUsed,
          heapTotal: mem.heapTotal,
          rss: mem.rss,
          percent: memoryUsagePercent,
        },
        metrics: {
          heapUsed,
          heapTotal,
          rss,
        },
        responseTime: Date.now() - start,
      },
      {
        headers: getSecurityHeaders(),
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers: getSecurityHeaders() }
    )
  }
}


