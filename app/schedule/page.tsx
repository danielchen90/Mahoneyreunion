"use client"

import Navigation from "@/components/navigation"
import ScheduleComingSoon from "@/components/schedule-coming-soon"
import Footer from "@/components/footer"
import PageGuard from "@/components/page-guard"
import Image from "next/image"

export default function SchedulePage() {
  return (
    <PageGuard pageId="schedule" showComingSoon={true}>
      <main className="min-h-screen relative overflow-hidden">
        {/* Background Image - Tropical Sunset */}
        <div className="fixed inset-0 z-0 w-full h-full">
          <Image
            src="/tropical-palm-trees-sunset-beach-florida-resort-pa.jpg"
            alt="Tropical Sunset Beach"
            fill
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            priority
            quality={90}
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-blue-900/60 to-slate-900/70" />
        </div>

        <div className="relative z-10">
          <Navigation />
          <div className="pt-20">
            <ScheduleComingSoon />
          </div>
          <Footer />
        </div>
      </main>
    </PageGuard>
  )
}
