/**
 * Cloudinary Configuration and Utilities
 * Handles file uploads and management with Cloudinary
 */

import { v2 as cloudinary } from 'cloudinary'

// Lazy configuration function
function ensureCloudinaryConfigured() {
  if (!cloudinary.config().cloud_name) {
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    })
  }
}

/**
 * Upload file to Cloudinary
 * @param file - File buffer or base64 string
 * @param options - Upload options
 * @returns Upload result with URL and public_id
 */
export async function uploadToCloudinary(
  file: string | Buffer,
  options: {
    folder?: string
    resource_type?: 'image' | 'video' | 'raw' | 'auto'
    public_id?: string
    overwrite?: boolean
    tags?: string[]
  } = {}
): Promise<{
  success: boolean
  url?: string
  secure_url?: string
  public_id?: string
  format?: string
  resource_type?: string
  bytes?: number
  width?: number
  height?: number
  error?: string
}> {
  try {
    ensureCloudinaryConfigured()
    const uploadOptions = {
      folder: options.folder || 'mahoney-reunion',
      resource_type: options.resource_type || 'auto',
      public_id: options.public_id,
      overwrite: options.overwrite ?? false,
      tags: options.tags || [],
    }

    const result = await cloudinary.uploader.upload(
      typeof file === 'string' ? file : `data:application/octet-stream;base64,${file.toString('base64')}`,
      uploadOptions
    )

    return {
      success: true,
      url: result.url,
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
    }
  } catch (error: any) {
    console.error('Cloudinary upload error:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload file',
    }
  }
}

/**
 * Delete file from Cloudinary
 * @param publicId - Cloudinary public_id
 * @param resourceType - Type of resource (image, video, raw)
 * @returns Deletion result
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<{
  success: boolean
  result?: string
  error?: string
}> {
  try {
    ensureCloudinaryConfigured()
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    })

    return {
      success: result.result === 'ok',
      result: result.result,
    }
  } catch (error: any) {
    console.error('Cloudinary delete error:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete file',
    }
  }
}

/**
 * Get file info from Cloudinary
 * @param publicId - Cloudinary public_id
 * @param resourceType - Type of resource
 * @returns File information
 */
export async function getCloudinaryFileInfo(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<{
  success: boolean
  info?: any
  error?: string
}> {
  try {
    ensureCloudinaryConfigured()
    const result = await cloudinary.api.resource(publicId, {
      resource_type: resourceType,
    })

    return {
      success: true,
      info: result,
    }
  } catch (error: any) {
    console.error('Cloudinary get info error:', error)
    return {
      success: false,
      error: error.message || 'Failed to get file info',
    }
  }
}

/**
 * Generate a signed upload URL for client-side uploads
 * @param folder - Folder to upload to
 * @returns Signed upload parameters
 */
export function generateUploadSignature(folder: string = 'mahoney-reunion'): {
  timestamp: number
  signature: string
  api_key: string
  cloud_name: string
  folder: string
} {
  ensureCloudinaryConfigured()
  const timestamp = Math.round(new Date().getTime() / 1000)
  const params = {
    timestamp,
    folder,
  }

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET || ''
  )

  return {
    timestamp,
    signature,
    api_key: process.env.CLOUDINARY_API_KEY || '',
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
    folder,
  }
}

/**
 * Get file type from MIME type
 * @param mimeType - MIME type string
 * @returns File type category
 */
export function getFileTypeFromMime(mimeType: string): 'image' | 'video' | 'document' | 'other' {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (
    mimeType.includes('pdf') ||
    mimeType.includes('document') ||
    mimeType.includes('text') ||
    mimeType.includes('spreadsheet') ||
    mimeType.includes('presentation')
  ) {
    return 'document'
  }
  return 'other'
}

/**
 * Get Cloudinary resource type from MIME type
 * @param mimeType - MIME type string
 * @returns Cloudinary resource type
 */
export function getCloudinaryResourceType(mimeType: string): 'image' | 'video' | 'raw' {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  return 'raw'
}

/**
 * Format file size to human-readable string
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const index = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, index)) * 100) / 100 + ' ' + sizes[index]
}

/**
 * Validate file type
 * @param mimeType - MIME type to validate
 * @param allowedTypes - Array of allowed MIME types or patterns
 * @returns Whether file type is allowed
 */
export function isFileTypeAllowed(
  mimeType: string,
  allowedTypes: string[] = [
    'image/*',
    'video/*',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]
): boolean {
  return allowedTypes.some((allowed) => {
    if (allowed.endsWith('/*')) {
      const prefix = allowed.slice(0, -2)
      return mimeType.startsWith(prefix)
    }
    return mimeType === allowed
  })
}

/**
 * Validate file size
 * @param bytes - File size in bytes
 * @param maxSizeMB - Maximum size in MB (default: 10MB)
 * @returns Whether file size is allowed
 */
export function isFileSizeAllowed(bytes: number, maxSizeMB: number = 10): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024
  return bytes <= maxBytes
}

export default cloudinary

