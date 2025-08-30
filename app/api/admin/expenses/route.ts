import { NextResponse } from 'next/server'

export async function GET() {
  // Mock data for royal expenses
  const expenses = [
    {
      year: 2023,
      amount: 107.5,
      category: 'Sovereign Grant',
      description: 'Official duties and property maintenance'
    },
    {
      year: 2022,
      amount: 102.4,
      category: 'Sovereign Grant',
      description: 'Official duties and property maintenance'
    },
    {
      year: 2021,
      amount: 85.9,
      category: 'Sovereign Grant',
      description: 'Official duties and property maintenance'
    }
  ]

  return NextResponse.json(expenses)
}
