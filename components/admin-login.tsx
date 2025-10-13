"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authenticate } from "@/lib/admin-auth"
import { Lock, AlertCircle, Shield } from "lucide-react"

interface AdminLoginProps {
  onLoginSuccess: () => void
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulate a small delay for better UX
    setTimeout(() => {
      const success = authenticate(password)
      
      if (success) {
        onLoginSuccess()
      } else {
        setError("Invalid password. Please try again.")
        setPassword("")
      }
      
      setLoading(false)
    }, 500)
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <Card className="p-8 bg-white/10 backdrop-blur-md border border-white/30 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-sm rounded-full border border-blue-400/40 mb-4">
            <Shield className="w-8 h-8 text-cyan-300 drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
            Admin Dashboard
          </h1>
          <p className="text-white/80 drop-shadow-md">
            Enter password to access page visibility controls
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white drop-shadow-md">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="pl-10 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400"
                disabled={loading}
                autoFocus
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/20 backdrop-blur-sm border border-red-400/40 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0" />
              <p className="text-sm text-red-200 drop-shadow-md">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-2 border-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating..." : "Login"}
          </Button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-500/10 backdrop-blur-sm border border-blue-400/30 rounded-lg">
          <p className="text-sm text-white/70 drop-shadow-sm text-center">
            <strong className="text-white/90">Default Password:</strong> mahoney2026
          </p>
          <p className="text-xs text-white/60 drop-shadow-sm text-center mt-1">
            (Change this in lib/admin-auth.ts for production)
          </p>
        </div>
      </Card>
    </div>
  )
}

