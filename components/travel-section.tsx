"use client"

import { Card } from "@/components/ui/card"
import { GlowCard } from "@/components/glow-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plane, Car, MapPin, Clock, Luggage, Sun, Umbrella, Camera, Navigation2, ExternalLink, DollarSign } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function TravelSection() {
  const flightRoutes = [
    {
      from: "Toronto (YYZ)",
      to: "Orlando (MCO)",
      airlines: ["Air Canada", "WestJet", "Porter Airlines"],
      duration: "~3 hours",
      googleFlightsUrl: "https://www.google.com/travel/flights?q=flights%20from%20toronto%20to%20orlando"
    },
    {
      from: "New York Area",
      to: "Orlando (MCO)",
      airports: "JFK, LGA, EWR",
      airlines: ["JetBlue", "Delta", "United", "American"],
      duration: "~3 hours",
      googleFlightsUrl: "https://www.google.com/travel/flights?q=flights%20from%20new%20york%20to%20orlando"
    }
  ]

  const carRentalCompanies = [
    { name: "Enterprise", url: "https://www.enterprise.com", logo: "https://logo.clearbit.com/enterprise.com" },
    { name: "Hertz", url: "https://www.hertz.com", logo: "https://logo.clearbit.com/hertz.com" },
    { name: "Budget", url: "https://www.budget.com", logo: "https://logo.clearbit.com/budget.com" },
    { name: "Avis", url: "https://www.avis.com", logo: "https://logo.clearbit.com/avis.com" },
    { name: "National", url: "https://www.nationalcar.com", logo: "https://logo.clearbit.com/nationalcar.com" },
    { name: "Alamo", url: "https://www.alamo.com", logo: "https://logo.clearbit.com/alamo.com" }
  ]

  const orlandoAttractions = [
    {
      name: "Walt Disney World",
      distance: "15 minutes",
      url: "https://disneyworld.disney.go.com",
      description: "Magic Kingdom, EPCOT, Hollywood Studios, Animal Kingdom",
      logo: "https://logo.clearbit.com/disneyworld.disney.go.com"
    },
    {
      name: "Universal Orlando Resort",
      distance: "20 minutes",
      url: "https://www.universalorlando.com",
      description: "Universal Studios, Islands of Adventure, Volcano Bay",
      logo: "https://logo.clearbit.com/universalorlando.com"
    },
    {
      name: "SeaWorld Orlando",
      distance: "25 minutes",
      url: "https://seaworld.com/orlando",
      description: "Marine life shows, rides, and animal encounters",
      logo: "https://logo.clearbit.com/seaworld.com"
    },
    {
      name: "ICON Park",
      distance: "30 minutes",
      url: "https://iconparkorlando.com",
      description: "The Wheel, Madame Tussauds, SEA LIFE Aquarium",
      logo: "https://logo.clearbit.com/iconparkorlando.com"
    },
    {
      name: "Kennedy Space Center",
      distance: "60 minutes",
      url: "https://www.kennedyspacecenter.com",
      description: "NASA visitor complex and space shuttle exhibits",
      logo: "https://logo.clearbit.com/kennedyspacecenter.com"
    },
    {
      name: "Gatorland",
      distance: "35 minutes",
      url: "https://www.gatorland.com",
      description: "Alligator park and wildlife preserve",
      logo: "https://logo.clearbit.com/gatorland.com"
    }
  ]



  return (
    <section id="travel" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/30">
          <h2 className="section-title text-white mb-4 drop-shadow-lg">Travel Information</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto text-pretty drop-shadow-md">
            Everything you need to know about getting to Orlando, Florida and making the most of your stay at Solterra Resort.
          </p>
        </div>

        {/* Flight Information Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-8 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <Plane className="w-8 h-8 inline-block mr-3 mb-1" />
            Flight Information
          </h3>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {flightRoutes.map((route, index) => {
              const glowColors = ['blue', 'purple'] as const
              const glowColor = glowColors[index % glowColors.length]

              return (
                <GlowCard
                  key={index}
                  glowColor={glowColor}
                  customSize={true}
                  className="hover:scale-105 transition-transform duration-300"
                >
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="text-xl font-bold text-white drop-shadow-lg">{route.from}</div>
                        <Plane className="w-6 h-6 text-white/80" />
                        <div className="text-xl font-bold text-white drop-shadow-lg">{route.to}</div>
                      </div>
                      {route.airports && (
                        <p className="text-sm text-white/70 mb-2">Airports: {route.airports}</p>
                      )}
                      <Badge className="bg-white/20 text-white backdrop-blur-sm border border-white/30">
                        {route.duration} flight time
                      </Badge>
                    </div>

                    <div>
                      <h5 className="font-semibold text-white/90 mb-3 drop-shadow-md">Airlines:</h5>
                      <div className="flex flex-wrap gap-2">
                        {route.airlines.map((airline, idx) => (
                          <Badge key={idx} className="bg-white/10 text-white/90 backdrop-blur-sm border border-white/20">
                            {airline}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Link href={route.googleFlightsUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border border-white/30 shadow-lg">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Search Flights on Google Flights
                      </Button>
                    </Link>
                  </div>
                </GlowCard>
              )
            })}
          </div>

          <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/30 shadow-xl">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white mb-3 drop-shadow-lg">Flight Booking Tips</h4>
              <ul className="text-sm text-white/90 space-y-2 text-left max-w-2xl mx-auto">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Book flights 2-3 months in advance for the best rates
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Consider arriving on July 29th for the welcome reception
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Orlando International Airport (MCO) is approximately 30 minutes from Solterra Resort
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Allow extra time at MCO - it's a large, busy airport
                </li>
              </ul>
            </div>
          </Card>
        </div>

        {/* Transportation & Getting to Resort */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-8 bg-gradient-to-r from-orange-600/80 to-amber-600/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <Car className="w-8 h-8 inline-block mr-3 mb-1" />
            Transportation & Directions
          </h3>

          {/* Rental Car Companies */}
          <Card className="p-8 bg-white/10 backdrop-blur-md border border-white/30 shadow-xl mb-8">
            <div className="text-center mb-6">
              <h4 className="text-2xl font-semibold text-white mb-2 drop-shadow-lg">Rental Car Options</h4>
              <p className="text-white/90 drop-shadow-md">Available at Orlando International Airport (MCO)</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {carRentalCompanies.map((company, index) => (
                <Link
                  key={index}
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="p-4 border-2 border-white/30 rounded-lg hover:border-white/50 hover:shadow-lg hover:scale-105 transition-all duration-300 text-center bg-white backdrop-blur-sm">
                    <div className="relative w-full h-10 mb-2 flex items-center justify-center">
                      <Image
                        src={company.logo}
                        alt={`${company.name} logo`}
                        width={56}
                        height={32}
                        className="object-contain max-w-full max-h-full"
                        onError={(e) => {
                          // Fallback to car icon if logo fails to load
                          e.currentTarget.style.display = 'none'
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement
                          if (fallback) fallback.style.display = 'block'
                        }}
                      />
                      <Car className="w-6 h-6 text-gray-700 hidden" />
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">{company.name}</p>
                    <ExternalLink className="w-3 h-3 text-gray-500 mx-auto mt-1 group-hover:text-gray-700" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="bg-cyan-500/20 border border-cyan-400/30 rounded-lg p-4">
              <h5 className="font-semibold text-cyan-300 mb-3">Rental Car Tips:</h5>
              <ul className="text-sm text-white/90 space-y-2">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Book in advance for better rates and vehicle selection
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Consider a larger vehicle if visiting theme parks (for stroller, coolers, etc.)
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  GPS/navigation is usually included or available as an add-on
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Check your credit card for rental car insurance coverage
                </li>
              </ul>
            </div>
          </Card>

          {/* Getting to Solterra Resort */}
          <GlowCard glowColor="green" customSize={true}>
            <div className="space-y-6">
              <div className="text-center">
                <Navigation2 className="w-12 h-12 text-white mx-auto mb-4" />
                <h4 className="text-2xl font-semibold text-white drop-shadow-lg mb-2">Getting to Solterra Resort</h4>
                <p className="text-white/90 drop-shadow-md">From Orlando International Airport (MCO)</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <h5 className="font-semibold text-white mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Directions
                  </h5>
                  <ol className="text-sm text-white/90 space-y-3">
                    <li className="flex items-start">
                      <span className="font-bold mr-2">1.</span>
                      <span>Exit MCO and follow signs for FL-417 South (toll road)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-2">2.</span>
                      <span>Take FL-417 South for approximately 20 miles</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-2">3.</span>
                      <span>Exit onto US-192 West toward Kissimmee</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-2">4.</span>
                      <span>Follow signs to Solterra Resort community</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-2">5.</span>
                      <span>GPS coordinates will be provided upon registration</span>
                    </li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/90 font-medium">Distance:</span>
                      <span className="text-white font-bold">~25 miles</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/90 font-medium">Drive Time:</span>
                      <span className="text-white font-bold">30-40 minutes</span>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <h5 className="font-semibold text-white mb-3">Transportation Options:</h5>
                    <ul className="text-sm text-white/90 space-y-2">
                      <li className="flex items-start">
                        <Car className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Rental Car:</strong> Most flexible option</span>
                      </li>
                      <li className="flex items-start">
                        <DollarSign className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Uber/Lyft:</strong> $35-50 from airport</span>
                      </li>
                      <li className="flex items-start">
                        <Car className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Shuttle Service:</strong> Contact resort for options</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-amber-500/20 backdrop-blur-sm rounded-lg p-4 border border-amber-400/30">
                    <p className="text-sm text-white/90">
                      <strong className="text-white">💡 Pro Tip:</strong> FL-417 is a toll road. Have a credit card ready or use SunPass/E-ZPass for automatic toll payment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </GlowCard>
        </div>



        {/* Weather & Packing */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <Card className="p-8 bg-white/10 backdrop-blur-md border border-white/30 shadow-xl">
            <div className="text-center mb-6">
              <Sun className="w-12 h-12 text-orange-400 mx-auto mb-4 drop-shadow-lg" />
              <h3 className="text-xl font-semibold text-white drop-shadow-lg">Orlando Weather</h3>
              <p className="text-white/90 drop-shadow-md">Late July / Early August</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-300">92°F</div>
                <div className="text-sm text-white/80">Average High</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-300">75°F</div>
                <div className="text-sm text-white/80">Average Low</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Sun className="w-5 h-5 text-orange-400" />
                <span className="text-sm text-white/90">Sunny and hot most days</span>
              </div>
              <div className="flex items-center space-x-3">
                <Umbrella className="w-5 h-5 text-cyan-400" />
                <span className="text-sm text-white/90">Afternoon thunderstorms possible</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-white/70" />
                <span className="text-sm text-white/90">High humidity levels</span>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-white/10 backdrop-blur-md border border-white/30 shadow-xl">
            <div className="text-center mb-6">
              <Luggage className="w-12 h-12 text-cyan-400 mx-auto mb-4 drop-shadow-lg" />
              <h3 className="text-xl font-semibold text-white drop-shadow-lg">Packing Essentials</h3>
              <p className="text-white/90 drop-shadow-md">What to bring to Florida</p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Clothing:</h4>
                <ul className="text-sm text-white/90 space-y-1">
                  <li>• Light, breathable fabrics</li>
                  <li>• Swimwear and cover-ups</li>
                  <li>• Comfortable walking shoes</li>
                  <li>• Light jacket for air conditioning</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Essentials:</h4>
                <ul className="text-sm text-white/90 space-y-1">
                  <li>• Sunscreen (SPF 30+)</li>
                  <li>• Sunglasses and hat</li>
                  <li>• Reusable water bottle</li>
                  <li>• Camera for family memories</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Orlando Attractions */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-8 bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <Camera className="w-8 h-8 inline-block mr-3 mb-1" />
            Orlando Attractions & Activities
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orlandoAttractions.map((attraction, index) => {
              const glowColors = ['purple', 'red', 'orange', 'blue', 'green', 'purple'] as const
              const glowColor = glowColors[index % glowColors.length]

              return (
                <Link
                  key={index}
                  href={attraction.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <GlowCard
                    glowColor={glowColor}
                    customSize={true}
                    className="hover:scale-105 transition-transform duration-300 h-full"
                  >
                    <div className="flex flex-col h-full space-y-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="relative w-16 h-10 bg-white rounded-md p-1.5 flex items-center justify-center flex-shrink-0">
                          <Image
                            src={attraction.logo}
                            alt={`${attraction.name} logo`}
                            width={52}
                            height={28}
                            className="object-contain max-w-full max-h-full"
                            onError={(e) => {
                              // Fallback to text if logo fails
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                        <ExternalLink className="w-5 h-5 text-white/60 group-hover:text-white transition-colors flex-shrink-0" />
                      </div>

                      <h4 className="text-lg font-semibold text-white drop-shadow-lg">{attraction.name}</h4>

                      <p className="text-sm text-white/80 drop-shadow-md flex-1">{attraction.description}</p>

                      <div className="flex items-center text-white/90 text-sm pt-2 border-t border-white/20">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{attraction.distance} from resort</span>
                      </div>
                    </div>
                  </GlowCard>
                </Link>
              )
            })}
          </div>

          <Card className="mt-8 p-6 bg-white/10 backdrop-blur-md border border-white/30 shadow-xl">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white mb-3 drop-shadow-lg">Planning Your Activities</h4>
              <p className="text-sm text-white/90 mb-4 max-w-3xl mx-auto drop-shadow-md">
                Click on any attraction above to visit their official website for tickets, hours, and detailed information.
                Many attractions offer group discounts and multi-day passes.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge className="bg-purple-500/30 text-white border-purple-400/40">Theme Parks</Badge>
                <Badge className="bg-cyan-500/30 text-white border-cyan-400/40">Water Parks</Badge>
                <Badge className="bg-green-500/30 text-white border-green-400/40">Nature & Wildlife</Badge>
                <Badge className="bg-orange-500/30 text-white border-orange-400/40">Entertainment</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
