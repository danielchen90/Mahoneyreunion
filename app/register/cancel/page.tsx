"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { XCircle, ArrowLeft, CreditCard, HelpCircle } from 'lucide-react'

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cancel Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
            <XCircle className="w-12 h-12 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your payment was cancelled and no charges were made to your account. Your registration has not been completed.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* What Happened */}
          <Card className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <XCircle className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-semibold text-gray-900">What Happened?</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="text-sm text-orange-600 mb-1">Payment Status</div>
                <div className="text-lg font-bold text-orange-800">Cancelled</div>
                <div className="text-sm text-orange-600 mt-2">
                  No charges were made to your payment method
                </div>
              </div>
              
              <div className="text-sm text-gray-600 space-y-2">
                <p>Your payment was cancelled before completion. This could happen if:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You clicked the "Cancel" button during payment</li>
                  <li>You closed the payment window</li>
                  <li>There was a technical issue with the payment process</li>
                  <li>You decided not to complete the registration</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">What's Next?</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Try Again</h3>
                  <p className="text-sm text-gray-600">You can return to the registration page and complete your payment at any time.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Check Your Information</h3>
                  <p className="text-sm text-gray-600">Make sure all your registration details are correct before attempting payment again.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Contact Support</h3>
                  <p className="text-sm text-gray-600">If you're experiencing technical issues, our support team is here to help.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Important Reminders */}
        <Card className="p-8 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Important Reminders</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Deposit Information</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><strong>Amount:</strong> $100 CAD per person</li>
                <li><strong>Due Date:</strong> December 1st, 2025</li>
                <li><strong>Purpose:</strong> Secures your spot at the reunion</li>
                <li><strong>Credit:</strong> Applied toward accommodation cost</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Payment Options</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✅ PayPal account</li>
                <li>✅ Credit or debit card (via PayPal)</li>
                <li>✅ Bank account (via PayPal)</li>
                <li>✅ Secure and encrypted processing</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Troubleshooting */}
        <Card className="p-8 mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <HelpCircle className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Need Help?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Common Issues</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><strong>Payment declined:</strong> Check with your bank or try a different payment method</li>
                <li><strong>Technical errors:</strong> Try refreshing the page or using a different browser</li>
                <li><strong>Account issues:</strong> Ensure your PayPal account is in good standing</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Contact Support</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <strong>Email:</strong> <a href="mailto:reunion@mahoney2026.com" className="text-blue-600 hover:underline">reunion@mahoney2026.com</a>
                </div>
                <div>
                  <strong>Phone:</strong> <a href="tel:+1-555-REUNION" className="text-blue-600 hover:underline">+1 (555) REUNION</a>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Support hours: Monday-Friday, 9 AM - 5 PM EST
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/register">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Try Registration Again
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              Return to Homepage
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
