"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GlowCard } from "@/components/glow-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import StripeButton from "@/components/stripe-button"
import { Calendar, Star, Users, CreditCard, CheckCircle2 } from "lucide-react"

interface AttendeeInfo {
  fullName: string
  email: string
  phone: string
  ageGroup: string
  dietaryRestrictions?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
}

interface RegistrationForm {
  quantity: number
  attendees: AttendeeInfo[]
  specialRequests: string
  emergencyContact: string
  emergencyPhone: string
  agreeToTerms: boolean
}

export default function RegistrationSection() {
  const [selectedPackage, setSelectedPackage] = useState<string>("deposit") // Auto-select deposit
  const [currency, setCurrency] = useState<'CAD' | 'USD'>('CAD')
  const [formData, setFormData] = useState<RegistrationForm>({
    quantity: 1,
    attendees: [{ fullName: "", email: "", phone: "" }],
    specialRequests: "",
    emergencyContact: "",
    emergencyPhone: "",
    agreeToTerms: false,
  })
  const [formErrors, setFormErrors] = useState<string[]>([])

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error)
    setFormErrors(['Payment failed. Please try again or contact support.'])
  }

  // Only show deposit package (hide full payment temporarily)
  const packages = [
    {
      id: "deposit",
      name: "$100 Deposit",
      price: 100,
      features: ["Secure your spot", "Pay balance later", "Flexible payment options"],
      icon: Calendar,
      popular: true,
    },
  ]

  // Update attendees array when quantity changes
  useEffect(() => {
    const newAttendees = Array.from({ length: formData.quantity }, (_, index) => {
      return formData.attendees[index] || {
        fullName: "",
        email: "",
        phone: "",
        ageGroup: "adult",
        dietaryRestrictions: "",
        emergencyContactName: formData.emergencyContact,
        emergencyContactPhone: formData.emergencyPhone
      }
    })
    setFormData(prev => ({ ...prev, attendees: newAttendees }))
  }, [formData.quantity])

  const convertPrice = (priceCAD: number) => {
    if (currency === 'USD') {
      return Math.round(priceCAD * 0.74 * 100) / 100
    }
    return priceCAD
  }

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId)
  }

  const handleInputChange = (field: keyof RegistrationForm, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAttendeeChange = (index: number, field: keyof AttendeeInfo, value: string) => {
    setFormData(prev => {
      const newAttendees = [...prev.attendees]
      newAttendees[index] = { ...newAttendees[index], [field]: value }
      return { ...prev, attendees: newAttendees }
    })
  }

  const selectedPkg = packages.find(pkg => pkg.id === selectedPackage)
  const totalDeposit = selectedPkg ? convertPrice(selectedPkg.price) * formData.quantity : 0

  return (
    <div id="registration" className="py-20 relative">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Currency Toggle */}
        <div className="relative mb-16">
          <div className="text-center">
            <h2 className="section-title text-white mb-4 relative drop-shadow-lg">
              <span className="relative z-10">Register for the Reunion</span>
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Join us for an unforgettable family reunion in Orlando, Florida
            </p>
          </div>

          {/* Currency Toggle - Upper Right Corner */}
          <div className="absolute top-0 right-0">
            <div className="inline-flex rounded-lg bg-white/20 backdrop-blur-md p-0.5 border border-white/30">
              <button
                onClick={() => setCurrency('CAD')}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                  currency === 'CAD'
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                CAD $
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                  currency === 'USD'
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                USD $
              </button>
            </div>
          </div>
        </div>

        {/* Payment Option - Single Deposit Package */}
        <div className="max-w-2xl mx-auto mb-12">
          {packages.map((pkg) => {
            const IconComponent = pkg.icon
            const isSelected = selectedPackage === pkg.id

            return (
              <div key={pkg.id} className="relative">
                <GlowCard
                  glowColor="purple"
                  customSize={true}
                  className="relative ring-4 ring-cyan-400 shadow-2xl shadow-cyan-500/50"
                >
                  {/* Selected Badge - Top Right */}
                  <div className="absolute -top-3 -right-3 z-20">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-bold text-sm">SELECTED</span>
                    </div>
                  </div>

                  <div className="p-8 bg-cyan-500/10 transition-colors duration-300">
                    <div className="flex flex-col items-center text-center">
                      {/* Icon */}
                      <div className="p-4 rounded-xl mb-4 bg-purple-500/20">
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>

                      {/* Package Name */}
                      <div className="mb-3">
                        <h3 className="text-3xl font-bold text-white mb-2">{pkg.name}</h3>
                        <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold rounded-full">
                          SECURE YOUR SPOT
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mb-6">
                        <p className="text-5xl font-bold text-white">
                          {currency === 'CAD' ? 'CAD' : 'USD'} ${convertPrice(pkg.price).toFixed(2)}
                        </p>
                        <span className="text-base text-white/70">per person</span>
                      </div>

                      {/* Features */}
                      <ul className="space-y-3 w-full max-w-md">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-white/90 text-base">
                            <svg className="w-6 h-6 mr-3 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Note about full payment */}
                      <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
                        <p className="text-sm text-white/80">
                          <strong>Note:</strong> Full payment options will be available once final costs are confirmed.
                          This deposit secures your spot for the reunion.
                        </p>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </div>
            )
          })}
        </div>

        {/* Registration Form - Always shown since deposit is auto-selected */}
        {selectedPackage && selectedPkg && (
          <div className="bg-white/15 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-10 border border-white/30">
            {/* Selected Package Summary with Total */}
            <div className="mb-8 p-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl border-2 border-cyan-400/40">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-white/80 mb-1 drop-shadow-md">Payment Option</p>
                  <h3 className="text-2xl font-bold text-white drop-shadow-lg">{selectedPkg.name}</h3>
                  <p className="text-sm text-white/70 mt-1">
                    {currency === 'CAD' ? 'CAD' : 'USD'} ${convertPrice(selectedPkg.price).toFixed(2)} per person
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/80 mb-1 drop-shadow-md">Total Deposit</p>
                  <p className="text-4xl font-bold text-cyan-300 drop-shadow-lg">
                    {currency === 'CAD' ? 'CAD' : 'USD'} ${totalDeposit.toFixed(2)}
                  </p>
                  <p className="text-xs text-white/70 drop-shadow-sm">
                    {formData.quantity} {formData.quantity === 1 ? 'person' : 'people'}
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">Registration Information</h3>

            <div className="space-y-8">
              {/* Quantity Selector */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Label htmlFor="quantity" className="text-white text-lg font-semibold mb-3 block drop-shadow-md">
                  Number of People to Register *
                </Label>
                <select
                  id="quantity"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                  className="w-full md:w-64 px-4 py-3 rounded-lg bg-white/90 border-2 border-cyan-400/50 text-gray-900 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Person' : 'People'}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-white/70 mt-2 drop-shadow-sm">
                  Select how many people you're registering for this reunion
                </p>
              </div>
              {/* Dynamic Attendee Information Fields */}
              {formData.attendees.map((attendee, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 space-y-4"
                >
                  <h4 className="text-xl font-bold text-white mb-4 drop-shadow-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    Person {index + 1} Information
                  </h4>

                  <div>
                    <Label htmlFor={`fullName-${index}`} className="text-white font-medium drop-shadow-md">
                      Full Name *
                    </Label>
                    <Input
                      id={`fullName-${index}`}
                      value={attendee.fullName}
                      onChange={(e) => handleAttendeeChange(index, 'fullName', e.target.value)}
                      className="mt-2 bg-white/90 border-cyan-400/50 focus:border-cyan-500"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`email-${index}`} className="text-white font-medium drop-shadow-md">
                      Email Address *
                    </Label>
                    <Input
                      id={`email-${index}`}
                      type="email"
                      value={attendee.email}
                      onChange={(e) => handleAttendeeChange(index, 'email', e.target.value)}
                      className="mt-2 bg-white/90 border-cyan-400/50 focus:border-cyan-500"
                      placeholder="email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`phone-${index}`} className="text-white font-medium drop-shadow-md">
                      Phone Number (Optional)
                    </Label>
                    <Input
                      id={`phone-${index}`}
                      type="tel"
                      value={attendee.phone}
                      onChange={(e) => handleAttendeeChange(index, 'phone', e.target.value)}
                      className="mt-2 bg-white/90 border-cyan-400/50 focus:border-cyan-500"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>
              ))}

              {/* Emergency Contact */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 space-y-4">
                <h4 className="text-xl font-bold text-white mb-4 drop-shadow-lg">Emergency Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContact" className="text-white font-medium drop-shadow-md">
                      Contact Name *
                    </Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      className="mt-2 bg-white/90 border-cyan-400/50 focus:border-cyan-500"
                      placeholder="Emergency contact name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone" className="text-white font-medium drop-shadow-md">
                      Contact Phone *
                    </Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      className="mt-2 bg-white/90 border-cyan-400/50 focus:border-cyan-500"
                      placeholder="Emergency contact phone"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Label htmlFor="specialRequests" className="text-white font-medium drop-shadow-md text-lg mb-3 block">
                  Special Requests or Dietary Requirements
                </Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  className="mt-2 bg-white/90 border-cyan-400/50 focus:border-cyan-500"
                  rows={4}
                  placeholder="Please let us know about any dietary restrictions, accessibility needs, or special requests..."
                />
              </div>

              {/* Total Amount Display */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border-2 border-cyan-400/40">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white/90 text-lg drop-shadow-md">Deposit per person:</span>
                  <span className="font-semibold text-white text-lg drop-shadow-md">
                    {currency === 'CAD' ? 'CAD' : 'USD'} ${convertPrice(selectedPkg.price).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white/90 text-lg drop-shadow-md">Number of people:</span>
                  <span className="font-semibold text-white text-lg drop-shadow-md">
                    {formData.quantity}
                  </span>
                </div>
                <div className="border-t border-white/30 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-white drop-shadow-lg">Total Deposit:</span>
                    <span className="text-4xl font-bold text-cyan-300 drop-shadow-lg">
                      {currency === 'CAD' ? 'CAD' : 'USD'} ${totalDeposit.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className="mt-1 h-5 w-5 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded cursor-pointer"
                />
                <Label htmlFor="agreeToTerms" className="text-sm text-white/90 cursor-pointer drop-shadow-md">
                  I agree to the terms and conditions and understand that this deposit is non-refundable. I confirm that all information provided is accurate.
                </Label>
              </div>

              {/* Error Messages */}
              {formErrors.length > 0 && (
                <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4">
                  {formErrors.map((error, index) => (
                    <p key={index} className="text-red-200 text-sm">{error}</p>
                  ))}
                </div>
              )}

              {/* Stripe Payment Button */}
              {formData.agreeToTerms && (
                <StripeButton
                  amount={totalDeposit}
                  currency={currency}
                  registrationData={{
                    firstName: formData.attendees[0]?.fullName.split(' ')[0] || '',
                    lastName: formData.attendees[0]?.fullName.split(' ').slice(1).join(' ') || '',
                    email: formData.attendees[0]?.email || '',
                    phone: formData.attendees[0]?.phone || '',
                    adults: formData.quantity,
                    children: 0,
                    specialRequests: formData.specialRequests,
                    attendees: formData.attendees.map(att => ({
                      ...att,
                      emergencyContactName: formData.emergencyContact,
                      emergencyContactPhone: formData.emergencyPhone
                    })),
                  }}
                  onError={handlePaymentError}
                  paymentType="deposit"
                />
              )}

              {!formData.agreeToTerms && (
                <div className="text-center p-4 bg-orange-500/20 border border-orange-400/50 rounded-lg">
                  <p className="text-orange-200 text-sm">
                    Please agree to the terms and conditions to proceed with payment
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

