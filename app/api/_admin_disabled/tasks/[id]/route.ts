import { NextRequest, NextResponse } from 'next/server'
import { tasksDB } from '@/lib/database'
import { getCurrentUser } from '@/lib/auth'
import { userHasPermission, Permission } from '@/lib/permissions'

// Force Node.js runtime for this route
export const runtime = 'nodejs'

/**
 * GET /api/admin/tasks/[id]
 * Get a single task by ID
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
    if (!userHasPermission(user, Permission.VIEW_TASKS)) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    const { id } = params

    // Get task
    const { data: task, error } = await tasksDB.getById(id)

    if (error) {
      console.error('Error fetching task:', error)
      return NextResponse.json(
        { error: 'Failed to fetch task' },
        { status: 500 }
      )
    }

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error('Error in GET /api/admin/tasks/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/tasks/[id]
 * Update a task
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
    if (!userHasPermission(user, Permission.EDIT_TASKS)) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    const { id } = params

    // Check if task exists
    const { data: existingTask } = await tasksDB.getById(id)
    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
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

    if (body.description !== undefined) {
      updates.description = body.description?.trim() || null
    }

    if (body.status !== undefined) {
      const validStatuses = ['todo', 'in_progress', 'review', 'done']
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        )
      }
      updates.status = body.status
    }

    if (body.priority !== undefined) {
      const validPriorities = ['low', 'medium', 'high', 'urgent']
      if (!validPriorities.includes(body.priority)) {
        return NextResponse.json(
          { error: 'Invalid priority' },
          { status: 400 }
        )
      }
      updates.priority = body.priority
    }

    if (body.assigned_to !== undefined) {
      updates.assigned_to = body.assigned_to || null
    }

    if (body.due_date !== undefined) {
      updates.due_date = body.due_date || null
    }

    if (body.tags !== undefined) {
      updates.tags = body.tags || []
    }

    if (body.order_index !== undefined) {
      updates.order_index = body.order_index
    }

    // Update task
    const { data: task, error } = await tasksDB.update(id, updates)

    if (error) {
      console.error('Error updating task:', error)
      return NextResponse.json(
        { error: 'Failed to update task' },
        { status: 500 }
      )
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error('Error in PATCH /api/admin/tasks/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/tasks/[id]
 * Delete a task
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
    if (!userHasPermission(user, Permission.DELETE_TASKS)) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    const { id } = params

    // Check if task exists
    const { data: existingTask } = await tasksDB.getById(id)
    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Delete task
    const { error } = await tasksDB.delete(id)

    if (error) {
      console.error('Error deleting task:', error)
      return NextResponse.json(
        { error: 'Failed to delete task' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/tasks/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

