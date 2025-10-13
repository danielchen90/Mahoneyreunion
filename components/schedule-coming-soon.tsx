import { Calendar, Clock, Sparkles, PartyPopper, Utensils, Camera, Music, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ScheduleComingSoon() {
  const activityTeasers = [
    {
      icon: PartyPopper,
      title: "Welcome Reception",
      description: "Kick off the reunion with a festive welcome party"
    },
    {
      icon: Utensils,
      title: "Family Dinners",
      description: "Delicious meals featuring family recipes and Florida specialties"
    },
    {
      icon: Camera,
      title: "Photo Sessions",
      description: "Professional family portraits and candid moments"
    },
    {
      icon: Music,
      title: "Entertainment",
      description: "Live music, dancing, and poolside fun for all ages"
    },
    {
      icon: Sparkles,
      title: "Orlando Adventures",
      description: "Optional trips to theme parks and local attractions"
    },
    {
      icon: Calendar,
      title: "Special Events",
      description: "Surprise activities and memorable celebrations"
    }
  ]

  return (
    <section className="py-20 min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Coming Soon Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/30 mb-12">
          <div className="text-center mb-8">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full mb-6 backdrop-blur-sm border border-blue-400/40">
              <Clock className="w-12 h-12 text-cyan-300 animate-pulse" />
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Schedule Coming Soon
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-6 drop-shadow-md leading-relaxed">
              We're planning something special for the Mahoney Family Reunion!
            </p>

            {/* Date Badge */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge className="bg-white/20 text-white backdrop-blur-sm border border-white/30 px-6 py-3 text-base">
                <Calendar className="w-5 h-5 mr-2 inline" />
                July 29 - August 3, 2026
              </Badge>
              <Badge className="bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-white backdrop-blur-sm border border-cyan-400/40 px-6 py-3 text-base">
                <Sparkles className="w-5 h-5 mr-2 inline" />
                Detailed Schedule: Spring 2026
              </Badge>
            </div>

            {/* Description */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
              <p className="text-lg text-white/90 leading-relaxed drop-shadow-md">
                Our planning committee is hard at work creating an unforgettable itinerary filled with 
                activities, meals, entertainment, and special moments for the entire family. The detailed 
                schedule will be published in <span className="font-semibold text-cyan-300">Spring 2026</span>, 
                giving everyone plenty of time to plan their days at the reunion.
              </p>
            </div>
          </div>

          {/* Activity Teasers Grid */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 drop-shadow-lg">
              What to Expect
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activityTeasers.map((activity, index) => {
                const IconComponent = activity.icon
                return (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/30 flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2 drop-shadow-lg">
                          {activity.title}
                        </h3>
                        <p className="text-white/80 text-sm drop-shadow-md">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <p className="text-white/90 text-lg mb-6 drop-shadow-md">
              Don't wait for the schedule—secure your spot today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-400/50 hover:border-blue-300 group"
                >
                  Register Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link href="/travel">
                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-6 text-lg border-2 border-white/40 hover:border-white/60 backdrop-blur-sm transition-all duration-300"
                >
                  Plan Your Travel
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/30">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500/30 to-amber-500/30 rounded-lg flex items-center justify-center mr-4">
                <Sparkles className="w-6 h-6 text-orange-300" />
              </div>
              <h3 className="text-xl font-semibold text-white drop-shadow-lg">Stay Updated</h3>
            </div>
            <p className="text-white/90 text-sm drop-shadow-md leading-relaxed">
              Register now to receive email updates when the detailed schedule is published. 
              You'll be the first to know about all the exciting activities we have planned!
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/30">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-lg flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-green-300" />
              </div>
              <h3 className="text-xl font-semibold text-white drop-shadow-lg">Mark Your Calendar</h3>
            </div>
            <p className="text-white/90 text-sm drop-shadow-md leading-relaxed">
              Save the dates: July 29 - August 3, 2026. Six days of family fun,
              celebration, and creating memories that will last a lifetime in beautiful Orlando, Florida!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

