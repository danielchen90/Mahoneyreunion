import { NextRequest, NextResponse } from 'next/server'
import { filesDB } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'
import { userHasPermission, Permission } from '@/lib/permissions'

// Force Node.js runtime for this route
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/files
 * Get all files or files in a specific folder
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

    // Get folder_id from query params
    const { searchParams } = new URL(request.url)
    const folderId = searchParams.get('folder_id')

    // Get files
    const { data: files, error } = folderId
      ? await filesDB.getByFolderId(folderId)
      : await filesDB.getAll()

    if (error) {
      console.error('Error fetching files:', error)
      return NextResponse.json(
        { error: 'Failed to fetch files' },
        { status: 500 }
      )
    }

    return NextResponse.json({ files })
  } catch (error) {
    console.error('Error in GET /api/admin/files:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

