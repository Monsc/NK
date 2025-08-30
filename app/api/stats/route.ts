import { NextResponse } from 'next/server'
import { getQueueStats } from '@/lib/queue'
import { getPages } from '@/lib/notion'

export async function GET() {
  try {
    const [queueStats, notionPages] = await Promise.all([
      getQueueStats(),
      getPages()
    ])

    const stats = {
      queue: queueStats,
      content: {
        totalPages: notionPages.length,
        publishedPages: notionPages.filter(page => page.published).length,
        categories: notionPages.reduce((acc, page) => {
          acc[page.category] = (acc[page.category] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
