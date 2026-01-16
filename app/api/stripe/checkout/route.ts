import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
})

interface CheckoutRequest {
  amount: number
  currency: 'CAD' | 'USD'
  registrationData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    adults: number
    children: number
    specialRequests?: string
    attendees: Array<{
      fullName: string
      email: string
      phone: string
      ageGroup: string
      dietaryRestrictions?: string
      emergencyContactName?: string
      emergencyContactPhone?: string
    }>
  }
  paymentType: 'deposit' | 'full_payment'
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== Stripe Checkout API Called ===')
    
    const body: CheckoutRequest = await request.json()
    const { amount, currency, registrationData, paymentType } = body

    // Validate required fields
    if (!amount || !currency || !registrationData || !paymentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `Mahoney Family Reunion 2026 - ${paymentType === 'deposit' ? 'Deposit' : 'Full Payment'}`,
              description: `${registrationData.adults} adult(s), ${registrationData.children} child(ren)`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/register/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/register/cancel`,
      customer_email: registrationData.email,
      metadata: {
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        email: registrationData.email,
        phone: registrationData.phone,
        adults: registrationData.adults.toString(),
        children: registrationData.children.toString(),
        specialRequests: registrationData.specialRequests || '',
        paymentType,
        attendeesData: JSON.stringify(registrationData.attendees),
      },
    })

    console.log('✅ Stripe session created:', session.id)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

