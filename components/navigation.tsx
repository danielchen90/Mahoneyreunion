"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { getVisiblePages, type PageConfig } from "@/lib/page-visibility"
import WhatsAppButton from "@/components/whatsapp-button"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [visiblePages, setVisiblePages] = useState<PageConfig[]>([])
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Load visible pages on mount
    setVisiblePages(getVisiblePages())

    // Listen for visibility changes from admin dashboard
    const handleVisibilityChange = () => {
      setVisiblePages(getVisiblePages())
    }

    window.addEventListener('pageVisibilityChanged', handleVisibilityChange)
    return () => window.removeEventListener('pageVisibilityChanged', handleVisibilityChange)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Convert PageConfig to nav link format, excluding Family Tree
  const navLinks = visiblePages
    .filter(page => page.id !== 'family-tree')
    .map(page => ({
      href: page.path,
      label: page.name,
    }))

  // Check if register page is visible for CTA button
  const isRegisterVisible = visiblePages.some(page => page.id === 'register')

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg"
          : "bg-transparent backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className={`text-2xl lg:text-3xl font-bold transition-all duration-300 drop-shadow-lg ${
                isScrolled ? "text-gray-800 hover:text-gray-900" : "text-white/90 hover:text-white"
              }`}
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                isScrolled
                  ? "from-gray-800 via-blue-600 to-gray-800"
                  : "from-white via-blue-100 to-white"
              }`}>
                Mahoney
              </span>{" "}
              <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                isScrolled
                  ? "from-orange-600 via-orange-500 to-orange-600"
                  : "from-amber-200 via-orange-200 to-amber-200"
              }`}>
                2026
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative group backdrop-blur-sm rounded-full whitespace-nowrap shadow-md ${
                    isScrolled
                      ? pathname === link.href
                        ? "text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg border-2 border-orange-400"
                        : "text-gray-700 bg-white/80 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-600 border-2 border-cyan-400/50 hover:border-cyan-400"
                      : pathname === link.href
                        ? "text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg border-2 border-orange-400"
                        : "text-white bg-cyan-500/40 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-600 border-2 border-cyan-400/60 hover:border-cyan-300"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                      isScrolled
                        ? "bg-gradient-to-r from-orange-400 to-orange-300"
                        : "bg-gradient-to-r from-white to-cyan-200"
                    } ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`}
                  ></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Medium Screen Navigation - Condensed */}
          <div className="hidden md:block lg:hidden">
            <div className="ml-6 flex items-center space-x-1">
              {navLinks.slice(0, 4).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-xs font-medium transition-all duration-300 relative group backdrop-blur-sm rounded-full whitespace-nowrap shadow-md ${
                    isScrolled
                      ? pathname === link.href
                        ? "text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg border-2 border-orange-400"
                        : "text-gray-700 bg-white/80 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-600 border-2 border-cyan-400/50 hover:border-cyan-400"
                      : pathname === link.href
                        ? "text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg border-2 border-orange-400"
                        : "text-white bg-cyan-500/40 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-600 border-2 border-cyan-400/60 hover:border-cyan-300"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                      isScrolled
                        ? "bg-gradient-to-r from-orange-400 to-orange-300"
                        : "bg-gradient-to-r from-white to-cyan-200"
                    } ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`}
                  ></span>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* WhatsApp Button */}
            <WhatsAppButton
              variant="nav"
              className={`${isScrolled ? "" : "backdrop-blur-sm"}`}
            />

            {/* Register Button */}
            {isRegisterVisible && (
              <Link href="/register">
                <Button className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg backdrop-blur-sm ${
                  isScrolled
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border border-orange-400 hover:border-orange-300"
                    : "bg-gradient-to-r from-white/25 via-white/20 to-white/25 hover:from-white/35 hover:via-white/30 hover:to-white/35 text-white border border-white/40 hover:border-white/60"
                }`}>
                  Register Now
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button and WhatsApp */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* WhatsApp Button - Mobile */}
            <WhatsAppButton
              variant="icon-only"
              className={`!w-9 !h-9 shadow-md ${isScrolled ? "" : "backdrop-blur-sm"}`}
            />

            {/* Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className={`p-2 rounded-lg backdrop-blur-sm border transition-all duration-300 ${
                isScrolled
                  ? "text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 border-gray-300 hover:border-blue-400"
                  : "text-white/80 hover:text-white hover:bg-gradient-to-r hover:from-white/15 hover:via-white/10 hover:to-white/15 border-transparent hover:border-white/20"
              }`}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-2 bg-white/10 backdrop-blur-md rounded-lg mt-2 shadow-lg border border-white/20">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 text-base font-medium w-full text-left rounded-full transition-all duration-300 shadow-md ${
                  isScrolled
                    ? pathname === link.href
                      ? "text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg border-2 border-orange-400"
                      : "text-gray-700 bg-white/80 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-600 border-2 border-cyan-400/50 hover:border-cyan-400"
                    : pathname === link.href
                      ? "text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg border-2 border-orange-400"
                      : "text-white bg-cyan-500/40 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-600 border-2 border-cyan-400/60 hover:border-cyan-300"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isRegisterVisible && (
              <div className="pt-2">
                <Link href="/register" className="block">
                  <Button className={`w-full py-2 rounded-full font-medium transition-all duration-300 backdrop-blur-sm shadow-lg ${
                    isScrolled
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-2 border-orange-400 hover:border-orange-300"
                      : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-2 border-orange-400 hover:border-orange-300"
                  }`}>
                    Register Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
