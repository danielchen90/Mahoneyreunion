"use client"

import { useState } from "react"
import { Play } from "lucide-react"

interface EntrancePageProps {
  onEnter: () => void
}

export default function EntrancePage({ onEnter }: EntrancePageProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleEnter = () => {
    setIsAnimating(true)
    setTimeout(() => {
      onEnter()
    }, 800)
  }

  return (
    <div
      className={`min-h-screen relative flex items-center justify-center p-4 transition-all duration-800 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/tropical-palm-trees-sunset-beach-florida-resort-pa.jpg')`,
        }}
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="entrance-card rounded-3xl p-12 max-w-2xl w-full text-center fade-in relative z-10 bg-white/10 backdrop-blur-md shadow-2xl border border-white/20">
        <div className="space-y-8">
          {/* Family Name */}
          <div className="space-y-4">
            <h1 className="hero-title text-white drop-shadow-lg mb-2">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Mahoney Family
              </span>
            </h1>
            <h2 className="text-4xl font-bold font-playfair">
              <span className="bg-gradient-to-r from-amber-200 via-orange-200 to-amber-200 bg-clip-text text-transparent drop-shadow-lg">
                Reunion
              </span>
            </h2>
          </div>

          {/* Location & Date */}
          <div className="space-y-3 text-white/90">
            <p className="text-xl font-semibold drop-shadow-md">Orlando, Florida</p>
            <p className="text-lg drop-shadow-md">Solterra Resort</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent drop-shadow-lg">July 29 - August 3, 2026</p>
          </div>

          <div className="flex justify-center items-center space-x-4 py-4">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-white/40"></div>
            <div className="w-4 h-4 rounded-full bg-white/40"></div>
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-white/40"></div>
          </div>

          {/* Welcome Message */}
          <p className="text-lg text-white/80 leading-relaxed max-w-lg mx-auto drop-shadow-md">
            Join us for a tropical family celebration in the heart of Florida, where memories are made and bonds are
            strengthened.
          </p>

          <button
            onClick={handleEnter}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border border-orange-400 hover:border-orange-300 px-12 py-4 rounded-full text-lg font-semibold inline-flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm hover:scale-105"
          >
            <Play className="w-5 h-5" />
            CLICK TO ENTER SITE
          </button>

          {/* Resort Info */}
          <div className="pt-6 border-t border-white/20">
            <p className="text-sm text-white/70 drop-shadow-md">
              Experience luxury and family fun at Florida's premier resort destination
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
