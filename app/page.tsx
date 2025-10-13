"use client"

import { useState } from "react"
import EntrancePage from "@/components/entrance-page"
import Navigation from "@/components/navigation"
import ScrollExpandMedia from "@/components/scroll-expand-media"
import AboutSection from "@/components/about-section"
import RegistrationCTA from "@/components/registration-cta"
import Footer from "@/components/footer"

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false)

  const handleEnter = () => {
    setHasEntered(true)
  }

  if (!hasEntered) {
    return <EntrancePage onEnter={handleEnter} />
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="/jorge-vasconez-CpeUoLVTAs8-unsplash.jpg"
        bgImageSrc="/tropical-palm-trees-sunset-beach-florida-resort-pa.jpg"
        title="Mahoney Family Reunion"
        date="July 29 - August 3, 2026"
        scrollToExpand="Scroll to explore our Orlando celebration"
        textBlend={false}
      >
        <AboutSection />
        <RegistrationCTA />
      </ScrollExpandMedia>
      <Footer />
    </main>
  )
}
