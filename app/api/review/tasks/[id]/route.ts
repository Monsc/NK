import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { mockReviewTasks, mockAuditLogs, AuditLog } from '@/lib/database'

// Schema for updating a review task
const UpdateReviewTaskSchema = z.object({
  state: z.enum(['APPROVED', 'REJECTED']),
  notes: z.string().optional(),
  reviewer: z.string()
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = UpdateReviewTaskSchema.parse(body)
    
    const taskIndex = mockReviewTasks.findIndex(task => task.id === params.id)
    if (taskIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Review task not found' },
        { status: 404 }
      )
    }
    
    const task = mockReviewTasks[taskIndex]
    const oldState = task.state
    
    // Update the task
    task.state = validatedData.state
    task.notes = validatedData.notes || task.notes
    task.reviewer = validatedData.reviewer
    task.updatedAt = Date.now()
    
    // Create audit log
    const auditLog: AuditLog = {
      id: `audit-${Date.now()}`,
      actor: validatedData.reviewer,
      action: validatedData.state === 'APPROVED' ? 'APPROVE' : 'REJECT',
      target: params.id,
      diff: { state: { from: oldState, to: validatedData.state } },
      createdAt: Date.now()
    }
    
    // In production, this would save to Redis
    mockAuditLogs.push(auditLog)
    
    return NextResponse.json({
      success: true,
      data: task,
      auditLog
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error updating review task:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update review task' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const task = mockReviewTasks.find(task => task.id === params.id)
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Review task not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: task
    })
  } catch (error) {
    console.error('Error fetching review task:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch review task' },
      { status: 500 }
    )
  }
}
