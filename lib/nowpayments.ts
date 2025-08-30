// NowPayments API integration utilities
export interface PaymentRequest {
  price_amount: number
  price_currency: string
  pay_currency: string
  order_id?: string
  order_description?: string
  ipn_callback_url?: string
  case?: string
}

export interface PaymentResponse {
  payment_id: string
  payment_status: string
  pay_address: string
  price_amount: number
  price_currency: string
  pay_amount: number
  pay_currency: string
  order_id?: string
  order_description?: string
  ipn_callback_url?: string
  created_at: string
  updated_at: string
  purchase_id: string
  payment_extra_id?: string
  case?: string
}

export interface PaymentStatus {
  payment_id: string
  payment_status: string
  pay_address: string
  price_amount: number
  price_currency: string
  pay_amount: number
  pay_currency: string
  order_id?: string
  order_description?: string
  ipn_callback_url?: string
  created_at: string
  updated_at: string
  purchase_id: string
  payment_extra_id?: string
  case?: string
}

export async function createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
  const apiKey = process.env.NOWPAYMENTS_API_KEY
  
  if (!apiKey) {
    throw new Error('NowPayments API key not configured')
  }

  try {
    const response = await fetch('https://api.nowpayments.io/v1/payment', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    })

    if (!response.ok) {
      throw new Error(`NowPayments API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('NowPayments API error:', error)
    throw error
  }
}

export async function getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
  const apiKey = process.env.NOWPAYMENTS_API_KEY
  
  if (!apiKey) {
    throw new Error('NowPayments API key not configured')
  }

  try {
    const response = await fetch(`https://api.nowpayments.io/v1/payment/${paymentId}`, {
      headers: {
        'x-api-key': apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`NowPayments API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('NowPayments API error:', error)
    throw error
  }
}

export function validateWebhookSignature(_payload: string, _signature: string): boolean {
  const secret = process.env.NOWPAYMENTS_WEBHOOK_SECRET
  
  if (!secret) {
    console.warn('NowPayments webhook secret not configured')
    return false
  }

  // In a real implementation, you would validate the signature
  // For now, we'll just return true for development
  return true
}
