import { NextResponse } from 'next/server'
import { deleteAuthCookie } from '@/lib/auth'

// Force Node.js runtime for this route
export const runtime = 'nodejs'

export async function POST() {
  try {
    // Delete authentication cookie
    await deleteAuthCookie()

    return NextResponse.json(
      {
        success: true,
        message: 'Logout successful',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

