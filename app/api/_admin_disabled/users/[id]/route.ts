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
 * GET /api/admin/users/[id]
 * Get a single user by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
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

    // Get user
    const { data: user, error: dbError } = await adminUsersDB.getById(id)

    if (dbError) {
      throw dbError
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Remove password hash
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        success: true,
        user: userWithoutPassword,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/users/[id]
 * Update a user
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check authentication
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check permission
    if (!userHasPermission(currentUser, Permission.EDIT_USERS)) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    // Get target user
    const { data: targetUser, error: getUserError } = await adminUsersDB.getById(id)
    if (getUserError || !targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if current user can manage target user's role
    if (!canManageRole(currentUser.role, targetUser.role)) {
      return NextResponse.json(
        { error: 'You cannot edit users with this role' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { email, password, name, role, is_active } = body

    const updates: any = {}

    // Validate and add email if provided
    if (email !== undefined) {
      if (!validateEmail(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        )
      }

      // Check if email is already taken by another user
      if (email !== targetUser.email) {
        const { data: existingUser } = await adminUsersDB.getByEmail(email)
        if (existingUser) {
          return NextResponse.json(
            { error: 'Email already exists' },
            { status: 409 }
          )
        }
      }

      updates.email = email
    }

    // Validate and add password if provided
    if (password !== undefined && password !== '') {
      const passwordValidation = validatePassword(password)
      if (!passwordValidation.valid) {
        return NextResponse.json(
          { error: 'Invalid password', details: passwordValidation.errors },
          { status: 400 }
        )
      }

      updates.password_hash = await hashPassword(password)
    }

    // Add name if provided
    if (name !== undefined) {
      if (!name.trim()) {
        return NextResponse.json(
          { error: 'Name cannot be empty' },
          { status: 400 }
        )
      }
      updates.name = name
    }

    // Validate and add role if provided
    if (role !== undefined) {
      const validRoles = ['super_admin', 'admin', 'moderator', 'viewer']
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { error: 'Invalid role' },
          { status: 400 }
        )
      }

      // Check if current user can assign this role
      if (!canManageRole(currentUser.role, role)) {
        return NextResponse.json(
          { error: 'You cannot assign this role' },
          { status: 403 }
        )
      }

      updates.role = role
    }

    // Add is_active if provided
    if (is_active !== undefined) {
      updates.is_active = is_active
    }

    // Prevent user from deactivating themselves
    if (currentUser.userId === id && is_active === false) {
      return NextResponse.json(
        { error: 'You cannot deactivate your own account' },
        { status: 400 }
      )
    }

    // Update user
    const { data: updatedUser, error: updateError } = await adminUsersDB.update(
      id,
      updates
    )

    if (updateError || !updatedUser) {
      throw updateError
    }

    // Remove password hash
    const { password_hash, ...userWithoutPassword } = updatedUser

    return NextResponse.json(
      {
        success: true,
        message: 'User updated successfully',
        user: userWithoutPassword,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete a user
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check authentication
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check permission
    if (!userHasPermission(currentUser, Permission.DELETE_USERS)) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    // Prevent user from deleting themselves
    if (currentUser.userId === id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      )
    }

    // Get target user
    const { data: targetUser, error: getUserError } = await adminUsersDB.getById(id)
    if (getUserError || !targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if current user can manage target user's role
    if (!canManageRole(currentUser.role, targetUser.role)) {
      return NextResponse.json(
        { error: 'You cannot delete users with this role' },
        { status: 403 }
      )
    }

    // Delete user
    const { error: deleteError } = await adminUsersDB.delete(id)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User deleted successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

