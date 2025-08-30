import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { mockReviewTasks, ReviewTask } from '@/lib/database'

// Schema for creating a new review task
const CreateReviewTaskSchema = z.object({
  kind: z.enum(['EVIDENCE', 'TEMPLATE', 'NEWS', 'LEDGER_REPORT']),
  targetId: z.string(),
  title: z.string(),
  summary: z.string().optional(),
  sources: z.array(z.string()),
  risk: z.number().min(1).max(5),
  checklist: z.object({
    sources: z.boolean(),
    quotes: z.boolean(),
    counterview: z.boolean(),
    numbers: z.boolean(),
    rights: z.boolean(),
    style: z.boolean()
  })
})

export async function GET() {
  try {
    // In production, this would fetch from Redis
    const tasks = mockReviewTasks.filter(task => task.state === 'REVIEWING')
    
    return NextResponse.json({
      success: true,
      data: tasks,
      count: tasks.length
    })
  } catch (error) {
    console.error('Error fetching review tasks:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch review tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CreateReviewTaskSchema.parse(body)
    
    const newTask: ReviewTask = {
      id: `task-${Date.now()}`,
      ...validatedData,
      state: 'REVIEWING',
      notes: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    
    // In production, this would save to Redis
    mockReviewTasks.push(newTask)
    
    return NextResponse.json({
      success: true,
      data: newTask
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating review task:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create review task' },
      { status: 500 }
    )
  }
}
