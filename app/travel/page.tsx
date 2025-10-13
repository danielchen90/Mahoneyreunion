import Navigation from "@/components/navigation"
import TravelSection from "@/components/travel-section"
import Footer from "@/components/footer"
import Image from "next/image"

export default function TravelPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Image - Airplane Landing */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <Image
          src="/airplane-landing-orlando.png"
          alt="Airplane Landing at Orlando International Airport"
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          priority
          quality={90}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-slate-900/50 to-blue-900/60" />
      </div>

      <div className="relative z-10">
        <Navigation />
        <div className="pt-20">
          <TravelSection />
        </div>
        <Footer />
      </div>
    </main>
  )
}
