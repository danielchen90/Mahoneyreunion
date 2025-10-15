import { NextRequest, NextResponse } from 'next/server'
import { adminUsersDB } from '@/lib/database'
import {
  getCurrentUser,
  hashPassword,
  validateEmail,
  validatePassword,
} from '@/lib/auth'
import {
  Permission,
  userHasPermission,
  canManageRole,
} from '@/lib/permissions'

// Force Node.js runtime for this route
export const runtime = 'nodejs'

/**
 * GET /api/admin/users
 * Get all admin users
 */
export async function GET() {
  try {
    // Check authentication
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check permission
    if (!userHasPermission(currentUser, Permission.VIEW_USERS)) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    // Get all users
    const { data: users, error: dbError } = await adminUsersDB.getAll()

    if (dbError) {
      throw dbError
    }

    // Remove password hashes
    const sanitizedUsers = users?.map(({ password_hash, ...user }) => user) || []

    return NextResponse.json(
      {
        success: true,
        users: sanitizedUsers,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/users
 * Create a new admin user
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check permission
    if (!userHasPermission(currentUser, Permission.CREATE_USERS)) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { email, password, name, role } = body

    // Validate input
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Email, password, name, and role are required' },
        { status: 400 }
      )
    }

    // Validate email
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: 'Invalid password', details: passwordValidation.errors },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['super_admin', 'admin', 'moderator', 'viewer']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Check if current user can create this role
    if (!canManageRole(currentUser.role, role)) {
      return NextResponse.json(
        { error: 'You cannot create users with this role' },
        { status: 403 }
      )
    }

    // Check if email already exists
    const { data: existingUser } = await adminUsersDB.getByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const password_hash = await hashPassword(password)

    // Create user
    const { data: newUser, error: dbError } = await adminUsersDB.create({
      email,
      password_hash,
      name,
      role,
    })

    if (dbError || !newUser) {
      throw dbError
    }

    // Remove password hash from response
    const { password_hash: _, ...userWithoutPassword } = newUser

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: userWithoutPassword,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

