/**
 * Edge Runtime Compatible Authentication Utilities
 * Only includes JWT verification and cookie handling (no bcrypt)
 * Used by middleware and other Edge Runtime contexts
 */

import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

// JWT Configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'mahoney-reunion-secret-key-change-in-production'
)

// Cookie Configuration
const COOKIE_NAME = 'admin_session'

// JWT Payload
export interface JWTPayload {
  userId: string
  email: string
  name: string
  role: string
  iat?: number
  exp?: number
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as JWTPayload
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

/**
 * Get authentication cookie
 */
export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(COOKIE_NAME)
  return cookie?.value
}

/**
 * Get current user from JWT token
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getAuthCookie()
  if (!token) return null
  return verifyToken(token)
}

