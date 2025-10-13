"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlowCard } from "@/components/glow-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Star, Users, CreditCard, CheckCircle2 } from "lucide-react"

interface RegistrationForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  adults: number
  children: number
  specialRequests: string
  emergencyContact: string
  emergencyPhone: string
  agreeToTerms: boolean
}

export default function RegistrationSection() {
  const [selectedPackage, setSelectedPackage] = useState<string>("")
  const [currency, setCurrency] = useState<'CAD' | 'USD'>('CAD')
  const [formData, setFormData] = useState<RegistrationForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    adults: 1,
    children: 0,
    specialRequests: "",
    emergencyContact: "",
    emergencyPhone: "",
    agreeToTerms: false,
  })

  // Only show deposit and full payment packages (hide test package)
  const packages = [
    {
      id: "deposit",
      name: "Initial Deposit",
      price: 100,
      features: ["Secure your spot", "Pay balance later", "Flexible payment options"],
      icon: Calendar,
      popular: true,
    },
    {
      id: "full",
      name: "Full Collective Costs",
      price: 435,
      features: ["Complete payment", "All activities included", "Best value"],
      icon: Star,
      popular: false,
    },
  ]

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

  const selectedPkg = packages.find(pkg => pkg.id === selectedPackage)

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

        {/* Package Selection - 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {packages.map((pkg, index) => {
            const IconComponent = pkg.icon
            const isSelected = selectedPackage === pkg.id
            const glowColors = ['purple', 'orange'] as const
            const glowColor = glowColors[index % glowColors.length]

            return (
              <div
                key={pkg.id}
                className="relative cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                onClick={() => handlePackageSelect(pkg.id)}
              >
                <GlowCard
                  glowColor={glowColor}
                  customSize={true}
                  className={`relative ${
                    isSelected
                      ? "ring-4 ring-cyan-400 shadow-2xl shadow-cyan-500/50"
                      : "ring-1 ring-white/20"
                  }`}
                >
                  {/* Selected Badge - Top Right */}
                  {isSelected && (
                    <div className="absolute -top-3 -right-3 z-20">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-bold text-sm">SELECTED</span>
                      </div>
                    </div>
                  )}

                  <div className={`p-6 ${isSelected ? 'bg-cyan-500/10' : ''} transition-colors duration-300`}>
                    <div className="flex flex-col items-center text-center">
                      {/* Icon */}
                      <div className={`p-4 rounded-xl mb-4 ${
                        glowColor === 'purple' ? 'bg-purple-500/20' : 'bg-orange-500/20'
                      }`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>

                      {/* Package Name */}
                      <div className="mb-3">
                        <h3 className="text-2xl font-bold text-white mb-1">{pkg.name}</h3>
                        {pkg.popular && (
                          <span className="inline-block px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold rounded-full">
                            POPULAR CHOICE
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="mb-6">
                        <p className="text-4xl font-bold text-white">
                          {currency === 'CAD' ? 'CAD' : 'USD'} ${convertPrice(pkg.price).toFixed(2)}
                        </p>
                        <span className="text-sm text-white/70">per person</span>
                      </div>

                      {/* Features */}
                      <ul className="space-y-3 w-full">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-white/90 text-sm">
                            <svg className="w-5 h-5 mr-2 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Select Button */}
                      {!isSelected && (
                        <Button
                          className="mt-6 w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePackageSelect(pkg.id)
                          }}
                        >
                          Select Package
                        </Button>
                      )}
                    </div>
                  </div>
                </GlowCard>
              </div>
            )
          })}
        </div>

        {/* Registration Form - Only shown after package selection */}
        {selectedPackage && selectedPkg && (
          <div className="bg-white/15 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-10 border border-white/30">
            {/* Selected Package Summary */}
            <div className="mb-8 p-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl border-2 border-cyan-400/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80 mb-1 drop-shadow-md">Selected Package</p>
                  <h3 className="text-2xl font-bold text-white drop-shadow-lg">{selectedPkg.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/80 mb-1 drop-shadow-md">Amount</p>
                  <p className="text-3xl font-bold text-cyan-300 drop-shadow-lg">
                    {currency === 'CAD' ? 'CAD' : 'USD'} ${convertPrice(selectedPkg.price).toFixed(2)}
                  </p>
                  <p className="text-xs text-white/70 drop-shadow-sm">per person</p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">Registration Information</h3>

            <div className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="text-gray-700">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-gray-700">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email" className="text-gray-700">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-700">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              {/* Number of Attendees */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="adults" className="text-gray-700">Number of Adults *</Label>
                  <Input
                    id="adults"
                    type="number"
                    min="1"
                    value={formData.adults}
                    onChange={(e) => handleInputChange('adults', parseInt(e.target.value) || 1)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="children" className="text-gray-700">Number of Children</Label>
                  <Input
                    id="children"
                    type="number"
                    min="0"
                    value={formData.children}
                    onChange={(e) => handleInputChange('children', parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="emergencyContact" className="text-gray-700">Contact Name *</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone" className="text-gray-700">Contact Phone *</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <Label htmlFor="specialRequests" className="text-gray-700">Special Requests or Dietary Requirements</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  className="mt-1"
                  rows={4}
                  placeholder="Please let us know about any dietary restrictions, accessibility needs, or special requests..."
                />
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3 pt-4">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                />
                <Label htmlFor="agreeToTerms" className="text-sm text-gray-700 cursor-pointer">
                  I agree to the terms and conditions and understand that this payment is non-refundable. I confirm that all information provided is accurate.
                </Label>
              </div>

              {/* Total Amount Display */}
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Package Price (per person):</span>
                  <span className="font-semibold text-gray-900">
                    {currency === 'CAD' ? 'CAD' : 'USD'} ${convertPrice(selectedPkg.price).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Number of People:</span>
                  <span className="font-semibold text-gray-900">
                    {formData.adults + formData.children}
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                    <span className="text-2xl font-bold text-cyan-600">
                      {currency === 'CAD' ? 'CAD' : 'USD'} ${(convertPrice(selectedPkg.price) * (formData.adults + formData.children)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pay Now Button */}
              <Button
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={!formData.agreeToTerms}
              >
                Pay Now with PayPal
              </Button>

              <p className="text-center text-sm text-gray-500">
                You will be redirected to PayPal to complete your payment securely
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

