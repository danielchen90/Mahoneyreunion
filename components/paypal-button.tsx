"use client"

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, CreditCard, CheckCircle, XCircle } from 'lucide-react'

interface PayPalButtonProps {
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
    emergencyContact?: string
    emergencyPhone?: string
  }
  onSuccess: (details: any) => void
  onError: (error: any) => void
  disabled?: boolean
}

declare global {
  interface Window {
    paypal?: any
  }
}

export default function PayPalButton({
  amount,
  currency,
  registrationData,
  onSuccess,
  onError,
  disabled = false
}: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load PayPal SDK
  useEffect(() => {
    if (window.paypal) {
      setPaypalLoaded(true)
      setIsLoading(false)
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${currency}&intent=capture&enable-funding=venmo,card`
    script.async = true
    
    script.onload = () => {
      setPaypalLoaded(true)
      setIsLoading(false)
    }
    
    script.onerror = () => {
      setError('Failed to load PayPal SDK')
      setIsLoading(false)
    }

    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [currency])

  // Initialize PayPal buttons
  useEffect(() => {
    if (!paypalLoaded || !window.paypal || !paypalRef.current || disabled) {
      return
    }

    // Clear any existing PayPal buttons
    paypalRef.current.innerHTML = ''

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal',
        height: 50,
      },
      
      createOrder: async () => {
        try {
          setIsProcessing(true)
          setError(null)

          console.log('Creating PayPal order with:', {
            amount,
            currency,
            registrationData
          })

          const response = await fetch('/api/paypal/create-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount,
              currency,
              description: `Mahoney Family Reunion 2026 - Deposit for ${registrationData.adults + registrationData.children} person(s)`,
              registrationData,
            }),
          })

          console.log('Create order response status:', response.status)

          if (!response.ok) {
            const errorData = await response.json()
            console.error('Create order error response:', errorData)
            throw new Error(errorData.error || 'Failed to create order')
          }

          const orderData = await response.json()
          console.log('Order created successfully:', orderData)
          return orderData.orderID
        } catch (error) {
          console.error('Error creating PayPal order:', error)
          setError(error instanceof Error ? error.message : 'Failed to create payment order')
          setIsProcessing(false)
          throw error
        }
      },

      onApprove: async (data: any) => {
        try {
          const response = await fetch('/api/paypal/capture-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderID: data.orderID,
              registrationData,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to capture payment')
          }

          const captureData = await response.json()
          setIsProcessing(false)
          onSuccess(captureData)
        } catch (error) {
          console.error('Error capturing PayPal payment:', error)
          setError(error instanceof Error ? error.message : 'Failed to process payment')
          setIsProcessing(false)
          onError(error)
        }
      },

      onError: (err: any) => {
        console.error('PayPal error:', err)
        setError('Payment failed. Please try again.')
        setIsProcessing(false)
        onError(err)
      },

      onCancel: () => {
        setIsProcessing(false)
        setError('Payment was cancelled')
      }
    }).render(paypalRef.current)
  }, [paypalLoaded, amount, currency, registrationData, disabled, onSuccess, onError])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading payment options...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <XCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
        <Button 
          onClick={() => {
            setError(null)
            setIsLoading(true)
            window.location.reload()
          }}
          variant="outline" 
          size="sm" 
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Payment Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-blue-800">Payment Summary</span>
          <CreditCard className="w-5 h-5 text-blue-600" />
        </div>
        <div className="space-y-1 text-sm text-blue-700">
          <div className="flex justify-between">
            <span>Deposit ({registrationData.adults + registrationData.children} person{registrationData.adults + registrationData.children > 1 ? 's' : ''})</span>
            <span className="font-semibold">${amount.toFixed(2)} {currency}</span>
          </div>
          <div className="text-xs text-blue-600 mt-2">
            This deposit will be credited toward your accommodation cost
          </div>
        </div>
      </div>

      {/* PayPal Button Container */}
      <div className={`${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <div ref={paypalRef} />
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="flex items-center justify-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Loader2 className="w-5 h-5 animate-spin mr-2 text-yellow-600" />
          <span className="text-yellow-800">Processing your payment...</span>
        </div>
      )}

      {/* Security Notice */}
      <div className="text-xs text-gray-500 text-center">
        <div className="flex items-center justify-center space-x-1">
          <CheckCircle className="w-3 h-3" />
          <span>Secure payment powered by PayPal</span>
        </div>
        <div className="mt-1">
          Your payment information is encrypted and secure
        </div>
      </div>
    </div>
  )
}
