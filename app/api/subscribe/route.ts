import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Mock subscription processing
    const subscription = {
      id: Date.now().toString(),
      email,
      name: name || '',
      status: 'subscribed',
      timestamp: new Date().toISOString()
    }

    // Here you would typically save to database
    console.log('New subscription:', subscription)

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to our newsletter'
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 400 }
    )
  }
}
