"use client"

import { useState } from "react"
import EntrancePage from "@/components/entrance-page"
import Navigation from "@/components/navigation"
import HomeContent from "@/components/home-content"
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
      <HomeContent />
      <Footer />
    </main>
  )
}
