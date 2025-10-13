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

interface OrderRequest {
  amount: number
  currency: 'CAD' | 'USD'
  description: string
  registrationData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    adults: number
    children: number
    specialRequests?: string
  }
}

// Get PayPal access token
async function getPayPalAccessToken(): Promise<string> {
  console.log('Getting PayPal access token...')
  console.log('PayPal Base URL:', PAYPAL_BASE_URL)
  console.log('Client ID length:', PAYPAL_CLIENT_ID?.length || 0)
  console.log('Client Secret length:', PAYPAL_CLIENT_SECRET?.length || 0)

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials are missing')
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  console.log('PayPal auth response status:', response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('PayPal auth error response:', errorText)
    throw new Error(`Failed to get PayPal access token: ${response.status} - ${errorText}`)
  }

  const data: PayPalAccessTokenResponse = await response.json()
  console.log('PayPal access token obtained successfully')
  return data.access_token
}

// Create PayPal order
async function createPayPalOrder(orderData: OrderRequest, accessToken: string) {
  const { amount, currency, description, registrationData } = orderData
  
  const order = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
        },
        description: description,
        custom_id: `reunion-${registrationData.email}-${Date.now()}`,
        soft_descriptor: 'MAHONEY REUNION',
      },
    ],
    application_context: {
      brand_name: 'Mahoney Family Reunion 2026',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/register/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/register/cancel`,
    },
  }

  const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`Failed to create PayPal order: ${errorData}`)
  }

  return await response.json()
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== PayPal Create Order API Called ===')
    console.log('Environment variables check:')
    console.log('PAYPAL_CLIENT_ID:', PAYPAL_CLIENT_ID ? 'Present' : 'Missing')
    console.log('PAYPAL_CLIENT_SECRET:', PAYPAL_CLIENT_SECRET ? 'Present' : 'Missing')
    console.log('PAYPAL_BASE_URL:', PAYPAL_BASE_URL)

    const orderData: OrderRequest = await request.json()
    console.log('Request data:', orderData)

    // Validate required fields
    if (!orderData.amount || !orderData.currency || !orderData.registrationData) {
      console.log('Validation failed: Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate amount (allow test amounts and deposit amounts)
    const validAmountsCAD = [1, 100, 435] // Test, deposit, full payment
    const validAmountsUSD = [1, 74, 322] // Test, deposit, full payment (approximate conversion)
    const validAmounts = orderData.currency === 'CAD' ? validAmountsCAD : validAmountsUSD

    // Check if the amount per person is valid (allowing for multiple people)
    const totalPeople = orderData.registrationData.adults + orderData.registrationData.children
    const amountPerPerson = orderData.amount / totalPeople

    const isValidAmount = validAmounts.some(validAmount => Math.abs(amountPerPerson - validAmount) <= 2)

    if (!isValidAmount) {
      console.log(`Invalid amount: ${orderData.amount} (${amountPerPerson} per person). Valid amounts: ${validAmounts.join(', ')}`)
      return NextResponse.json(
        { error: `Invalid payment amount. Expected one of: ${validAmounts.join(', ')} ${orderData.currency} per person` },
        { status: 400 }
      )
    }

    console.log(`Amount validation passed: ${orderData.amount} ${orderData.currency} for ${totalPeople} people`)

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken()

    // Create PayPal order
    const paypalOrder = await createPayPalOrder(orderData, accessToken)

    // Store registration data temporarily (in production, use a database)
    // For now, we'll include it in the response for the frontend to handle
    
    return NextResponse.json({
      orderID: paypalOrder.id,
      registrationData: orderData.registrationData,
      amount: orderData.amount,
      currency: orderData.currency,
    })

  } catch (error) {
    console.error('PayPal order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}
