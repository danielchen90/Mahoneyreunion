"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlowCard } from "@/components/glow-card"
import {
  Bed, Bath, Users, Home, Wifi, Car, Wind, Tv, UtensilsCrossed,
  Dumbbell, Gamepad2, Baby, Snowflake, Shirt, Sun, Waves, Palmtree
} from "lucide-react"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import RegistrationCTA from "@/components/registration-cta"

export default function HomeContent() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Property photos - Actual VRBO property images (served from /public/property-photos/)
  const propertyPhotos = [
    {
      src: "/property-photos/Property.png",
      alt: "Sandhill Estate - Exterior View",
      caption: "Stunning Exterior of Sandhill Estate"
    },
    {
      src: "/property-photos/Pool.png",
      alt: "Sandhill Estate - Private Pool",
      caption: "Private Heated Pool & Spa Area"
    },
    {
      src: "/property-photos/living room.png",
      alt: "Sandhill Estate - Living Room",
      caption: "Spacious Living Room with Modern Furnishings"
    },
    {
      src: "/property-photos/Kitchen.png",
      alt: "Sandhill Estate - Gourmet Kitchen",
      caption: "Fully Equipped Gourmet Kitchen"
    },
    {
      src: "/property-photos/dinning room.png",
      alt: "Sandhill Estate - Dining Room",
      caption: "Elegant Dining Room for Family Gatherings"
    },
    {
      src: "/property-photos/Gameroom.png",
      alt: "Sandhill Estate - Game Room",
      caption: "Game Room with Pool Table & Entertainment"
    },
    {
      src: "/property-photos/floorplan.png",
      alt: "Sandhill Estate - Floor Plan",
      caption: "Property Floor Plan - 15 Bedrooms, 11 Bathrooms"
    },
    {
      src: "/property-photos/Luxurious_resort_swimming_pool_with_crystal_clear_-1759553583648.png",
      alt: "Solterra Resort - Resort Pool",
      caption: "Luxurious Resort Swimming Pool"
    },
    {
      src: "/property-photos/Beautiful_sunset_over_Orlando_Florida_skyline_with-1759553592565.png",
      alt: "Orlando - Sunset Skyline",
      caption: "Beautiful Orlando Sunset Views"
    },
    {
      src: "/property-photos/Beautiful_outdoor_shopping_district_in_Orlando_wit-1759553607959.png",
      alt: "Orlando - Shopping District",
      caption: "Nearby Shopping & Entertainment"
    },
    {
      src: "/property-photos/Commercial_airplane_landing_at_Orlando_Internation-1759604366704.png",
      alt: "Orlando International Airport",
      caption: "Easy Access from Orlando International Airport"
    },
  ]

  // Property details from VRBO listing (ACCURATE DATA)
  const propertyDetails = {
    name: "Waterpark, Pool Table, Castle Bedroom, Pool + Spa: Sandhill Estate",
    bedrooms: 15,
    bathrooms: 11,
    maxOccupancy: 41,
    propertyType: "Luxury Vacation Home",
    checkIn: "July 29, 2026 (Wednesday) - 4:00 PM",
    checkOut: "August 3, 2026 (Monday) - 10:00 AM",
    nights: 5,
    squareFeet: "6,223 sq ft"
  }

  // Comprehensive amenities list from VRBO listing (ACCURATE DATA)
  const amenities = [
    { icon: Wifi, name: "Free WiFi", description: "High-speed wireless internet" },
    { icon: Wind, name: "Air Conditioning", description: "Central AC throughout" },
    { icon: Waves, name: "Heated Pool", description: "Private heated pool" },
    { icon: Waves, name: "Hot Tub", description: "Relaxing spa/hot tub" },
    { icon: Car, name: "Parking & Garage", description: "Free parking with garage" },
    { icon: Car, name: "EV Charger", description: "Electric vehicle charging" },
    { icon: Shirt, name: "Washer & Dryer", description: "In-unit laundry facilities" },
    { icon: UtensilsCrossed, name: "Full Kitchen", description: "Fully equipped kitchen" },
    { icon: Tv, name: "Smart TVs", description: "Multiple smart TVs" },
    { icon: Gamepad2, name: "Pool Table", description: "Billiards in game room" },
    { icon: Gamepad2, name: "Arcade/Game Room", description: "Entertainment for all ages" },
    { icon: Dumbbell, name: "Fitness Center", description: "Resort fitness facilities" },
    { icon: Baby, name: "Family Friendly", description: "Travel cot & highchair" },
    { icon: Sun, name: "Balcony & Patio", description: "Outdoor space with BBQ" },
    { icon: Snowflake, name: "Water Park Access", description: "On-site water park" },
    { icon: Palmtree, name: "Resort Amenities", description: "Full resort access" },
  ]

  return (
    <div className="relative min-h-screen">
      {/* Fixed Background Image */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <Image
          src="/tropical-palm-trees-sunset-beach-florida-resort-pa.jpg"
          alt="Tropical Background"
          fill
          className="object-cover"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          priority
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Hero Text */}
        <div className="text-center mb-16 bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/30">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Mahoney Family Reunion
          </h1>
          <p className="text-2xl text-white/90 mb-2 drop-shadow-md">July 29 - August 3, 2026</p>
          <p className="text-xl text-white/80 drop-shadow-md">Orlando, Florida • Solterra Resort</p>
        </div>

        {/* 1. Our Reunion Property Section (TOP PRIORITY) */}
        <div className="mb-16">
          <div className="text-center mb-12 bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/30">
            <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">Our Reunion Property</h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8 drop-shadow-md">
              Experience the perfect blend of luxury and family fun at this premier Orlando resort villa, just minutes from world-famous attractions.
            </p>

            {/* Photo Carousel */}
            <div className="relative w-full max-w-5xl mx-auto mb-8">
              <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                  {propertyPhotos.map((photo, index) => (
                    <CarouselItem key={index}>
                      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-2xl border-2 border-white/30">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          className="object-cover"
                          priority={index === 0}
                        />
                        {/* Image Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Photo Caption */}
                        <div className="absolute bottom-6 left-6 right-6 bg-white/20 backdrop-blur-md border border-white/40 rounded-lg px-6 py-3">
                          <p className="text-white font-semibold text-lg drop-shadow-lg">{photo.caption}</p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 bg-white/20 backdrop-blur-md border-white/40 hover:bg-white/30" />
                <CarouselNext className="right-4 bg-white/20 backdrop-blur-md border-white/40 hover:bg-white/30" />
              </Carousel>

              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {propertyPhotos.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'bg-white w-8'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Property Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-4">
                <Bed className="w-8 h-8 text-cyan-300 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white drop-shadow-lg">{propertyDetails.bedrooms}</p>
                <p className="text-sm text-white/80 drop-shadow-md">Bedrooms</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg p-4">
                <Bath className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white drop-shadow-lg">{propertyDetails.bathrooms}</p>
                <p className="text-sm text-white/80 drop-shadow-md">Bathrooms</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 rounded-lg p-4">
                <Users className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white drop-shadow-lg">{propertyDetails.maxOccupancy}</p>
                <p className="text-sm text-white/80 drop-shadow-md">Max Guests</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 backdrop-blur-sm border border-orange-400/30 rounded-lg p-4">
                <Home className="w-8 h-8 text-orange-300 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white drop-shadow-lg">{propertyDetails.nights}</p>
                <p className="text-sm text-white/80 drop-shadow-md">Nights</p>
              </div>
            </div>

            {/* Stay Dates */}
            <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-sm border border-orange-400/30 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
              <h4 className="text-xl font-semibold text-white mb-3 drop-shadow-lg">Reunion Dates</h4>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-white/70 drop-shadow-md">Check-In</p>
                  <p className="text-lg font-semibold text-white drop-shadow-lg">{propertyDetails.checkIn}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70 drop-shadow-md">Check-Out</p>
                  <p className="text-lg font-semibold text-white drop-shadow-lg">{propertyDetails.checkOut}</p>
                </div>
              </div>
              <p className="text-white/80 mt-3 drop-shadow-md">
                <strong>{propertyDetails.nights} nights</strong> of family fun and memories!
              </p>
            </div>
          </div>
        </div>

        {/* 2. Amenities Section */}
        <div className="mb-16">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/30">
            <h2 className="text-3xl font-bold text-white mb-6 text-center drop-shadow-lg">Property Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {amenities.map((amenity, index) => {
                const IconComponent = amenity.icon
                return (
                  <div
                    key={index}
                    className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-lg p-4 transition-all duration-300 hover:scale-105"
                  >
                    <IconComponent className="w-8 h-8 text-cyan-300 mb-2" />
                    <h5 className="text-sm font-semibold text-white mb-1 drop-shadow-lg">{amenity.name}</h5>
                    <p className="text-xs text-white/70 drop-shadow-md">{amenity.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 3. Registration CTA */}
        <div className="mb-16">
          <RegistrationCTA />
        </div>

        {/* Resort Highlights */}
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
                <p className="text-white/80 text-sm leading-relaxed drop-shadow-md">Multiple pools, water slides, lazy river, and aquatic fun for all ages</p>
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
                <h4 className="text-xl font-semibold text-white drop-shadow-lg">Prime Orlando Location</h4>
                <p className="text-white/80 text-sm leading-relaxed drop-shadow-md">15 minutes to Disney World, 20 minutes to Universal Studios</p>
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
                <p className="text-white/80 text-sm leading-relaxed drop-shadow-md">Beautiful landscaping, Florida sunshine, and resort-style living</p>
              </div>
            </div>
          </GlowCard>
        </div>

      </div>
    </div>
  )
}

