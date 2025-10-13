"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GlowCard } from "@/components/glow-card"
import { Heart, Camera, Music, Utensils, Palmtree, Gift, Sun, Waves, MapPin, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AboutSection() {
  const activities = [
    {
      icon: Heart,
      title: "Family Stories",
      description: "Share memories and create new ones with storytelling sessions under the Florida sunshine.",
    },
    {
      icon: Camera,
      title: "Photo Sessions",
      description: "Professional family portraits with tropical backdrops and resort scenery to capture every precious moment.",
    },
    {
      icon: Music,
      title: "Live Entertainment",
      description: "Live music, dancing, and poolside entertainment for all ages throughout our Florida celebration.",
    },
    {
      icon: Utensils,
      title: "Resort Dining",
      description: "Gourmet dining experiences featuring family recipes and delicious Florida specialties at Solterra Resort.",
    },
    {
      icon: Waves,
      title: "Pool & Water Activities",
      description: "Resort pools, water slides, and aquatic fun for the whole family in the Orlando sunshine.",
    },
    {
      icon: Sun,
      title: "Orlando Adventures",
      description: "Explore nearby attractions, theme parks, and enjoy the magic of Orlando together as a family.",
    },
  ]

  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Location Banner - Updated for glassmorphism */}
        <div className="text-center mb-12 bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/30">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-orange-300 mr-3 drop-shadow-lg" />
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              <span className="bg-gradient-to-r from-orange-300 via-amber-200 to-orange-300 bg-clip-text text-transparent">
                Orlando, Florida
              </span>
            </h2>
          </div>
          <div className="text-2xl font-semibold text-white mb-2 drop-shadow-lg">Solterra Resort</div>
          <p className="text-lg text-white/90 drop-shadow-md">A Tropical Paradise for Our Family Celebration</p>
        </div>

        <div className="text-center mb-16 bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/30">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-lg">About the Reunion</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto text-pretty leading-relaxed drop-shadow-md">
            Six days of tropical celebration, connection, and creating lasting memories with the entire Mahoney family.
            Join us in beautiful Orlando, Florida for an unforgettable resort experience filled with sunshine, love, laughter, and togetherness.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 justify-items-center">
          {activities.map((activity, index) => {
            const IconComponent = activity.icon
            const glowColors = ['blue', 'purple', 'green', 'orange', 'red'] as const
            const glowColor = glowColors[index % glowColors.length]

            return (
              <GlowCard
                key={index}
                glowColor={glowColor}
                size="md"
                className="text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-white drop-shadow-lg">{activity.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed drop-shadow-md">{activity.description}</p>
                  </div>
                </div>
              </GlowCard>
            )
          })}
        </div>

        {/* Resort Features Section with Property Image */}
        <div className="mb-16">
          <div className="text-center mb-12 bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/30">
            <h3 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">Why Solterra Resort?</h3>
            <p className="text-white/90 max-w-2xl mx-auto mb-6 drop-shadow-md">
              Experience the perfect blend of luxury and family fun at this premier Orlando resort, just minutes from world-famous attractions.
            </p>

            {/* Property Image */}
            <div className="relative w-full max-w-4xl mx-auto mb-6 rounded-xl overflow-hidden shadow-2xl border-2 border-white/30">
              <Image
                src="/resort-pool.png"
                alt="Solterra Resort - Luxurious Pool and Amenities"
                width={1200}
                height={600}
                className="w-full h-auto"
                style={{
                  objectFit: 'cover',
                }}
                priority
              />
              {/* Image Overlay for Better Text Visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Property Badge */}
              <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md border border-white/40 rounded-lg px-4 py-2">
                <p className="text-white font-semibold drop-shadow-lg">Solterra Resort Pool & Amenities</p>
              </div>
            </div>

            {/* View Property Button */}
            <Link
              href="https://www.vrbo.com/en-ca/cottage-rental/p4478728vb?endDate=2026-08-03&latLong=28.291956%2C-81.407571&location=Kissimmee%2C%20Florida%2C%20United%20States%20of%20America%2CKissimmee%2C%20Florida%2C%20United%20States%20of%20America&mapBounds=28.21381%2C-81.65579%2C28.39997%2C-81.3615&regionId=7927&rm1=a24%3Ac2%3Ac2%3Ac15%3Ac17%3Ac11%3Ac7%3Ac10&startDate=2026-07-29&expediaPropertyId=113800842&brandcid=VRBO.OWNED.BRANCH.DEFAULT.APP-SHARELINK&_branch_match_id=1503064228439437284&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXL9ErK0rK18vM1y82NTPwKEwP8w9Psq8rSk1LLSrKzEuPTyrKLy9OLbJ1zijKz00FALvmKi43AAAA"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:via-amber-600 hover:to-orange-600 text-white font-semibold border-2 border-orange-400/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                View Property on VRBO
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 justify-items-center">
            <GlowCard
              glowColor="blue"
              size="md"
              className="text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <Waves className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-semibold text-white drop-shadow-lg">Resort Pools & Waterpark</h4>
                  <p className="text-white/80 text-sm leading-relaxed drop-shadow-md">Multiple pools, water slides, and aquatic fun for all ages</p>
                </div>
              </div>
            </GlowCard>

            <GlowCard
              glowColor="orange"
              size="md"
              className="text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <Sun className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-semibold text-white drop-shadow-lg">Orlando Location</h4>
                  <p className="text-white/80 text-sm leading-relaxed drop-shadow-md">Minutes from Disney World, Universal Studios, and more</p>
                </div>
              </div>
            </GlowCard>

            <GlowCard
              glowColor="green"
              size="md"
              className="text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <Palmtree className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-semibold text-white drop-shadow-lg">Tropical Paradise</h4>
                  <p className="text-white/80 text-sm leading-relaxed drop-shadow-md">Beautiful landscaping and Florida sunshine year-round</p>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>

      </div>
    </section>
  )
}
