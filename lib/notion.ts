import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY || 'dummy-key',
})

export interface NotionPage {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  category: string
  tags: string[]
  published: boolean
}

export interface NotionTimelineEntry {
  id: string
  title: string
  date: string
  description: string
  summary: string
}

export interface NotionEvent {
  id: string
  title: string
  date: string
  location: string
  description: string
  url?: string
}

export interface NotionPetition {
  id: string
  title: string
  description: string
  url: string
  signatures: number
  target: number
}

export interface NotionResource {
  id: string
  title: string
  description: string
  url: string
  category: string
  tags: string[]
}

export async function createPage(page: Omit<NotionPage, 'id'>): Promise<string> {
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID!,
      },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: page.title,
              },
            },
          ],
        },
        Excerpt: {
          rich_text: [
            {
              text: {
                content: page.excerpt,
              },
            },
          ],
        },
        Category: {
          select: {
            name: page.category,
          },
        },
        Date: {
          date: {
            start: page.date,
          },
        },
        Tags: {
          multi_select: page.tags.map(tag => ({ name: tag })),
        },
        Published: {
          checkbox: page.published,
        },
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: page.content,
                },
              },
            ],
          },
        },
      ],
    })

    return response.id
  } catch (error) {
    console.error('Failed to create Notion page:', error)
    throw error
  }
}

export async function getPages(category?: string): Promise<NotionPage[]> {
  try {
    const filter = category ? {
      property: 'Category',
      select: {
        equals: category,
      },
    } : undefined

    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter,
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    })

    return response.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Title.title[0]?.text.content || '',
      excerpt: page.properties.Excerpt.rich_text[0]?.text.content || '',
      content: page.properties.Content?.rich_text[0]?.text.content || '',
      date: page.properties.Date.date?.start || '',
      category: page.properties.Category.select?.name || '',
      tags: page.properties.Tags.multi_select?.map((tag: any) => tag.name) || [],
      published: page.properties.Published.checkbox || false,
    }))
  } catch (error) {
    console.error('Failed to get Notion pages:', error)
    return []
  }
}

export async function getPage(id: string): Promise<NotionPage | null> {
  try {
    const response = await notion.pages.retrieve({ page_id: id })
    const blocks = await notion.blocks.children.list({ block_id: id })

    const content = blocks.results
      .map((block: any) => {
        if (block.type === 'paragraph') {
          return block.paragraph.rich_text[0]?.text.content || ''
        }
        return ''
      })
      .join('\n')
  
  return {
      id: response.id,
      title: (response as any).properties.Title.title[0]?.text.content || '',
      excerpt: (response as any).properties.Excerpt.rich_text[0]?.text.content || '',
      content,
      date: (response as any).properties.Date.date?.start || '',
      category: (response as any).properties.Category.select?.name || '',
      tags: (response as any).properties.Tags.multi_select?.map((tag: any) => tag.name) || [],
      published: (response as any).properties.Published.checkbox || false,
    }
  } catch (error) {
    console.error('Failed to get Notion page:', error)
    return null
  }
}

export async function updatePage(id: string, updates: Partial<NotionPage>): Promise<void> {
  try {
    const properties: any = {}

    if (updates.title) {
      properties.Title = {
        title: [{ text: { content: updates.title } }],
      }
    }

    if (updates.excerpt) {
      properties.Excerpt = {
        rich_text: [{ text: { content: updates.excerpt } }],
      }
    }

    if (updates.category) {
      properties.Category = {
        select: { name: updates.category },
      }
    }

    if (updates.date) {
      properties.Date = {
        date: { start: updates.date },
      }
    }

    if (updates.tags) {
      properties.Tags = {
        multi_select: updates.tags.map(tag => ({ name: tag })),
      }
    }

    if (updates.published !== undefined) {
      properties.Published = {
        checkbox: updates.published,
      }
    }

    await notion.pages.update({
      page_id: id,
      properties,
    })
  } catch (error) {
    console.error('Failed to update Notion page:', error)
    throw error
  }
}

export async function deletePage(id: string): Promise<void> {
  try {
    await notion.pages.update({
      page_id: id,
      archived: true,
    })
  } catch (error) {
    console.error('Failed to delete Notion page:', error)
    throw error
  }
}
