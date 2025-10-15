import { NextRequest, NextResponse } from 'next/server'
import { filesDB } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'
import { userHasPermission, Permission } from '@/lib/permissions'
import { uploadToCloudinary, getCloudinaryResourceType, isFileTypeAllowed, isFileSizeAllowed } from '@/lib/cloudinary'

// Force Node.js runtime for this route
export const runtime = 'nodejs'

/**
 * POST /api/admin/files/upload
 * Upload a file to Cloudinary and save metadata to database
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
    if (!userHasPermission(user, Permission.UPLOAD_FILES)) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folderId = formData.get('folder_id') as string | null
    const fileName = formData.get('file_name') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!isFileTypeAllowed(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    if (!isFileSizeAllowed(file.size, 10)) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Determine folder path for Cloudinary
    const cloudinaryFolder = folderId 
      ? `mahoney-reunion/folder-${folderId}`
      : 'mahoney-reunion'

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(buffer, {
      folder: cloudinaryFolder,
      resource_type: getCloudinaryResourceType(file.type),
      tags: ['mahoney-reunion'],
    })

    if (!uploadResult.success || !uploadResult.secure_url || !uploadResult.public_id) {
      return NextResponse.json(
        { error: uploadResult.error || 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Save file metadata to database
    const { data: fileRecord, error: dbError } = await filesDB.create({
      name: fileName || file.name,
      file_url: uploadResult.secure_url,
      file_type: file.type,
      file_size: file.size,
      folder_id: folderId || undefined,
      cloudinary_public_id: uploadResult.public_id,
      uploaded_by: user.userId,
    })

    if (dbError || !fileRecord) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save file metadata' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      file: fileRecord,
      message: 'File uploaded successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/files/upload:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

