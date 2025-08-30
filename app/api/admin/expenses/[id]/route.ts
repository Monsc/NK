import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  // Mock expense data
  const expense = {
    id,
    year: 2023,
    amount: 107.5,
    category: 'Sovereign Grant',
    description: 'Official duties and property maintenance',
    breakdown: {
      travel: 4.2,
      security: 12.8,
      property: 45.3,
      staff: 23.1,
      other: 22.1
    }
  }

  return NextResponse.json(expense)
}
