import { getPages, getPage, NotionPage, NotionTimelineEntry, NotionEvent, NotionPetition, NotionResource } from './notion'

// Mock data for Edge Runtime compatibility
export const latestArticles: NotionPage[] = [
  {
    id: '1',
    title: 'Monarchy Costs Surge in 2024',
    excerpt: 'New figures reveal the monarchy now costs taxpayers £345 million annually, a 45% increase from last year.',
    content: 'The latest Sovereign Grant report shows that the monarchy now costs UK taxpayers £345 million per year...',
    date: '2024-01-01',
    category: 'latest',
    tags: ['costs', 'report'],
    published: true
  },
  {
    id: '2',
    title: 'Why Abolition Matters',
    excerpt: 'The monarchy imposes vast financial and democratic costs on society.',
    content: 'The British monarchy costs taxpayers hundreds of millions of pounds annually while undermining democratic accountability...',
    date: '2024-01-05',
    category: 'latest',
    tags: ['democracy', 'accountability'],
    published: true
  }
]

const mockWhyArticles: NotionPage[] = [
  {
    id: 'why-1',
    title: 'The Cost to the People',
    excerpt: 'How the monarchy drains public resources that could be better spent on essential services.',
    content: 'The British monarchy costs taxpayers hundreds of millions of pounds annually...',
    date: '2024-01-01',
    category: 'economic',
    tags: ['costs', 'taxpayers', 'public-funds'],
    published: true
  },
  {
    id: 'why-2',
    title: 'Democratic Principles',
    excerpt: 'Why hereditary privilege is incompatible with modern democratic values.',
    content: 'In a truly democratic society, no one should inherit power or privilege...',
    date: '2024-01-01',
    category: 'political',
    tags: ['democracy', 'hereditary-privilege', 'equality'],
    published: true
  }
]

const mockEvents: NotionEvent[] = [
  {
    id: 'event-1',
    title: 'Republic Rally in London',
    date: '2024-02-15',
    location: 'Trafalgar Square, London',
    description: 'Join us for a peaceful demonstration calling for democratic reform.',
    url: 'https://example.com/rally'
  },
  {
    id: 'event-2',
    title: 'Constitutional Reform Debate',
    date: '2024-02-20',
    location: 'University College London',
    description: 'Academic discussion on the future of the British constitution.'
  }
]

const mockPetitions: NotionPetition[] = [
  {
    id: 'petition-1',
    title: 'End the Sovereign Grant',
    description: 'Call for an end to taxpayer funding of the monarchy.',
    url: 'https://petition.parliament.uk/petitions/123456',
    signatures: 12543,
    target: 10000
  },
  {
    id: 'petition-2',
    title: 'Hold a Republic Referendum',
    description: 'Demand a public vote on the future of the monarchy.',
    url: 'https://petition.parliament.uk/petitions/789012',
    signatures: 8920,
    target: 10000
  }
]

const mockResources: NotionResource[] = [
  {
    id: 'resource-1',
    title: 'The Case for a Republic',
    description: 'Comprehensive guide to republican arguments and evidence.',
    url: 'https://example.com/case-for-republic',
    category: 'education',
    tags: ['republic', 'arguments', 'evidence']
  },
  {
    id: 'resource-2',
    title: 'Monarchy Costs Calculator',
    description: 'Interactive tool to calculate the true cost of the monarchy.',
    url: 'https://example.com/cost-calculator',
    category: 'tools',
    tags: ['costs', 'calculator', 'interactive']
  }
]

const mockTimeline: NotionTimelineEntry[] = [
  {
    id: 'timeline-1',
    title: 'Magna Carta',
    date: '1215',
    description: 'First document to limit royal power.',
    summary: 'The Magna Carta established the principle that the king was not above the law.'
  },
  {
    id: 'timeline-2',
    title: 'English Civil War',
    date: '1642-1651',
    description: 'Conflict between monarchy and parliament.',
    summary: 'The English Civil War led to the temporary abolition of the monarchy and establishment of a republic.'
  }
]

export async function getLatestUpdate(): Promise<NotionPage | null> {
  try {
    const pages = await getPages('latest')
    return pages.length > 0 ? pages[0] : latestArticles[0]
    } catch (error) {
    console.error('Failed to get latest update:', error)
    return latestArticles[0]
  }
}

export async function getWhyArticles(): Promise<NotionPage[]> {
    try {
    const pages = await getPages('why')
    return pages.length > 0 ? pages : mockWhyArticles
    } catch (error) {
    console.error('Failed to get why articles:', error)
    return mockWhyArticles
  }
}

export async function getEvents(): Promise<NotionEvent[]> {
  try {
    // In a real implementation, this would fetch from Notion
    return mockEvents
  } catch (error) {
    console.error('Failed to get events:', error)
    return mockEvents
  }
}

export async function getPetitions(): Promise<NotionPetition[]> {
  try {
    // In a real implementation, this would fetch from Notion
    return mockPetitions
    } catch (error) {
    console.error('Failed to get petitions:', error)
    return mockPetitions
  }
}

export async function getResources(): Promise<NotionResource[]> {
  try {
    // In a real implementation, this would fetch from Notion
    return mockResources
  } catch (error) {
    console.error('Failed to get resources:', error)
    return mockResources
  }
}

export async function getTimeline(): Promise<NotionTimelineEntry[]> {
  try {
    // In a real implementation, this would fetch from Notion
    return mockTimeline
  } catch (error) {
    console.error('Failed to get timeline:', error)
    return mockTimeline
  }
}

export async function getArticleBySlug(slug: string, type: 'latest' | 'why' = 'latest'): Promise<NotionPage | null> {
  try {
    if (type === 'latest') {
      const article = latestArticles.find(a => a.id === slug)
      if (article) return article
    } else if (type === 'why') {
      const article = mockWhyArticles.find(a => a.id === slug)
      if (article) return article
    }
    
    // Fallback to Notion
    const page = await getPage(slug)
    return page
  } catch (error) {
    console.error('Failed to get article by slug:', error)
    return null
  }
}

export async function searchContent(query: string): Promise<NotionPage[]> {
  try {
    const allPages = await getPages()
    const searchTerm = query.toLowerCase()
    
    return allPages.filter(page => 
      page.title.toLowerCase().includes(searchTerm) ||
      page.excerpt.toLowerCase().includes(searchTerm) ||
      page.content.toLowerCase().includes(searchTerm) ||
      page.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
    } catch (error) {
    console.error('Failed to search content:', error)
    return []
  }
}
