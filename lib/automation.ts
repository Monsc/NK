import { enqueue } from './queue'
import { classify, brief, article, safety } from './ai'
import { createPage } from './notion'
import Parser from 'rss-parser'

interface AutomationConfig {
  sources: string[]
  keywords: string[]
  minRelevance: number
  autoPublish: boolean
}

const parser = new Parser()

// Anti-monarchy RSS sources and keywords
const ANTI_MONARCHY_CONFIG: AutomationConfig = {
  sources: [
    'https://feeds.bbci.co.uk/news/uk/rss.xml',
    'https://www.theguardian.com/uk-news/rss',
    'https://www.independent.co.uk/news/uk/rss',
    'https://feeds.skynews.com/feeds/rss/uk.xml',
  ],
  keywords: [
    'monarchy', 'royal family', 'king', 'queen', 'prince', 'princess',
    'crown', 'throne', 'Buckingham Palace', 'Windsor',
    'hereditary privilege', 'abolish monarchy', 'royal cost',
    'taxpayer money', 'royal scandals', 'constitutional monarchy'
  ],
  minRelevance: 0.6,
  autoPublish: true
}

export class AutomationEngine {
  private config: AutomationConfig
  private isRunning: boolean = false

  constructor(config: AutomationConfig = ANTI_MONARCHY_CONFIG) {
    this.config = config
  }

  // Start automation system
  async start(): Promise<void> {
    if (this.isRunning) return
    
    this.isRunning = true
    console.log('🤖 Starting AI automation system for anti-monarchy campaign...')
    
         // Execute news fetching every 15 minutes
     const interval = setInterval(async () => {
      if (!this.isRunning) {
        clearInterval(interval)
        return
      }
      
      try {
        await this.executeAutomationCycle()
             } catch (error) {
         console.error('Automation cycle execution failed:', error)
       }
         }, 15 * 60 * 1000) // 15 minutes

     // Execute immediately once
     await this.executeAutomationCycle()
  }

  // Stop automation system
  stop(): void {
    this.isRunning = false
    console.log('🛑 Stopping AI automation system')
  }

  // Execute complete automation cycle
  private async executeAutomationCycle(): Promise<void> {
    console.log('🔄 Executing automation cycle...')
    
    // 1. Fetch news
    const newsItems = await this.fetchNews()
    console.log(`📰 Fetched ${newsItems.length} news items`)

    // 2. Filter relevant news
    const relevantNews = await this.filterRelevantNews(newsItems)
    console.log(`🎯 Filtered ${relevantNews.length} relevant news items`)

    // 3. Process news items
    for (const item of relevantNews) {
      await this.processNewsItem(item)
    }
  }

  // Fetch news from RSS sources
  private async fetchNews(): Promise<any[]> {
    const allNews: any[] = []

    for (const source of this.config.sources) {
      try {
        const feed = await parser.parseURL(source)
        const sourceNews = feed.items.map(item => ({
          id: item.guid || item.link || `${Date.now()}-${Math.random()}`,
          title: item.title || '',
          excerpt: item.contentSnippet || item.content || '',
          url: item.link || '',
          source: source,
          publishedAt: item.pubDate || new Date().toISOString(),
          category: 'news'
        }))
        
        allNews.push(...sourceNews)
      } catch (error) {
        console.error(`Failed to fetch news source ${source}:`, error)
      }
    }

    return allNews
  }

  // Filter relevant news items
  private async filterRelevantNews(newsItems: any[]): Promise<any[]> {
    const relevantNews: any[] = []

    for (const item of newsItems) {
      // Keyword matching
      const hasKeyword = this.config.keywords.some(keyword => 
        item.title.toLowerCase().includes(keyword.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(keyword.toLowerCase())
      )

      if (hasKeyword) {
        // AI classification for relevance
        try {
          const classification = await classify(item.title, item.excerpt)
          if (classification.relevance >= this.config.minRelevance) {
            relevantNews.push({
              ...item,
              classification
            })
          }
        } catch (error) {
          console.error('AI classification failed:', error)
          // If AI classification fails but keywords match, still add to queue
          if (hasKeyword) {
            relevantNews.push(item)
          }
        }
      }
    }

    return relevantNews
  }

  // Process individual news item
  private async processNewsItem(item: any): Promise<void> {
    try {
      console.log(`🔄 Processing news: ${item.title}`)

      // 1. Add to processing queue
      await enqueue(item)

      // 2. Generate brief
      const briefResult = await brief(item.title, item.excerpt)

      // 3. Generate full article
      const articleResult = await article(
        item.title, 
        item.excerpt, 
        [item.source]
      )

      // 4. Safety check
      const safetyResult = await safety(articleResult.content)

      if (safetyResult.isSafe && this.config.autoPublish) {
        // 5. Auto-publish to Notion
        await createPage({
          title: articleResult.title,
          content: articleResult.content,
          excerpt: articleResult.excerpt,
          tags: articleResult.tags,
          category: item.classification?.category || 'other',
          date: new Date().toISOString(),
          published: true
        })

        console.log(`✅ Auto-published article: ${articleResult.title}`)
      } else {
        console.log(`⚠️ Article requires manual review: ${articleResult.title}`)
        console.log('Safety concerns:', safetyResult.concerns)
      }

    } catch (error) {
      console.error(`Failed to process news ${item.title}:`, error)
    }
  }

  // Get automation status
  getStatus(): {
    isRunning: boolean
    config: AutomationConfig
    uptime: number
  } {
    return {
      isRunning: this.isRunning,
      config: this.config,
      uptime: this.isRunning ? Date.now() : 0
    }
  }
}

// Global automation engine instance
export const automationEngine = new AutomationEngine()

// Start automation in production environment
if (process.env.NODE_ENV === 'production' && process.env.AUTO_START_AUTOMATION === 'true') {
  automationEngine.start().catch(console.error)
}
