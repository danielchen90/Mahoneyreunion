"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import AdminDashboard from "@/components/admin-dashboard"
import AdminLogin from "@/components/admin-login"
import { isAuthenticated } from "@/lib/admin-auth"
import Image from "next/image"

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication status on mount
    const authStatus = isAuthenticated()
    setAuthenticated(authStatus)
    setLoading(false)
  }, [])

  const handleLoginSuccess = () => {
    setAuthenticated(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
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
        <div className="pt-20 pb-20">
          {authenticated ? (
            <AdminDashboard onLogout={() => setAuthenticated(false)} />
          ) : (
            <AdminLogin onLoginSuccess={handleLoginSuccess} />
          )}
        </div>
        <Footer />
      </div>
    </main>
  )
}

