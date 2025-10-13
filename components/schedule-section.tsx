import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Users, Utensils, Camera, Music, Waves, Sun, Palmtree, Heart } from "lucide-react"

export default function ScheduleSection() {
  const schedule = [
    {
      day: "Wednesday, July 29",
      date: "Day 1 - Arrival Day",
      events: [
        {
          time: "2:00 PM - 6:00 PM",
          title: "Check-in & Welcome Reception",
          location: "Solterra Resort Lobby",
          description: "Arrive, check into your rooms, and join us for a welcome reception with light refreshments",
          icon: Heart,
          type: "arrival"
        },
        {
          time: "6:30 PM - 8:30 PM",
          title: "Welcome Dinner",
          location: "Resort Main Dining Room",
          description: "Kick off the reunion with a family-style dinner featuring Florida specialties",
          icon: Utensils,
          type: "meal"
        },
        {
          time: "8:30 PM - 10:00 PM",
          title: "Family Mixer & Icebreakers",
          location: "Resort Pool Deck",
          description: "Get reacquainted with family members and meet new additions to the family",
          icon: Users,
          type: "social"
        }
      ]
    },
    {
      day: "Thursday, July 30",
      date: "Day 2 - Family Fun Day",
      events: [
        {
          time: "8:00 AM - 10:00 AM",
          title: "Breakfast Buffet",
          location: "Resort Restaurant",
          description: "Start your day with a hearty breakfast buffet",
          icon: Utensils,
          type: "meal"
        },
        {
          time: "10:30 AM - 12:30 PM",
          title: "Family Olympics",
          location: "Resort Recreation Area",
          description: "Team competitions, games, and activities for all ages",
          icon: Users,
          type: "activity"
        },
        {
          time: "12:30 PM - 2:00 PM",
          title: "Poolside Lunch",
          location: "Pool Bar & Grill",
          description: "Casual lunch by the pool with tropical drinks",
          icon: Waves,
          type: "meal"
        },
        {
          time: "2:00 PM - 4:00 PM",
          title: "Pool Party & Water Activities",
          location: "Resort Pool Complex",
          description: "Swimming, water slides, and poolside fun for the whole family",
          icon: Waves,
          type: "activity"
        },
        {
          time: "7:00 PM - 9:00 PM",
          title: "BBQ Dinner",
          location: "Resort Patio",
          description: "Traditional BBQ with live music and dancing",
          icon: Music,
          type: "meal"
        }
      ]
    },
    {
      day: "Friday, July 31",
      date: "Day 3 - Orlando Adventure Day",
      events: [
        {
          time: "8:00 AM - 9:00 AM",
          title: "Breakfast",
          location: "Resort Restaurant",
          description: "Quick breakfast before our Orlando adventure",
          icon: Utensils,
          type: "meal"
        },
        {
          time: "9:30 AM - 6:00 PM",
          title: "Disney World Group Visit",
          location: "Magic Kingdom",
          description: "Optional group visit to Disney World (additional cost, group discounts available)",
          icon: Sun,
          type: "excursion"
        },
        {
          time: "7:30 PM - 9:30 PM",
          title: "Dinner at Resort",
          location: "Resort Dining Room",
          description: "Relaxed dinner for those returning from Orlando adventures",
          icon: Utensils,
          type: "meal"
        }
      ]
    },
    {
      day: "Saturday, August 1",
      date: "Day 4 - Beach & Relaxation Day",
      events: [
        {
          time: "8:00 AM - 10:00 AM",
          title: "Breakfast Buffet",
          location: "Resort Restaurant",
          description: "Leisurely breakfast to start your day",
          icon: Utensils,
          type: "meal"
        },
        {
          time: "10:00 AM - 4:00 PM",
          title: "Beach Day Trip",
          location: "Cocoa Beach",
          description: "Optional group trip to nearby Cocoa Beach for sun, sand, and surf",
          icon: Waves,
          type: "excursion"
        },
        {
          time: "6:00 PM - 8:00 PM",
          title: "Casual Dinner",
          location: "Resort Dining Room",
          description: "Relaxed dinner with family",
          icon: Utensils,
          type: "meal"
        },
        {
          time: "8:30 PM - 11:00 PM",
          title: "Movie Night Under the Stars",
          location: "Resort Lawn",
          description: "Family-friendly outdoor movie with popcorn and treats",
          icon: Camera,
          type: "activity"
        }
      ]
    },
    {
      day: "Sunday, August 2",
      date: "Day 5 - Family Heritage Day",
      events: [
        {
          time: "9:00 AM - 10:30 AM",
          title: "Breakfast",
          location: "Resort Restaurant",
          description: "Morning breakfast buffet",
          icon: Utensils,
          type: "meal"
        },
        {
          time: "11:00 AM - 1:00 PM",
          title: "Family History & Photo Sharing",
          location: "Resort Conference Room",
          description: "Share family stories, old photos, and create a family tree together",
          icon: Camera,
          type: "activity"
        },
        {
          time: "1:00 PM - 2:30 PM",
          title: "Lunch",
          location: "Resort Restaurant",
          description: "Casual lunch buffet",
          icon: Utensils,
          type: "meal"
        },
        {
          time: "3:00 PM - 5:00 PM",
          title: "Family Talent Show Rehearsal",
          location: "Resort Event Space",
          description: "Practice for tonight's talent show - all ages welcome!",
          icon: Music,
          type: "activity"
        },
        {
          time: "6:00 PM - 10:00 PM",
          title: "Farewell Gala Dinner & Talent Show",
          location: "Resort Ballroom",
          description: "Formal dinner followed by family talent show and dancing",
          icon: Music,
          type: "meal"
        }
      ]
    },
    {
      day: "Monday, August 3",
      date: "Day 6 - Departure Day",
      events: [
        {
          time: "7:00 AM - 10:00 AM",
          title: "Farewell Breakfast",
          location: "Resort Restaurant",
          description: "Final breakfast together before checkout",
          icon: Utensils,
          type: "meal"
        },
        {
          time: "10:00 AM - 11:00 AM",
          title: "Checkout & Goodbyes",
          location: "Resort Lobby",
          description: "Check out of rooms and say your farewells until next time",
          icon: Heart,
          type: "arrival"
        }
      ]
    }
  ]

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meal': return Utensils
      case 'activity': return Users
      case 'social': return Heart
      case 'arrival': return MapPin
      case 'excursion': return Sun
      default: return Clock
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meal': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'activity': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'social': return 'bg-rose-100 text-rose-800 border-rose-200'
      case 'arrival': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'excursion': return 'bg-amber-100 text-amber-800 border-amber-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <section id="schedule" className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/tropical-palm-trees-sunset-beach-florida-resort-pa.jpg')`,
        }}
      />
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16 bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30">
          <h2 className="section-title text-neutral-900 mb-4">Event Schedule</h2>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto text-pretty">
            Six days of family fun, activities, and memories in beautiful Orlando, Florida.
            All events are included unless otherwise noted.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Badge className="bg-orange-100 text-orange-800 border-orange-200">Meals Included</Badge>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">Family Activities</Badge>
            <Badge className="bg-amber-100 text-amber-800 border-amber-200">Optional Excursions</Badge>
          </div>
        </div>

        {/* Schedule Days */}
        <div className="space-y-12">
          {schedule.map((day, dayIndex) => (
            <div key={dayIndex} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">{day.day}</h3>
                <p className="text-lg text-neutral-600">{day.date}</p>
              </div>
              
              <div className="space-y-6">
                {day.events.map((event, eventIndex) => {
                  const IconComponent = getEventIcon(event.type)
                  return (
                    <Card key={eventIndex} className="p-6 hover:shadow-lg transition-shadow duration-200">
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${getEventColor(event.type)}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                            <h4 className="text-lg font-semibold text-neutral-900">{event.title}</h4>
                            <div className="flex items-center space-x-2 text-sm text-neutral-500">
                              <Clock className="w-4 h-4" />
                              <span>{event.time}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            <MapPin className="w-4 h-4 text-neutral-400" />
                            <span className="text-sm text-neutral-600">{event.location}</span>
                          </div>
                          <p className="text-neutral-700 text-pretty">{event.description}</p>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Important Notes */}
        <div className="mt-12 bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30">
          <h3 className="text-xl font-semibold text-neutral-900 mb-4">Important Notes</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-neutral-800 mb-2">What's Included</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• All meals listed in the schedule</li>
                <li>• Resort amenities and pool access</li>
                <li>• Family activities and entertainment</li>
                <li>• Welcome reception and mixer</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-800 mb-2">Additional Costs</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Disney World tickets (group discounts available)</li>
                <li>• Personal expenses and souvenirs</li>
                <li>• Alcoholic beverages (some included)</li>
                <li>• Spa services and premium activities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
