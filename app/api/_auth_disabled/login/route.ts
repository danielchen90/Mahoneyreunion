import { NextRequest, NextResponse } from 'next/server'
import { adminUsersDB } from '@/lib/database'
import {
  verifyPassword,
  createToken,
  setAuthCookie,
  validateEmail,
  isAccountLocked,
  calculateLockExpiry,
} from '@/lib/auth'

// Force Node.js runtime for this route
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Get user from database
    const { data: user, error: dbError } = await adminUsersDB.getByEmail(email)

    if (dbError || !user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if account is locked
    if (isAccountLocked(user.failed_login_attempts, user.locked_until || null)) {
      const lockExpiry = user.locked_until ? new Date(user.locked_until) : null
      const minutesRemaining = lockExpiry
        ? Math.ceil((lockExpiry.getTime() - Date.now()) / 60000)
        : 30

      return NextResponse.json(
        {
          error: `Account is locked due to too many failed login attempts. Please try again in ${minutesRemaining} minutes.`,
        },
        { status: 423 }
      )
    }

    // Check if account is active
    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Account is deactivated. Please contact an administrator.' },
        { status: 403 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      // Increment failed attempts
      const newAttempts = user.failed_login_attempts + 1
      const shouldLock = newAttempts >= 5
      const lockUntil = shouldLock ? calculateLockExpiry() : undefined

      await adminUsersDB.incrementFailedAttempts(user.id, lockUntil)

      if (shouldLock) {
        return NextResponse.json(
          {
            error: 'Too many failed login attempts. Account locked for 30 minutes.',
          },
          { status: 423 }
        )
      }

      return NextResponse.json(
        {
          error: 'Invalid email or password',
          attemptsRemaining: 5 - newAttempts,
        },
        { status: 401 }
      )
    }

    // Update last login and reset failed attempts
    await adminUsersDB.updateLastLogin(user.id)

    // Create JWT token
    const token = await createToken(user)

    // Set cookie
    await setAuthCookie(token)

    // Return success with user data (without password hash)
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: userWithoutPassword,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

