import { NextRequest, NextResponse } from 'next/server'
import { meetingNotesDB } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'
import { userHasPermission, Permission } from '@/lib/permissions'

// Force Node.js runtime for this route
export const runtime = 'nodejs'

/**
 * GET /api/admin/meetings/[id]
 * Get a single meeting note by ID
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
    if (!userHasPermission(user, Permission.VIEW_MEETINGS)) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    const { id } = params

    // Get meeting
    const { data: meeting, error } = await meetingNotesDB.getById(id)

    if (error) {
      console.error('Error fetching meeting:', error)
      return NextResponse.json(
        { error: 'Failed to fetch meeting' },
        { status: 500 }
      )
    }

    if (!meeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ meeting })
  } catch (error) {
    console.error('Error in GET /api/admin/meetings/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/meetings/[id]
 * Update a meeting note
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
    if (!userHasPermission(user, Permission.EDIT_MEETINGS)) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    const { id } = params

    // Check if meeting exists
    const { data: existingMeeting } = await meetingNotesDB.getById(id)
    if (!existingMeeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      )
    }

    // Parse request body
    const body = await request.json()
    const updates: any = {}

    // Validate and add updates
    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || body.title.trim().length === 0) {
        return NextResponse.json(
          { error: 'Title cannot be empty' },
          { status: 400 }
        )
      }
      updates.title = body.title.trim()
    }

    if (body.date !== undefined) {
      updates.date = body.date
    }

    if (body.attendees !== undefined) {
      if (!Array.isArray(body.attendees) || body.attendees.length === 0) {
        return NextResponse.json(
          { error: 'At least one attendee is required' },
          { status: 400 }
        )
      }
      updates.attendees = body.attendees
    }

    if (body.notes !== undefined) {
      if (typeof body.notes !== 'string' || body.notes.trim().length === 0) {
        return NextResponse.json(
          { error: 'Notes cannot be empty' },
          { status: 400 }
        )
      }
      updates.notes = body.notes.trim()
    }

    if (body.action_items !== undefined) {
      updates.action_items = body.action_items || []
    }

    // Update meeting
    const { data: meeting, error } = await meetingNotesDB.update(id, updates)

    if (error) {
      console.error('Error updating meeting:', error)
      return NextResponse.json(
        { error: 'Failed to update meeting' },
        { status: 500 }
      )
    }

    return NextResponse.json({ meeting })
  } catch (error) {
    console.error('Error in PATCH /api/admin/meetings/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/meetings/[id]
 * Delete a meeting note
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
    if (!userHasPermission(user, Permission.DELETE_MEETINGS)) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    const { id } = params

    // Check if meeting exists
    const { data: existingMeeting } = await meetingNotesDB.getById(id)
    if (!existingMeeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      )
    }

    // Delete meeting
    const { error } = await meetingNotesDB.delete(id)

    if (error) {
      console.error('Error deleting meeting:', error)
      return NextResponse.json(
        { error: 'Failed to delete meeting' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/meetings/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

