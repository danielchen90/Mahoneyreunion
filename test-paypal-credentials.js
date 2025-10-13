// Simple test script to verify PayPal credentials
// Run with: node test-paypal-credentials.js

const CLIENT_ID = 'Afku1SqAhc9pnV4719LUq0qWvWwIPr1ZuXl3Y7iEV18jOQ6nNGGTMtZoVXbgq0piCJ9Bd4NWuGgbttNn'
const CLIENT_SECRET = 'EOTJZXVFxaK9lKdf2FbM39NtJiJQlcdQZDskeb5JaCO0y2OVHNY9HzYHvYC0-MyBQfs0Rg2BajZD6Ckh'
const PAYPAL_BASE_URL = 'https://api-m.sandbox.paypal.com'

async function testPayPalCredentials() {
  console.log('Testing PayPal credentials...')
  console.log('Client ID:', CLIENT_ID.substring(0, 10) + '...')
  console.log('Client Secret:', CLIENT_SECRET.substring(0, 10) + '...')
  console.log('Base URL:', PAYPAL_BASE_URL)
  
  try {
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
    
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })
    
    console.log('Response status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ SUCCESS! Credentials are valid')
      console.log('Access token received:', data.access_token.substring(0, 20) + '...')
    } else {
      const errorData = await response.json()
      console.log('❌ FAILED! Credentials are invalid')
      console.log('Error:', errorData)
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message)
  }
}

testPayPalCredentials()
