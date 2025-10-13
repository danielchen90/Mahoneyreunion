import { GlowCard } from "@/components/glow-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MapPin, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function RegistrationCTA() {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Card */}
        <GlowCard glowColor="orange" customSize={true} className="overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Header with Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500/30 to-amber-500/30 rounded-full mb-6 backdrop-blur-sm border border-orange-400/40">
                <Sparkles className="w-10 h-10 text-orange-300" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                Join Us in Orlando!
              </h2>
              
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-6 drop-shadow-md leading-relaxed">
                Reserve your spot for an unforgettable family reunion at Solterra Resort.
                Six days of celebration, connection, and memories await!
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <Badge className="bg-white/20 text-white backdrop-blur-sm border border-white/30 px-4 py-2 text-sm">
                  <Calendar className="w-4 h-4 mr-2 inline" />
                  July 29 - August 3, 2026
                </Badge>
                <Badge className="bg-white/20 text-white backdrop-blur-sm border border-white/30 px-4 py-2 text-sm">
                  <MapPin className="w-4 h-4 mr-2 inline" />
                  Orlando, Florida
                </Badge>
                <Badge className="bg-white/20 text-white backdrop-blur-sm border border-white/30 px-4 py-2 text-sm">
                  <Users className="w-4 h-4 mr-2 inline" />
                  150+ Family Members
                </Badge>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                <div className="text-3xl font-bold text-white mb-2 drop-shadow-lg">3</div>
                <div className="text-white/80 text-sm drop-shadow-md">Package Options</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                <div className="text-3xl font-bold text-white mb-2 drop-shadow-lg">5</div>
                <div className="text-white/80 text-sm drop-shadow-md">Days of Activities</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                <div className="text-3xl font-bold text-white mb-2 drop-shadow-lg">∞</div>
                <div className="text-white/80 text-sm drop-shadow-md">Memories to Create</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register" className="w-full sm:w-auto">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-orange-400/50 hover:border-orange-300 group"
                >
                  Register Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link href="/budget" className="w-full sm:w-auto">
                <Button 
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-6 text-lg border-2 border-white/40 hover:border-white/60 backdrop-blur-sm transition-all duration-300"
                >
                  Calculate Budget
                </Button>
              </Link>
            </div>
          </div>
        </GlowCard>

        {/* Quick Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Link href="/schedule" className="group">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/30 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-white drop-shadow-lg">View Schedule</h3>
                <Calendar className="w-6 h-6 text-cyan-300 group-hover:scale-110 transition-transform drop-shadow-lg" />
              </div>
              <p className="text-white/90 text-sm drop-shadow-md">
                Explore our full itinerary of activities, meals, and special events planned for the reunion.
              </p>
            </div>
          </Link>

          <Link href="/travel" className="group">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/30 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-white drop-shadow-lg">Travel Information</h3>
                <MapPin className="w-6 h-6 text-orange-300 group-hover:scale-110 transition-transform drop-shadow-lg" />
              </div>
              <p className="text-white/90 text-sm drop-shadow-md">
                Find flight options, rental cars, directions to the resort, and Orlando attractions.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

