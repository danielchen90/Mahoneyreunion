"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, CreditCard } from 'lucide-react'

interface StripeButtonProps {
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
  onError: (error: any) => void
  paymentType?: 'deposit' | 'full_payment'
}

export default function StripeButton({
  amount,
  currency,
  registrationData,
  onError,
  paymentType = 'deposit'
}: StripeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    try {
      setIsLoading(true)

      console.log('Creating Stripe checkout session...')

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          registrationData,
          paymentType,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { url } = await response.json()

      console.log('✅ Checkout session created, redirecting to:', url)

      // Redirect to Stripe Checkout
      window.location.href = url

    } catch (error) {
      console.error('Stripe checkout error:', error)
      setIsLoading(false)
      onError(error)
    }
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleCheckout}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 text-lg shadow-lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Pay with Card - {currency} ${amount.toFixed(2)}
          </>
        )}
      </Button>

      <div className="text-xs text-white/70 text-center">
        <div className="flex items-center justify-center space-x-1">
          <CreditCard className="w-3 h-3" />
          <span>Secure payment powered by Stripe</span>
        </div>
        <div className="mt-1">
          Your payment information is encrypted and secure
        </div>
      </div>
    </div>
  )
}

