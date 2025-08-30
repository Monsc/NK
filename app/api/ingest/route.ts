import { NextRequest, NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { enqueue, NewsItem } from '@/lib/queue'

const parser = new Parser()

const RSS_SOURCES = [
  {
    name: 'BBC News',
    url: 'https://feeds.bbci.co.uk/news/rss.xml',
    category: 'news'
  },
  {
    name: 'The Guardian',
    url: 'https://www.theguardian.com/uk/rss',
    category: 'news'
  },
  {
    name: 'The Independent',
    url: 'https://www.independent.co.uk/news/uk/rss',
    category: 'news'
  },
  {
    name: 'Sky News',
    url: 'https://feeds.skynews.com/feeds/rss/home.xml',
    category: 'news'
  }
]

export async function POST(request: NextRequest) {
  try {
    const { source } = await request.json()
    
    // If specific source requested, only process that one
    const sourcesToProcess = source 
      ? RSS_SOURCES.filter(s => s.name.toLowerCase().includes(source.toLowerCase()))
      : RSS_SOURCES

    let totalProcessed = 0
    const results = []

    for (const rssSource of sourcesToProcess) {
      try {
        console.log(`Processing RSS source: ${rssSource.name}`)
        
        const feed = await parser.parseURL(rssSource.url)
        
        for (const item of feed.items.slice(0, 10)) { // Limit to 10 items per source
          const newsItem: NewsItem = {
            id: `${rssSource.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: item.title || '',
            excerpt: item.contentSnippet || item.content || '',
            url: item.link || '',
            source: rssSource.name,
            publishedAt: item.pubDate || new Date().toISOString(),
            category: rssSource.category
          }

          await enqueue(newsItem)
          totalProcessed++
          results.push({
            source: rssSource.name,
            title: newsItem.title,
            status: 'enqueued'
          })
        }
      } catch (error) {
        console.error(`Failed to process RSS source ${rssSource.name}:`, error)
        results.push({
          source: rssSource.name,
          error: error instanceof Error ? error.message : 'Unknown error',
          status: 'failed'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${totalProcessed} news items from ${sourcesToProcess.length} sources`,
      results
    })

  } catch (error) {
    console.error('Ingest API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    sources: RSS_SOURCES.map(s => ({ name: s.name, url: s.url })),
    message: 'Use POST to ingest news from RSS sources'
  })
}
