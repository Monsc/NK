import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''

  // Mock search results
  const results = [
    {
      id: '1',
      title: 'Royal Expenses 2024',
      excerpt: 'Latest figures show the cost to taxpayers',
      url: '/latest/royal-expenses-2024',
      relevance: 95
    },
    {
      id: '2',
      title: 'Democratic Principles',
      excerpt: 'Why modern democracies don\'t have hereditary heads of state',
      url: '/why/democratic-principles',
      relevance: 90
    },
    {
      id: '3',
      title: 'Public Opinion Polls',
      excerpt: 'Recent surveys show declining support',
      url: '/latest/public-opinion',
      relevance: 85
    }
  ].filter(result => 
    result.title.toLowerCase().includes(query.toLowerCase()) ||
    result.excerpt.toLowerCase().includes(query.toLowerCase())
  )

  return NextResponse.json({
    query,
    results,
    total: results.length
  })
}
