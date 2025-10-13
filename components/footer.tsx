"use client"

import { Heart, MapPin } from "lucide-react"
import Link from "next/link"

// WhatsApp official logo SVG component
const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

export default function Footer() {
  return (
    <footer id="contact" className="relative py-16 mt-20">
      {/* Footer Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/50 via-transparent to-transparent" />

      {/* Decorative top border with gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-bold mb-4 drop-shadow-lg" style={{ fontFamily: "var(--font-playfair)" }}>
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Mahoney
              </span>{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                2026
              </span>
            </h3>
            <p className="text-white/80 mb-6 text-pretty max-w-md leading-relaxed drop-shadow-md">
              Bringing the Mahoney family together in beautiful Orlando, Florida for six days of tropical celebration,
              connection, and creating lasting memories at Solterra Resort.
            </p>
            <div className="flex items-center space-x-2 text-white/70">
              <Heart className="w-4 h-4 text-red-400 drop-shadow-md" />
              <span className="text-sm drop-shadow-md">Made with love for the Mahoney family</span>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white drop-shadow-lg">Stay Connected</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-green-400/30 group-hover:bg-green-500/30 transition-colors">
                  <WhatsAppIcon className="w-4 h-4 text-green-300 flex-shrink-0" />
                </div>
                <a
                  href="https://chat.whatsapp.com/IZHNazBdp7M8ymqyDPvYY5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 text-sm drop-shadow-md hover:text-green-300 transition-colors"
                >
                  Join WhatsApp Group
                </a>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-blue-400/30 group-hover:bg-blue-500/30 transition-colors flex-shrink-0">
                  <MapPin className="w-4 h-4 text-blue-300 mt-0.5" />
                </div>
                <div className="text-white/80 text-sm drop-shadow-md">
                  <div>Solterra Resort</div>
                  <div>Orlando, Florida</div>
                  <div className="text-cyan-300">July 29 - August 3, 2026</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white drop-shadow-lg">Quick Links</h4>
            <div className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Schedule", href: "/schedule" },
                { label: "Travel Info", href: "/travel" },
                { label: "Budget Calculator", href: "/budget" },
                { label: "Register", href: "/register" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact", href: "/contact" },
              ].map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="block text-white/70 hover:text-cyan-300 text-sm transition-all duration-200 hover:translate-x-1 drop-shadow-md"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/60 text-sm drop-shadow-md">
              © 2026 Mahoney Family Reunion. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="#"
                className="text-white/60 hover:text-cyan-300 text-sm transition-colors duration-200 drop-shadow-md"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-white/60 hover:text-cyan-300 text-sm transition-colors duration-200 drop-shadow-md"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-white/60 hover:text-cyan-300 text-sm transition-colors duration-200 drop-shadow-md"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
