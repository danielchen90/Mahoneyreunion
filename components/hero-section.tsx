"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, Users } from "lucide-react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [mounted, setMounted] = useState(false)

  const reunionDate = new Date(2026, 6, 29, 0, 0, 0).getTime()

  useEffect(() => {
    setMounted(true)

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const distance = reunionDate - now

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [reunionDate])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <section id="home" className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/florida-palm-trees-resort-tropical-paradise-orland.jpg')`,
        }}
      />

      <div className="absolute inset-0 bg-white/30" />
      {/* Background Pattern - keeping for texture */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-5rem)]">
          {/* Hero Content */}
          <div className="text-center lg:text-left space-y-8 fade-in">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-lg">
              <div className="space-y-4">
                <h1 className="hero-title text-white text-balance drop-shadow-lg">
                  The <span className="text-gradient">Mahoney</span>
                  <br />
                  Family <span className="text-gradient">Reunion</span>
                </h1>
                <p className="text-xl lg:text-2xl text-white/90 max-w-2xl text-pretty font-medium drop-shadow-md">
                  Join us in beautiful Orlando, Florida for an unforgettable tropical celebration of family, memories, and new beginnings.
                  Six days of sunshine, joy, laughter, and connection await at Solterra Resort.
                </p>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white text-balance drop-shadow-lg">Countdown to Reunion</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg mx-auto lg:mx-0">
                {[
                  { value: timeLeft.days, label: "Days" },
                  { value: timeLeft.hours, label: "Hours" },
                  { value: timeLeft.minutes, label: "Minutes" },
                  { value: timeLeft.seconds, label: "Seconds" },
                ].map((item, index) => (
                  // Increased border thickness
                  <Card
                    key={index}
                    className="p-4 text-center bg-white/15 backdrop-blur-md border-2 border-white/40 shadow-md"
                  >
                    <div className="text-3xl lg:text-4xl font-bold text-cyan-300 font-mono drop-shadow-lg">
                      {item.value.toString().padStart(2, "0")}
                    </div>
                    <div className="text-sm text-white/90 font-medium mt-1 drop-shadow-md">{item.label}</div>
                  </Card>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={() => scrollToSection("registration")}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Register Now
              </Button>
              <Button
                onClick={() => scrollToSection("about")}
                variant="outline"
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-200"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Event Details Card */}
          <div className="slide-up">
            <Card className="p-8 bg-white/10 backdrop-blur-md border-2 border-white/30 shadow-2xl">
              <div className="space-y-6">
                <div className="text-center">
                  <h3
                    className="text-2xl font-bold text-white mb-2 drop-shadow-lg"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Event Details
                  </h3>
                  <div className="w-16 h-1 bg-cyan-400 mx-auto rounded-full"></div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-500/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-400/40">
                      <Calendar className="w-6 h-6 text-cyan-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white drop-shadow-md">When</h4>
                      <p className="text-white/90 drop-shadow-md">July 29 - August 3, 2026</p>
                      <p className="text-sm text-white/70 drop-shadow-sm">Wednesday - Monday</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-emerald-400/40">
                      <MapPin className="w-6 h-6 text-emerald-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white drop-shadow-md">Where</h4>
                      <p className="text-white/90 drop-shadow-md">Solterra Resort</p>
                      <p className="text-sm text-white/70 drop-shadow-sm">Orlando, Florida - Luxury resort experience</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-500/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-amber-400/40">
                      <Users className="w-6 h-6 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white drop-shadow-md">Who</h4>
                      <p className="text-white/90 drop-shadow-md">All Mahoney family members & friends</p>
                      <p className="text-sm text-white/70 drop-shadow-sm">Bring the whole family - all ages welcome!</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/30">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-white mb-2 drop-shadow-lg">Early Bird Special</p>
                    <p className="text-white/90 text-sm drop-shadow-md">Register before March 1st and save 20% on all packages</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
