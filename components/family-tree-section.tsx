"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GlowCard } from "@/components/glow-card"
import { Users, Download, Upload, Heart, TreePine } from "lucide-react"

export default function FamilyTreeSection() {
  // Family members organized by tree position
  const familyData = {
    matriarch: {
      name: "Viv Mahoney",
      years: "Born: Kingston, Jamaica",
      title: "Our Family's Foundation",
      description: "The heart of our family legacy"
    },
    daughters: [
      { name: "Daughter 1", spouse: "& Family", location: "Toronto, Canada" },
      { name: "Daughter 2", spouse: "& Family", location: "Vancouver, Canada" },
      { name: "Daughter 3", spouse: "& Family", location: "Miami, Florida" },
      { name: "Daughter 4", spouse: "& Family", location: "New York, USA" }
    ],
    currentGeneration: [
      "4 Daughters",
      "10 Grandchildren",
      "3 Great Grandchildren"
    ],
    heritage: {
      origin: "Jamaica → Canada → United States",
      description: "From our Jamaican roots in Kingston to flourishing branches across Canada and the United States"
    }
  }

  return (
    <section id="family-tree" className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Quote */}
        <div className="text-center mb-16 bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/30">
          <TreePine className="w-16 h-16 text-emerald-300 mx-auto mb-4 drop-shadow-lg" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">The Mahoney Family Tree</h2>
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-2xl font-serif italic text-emerald-200 mb-4 drop-shadow-md">
              "Family is not just an important thing, it's everything."
            </blockquote>
            <p className="text-lg text-white/80 mb-4 drop-shadow-md">— Michael J. Fox</p>
            <p className="text-xl text-white/90 max-w-3xl mx-auto text-pretty drop-shadow-md">
              {familyData.heritage.description}, discover the beautiful story of the Mahoney family legacy.
            </p>
            <div className="mt-6 flex items-center justify-center space-x-2 text-lg font-semibold text-cyan-300 drop-shadow-lg">
              <span>🇯🇲</span>
              <span>{familyData.heritage.origin}</span>
              <span>🇨🇦🇺🇸</span>
            </div>
          </div>
        </div>

        {/* Statistics Row */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-16">
          {familyData.currentGeneration.map((stat, index) => {
            const glowColors: Array<'blue' | 'purple' | 'green' | 'red' | 'orange'> = ['green', 'blue', 'purple']
            const glowColor = glowColors[index % glowColors.length]

            return (
              <GlowCard
                key={index}
                glowColor={glowColor}
                customSize={true}
                className="hover:scale-105 transition-transform duration-300"
              >
                <div className="text-center px-8 py-6">
                  <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{stat.split(' ')[0]}</div>
                  <div className="text-sm font-medium text-white/90 drop-shadow-md">{stat.split(' ').slice(1).join(' ')}</div>
                </div>
              </GlowCard>
            )
          })}
        </div>

        {/* Modern Family Tree Visualization */}
        <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl border border-white/30 mb-16 overflow-hidden">
          {/* Decorative gradient orbs */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>

          {/* Family Tree Content */}
          <div className="relative z-10">
            {/* Connecting Lines */}
            <div className="flex justify-center mb-8">
              <svg className="w-full max-w-4xl h-16" viewBox="0 0 800 60">
                <path d="M400 60 L200 20" stroke="rgba(16, 185, 129, 0.5)" strokeWidth="3" fill="none"/>
                <path d="M400 60 L300 20" stroke="rgba(16, 185, 129, 0.5)" strokeWidth="3" fill="none"/>
                <path d="M400 60 L500 20" stroke="rgba(16, 185, 129, 0.5)" strokeWidth="3" fill="none"/>
                <path d="M400 60 L600 20" stroke="rgba(16, 185, 129, 0.5)" strokeWidth="3" fill="none"/>
              </svg>
            </div>

            {/* Four Daughters Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto">
              {familyData.daughters.map((daughter, index) => {
                const glowColors: Array<'blue' | 'purple' | 'green' | 'red' | 'orange'> = ['blue', 'purple', 'orange', 'green']
                const glowColor = glowColors[index % glowColors.length]

                return (
                  <GlowCard
                    key={index}
                    glowColor={glowColor}
                    customSize={true}
                    className="hover:scale-105 transition-transform duration-300"
                  >
                    <div className="flex flex-col items-center p-4">
                      {/* Avatar */}
                      <div className="relative mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center shadow-lg border-2 border-white/40 backdrop-blur-sm">
                          <span className="text-3xl font-bold text-white drop-shadow-lg">
                            {daughter.name.charAt(daughter.name.length - 1)}
                          </span>
                        </div>
                        {/* Location flag */}
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md border border-white/50">
                          <span className="text-sm">
                            {daughter.location.includes('Canada') ? '🇨🇦' : '🇺🇸'}
                          </span>
                        </div>
                      </div>
                      {/* Info */}
                      <div className="text-center">
                        <h4 className="font-bold text-white mb-1 drop-shadow-lg">{daughter.name}</h4>
                        <p className="text-sm text-white/80 mb-2 drop-shadow-md">{daughter.spouse}</p>
                        <p className="text-xs text-cyan-300 font-medium drop-shadow-md">{daughter.location}</p>
                      </div>
                    </div>
                  </GlowCard>
                )
              })}
            </div>

            {/* Connecting Line to Foundation */}
            <div className="flex justify-center mb-8">
              <div className="w-1 h-16 bg-gradient-to-b from-emerald-400/50 to-rose-400/50 rounded-full"></div>
            </div>

            {/* Viv Mahoney - Foundation */}
            <div className="flex justify-center">
              <GlowCard
                glowColor="red"
                customSize={true}
                className="hover:scale-105 transition-transform duration-300 max-w-md"
              >
                <div className="flex flex-col items-center p-6">
                  {/* Avatar */}
                  <div className="relative mb-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-rose-400/40 to-pink-500/40 rounded-full flex items-center justify-center shadow-xl border-4 border-white/40 backdrop-blur-sm">
                      <Heart className="w-16 h-16 text-white drop-shadow-lg" />
                    </div>
                    {/* Jamaica flag */}
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/50">
                      <span className="text-xl">🇯🇲</span>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{familyData.matriarch.name}</h3>
                    <p className="text-rose-200 font-medium mb-2 drop-shadow-md">{familyData.matriarch.years}</p>
                    <p className="text-white font-semibold mb-2 drop-shadow-md">{familyData.matriarch.title}</p>
                    <p className="text-sm text-white/90 drop-shadow-md">{familyData.matriarch.description}</p>
                  </div>
                </div>
              </GlowCard>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-8 justify-items-center mb-12">
          <GlowCard
            glowColor="green"
            size="md"
            className="text-center hover:scale-105 transition-transform duration-300"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Download className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white drop-shadow-lg">Download Family Tree</h3>
                <p className="text-white/80 text-sm leading-relaxed drop-shadow-md">
                  Get a complete digital copy of our family tree with photos and detailed genealogy information.
                </p>
                <Button
                  variant="outline"
                  className="border-white/50 text-white hover:bg-white/20 bg-white/10 backdrop-blur-sm mt-4"
                >
                  Download PDF
                </Button>
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
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white drop-shadow-lg">Add Your Information</h3>
                <p className="text-white/80 text-sm leading-relaxed drop-shadow-md">
                  Help us keep our family tree current by submitting updates, photos, and new family information.
                </p>
                <Button
                  variant="outline"
                  className="border-white/50 text-white hover:bg-white/20 bg-white/10 backdrop-blur-sm mt-4"
                >
                  Submit Updates
                </Button>
              </div>
            </div>
          </GlowCard>

          <GlowCard
            glowColor="red"
            size="md"
            className="text-center hover:scale-105 transition-transform duration-300"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white drop-shadow-lg">Share Your Story</h3>
                <p className="text-white/80 text-sm leading-relaxed drop-shadow-md">
                  Share family memories, photos, and stories to help preserve our rich Mahoney heritage.
                </p>
                <Button
                  variant="outline"
                  className="border-white/50 text-white hover:bg-white/20 bg-white/10 backdrop-blur-sm mt-4"
                >
                  Share Memory
                </Button>
              </div>
            </div>
          </GlowCard>
        </div>

        {/* Family Legacy Quote */}
        <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/30">
          <blockquote className="text-2xl font-serif italic text-emerald-200 mb-4 drop-shadow-md">
            "From the warmth of Jamaica to the promise of new lands, our family tree grows stronger with each generation."
          </blockquote>
          <p className="text-lg text-white/90 drop-shadow-md">— The Mahoney Family Legacy</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
            <span className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <span>🇯🇲</span>
              <span>Kingston Roots</span>
            </span>
            <span className="text-white/50">•</span>
            <span className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <span>🇨🇦</span>
              <span>Canadian Growth</span>
            </span>
            <span className="text-white/50">•</span>
            <span className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <span>🇺🇸</span>
              <span>American Dreams</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
