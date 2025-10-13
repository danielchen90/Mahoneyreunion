import { NextRequest, NextResponse } from 'next/server'

// PayPal API configuration
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const PAYPAL_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com'

interface PayPalAccessTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

interface CaptureRequest {
  orderID: string
  registrationData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    adults: number
    children: number
    specialRequests?: string
    emergencyContact?: string
    emergencyPhone?: string
  }
}

// Get PayPal access token
async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token')
  }

  const data: PayPalAccessTokenResponse = await response.json()
  return data.access_token
}

// Capture PayPal payment
async function capturePayPalOrder(orderID: string, accessToken: string) {
  const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`Failed to capture PayPal order: ${errorData}`)
  }

  return await response.json()
}

// Save registration data (in production, save to database)
async function saveRegistrationData(registrationData: CaptureRequest['registrationData'], paymentDetails: any) {
  // In a real application, you would save this to a database
  // For now, we'll just log it and return success
  
  console.log('Registration Data:', {
    ...registrationData,
    paymentDetails: {
      transactionId: paymentDetails.id,
      status: paymentDetails.status,
      amount: paymentDetails.purchase_units[0].payments.captures[0].amount,
      payerEmail: paymentDetails.payer?.email_address,
      captureId: paymentDetails.purchase_units[0].payments.captures[0].id,
      createTime: paymentDetails.create_time,
    }
  })

  // TODO: Implement database storage
  // Example:
  // await db.registrations.create({
  //   data: {
  //     firstName: registrationData.firstName,
  //     lastName: registrationData.lastName,
  //     email: registrationData.email,
  //     phone: registrationData.phone,
  //     adults: registrationData.adults,
  //     children: registrationData.children,
  //     specialRequests: registrationData.specialRequests,
  //     emergencyContact: registrationData.emergencyContact,
  //     emergencyPhone: registrationData.emergencyPhone,
  //     paymentStatus: 'COMPLETED',
  //     transactionId: paymentDetails.id,
  //     captureId: paymentDetails.purchase_units[0].payments.captures[0].id,
  //     amount: parseFloat(paymentDetails.purchase_units[0].payments.captures[0].amount.value),
  //     currency: paymentDetails.purchase_units[0].payments.captures[0].amount.currency_code,
  //     createdAt: new Date(),
  //   }
  // })

  return true
}

// Send confirmation email (placeholder)
async function sendConfirmationEmail(registrationData: CaptureRequest['registrationData'], paymentDetails: any) {
  // TODO: Implement email sending
  // You could use services like SendGrid, Mailgun, or AWS SES
  
  console.log('Would send confirmation email to:', registrationData.email)
  console.log('Payment confirmed for:', paymentDetails.purchase_units[0].payments.captures[0].amount)
  
  return true
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== PayPal Capture Order API Called ===')
    const { orderID, registrationData }: CaptureRequest = await request.json()
    console.log('Capture request:', { orderID, registrationData })

    if (!orderID || !registrationData) {
      console.log('❌ Missing required fields for capture')
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get PayPal access token
    console.log('Getting PayPal access token for capture...')
    const accessToken = await getPayPalAccessToken()
    console.log('✅ PayPal access token obtained for capture')

    // Capture the payment
    console.log('Capturing PayPal order:', orderID)
    const captureData = await capturePayPalOrder(orderID, accessToken)
    console.log('✅ PayPal capture response:', JSON.stringify(captureData, null, 2))

    // Check if payment was successful
    if (captureData.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment was not completed successfully' },
        { status: 400 }
      )
    }

    // Save registration data
    await saveRegistrationData(registrationData, captureData)

    // Send confirmation email
    await sendConfirmationEmail(registrationData, captureData)

    // Return success response
    return NextResponse.json({
      success: true,
      transactionId: captureData.id,
      captureId: captureData.purchase_units[0].payments.captures[0].id,
      amount: captureData.purchase_units[0].payments.captures[0].amount,
      status: captureData.status,
      message: 'Registration completed successfully! You will receive a confirmation email shortly.',
    })

  } catch (error) {
    console.error('PayPal capture error:', error)
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    )
  }
}
