import { NextRequest, NextResponse } from 'next/server'
import { foldersDB } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'
import { userHasPermission, Permission } from '@/lib/permissions'

// Force Node.js runtime for this route
export const runtime = 'nodejs'

/**
 * GET /api/admin/folders/[id]
 * Get a single folder by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check permission
    if (!userHasPermission(user, Permission.VIEW_FILES)) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    const { id } = params

    // Get folder
    const { data: folder, error } = await foldersDB.getById(id)

    if (error) {
      console.error('Error fetching folder:', error)
      return NextResponse.json(
        { error: 'Failed to fetch folder' },
        { status: 500 }
      )
    }

    if (!folder) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ folder })
  } catch (error) {
    console.error('Error in GET /api/admin/folders/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/folders/[id]
 * Update a folder (rename or move)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check permission
    if (!userHasPermission(user, Permission.MANAGE_FOLDERS)) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    const { id } = params

    // Check if folder exists
    const { data: existingFolder } = await foldersDB.getById(id)
    if (!existingFolder) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      )
    }

    // Parse request body
    const body = await request.json()
    const updates: any = {}

    // Validate and add updates
    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim().length === 0) {
        return NextResponse.json(
          { error: 'Folder name cannot be empty' },
          { status: 400 }
        )
      }
      updates.name = body.name.trim()
    }

    if (body.parent_id !== undefined) {
      // Prevent circular references
      if (body.parent_id === id) {
        return NextResponse.json(
          { error: 'Folder cannot be its own parent' },
          { status: 400 }
        )
      }
      updates.parent_id = body.parent_id || null
    }

    // Update folder
    const { data: folder, error } = await foldersDB.update(id, updates)

    if (error) {
      console.error('Error updating folder:', error)
      return NextResponse.json(
        { error: 'Failed to update folder' },
        { status: 500 }
      )
    }

    return NextResponse.json({ folder })
  } catch (error) {
    console.error('Error in PATCH /api/admin/folders/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/folders/[id]
 * Delete a folder
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check permission
    if (!userHasPermission(user, Permission.MANAGE_FOLDERS)) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    const { id } = params

    // Check if folder exists
    const { data: existingFolder } = await foldersDB.getById(id)
    if (!existingFolder) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      )
    }

    // TODO: Check if folder has files or subfolders
    // For now, we'll allow deletion (database cascade will handle it)

    // Delete folder
    const { error } = await foldersDB.delete(id)

    if (error) {
      console.error('Error deleting folder:', error)
      return NextResponse.json(
        { error: 'Failed to delete folder' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/folders/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

