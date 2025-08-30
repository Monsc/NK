import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { mockLedgerEntries, LedgerEntry } from '@/lib/database'

// Schema for creating a ledger entry
const CreateLedgerEntrySchema = z.object({
  category: z.enum(['infra', 'legal', 'tools', 'comms']),
  amountUsd: z.number().positive(),
  note: z.string().optional()
})

const MONTHLY_CAP_USD = 1000

export async function GET(
  request: NextRequest,
  { params }: { params: { month: string } }
) {
  try {
    const month = params.month // Format: yyyy-mm
    
    // Filter entries for the specified month
    const entries = mockLedgerEntries.filter(entry => entry.month === month)
    
    // Calculate totals
    const totalSpent = entries.reduce((sum, entry) => sum + entry.amountUsd, 0)
    const remainingBudget = Math.max(0, MONTHLY_CAP_USD - totalSpent)
    
    // Group by category
    const categoryTotals = entries.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + entry.amountUsd
      return acc
    }, {} as Record<string, number>)
    
    return NextResponse.json({
      success: true,
      data: {
        month,
        entries,
        summary: {
          totalSpent,
          remainingBudget,
          monthlyCap: MONTHLY_CAP_USD,
          categoryTotals
        }
      }
    })
  } catch (error) {
    console.error('Error fetching ledger:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ledger' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { month: string } }
) {
  try {
    const body = await request.json()
    const validatedData = CreateLedgerEntrySchema.parse(body)
    
    const month = params.month
    
    // Check monthly cap
    const existingEntries = mockLedgerEntries.filter(entry => entry.month === month)
    const totalSpent = existingEntries.reduce((sum, entry) => sum + entry.amountUsd, 0)
    
    if (totalSpent + validatedData.amountUsd > MONTHLY_CAP_USD) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Monthly cap exceeded',
          details: {
            currentSpent: totalSpent,
            requestedAmount: validatedData.amountUsd,
            monthlyCap: MONTHLY_CAP_USD,
            remainingBudget: MONTHLY_CAP_USD - totalSpent
          }
        },
        { status: 400 }
      )
    }
    
    const newEntry: LedgerEntry = {
      month,
      category: validatedData.category,
      amountUsd: validatedData.amountUsd,
      capApplied: false,
      note: validatedData.note,
      createdAt: Date.now()
    }
    
    // In production, this would save to Redis
    mockLedgerEntries.push(newEntry)
    
    return NextResponse.json({
      success: true,
      data: newEntry,
      summary: {
        totalSpent: totalSpent + validatedData.amountUsd,
        remainingBudget: MONTHLY_CAP_USD - (totalSpent + validatedData.amountUsd)
      }
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating ledger entry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create ledger entry' },
      { status: 500 }
    )
  }
}
