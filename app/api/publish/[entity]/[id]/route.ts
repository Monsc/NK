import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { mockReviewTasks, mockAuditLogs, AuditLog } from '@/lib/database'

// Schema for publishing content
const PublishSchema = z.object({
  publisher: z.string(),
  notes: z.string().optional()
})

export async function POST(
  request: NextRequest,
  { params }: { params: { entity: string; id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = PublishSchema.parse(body)
    
    // Find the review task for this content
    const reviewTask = mockReviewTasks.find(task => 
      task.targetId === params.id && task.kind.toLowerCase() === params.entity.toUpperCase()
    )
    
    if (!reviewTask) {
      return NextResponse.json(
        { success: false, error: 'No review task found for this content' },
        { status: 404 }
      )
    }
    
    if (reviewTask.state !== 'APPROVED') {
      return NextResponse.json(
        { success: false, error: 'Content must be approved before publishing' },
        { status: 403 }
      )
    }
    
    // Create audit log for publishing
    const auditLog: AuditLog = {
      id: `audit-${Date.now()}`,
      actor: validatedData.publisher,
      action: 'PUBLISH',
      target: params.id,
      diff: { published: true, entity: params.entity },
      createdAt: Date.now()
    }
    
    // In production, this would:
    // 1. Save to Redis as published content
    // 2. Write to Notion for long-term storage
    // 3. Update any caches
    // 4. Send notifications
    
    mockAuditLogs.push(auditLog)
    
    return NextResponse.json({
      success: true,
      message: 'Content published successfully',
      data: {
        entity: params.entity,
        id: params.id,
        publishedAt: Date.now(),
        reviewer: reviewTask.reviewer,
        auditLog
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error publishing content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to publish content' },
      { status: 500 }
    )
  }
}
