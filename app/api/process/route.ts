import { NextRequest, NextResponse } from 'next/server'
import { dequeue, markProcessed, markFailed } from '@/lib/queue'
import { classify, brief, article, safety } from '@/lib/ai'
import { createPage } from '@/lib/notion'

export async function POST(request: NextRequest) {
  try {
    const { count = 1 } = await request.json()
    const results = []

    for (let i = 0; i < count; i++) {
      const item = await dequeue()
      if (!item) {
        console.log('No more items in queue')
        break
      }

      try {
        console.log(`Processing item: ${item.title}`)

        // Step 1: Classify the content
        const classification = await classify(item.title, item.excerpt)
        console.log(`Classification: ${classification.category}, relevance: ${classification.relevance}`)

        // Step 2: Safety check
        const safetyCheck = await safety(item.excerpt)
        if (!safetyCheck.isSafe) {
          console.log(`Safety check failed for: ${item.title}`)
          await markFailed(item, `Safety concerns: ${safetyCheck.concerns.join(', ')}`)
          results.push({
            id: item.id,
            title: item.title,
            status: 'failed',
            reason: 'Safety check failed'
          })
          continue
        }

        // Step 3: Generate brief and article
        const briefResult = await brief(item.title, item.excerpt)
        const articleResult = await article(item.title, item.excerpt, [item.url])

        // Step 4: Publish to Notion
        let notionPageId = null
        try {
          notionPageId = await createPage({
            title: articleResult.title,
            excerpt: articleResult.excerpt,
            content: articleResult.content,
            date: item.publishedAt,
            category: classification.category,
            tags: articleResult.tags,
            published: true
          })
          console.log(`Published to Notion: ${notionPageId}`)
        } catch (notionError) {
          console.error('Failed to publish to Notion:', notionError)
          // Continue processing even if Notion fails
        }

        // Step 5: Mark as processed
        const processedItem = {
          ...item,
          brief: briefResult,
          article: articleResult,
          safetyCheck,
          publishedToNotion: !!notionPageId,
          notionPageId
        }

        await markProcessed(processedItem)

        results.push({
          id: item.id,
          title: item.title,
          status: 'processed',
          category: classification.category,
          relevance: classification.relevance,
          notionPageId
        })

      } catch (error) {
        console.error(`Failed to process item ${item.id}:`, error)
        await markFailed(item, error instanceof Error ? error.message : 'Unknown error')
        results.push({
          id: item.id,
          title: item.title,
          status: 'failed',
          reason: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.length} items`,
      results
    })

  } catch (error) {
    console.error('Process API error:', error)
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
    message: 'Use POST to process news items from queue',
    example: {
      count: 5
    }
  })
}
