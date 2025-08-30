import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { mockDonations, Donation } from '@/lib/database'

// NOWPayments webhook schema
const NOWPaymentsWebhookSchema = z.object({
  payment_id: z.string(),
  payment_status: z.enum(['waiting', 'confirming', 'confirmed', 'sending', 'partially_paid', 'finished', 'failed', 'refunded', 'expired']),
  pay_amount: z.number().positive(),
  pay_currency: z.string(),
  pay_address: z.string().optional(),
  price_amount: z.number().optional(),
  price_currency: z.string().optional(),
  order_id: z.string().optional(),
  order_description: z.string().optional(),
  purchase_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  outcome_amount: z.number().optional(),
  outcome_currency: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = NOWPaymentsWebhookSchema.parse(body)
    
    // Only process confirmed/finished payments
    if (!['confirmed', 'finished'].includes(validatedData.payment_status)) {
      return NextResponse.json({ 
        status: 'ignored', 
        reason: `Payment status ${validatedData.payment_status} not processed` 
      })
    }
    
    // Check if payment already exists
    const existingPayment = mockDonations.find(d => d.transactionHash === validatedData.payment_id)
    if (existingPayment) {
      return NextResponse.json({ 
        status: 'duplicate', 
        message: 'Payment already processed' 
      })
    }
    
    // Create donation record
    const donation: Donation = {
      id: `donation-${Date.now()}`,
      amount: validatedData.pay_amount,
      currency: validatedData.pay_currency,
      donor: validatedData.pay_address || 'anonymous',
      message: validatedData.order_description,
      timestamp: validatedData.created_at || new Date().toISOString(),
      transactionHash: validatedData.payment_id,
      verified: true
    }
    
    // In production, this would save to Redis
    mockDonations.push(donation)
    
    // Log the donation for transparency
    console.log('Donation processed:', {
      id: donation.id,
      amount: donation.amount,
      currency: donation.currency,
      timestamp: donation.timestamp
    })
    
    return NextResponse.json({ 
      status: 'success',
      donation_id: donation.id
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Webhook validation error:', error.errors)
      return NextResponse.json(
        { error: 'Invalid webhook data', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}
