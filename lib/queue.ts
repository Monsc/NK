import { Redis } from '@upstash/redis'

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

export interface NewsItem {
  id: string
  title: string
  excerpt: string
  url: string
  source: string
  publishedAt: string
  category?: string
  relevance?: number
}

export interface ProcessedItem extends NewsItem {
  brief?: any
  article?: any
  safetyCheck?: any
  publishedToNotion?: boolean
}

const QUEUE_NAME = 'news_queue'
const PROCESSED_QUEUE = 'processed_queue'
const FAILED_QUEUE = 'failed_queue'

export async function enqueue(item: NewsItem): Promise<void> {
  if (!redis) {
    console.log('Redis not configured, skipping enqueue')
    return
  }
  try {
    await redis.lpush(QUEUE_NAME, JSON.stringify(item))
    console.log(`Enqueued: ${item.title}`)
  } catch (error) {
    console.error('Failed to enqueue item:', error)
    throw error
  }
}

export async function dequeue(): Promise<NewsItem | null> {
  if (!redis) {
    console.log('Redis not configured, skipping dequeue')
    return null
  }
  try {
    const item = await redis.rpop(QUEUE_NAME)
    if (!item) return null
    
    const parsedItem = JSON.parse(item as string)
    console.log(`Dequeued: ${parsedItem.title}`)
    return parsedItem
  } catch (error) {
    console.error('Failed to dequeue item:', error)
    return null
  }
}

export async function markProcessed(item: ProcessedItem): Promise<void> {
  if (!redis) {
    console.log('Redis not configured, skipping markProcessed')
    return
  }
  try {
    await redis.lpush(PROCESSED_QUEUE, JSON.stringify(item))
    console.log(`Marked as processed: ${item.title}`)
  } catch (error) {
    console.error('Failed to mark item as processed:', error)
    throw error
  }
}

export async function markFailed(item: NewsItem, error: string): Promise<void> {
  if (!redis) {
    console.log('Redis not configured, skipping markFailed')
    return
  }
  try {
    const failedItem = {
      ...item,
      error,
      failedAt: new Date().toISOString()
    }
    await redis.lpush(FAILED_QUEUE, JSON.stringify(failedItem))
    console.log(`Marked as failed: ${item.title}`)
  } catch (err) {
    console.error('Failed to mark item as failed:', err)
    throw err
  }
}

export async function getQueueLength(): Promise<number> {
  if (!redis) {
    return 0
  }
  try {
    return await redis.llen(QUEUE_NAME)
  } catch (error) {
    console.error('Failed to get queue length:', error)
    return 0
  }
}

export async function getProcessedCount(): Promise<number> {
  if (!redis) {
    return 0
  }
  try {
    return await redis.llen(PROCESSED_QUEUE)
  } catch (error) {
    console.error('Failed to get processed count:', error)
    return 0
  }
}

export async function getFailedCount(): Promise<number> {
  if (!redis) {
    return 0
  }
  try {
    return await redis.llen(FAILED_QUEUE)
  } catch (error) {
    console.error('Failed to get failed count:', error)
    return 0
  }
}

export async function getQueueStats(): Promise<{
  pending: number
  processed: number
  failed: number
}> {
  const [pending, processed, failed] = await Promise.all([
    getQueueLength(),
    getProcessedCount(),
    getFailedCount()
  ])
  
  return { pending, processed, failed }
}
