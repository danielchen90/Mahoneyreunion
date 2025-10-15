import { NextRequest, NextResponse } from 'next/server'
import { foldersDB } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'
import { userHasPermission, Permission } from '@/lib/permissions'

// Force Node.js runtime for this route
export const runtime = 'nodejs'

/**
 * GET /api/admin/folders
 * Get all folders or folders in a specific parent folder
 */
export async function GET(request: NextRequest) {
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

    // Get parent_id from query params
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parent_id')

    // Get folders
    const { data: folders, error } = parentId
      ? await foldersDB.getByParentId(parentId)
      : await foldersDB.getAll()

    if (error) {
      console.error('Error fetching folders:', error)
      return NextResponse.json(
        { error: 'Failed to fetch folders' },
        { status: 500 }
      )
    }

    return NextResponse.json({ folders })
  } catch (error) {
    console.error('Error in GET /api/admin/folders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/folders
 * Create a new folder
 */
export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json()
    const { name, parent_id } = body

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Folder name is required' },
        { status: 400 }
      )
    }

    // Create folder
    const { data: folder, error } = await foldersDB.create({
      name: name.trim(),
      parent_id: parent_id || undefined,
      created_by: user.userId,
    })

    if (error) {
      console.error('Error creating folder:', error)
      return NextResponse.json(
        { error: 'Failed to create folder' },
        { status: 500 }
      )
    }

    return NextResponse.json({ folder }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/folders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

