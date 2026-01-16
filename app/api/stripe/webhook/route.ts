import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { registrationsDB, paymentsDB, attendeesDB } from '@/lib/database'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      console.error('❌ No Stripe signature found')
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log('✅ Webhook event received:', event.type)

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      console.log('Processing checkout session:', session.id)

      // Extract metadata
      const metadata = session.metadata || {}
      const attendeesData = metadata.attendeesData ? JSON.parse(metadata.attendeesData) : []

      // Create registration record
      const { data: registration, error: regError } = await registrationsDB.create({
        email: metadata.email || session.customer_email || '',
        phone: metadata.phone || '',
        adults: parseInt(metadata.adults || '0'),
        children: parseInt(metadata.children || '0'),
        total_amount: (session.amount_total || 0) / 100, // Convert from cents
        currency: session.currency?.toUpperCase() || 'USD',
        payment_type: metadata.paymentType || 'deposit',
        payment_status: 'completed',
        stripe_session_id: session.id,
        stripe_customer_id: session.customer as string || undefined,
        special_requests: metadata.specialRequests || undefined,
      })

      if (regError || !registration) {
        console.error('❌ Failed to create registration:', regError)
        return NextResponse.json(
          { error: 'Failed to create registration' },
          { status: 500 }
        )
      }

      console.log('✅ Registration created:', registration.id)

      // Create payment record
      const { data: payment, error: payError } = await paymentsDB.create({
        registration_id: registration.id,
        stripe_payment_intent_id: session.payment_intent as string || undefined,
        amount: (session.amount_total || 0) / 100,
        currency: session.currency?.toUpperCase() || 'USD',
        status: 'succeeded',
        payment_method: 'card',
      })

      if (payError) {
        console.error('❌ Failed to create payment:', payError)
      } else {
        console.log('✅ Payment record created:', payment?.id)
      }

      // Create attendee records
      for (const attendee of attendeesData) {
        const { error: attError } = await attendeesDB.create({
          registration_id: registration.id,
          full_name: attendee.fullName,
          email: attendee.email || undefined,
          phone: attendee.phone || undefined,
          age_group: attendee.ageGroup,
          dietary_restrictions: attendee.dietaryRestrictions || undefined,
          emergency_contact_name: attendee.emergencyContactName || undefined,
          emergency_contact_phone: attendee.emergencyContactPhone || undefined,
        })

        if (attError) {
          console.error('❌ Failed to create attendee:', attError)
        } else {
          console.log('✅ Attendee created:', attendee.fullName)
        }
      }

      console.log('✅ Webhook processing complete')
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

