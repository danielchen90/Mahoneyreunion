"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle, Download, Calendar, Mail, Phone } from 'lucide-react'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const [paymentDetails, setPaymentDetails] = useState<any>(null)

  useEffect(() => {
    // Extract payment details from URL parameters
    const transactionId = searchParams.get('transaction_id')
    const amount = searchParams.get('amount')
    const currency = searchParams.get('currency')
    const status = searchParams.get('status')
    const registrant = searchParams.get('registrant')
    const email = searchParams.get('email')
    const packageType = searchParams.get('package')

    console.log('Success page loaded with params:', {
      transactionId,
      amount,
      currency,
      status,
      registrant,
      email,
      packageType
    })

    if (transactionId) {
      setPaymentDetails({
        transactionId,
        amount,
        currency,
        status,
        registrant,
        email,
        packageType,
        paymentDate: new Date().toISOString()
      })
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Registration Successful! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thank you for registering for the Mahoney Family Reunion 2026. Your deposit has been processed successfully.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Confirmation */}
          <Card className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Payment Confirmed</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm text-green-600 mb-1">
                  {paymentDetails?.packageType === 'test' ? 'Test Payment' : 'Deposit Paid'}
                </div>
                <div className="text-2xl font-bold text-green-800">
                  {paymentDetails?.amount && paymentDetails?.currency
                    ? `$${paymentDetails.amount} ${paymentDetails.currency}`
                    : 'Payment Confirmed'
                  }
                </div>
              </div>

              {paymentDetails?.registrant && (
                <div className="text-sm text-gray-600">
                  <strong>Registrant:</strong> {paymentDetails.registrant}
                </div>
              )}

              {paymentDetails?.email && (
                <div className="text-sm text-gray-600">
                  <strong>Email:</strong> {paymentDetails.email}
                </div>
              )}

              {paymentDetails?.packageType && (
                <div className="text-sm text-gray-600">
                  <strong>Package:</strong> {
                    paymentDetails.packageType === 'test' ? 'Test Payment ($1)' :
                    paymentDetails.packageType === 'deposit' ? 'Initial Deposit ($100)' :
                    paymentDetails.packageType === 'full' ? 'Full Payment ($435)' :
                    paymentDetails.packageType
                  }
                </div>
              )}

              {paymentDetails?.transactionId && (
                <div className="text-sm text-gray-600">
                  <strong>Transaction ID:</strong> {paymentDetails.transactionId}
                </div>
              )}

              <div className="text-sm text-gray-600">
                <strong>Payment Date:</strong> {
                  paymentDetails?.paymentDate
                    ? new Date(paymentDetails.paymentDate).toLocaleDateString()
                    : new Date().toLocaleDateString()
                }
              </div>

              <div className="text-sm text-gray-600">
                <strong>Status:</strong> <span className="text-green-600 font-medium">
                  {paymentDetails?.status || 'Completed'}
                </span>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">What's Next?</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Confirmation Email</h3>
                  <p className="text-sm text-gray-600">You'll receive a confirmation email with your registration details within 24 hours.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Food Payment Schedule</h3>
                  <p className="text-sm text-gray-600">Details about the food payment schedule will be sent to you soon.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Reunion Updates</h3>
                  <p className="text-sm text-gray-600">Stay tuned for updates about activities, travel information, and more details about the reunion.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Important Information */}
        <Card className="p-8 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Important Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Reunion Details</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><strong>Dates:</strong> July 29 - August 3, 2026</li>
                <li><strong>Location:</strong> Solterra Resort, Orlando, Florida</li>
                <li><strong>Accommodation:</strong> Shared Airbnb (included in your payment)</li>
                <li><strong>Meals:</strong> Breakfasts and dinners included</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Your Deposit</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✅ Secures your spot at the reunion</li>
                <li>✅ Will be credited toward accommodation cost</li>
                <li>✅ Refundable until March 1st, 2026</li>
                <li>⚠️ Individual expenses (travel, activities, lunches) are separate</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="p-8 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Need Help?</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">Email Support</div>
                <a href="mailto:reunion@mahoney2026.com" className="text-blue-600 hover:underline">
                  reunion@mahoney2026.com
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">Phone Support</div>
                <a href="tel:+1-555-REUNION" className="text-blue-600 hover:underline">
                  +1 (555) REUNION
                </a>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/">
              Return to Homepage
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link href="/budget">
              Plan Your Budget
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download Receipt</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
