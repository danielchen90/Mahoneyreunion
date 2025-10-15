import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { adminUsersDB } from '@/lib/database'

// Force Node.js runtime for this route
export const runtime = 'nodejs'

export async function GET() {
  try {
    // Get current user from JWT
    const jwtUser = await getCurrentUser()

    if (!jwtUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get fresh user data from database
    const { data: user, error: dbError } = await adminUsersDB.getById(jwtUser.userId)

    if (dbError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if account is still active
    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      )
    }

    // Return user data (without password hash)
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        success: true,
        user: userWithoutPassword,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

