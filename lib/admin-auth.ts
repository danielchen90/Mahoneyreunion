/**
 * Admin Authentication System
 * Simple password-based authentication for admin dashboard
 */

const ADMIN_PASSWORD = 'mahoney2026' // Change this to a secure password
const AUTH_STORAGE_KEY = 'mahoney-reunion-admin-auth'
const AUTH_EXPIRY_HOURS = 24 // Session expires after 24 hours

interface AuthSession {
  authenticated: boolean
  timestamp: number
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) return false

    const session: AuthSession = JSON.parse(stored)
    const now = Date.now()
    const expiryTime = session.timestamp + AUTH_EXPIRY_HOURS * 60 * 60 * 1000

    // Check if session is still valid
    if (session.authenticated && now < expiryTime) {
      return true
    }

    // Session expired, clear it
    logout()
    return false
  } catch (error) {
    console.error('Error checking authentication:', error)
    return false
  }
}

/**
 * Authenticate user with password
 */
export function authenticate(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    const session: AuthSession = {
      authenticated: true,
      timestamp: Date.now(),
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
    return true
  }
  return false
}

/**
 * Logout user
 */
export function logout(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

/**
 * Get remaining session time in minutes
 */
export function getSessionTimeRemaining(): number {
  if (typeof window === 'undefined') return 0

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) return 0

    const session: AuthSession = JSON.parse(stored)
    const now = Date.now()
    const expiryTime = session.timestamp + AUTH_EXPIRY_HOURS * 60 * 60 * 1000
    const remainingMs = expiryTime - now

    return Math.max(0, Math.floor(remainingMs / 60000)) // Convert to minutes
  } catch (error) {
    return 0
  }
}

