import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const pathString = path.join('/')
  
  // Mock Notion API response
  const response = {
    path: pathString,
    data: {
      title: 'Sample Notion Page',
      content: 'This is mock content from Notion',
      lastEdited: new Date().toISOString()
    }
  }

  return NextResponse.json(response)
}
