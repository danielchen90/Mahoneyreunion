"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, MessageCircle, MapPin, Clock, Car, Plane, Sun, Palmtree } from "lucide-react"
import ContactFormModal from "@/components/contact-form-modal"
import WhatsAppButton from "@/components/whatsapp-button"

export default function ContactSection() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  return (
    <section id="contact" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/30">
          <h2 className="section-title text-white mb-4 drop-shadow-lg">Contact & Travel Information</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto text-pretty drop-shadow-md">
            Everything you need to know about getting to Orlando, Florida and enjoying your stay at Solterra Resort.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Information */}
          <Card className="p-8 bg-white/10 backdrop-blur-md border border-white/30 shadow-xl">
            <h3 className="text-2xl font-semibold text-white mb-6 drop-shadow-lg">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-400/40">
                  <MessageSquare className="w-6 h-6 text-cyan-300 drop-shadow-lg" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white drop-shadow-md mb-2">Send Us a Message</h4>
                  <p className="text-sm text-white/70 drop-shadow-sm mb-3">Have questions about registration, accommodations, or events? We're here to help!</p>
                  <Button
                    onClick={() => setIsContactFormOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm py-2 px-4"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Open Contact Form
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-emerald-400/40">
                  <MessageCircle className="w-6 h-6 text-emerald-300 drop-shadow-lg" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white drop-shadow-md mb-2">WhatsApp Group</h4>
                  <p className="text-sm text-white/70 drop-shadow-sm mb-3">Join our family WhatsApp group for real-time updates and coordination</p>
                  <WhatsAppButton className="text-sm py-2 px-4" />
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-500/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-orange-400/40">
                  <MapPin className="w-6 h-6 text-orange-300 drop-shadow-lg" />
                </div>
                <div>
                  <h4 className="font-semibold text-white drop-shadow-md">Location</h4>
                  <p className="text-white/90 drop-shadow-md">Solterra Resort</p>
                  <p className="text-white/90 drop-shadow-md">Orlando, Florida</p>
                  <p className="text-sm text-white/70 drop-shadow-sm">Luxury resort with pools, dining, and family activities</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-500/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-amber-400/40">
                  <Clock className="w-6 h-6 text-amber-300 drop-shadow-lg" />
                </div>
                <div>
                  <h4 className="font-semibold text-white drop-shadow-md">Event Dates</h4>
                  <p className="text-white/90 drop-shadow-md">July 29 - August 3, 2026</p>
                  <p className="text-white/90 drop-shadow-md">Wednesday - Monday</p>
                  <p className="text-sm text-white/70 drop-shadow-sm">5 nights, 6 days of family fun in the Florida sunshine</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Travel Information */}
          <Card className="p-8 bg-white/10 backdrop-blur-md border border-white/30 shadow-xl">
            <h3 className="text-2xl font-semibold text-white mb-6 drop-shadow-lg">Travel Information</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-400/40">
                  <Plane className="w-6 h-6 text-cyan-300 drop-shadow-lg" />
                </div>
                <div>
                  <h4 className="font-semibold text-white drop-shadow-md">Flying to Orlando</h4>
                  <p className="text-white/90 drop-shadow-md">Orlando International Airport (MCO)</p>
                  <p className="text-sm text-white/70 drop-shadow-sm">30 minutes from Solterra Resort</p>
                  <p className="text-sm text-white/70 drop-shadow-sm">Shuttle service available - contact us for details</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-emerald-400/40">
                  <Car className="w-6 h-6 text-emerald-300 drop-shadow-lg" />
                </div>
                <div>
                  <h4 className="font-semibold text-white drop-shadow-md">Driving to Orlando</h4>
                  <p className="text-white/90 drop-shadow-md">Free parking at Solterra Resort</p>
                  <p className="text-sm text-white/70 drop-shadow-sm">Easy access from I-4 and major highways</p>
                  <p className="text-sm text-white/70 drop-shadow-sm">GPS coordinates will be provided upon registration</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-500/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-orange-400/40">
                  <Sun className="w-6 h-6 text-orange-300 drop-shadow-lg" />
                </div>
                <div>
                  <h4 className="font-semibold text-white drop-shadow-md">Weather in Orlando</h4>
                  <p className="text-white/90 drop-shadow-md">Warm & sunny in late July/early August</p>
                  <p className="text-sm text-white/70 drop-shadow-sm">Average high: 92°F, Average low: 75°F</p>
                  <p className="text-sm text-white/70 drop-shadow-sm">Pack light, comfortable clothing and sunscreen!</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-green-400/40">
                  <Palmtree className="w-6 h-6 text-green-300 drop-shadow-lg" />
                </div>
                <div>
                  <h4 className="font-semibold text-white drop-shadow-md">Local Attractions</h4>
                  <p className="text-white/90 drop-shadow-md">Disney World, Universal Studios, SeaWorld</p>
                  <p className="text-sm text-white/70 drop-shadow-sm">All within 30 minutes of the resort</p>
                  <p className="text-sm text-white/70 drop-shadow-sm">Group discounts available - ask us for details!</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center bg-white/10 backdrop-blur-md border border-white/30 shadow-xl">
            <h4 className="text-lg font-semibold text-white mb-3 drop-shadow-lg">Need Help?</h4>
            <p className="text-white/90 mb-4 text-sm drop-shadow-md">
              Have questions about the reunion, travel, or accommodations?
            </p>
            <Button
              onClick={() => setIsContactFormOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-2 border-blue-400/50"
            >
              Send Us a Message
            </Button>
          </Card>

          <Card className="p-6 text-center bg-white/10 backdrop-blur-md border border-white/30 shadow-xl">
            <h4 className="text-lg font-semibold text-white mb-3 drop-shadow-lg">Register Now</h4>
            <p className="text-white/90 mb-4 text-sm drop-shadow-md">
              Ready to join us in Orlando? Register for the reunion today!
            </p>
            <Button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border-2 border-emerald-400/50">
              Register
            </Button>
          </Card>

          <Card className="p-6 text-center bg-white/10 backdrop-blur-md border border-white/30 shadow-xl">
            <h4 className="text-lg font-semibold text-white mb-3 drop-shadow-lg">Share Updates</h4>
            <p className="text-white/90 mb-4 text-sm drop-shadow-md">
              Help us keep everyone informed with the latest reunion news.
            </p>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-2 border-orange-400/50">
              Share News
            </Button>
          </Card>
        </div>
      </div>

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
      />
    </section>
  )
}
