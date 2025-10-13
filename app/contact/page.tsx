import Navigation from "@/components/navigation"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import Image from "next/image"

export default function ContactPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Image - Resort Paradise */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <Image
          src="/florida-palm-trees-resort-tropical-paradise-orland.jpg"
          alt="Florida Resort Paradise"
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          priority
          quality={90}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/50 to-slate-900/60" />
      </div>

      <div className="relative z-10">
        <Navigation />
        <div className="pt-20">
          <ContactSection />
        </div>
        <Footer />
      </div>
    </main>
  )
}
