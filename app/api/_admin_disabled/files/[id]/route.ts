import { NextRequest, NextResponse } from 'next/server'
import { filesDB } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'
import { userHasPermission, Permission } from '@/lib/permissions'
import { deleteFromCloudinary, getCloudinaryResourceType } from '@/lib/cloudinary'

// Force Node.js runtime for this route
export const runtime = 'nodejs'

/**
 * GET /api/admin/files/[id]
 * Get a single file by ID
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

    // Get file
    const { data: file, error } = await filesDB.getById(id)

    if (error) {
      console.error('Error fetching file:', error)
      return NextResponse.json(
        { error: 'Failed to fetch file' },
        { status: 500 }
      )
    }

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ file })
  } catch (error) {
    console.error('Error in GET /api/admin/files/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/files/[id]
 * Update a file (rename or move to folder)
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
    if (!userHasPermission(user, Permission.UPLOAD_FILES)) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    const { id } = params

    // Check if file exists
    const { data: existingFile } = await filesDB.getById(id)
    if (!existingFile) {
      return NextResponse.json(
        { error: 'File not found' },
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
          { error: 'File name cannot be empty' },
          { status: 400 }
        )
      }
      updates.name = body.name.trim()
    }

    if (body.folder_id !== undefined) {
      updates.folder_id = body.folder_id || null
    }

    // Update file
    const { data: file, error } = await filesDB.update(id, updates)

    if (error) {
      console.error('Error updating file:', error)
      return NextResponse.json(
        { error: 'Failed to update file' },
        { status: 500 }
      )
    }

    return NextResponse.json({ file })
  } catch (error) {
    console.error('Error in PATCH /api/admin/files/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/files/[id]
 * Delete a file from Cloudinary and database
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
    if (!userHasPermission(user, Permission.DELETE_FILES)) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    const { id } = params

    // Get file to get Cloudinary public_id
    const { data: file } = await filesDB.getById(id)
    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Delete from Cloudinary
    const resourceType = getCloudinaryResourceType(file.file_type)
    const cloudinaryResult = await deleteFromCloudinary(file.cloudinary_public_id, resourceType)

    if (!cloudinaryResult.success) {
      console.error('Cloudinary delete error:', cloudinaryResult.error)
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    const { error } = await filesDB.delete(id)

    if (error) {
      console.error('Error deleting file:', error)
      return NextResponse.json(
        { error: 'Failed to delete file' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/files/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

