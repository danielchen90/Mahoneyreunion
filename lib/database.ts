/**
 * Neon PostgreSQL Database Configuration
 * Handles database operations for the Mahoney Family Reunion website
 */

import { neon } from '@neondatabase/serverless'

// Neon database connection from environment variables
const sql = neon(process.env.DATABASE_URL || '')

// Database types for TypeScript
export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'unread' | 'read'
  archived: boolean
  created_at: string
  updated_at: string
}

/**
 * Contact Submissions Database Operations
 */
export const contactSubmissionsDB = {
  /**
   * Create a new contact submission
   */
  async create(data: {
    name: string
    email: string
    phone?: string
    subject: string
    message: string
  }): Promise<{ data: ContactSubmission | null; error: any }> {
    try {
      const result = await sql`
        INSERT INTO contact_submissions (name, email, phone, subject, message, status, archived)
        VALUES (${data.name}, ${data.email}, ${data.phone || null}, ${data.subject}, ${data.message}, 'unread', false)
        RETURNING *
      `
      return { data: result[0] as ContactSubmission, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Get all contact submissions (with optional filters)
   */
  async getAll(filters?: {
    status?: 'unread' | 'read'
    archived?: boolean
    search?: string
  }): Promise<{ data: ContactSubmission[] | null; error: any }> {
    try {
      // Build query dynamically based on filters
      if (!filters || (!filters.status && filters.archived === undefined && !filters.search)) {
        // No filters - simple query
        const result = await sql`
          SELECT * FROM contact_submissions
          ORDER BY created_at DESC
        `
        return { data: result as ContactSubmission[], error: null }
      }

      // With filters - build query parts
      const conditions: string[] = []

      if (filters.status) {
        conditions.push(`status = '${filters.status}'`)
      }

      if (filters.archived !== undefined) {
        conditions.push(`archived = ${filters.archived}`)
      }

      if (filters.search) {
        const searchTerm = filters.search.replace(/'/g, "''") // Escape single quotes
        conditions.push(`(
          name ILIKE '%${searchTerm}%' OR
          email ILIKE '%${searchTerm}%' OR
          subject ILIKE '%${searchTerm}%' OR
          message ILIKE '%${searchTerm}%'
        )`)
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

      // Use neon().query() for dynamic queries
      const { neon } = await import('@neondatabase/serverless')
      const sqlQuery = neon(process.env.DATABASE_URL || '')
      const result = await sqlQuery(`
        SELECT * FROM contact_submissions
        ${whereClause}
        ORDER BY created_at DESC
      `)

      return { data: result as ContactSubmission[], error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Get a single contact submission by ID
   */
  async getById(id: string): Promise<{ data: ContactSubmission | null; error: any }> {
    try {
      const result = await sql`
        SELECT * FROM contact_submissions WHERE id = ${id}
      `
      return { data: result[0] as ContactSubmission || null, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Update contact submission status
   */
  async updateStatus(
    id: string,
    status: 'unread' | 'read'
  ): Promise<{ data: ContactSubmission | null; error: any }> {
    try {
      const result = await sql`
        UPDATE contact_submissions
        SET status = ${status}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
      return { data: result[0] as ContactSubmission || null, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Archive/unarchive a contact submission
   */
  async updateArchived(
    id: string,
    archived: boolean
  ): Promise<{ data: ContactSubmission | null; error: any }> {
    try {
      const result = await sql`
        UPDATE contact_submissions
        SET archived = ${archived}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
      return { data: result[0] as ContactSubmission || null, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Delete a contact submission
   */
  async delete(id: string): Promise<{ error: any }> {
    try {
      await sql`
        DELETE FROM contact_submissions WHERE id = ${id}
      `
      return { error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { error }
    }
  },

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<{ count: number; error: any }> {
    try {
      const result = await sql`
        SELECT COUNT(*) as count
        FROM contact_submissions
        WHERE status = 'unread' AND archived = false
      `
      return { count: parseInt(result[0].count as string) || 0, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { count: 0, error }
    }
  },
}

/**
 * Admin Users Database Operations (Phase 2)
 */
export interface AdminUser {
  id: string
  email: string
  password_hash: string
  name: string
  role: 'super_admin' | 'admin' | 'moderator' | 'viewer'
  is_active: boolean
  email_verified: boolean
  last_login?: string
  failed_login_attempts: number
  locked_until?: string
  created_at: string
  updated_at: string
}

export const adminUsersDB = {
  /**
   * Create a new admin user
   */
  async create(data: {
    email: string
    password_hash: string
    name: string
    role: string
  }): Promise<{ data: AdminUser | null; error: any }> {
    try {
      const result = await sql`
        INSERT INTO admin_users (email, password_hash, name, role, is_active, email_verified)
        VALUES (${data.email}, ${data.password_hash}, ${data.name}, ${data.role}, true, false)
        RETURNING *
      `
      return { data: result[0] as AdminUser, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Get user by email
   */
  async getByEmail(email: string): Promise<{ data: AdminUser | null; error: any }> {
    try {
      const result = await sql`
        SELECT * FROM admin_users WHERE email = ${email}
      `
      return { data: result[0] as AdminUser || null, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<{ data: AdminUser | null; error: any }> {
    try {
      const result = await sql`
        SELECT * FROM admin_users WHERE id = ${id}
      `
      return { data: result[0] as AdminUser || null, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Get all users
   */
  async getAll(): Promise<{ data: AdminUser[] | null; error: any }> {
    try {
      const result = await sql`
        SELECT * FROM admin_users ORDER BY created_at DESC
      `
      return { data: result as AdminUser[], error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Update user
   */
  async update(
    id: string,
    data: Partial<AdminUser>
  ): Promise<{ data: AdminUser | null; error: any }> {
    try {
      const updates: string[] = []
      const values: any[] = []
      let paramIndex = 1

      if (data.name !== undefined) {
        updates.push(`name = $${paramIndex}`)
        values.push(data.name)
        paramIndex++
      }
      if (data.email !== undefined) {
        updates.push(`email = $${paramIndex}`)
        values.push(data.email)
        paramIndex++
      }
      if (data.role !== undefined) {
        updates.push(`role = $${paramIndex}`)
        values.push(data.role)
        paramIndex++
      }
      if (data.is_active !== undefined) {
        updates.push(`is_active = $${paramIndex}`)
        values.push(data.is_active)
        paramIndex++
      }
      if (data.password_hash !== undefined) {
        updates.push(`password_hash = $${paramIndex}`)
        values.push(data.password_hash)
        paramIndex++
      }

      updates.push(`updated_at = NOW()`)
      values.push(id)

      const { neon } = await import('@neondatabase/serverless')
      const sqlQuery = neon(process.env.DATABASE_URL || '')
      const result = await sqlQuery(
        `UPDATE admin_users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
      )

      return { data: result[0] as AdminUser || null, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Update last login
   */
  async updateLastLogin(id: string): Promise<{ error: any }> {
    try {
      await sql`
        UPDATE admin_users
        SET last_login = NOW(), failed_login_attempts = 0, locked_until = NULL
        WHERE id = ${id}
      `
      return { error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { error }
    }
  },

  /**
   * Increment failed login attempts
   */
  async incrementFailedAttempts(
    id: string,
    lockUntil?: Date
  ): Promise<{ error: any }> {
    try {
      if (lockUntil) {
        await sql`
          UPDATE admin_users
          SET failed_login_attempts = failed_login_attempts + 1,
              locked_until = ${lockUntil.toISOString()}
          WHERE id = ${id}
        `
      } else {
        await sql`
          UPDATE admin_users
          SET failed_login_attempts = failed_login_attempts + 1
          WHERE id = ${id}
        `
      }
      return { error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { error }
    }
  },

  /**
   * Delete user
   */
  async delete(id: string): Promise<{ error: any }> {
    try {
      await sql`
        DELETE FROM admin_users WHERE id = ${id}
      `
      return { error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { error }
    }
  },
}

/**
 * Task Management Types
 */
export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to?: string
  created_by: string
  due_date?: string
  tags?: string[]
  order_index: number
  created_at: string
  updated_at: string
}

export interface TaskComment {
  id: string
  task_id: string
  user_id: string
  comment: string
  created_at: string
  updated_at: string
}

export interface TaskAttachment {
  id: string
  task_id: string
  file_name: string
  file_url: string
  file_type: string
  file_size: number
  uploaded_by: string
  created_at: string
}

export interface MeetingNote {
  id: string
  title: string
  date: string
  attendees: string[]
  notes: string
  action_items?: string[]
  created_by: string
  created_at: string
  updated_at: string
}

export interface MeetingTask {
  id: string
  meeting_id: string
  task_id: string
  created_at: string
}

/**
 * Tasks Database Operations
 */
export const tasksDB = {
  /**
   * Create a new task
   */
  async create(data: {
    title: string
    description?: string
    status?: string
    priority?: string
    assigned_to?: string
    created_by: string
    due_date?: string
    tags?: string[]
  }): Promise<{ data: Task | null; error: any }> {
    try {
      // Get the max order_index for the status column
      const maxOrder = await sql`
        SELECT COALESCE(MAX(order_index), -1) as max_order
        FROM tasks
        WHERE status = ${data.status || 'todo'}
      `
      const orderIndex = (maxOrder[0]?.max_order || -1) + 1

      const result = await sql`
        INSERT INTO tasks (
          title, description, status, priority, assigned_to, created_by,
          due_date, tags, order_index
        )
        VALUES (
          ${data.title},
          ${data.description || null},
          ${data.status || 'todo'},
          ${data.priority || 'medium'},
          ${data.assigned_to || null},
          ${data.created_by},
          ${data.due_date || null},
          ${data.tags || null},
          ${orderIndex}
        )
        RETURNING *
      `
      return { data: result[0] as Task, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Get all tasks
   */
  async getAll(): Promise<{ data: Task[] | null; error: any }> {
    try {
      const result = await sql`
        SELECT * FROM tasks
        ORDER BY order_index ASC, created_at DESC
      `
      return { data: result as Task[], error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Get task by ID
   */
  async getById(id: string): Promise<{ data: Task | null; error: any }> {
    try {
      const result = await sql`
        SELECT * FROM tasks WHERE id = ${id}
      `
      return { data: result[0] as Task || null, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Update task
   */
  async update(id: string, data: Partial<Task>): Promise<{ data: Task | null; error: any }> {
    try {
      const updates: string[] = []
      const values: any[] = []

      if (data.title !== undefined) {
        updates.push(`title = $${updates.length + 1}`)
        values.push(data.title)
      }
      if (data.description !== undefined) {
        updates.push(`description = $${updates.length + 1}`)
        values.push(data.description)
      }
      if (data.status !== undefined) {
        updates.push(`status = $${updates.length + 1}`)
        values.push(data.status)
      }
      if (data.priority !== undefined) {
        updates.push(`priority = $${updates.length + 1}`)
        values.push(data.priority)
      }
      if (data.assigned_to !== undefined) {
        updates.push(`assigned_to = $${updates.length + 1}`)
        values.push(data.assigned_to)
      }
      if (data.due_date !== undefined) {
        updates.push(`due_date = $${updates.length + 1}`)
        values.push(data.due_date)
      }
      if (data.tags !== undefined) {
        updates.push(`tags = $${updates.length + 1}`)
        values.push(data.tags)
      }
      if (data.order_index !== undefined) {
        updates.push(`order_index = $${updates.length + 1}`)
        values.push(data.order_index)
      }

      updates.push(`updated_at = NOW()`)

      const result = await sql`
        UPDATE tasks
        SET ${sql.unsafe(updates.join(', '))}
        WHERE id = ${id}
        RETURNING *
      `
      return { data: result[0] as Task || null, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Delete task
   */
  async delete(id: string): Promise<{ error: any }> {
    try {
      await sql`DELETE FROM tasks WHERE id = ${id}`
      return { error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { error }
    }
  },

  /**
   * Update task order (for drag and drop)
   */
  async updateOrder(tasks: { id: string; order_index: number; status: string }[]): Promise<{ error: any }> {
    try {
      for (const task of tasks) {
        await sql`
          UPDATE tasks
          SET order_index = ${task.order_index}, status = ${task.status}, updated_at = NOW()
          WHERE id = ${task.id}
        `
      }
      return { error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { error }
    }
  },
}

/**
 * Task Comments Database Operations
 */
export const taskCommentsDB = {
  /**
   * Create a new comment
   */
  async create(data: {
    task_id: string
    user_id: string
    comment: string
  }): Promise<{ data: TaskComment | null; error: any }> {
    try {
      const result = await sql`
        INSERT INTO task_comments (task_id, user_id, comment)
        VALUES (${data.task_id}, ${data.user_id}, ${data.comment})
        RETURNING *
      `
      return { data: result[0] as TaskComment, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Get comments for a task
   */
  async getByTaskId(taskId: string): Promise<{ data: TaskComment[] | null; error: any }> {
    try {
      const result = await sql`
        SELECT * FROM task_comments
        WHERE task_id = ${taskId}
        ORDER BY created_at ASC
      `
      return { data: result as TaskComment[], error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Delete comment
   */
  async delete(id: string): Promise<{ error: any }> {
    try {
      await sql`DELETE FROM task_comments WHERE id = ${id}`
      return { error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { error }
    }
  },
}

/**
 * Task Attachments Database Operations
 */
export const taskAttachmentsDB = {
  /**
   * Create a new attachment
   */
  async create(data: {
    task_id: string
    file_name: string
    file_url: string
    file_type: string
    file_size: number
    uploaded_by: string
  }): Promise<{ data: TaskAttachment | null; error: any }> {
    try {
      const result = await sql`
        INSERT INTO task_attachments (
          task_id, file_name, file_url, file_type, file_size, uploaded_by
        )
        VALUES (
          ${data.task_id}, ${data.file_name}, ${data.file_url},
          ${data.file_type}, ${data.file_size}, ${data.uploaded_by}
        )
        RETURNING *
      `
      return { data: result[0] as TaskAttachment, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Get attachments for a task
   */
  async getByTaskId(taskId: string): Promise<{ data: TaskAttachment[] | null; error: any }> {
    try {
      const result = await sql`
        SELECT * FROM task_attachments
        WHERE task_id = ${taskId}
        ORDER BY created_at DESC
      `
      return { data: result as TaskAttachment[], error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Delete attachment
   */
  async delete(id: string): Promise<{ error: any }> {
    try {
      await sql`DELETE FROM task_attachments WHERE id = ${id}`
      return { error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { error }
    }
  },
}

/**
 * Meeting Notes Database Operations
 */
export const meetingNotesDB = {
  /**
   * Create a new meeting note
   */
  async create(data: {
    title: string
    date: string
    attendees: string[]
    notes: string
    action_items?: string[]
    created_by: string
  }): Promise<{ data: MeetingNote | null; error: any }> {
    try {
      const result = await sql`
        INSERT INTO meeting_notes (
          title, date, attendees, notes, action_items, created_by
        )
        VALUES (
          ${data.title}, ${data.date}, ${data.attendees},
          ${data.notes}, ${data.action_items || null}, ${data.created_by}
        )
        RETURNING *
      `
      return { data: result[0] as MeetingNote, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Get all meeting notes
   */
  async getAll(): Promise<{ data: MeetingNote[] | null; error: any }> {
    try {
      const result = await sql`
        SELECT * FROM meeting_notes
        ORDER BY date DESC, created_at DESC
      `
      return { data: result as MeetingNote[], error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Get meeting note by ID
   */
  async getById(id: string): Promise<{ data: MeetingNote | null; error: any }> {
    try {
      const result = await sql`
        SELECT * FROM meeting_notes WHERE id = ${id}
      `
      return { data: result[0] as MeetingNote || null, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Update meeting note
   */
  async update(id: string, data: Partial<MeetingNote>): Promise<{ data: MeetingNote | null; error: any }> {
    try {
      const updates: string[] = []

      if (data.title !== undefined) updates.push(`title = '${data.title}'`)
      if (data.date !== undefined) updates.push(`date = '${data.date}'`)
      if (data.attendees !== undefined) updates.push(`attendees = ARRAY[${data.attendees.map(a => `'${a}'`).join(',')}]`)
      if (data.notes !== undefined) updates.push(`notes = '${data.notes}'`)
      if (data.action_items !== undefined) {
        if (data.action_items === null) {
          updates.push(`action_items = NULL`)
        } else {
          updates.push(`action_items = ARRAY[${data.action_items.map(a => `'${a}'`).join(',')}]`)
        }
      }

      updates.push(`updated_at = NOW()`)

      const result = await sql`
        UPDATE meeting_notes
        SET ${sql.unsafe(updates.join(', '))}
        WHERE id = ${id}
        RETURNING *
      `
      return { data: result[0] as MeetingNote || null, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Delete meeting note
   */
  async delete(id: string): Promise<{ error: any }> {
    try {
      await sql`DELETE FROM meeting_notes WHERE id = ${id}`
      return { error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { error }
    }
  },
}

/**
 * File Storage Types
 */
export interface Folder {
  id: string
  name: string
  parent_id?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface File {
  id: string
  name: string
  file_url: string
  file_type: string
  file_size: number
  folder_id?: string
  cloudinary_public_id: string
  uploaded_by: string
  created_at: string
  updated_at: string
}

/**
 * Folders Database Operations
 */
export const foldersDB = {
  /**
   * Create a new folder
   */
  async create(data: {
    name: string
    parent_id?: string
    created_by: string
  }): Promise<{ data: Folder | null; error: any }> {
    try {
      const result = await sql`
        INSERT INTO folders (name, parent_id, created_by)
        VALUES (${data.name}, ${data.parent_id || null}, ${data.created_by})
        RETURNING *
      `
      return { data: result[0] as Folder, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Get all folders
   */
  async getAll(): Promise<{ data: Folder[] | null; error: any }> {
    try {
      const result = await sql`
        SELECT * FROM folders
        ORDER BY name ASC
      `
      return { data: result as Folder[], error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Get folder by ID
   */
  async getById(id: string): Promise<{ data: Folder | null; error: any }> {
    try {
      const result = await sql`
        SELECT * FROM folders WHERE id = ${id}
      `
      return { data: result[0] as Folder || null, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Get folders by parent ID
   */
  async getByParentId(parentId: string | null): Promise<{ data: Folder[] | null; error: any }> {
    try {
      const result = parentId
        ? await sql`SELECT * FROM folders WHERE parent_id = ${parentId} ORDER BY name ASC`
        : await sql`SELECT * FROM folders WHERE parent_id IS NULL ORDER BY name ASC`

      return { data: result as Folder[], error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Update folder
   */
  async update(id: string, data: { name?: string; parent_id?: string }): Promise<{ data: Folder | null; error: any }> {
    try {
      const updates: string[] = []

      if (data.name !== undefined) updates.push(`name = '${data.name}'`)
      if (data.parent_id !== undefined) {
        updates.push(data.parent_id ? `parent_id = '${data.parent_id}'` : `parent_id = NULL`)
      }

      updates.push(`updated_at = NOW()`)

      const result = await sql`
        UPDATE folders
        SET ${sql.unsafe(updates.join(', '))}
        WHERE id = ${id}
        RETURNING *
      `
      return { data: result[0] as Folder || null, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Delete folder
   */
  async delete(id: string): Promise<{ error: any }> {
    try {
      await sql`DELETE FROM folders WHERE id = ${id}`
      return { error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { error }
    }
  },
}

/**
 * Files Database Operations
 */
export const filesDB = {
  /**
   * Create a new file record
   */
  async create(data: {
    name: string
    file_url: string
    file_type: string
    file_size: number
    folder_id?: string
    cloudinary_public_id: string
    uploaded_by: string
  }): Promise<{ data: File | null; error: any }> {
    try {
      const result = await sql`
        INSERT INTO files (
          name, file_url, file_type, file_size, folder_id,
          cloudinary_public_id, uploaded_by
        )
        VALUES (
          ${data.name}, ${data.file_url}, ${data.file_type},
          ${data.file_size}, ${data.folder_id || null},
          ${data.cloudinary_public_id}, ${data.uploaded_by}
        )
        RETURNING *
      `
      return { data: result[0] as File, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Get all files
   */
  async getAll(): Promise<{ data: File[] | null; error: any }> {
    try {
      const result = await sql`
        SELECT * FROM files
        ORDER BY created_at DESC
      `
      return { data: result as File[], error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Get file by ID
   */
  async getById(id: string): Promise<{ data: File | null; error: any }> {
    try {
      const result = await sql`
        SELECT * FROM files WHERE id = ${id}
      `
      return { data: result[0] as File || null, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Get files by folder ID
   */
  async getByFolderId(folderId: string | null): Promise<{ data: File[] | null; error: any }> {
    try {
      const result = folderId
        ? await sql`SELECT * FROM files WHERE folder_id = ${folderId} ORDER BY created_at DESC`
        : await sql`SELECT * FROM files WHERE folder_id IS NULL ORDER BY created_at DESC`

      return { data: result as File[], error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Update file
   */
  async update(id: string, data: { name?: string; folder_id?: string }): Promise<{ data: File | null; error: any }> {
    try {
      const updates: string[] = []

      if (data.name !== undefined) updates.push(`name = '${data.name}'`)
      if (data.folder_id !== undefined) {
        updates.push(data.folder_id ? `folder_id = '${data.folder_id}'` : `folder_id = NULL`)
      }

      updates.push(`updated_at = NOW()`)

      const result = await sql`
        UPDATE files
        SET ${sql.unsafe(updates.join(', '))}
        WHERE id = ${id}
        RETURNING *
      `
      return { data: result[0] as File || null, error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { data: null, error }
    }
  },

  /**
   * Delete file
   */
  async delete(id: string): Promise<{ error: any }> {
    try {
      await sql`DELETE FROM files WHERE id = ${id}`
      return { error: null }
    } catch (error) {
      console.error('Database error:', error)
      return { error }
    }
  },
}

