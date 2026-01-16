import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      )
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    return NextResponse.json({
      sessionId: session.id,
      amount: (session.amount_total || 0) / 100,
      currency: session.currency?.toUpperCase() || 'USD',
      paymentStatus: session.payment_status,
      customerEmail: session.customer_email,
      metadata: session.metadata,
      paymentType: session.metadata?.paymentType || 'deposit',
    })

  } catch (error) {
    console.error('Error retrieving session:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    )
  }
}

