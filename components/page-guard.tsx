"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isPageVisible } from "@/lib/page-visibility"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, Home, Calendar } from "lucide-react"
import Link from "next/link"

interface PageGuardProps {
  pageId: string
  children: React.ReactNode
  showComingSoon?: boolean // If true, show "Coming Soon" instead of redirecting
}

export default function PageGuard({ pageId, children, showComingSoon = false }: PageGuardProps) {
  const [isVisible, setIsVisible] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkVisibility = () => {
      const visible = isPageVisible(pageId)
      setIsVisible(visible)

      // If page is not visible and we're not showing "Coming Soon", redirect to home
      if (!visible && !showComingSoon) {
        router.push('/')
      }
    }

    checkVisibility()

    // Listen for visibility changes
    const handleVisibilityChange = () => {
      checkVisibility()
    }

    window.addEventListener('pageVisibilityChanged', handleVisibilityChange)
    return () => window.removeEventListener('pageVisibilityChanged', handleVisibilityChange)
  }, [pageId, router, showComingSoon])

  // Loading state
  if (isVisible === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  // If page is visible, render children
  if (isVisible) {
    return <>{children}</>
  }

  // If page is not visible and showComingSoon is true, show "Coming Soon" message
  if (showComingSoon) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full p-12 bg-white/10 backdrop-blur-md border border-white/30 shadow-2xl text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500/30 to-amber-500/30 backdrop-blur-sm rounded-full border border-orange-400/40 mb-6">
            <Lock className="w-10 h-10 text-orange-300 drop-shadow-lg" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Page Not Available
          </h1>
          
          <p className="text-xl text-white/90 mb-8 drop-shadow-md">
            This page is currently hidden and will be available soon. Check back after the family information session!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-2 border-blue-400/50">
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Button>
            </Link>
            <Link href="/about">
              <Button 
                variant="outline"
                className="bg-white/10 hover:bg-white/20 border-white/30 text-white"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Learn More About the Reunion
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  // If redirecting, show nothing (will redirect in useEffect)
  return null
}

