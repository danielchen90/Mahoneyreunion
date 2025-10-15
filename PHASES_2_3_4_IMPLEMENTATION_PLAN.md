# 🚀 Phases 2, 3, 4 - Complete Implementation Plan

## 📋 OVERVIEW

This document outlines the complete implementation plan for the remaining admin dashboard features.

---

## **PHASE 2: MULTI-USER ADMIN SYSTEM** 👥

### **Features:**
1. **User Management**
   - Create, edit, delete admin users
   - User profile management
   - Password management (hashing with bcrypt)
   - Email verification
   - Account activation/deactivation

2. **Role-Based Access Control (RBAC)**
   - **Super Admin** - Full access to everything
   - **Admin** - Manage content, view users (no user management)
   - **Moderator** - Manage contact messages only
   - **Viewer** - Read-only access

3. **Authentication & Security**
   - JWT-based authentication
   - Secure password hashing (bcrypt)
   - Session management
   - Password reset functionality
   - Login attempt tracking
   - Account lockout after failed attempts

4. **User Interface**
   - User management dashboard
   - Role assignment interface
   - Activity logs
   - User permissions matrix

### **Database Schema:**
```sql
-- Users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'moderator', 'viewer')),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity logs
CREATE TABLE admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100),
  resource_id VARCHAR(255),
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_activity_logs_user_id ON admin_activity_logs(user_id);
CREATE INDEX idx_admin_activity_logs_created_at ON admin_activity_logs(created_at DESC);
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
```

### **NPM Packages Needed:**
```bash
npm install bcryptjs jsonwebtoken jose
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

### **Files to Create:**
- `lib/auth.ts` - Authentication utilities
- `lib/permissions.ts` - Permission checking
- `app/api/auth/login/route.ts` - Login endpoint
- `app/api/auth/logout/route.ts` - Logout endpoint
- `app/api/auth/me/route.ts` - Get current user
- `app/api/admin/users/route.ts` - User CRUD
- `app/api/admin/users/[id]/route.ts` - Single user operations
- `app/api/admin/activity/route.ts` - Activity logs
- `components/admin-users.tsx` - User management UI
- `components/admin-activity-logs.tsx` - Activity log viewer
- `components/login-form.tsx` - Enhanced login form
- `middleware.ts` - Route protection

### **Time Estimate:** 4-6 hours

---

## **PHASE 3: FILE STORAGE SYSTEM** 📁

### **Features:**
1. **File Upload**
   - Drag-and-drop interface
   - Multiple file upload
   - File type validation
   - File size limits
   - Progress indicators

2. **File Management**
   - File browser with folders
   - File preview (images, PDFs)
   - File download
   - File deletion
   - File renaming
   - Move files between folders

3. **Organization**
   - Folder structure
   - File categories/tags
   - Search functionality
   - Sort by name, date, size, type

4. **Storage Options**
   - **Option A:** Cloudinary (recommended - free tier, easy setup)
   - **Option B:** AWS S3 (more complex, scalable)
   - **Option C:** Vercel Blob Storage (simple, integrated)

### **Database Schema:**
```sql
-- Files table
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  storage_url TEXT NOT NULL,
  storage_key VARCHAR(500) NOT NULL,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  description TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT false,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Folders table
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_files_folder_id ON files(folder_id);
CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);
CREATE INDEX idx_files_created_at ON files(created_at DESC);
CREATE INDEX idx_folders_parent_id ON folders(parent_id);
```

### **NPM Packages Needed (Cloudinary):**
```bash
npm install cloudinary next-cloudinary
```

### **Files to Create:**
- `lib/storage.ts` - Storage utilities (Cloudinary integration)
- `app/api/files/upload/route.ts` - File upload endpoint
- `app/api/files/list/route.ts` - List files
- `app/api/files/[id]/route.ts` - File operations (get, delete, update)
- `app/api/files/[id]/download/route.ts` - File download
- `app/api/folders/route.ts` - Folder CRUD
- `components/admin-files.tsx` - File management UI
- `components/file-upload.tsx` - Upload component
- `components/file-browser.tsx` - File browser component
- `components/file-preview.tsx` - File preview modal

### **Time Estimate:** 3-5 hours

---

## **PHASE 4: TASK MANAGEMENT SYSTEM** ✅

### **Features:**
1. **Task Management**
   - Create, edit, delete tasks
   - Task assignment to users
   - Due dates and reminders
   - Priority levels (Low, Medium, High, Urgent)
   - Task status (To Do, In Progress, Done, Blocked)
   - Task categories/labels

2. **Collaboration**
   - Task comments/notes
   - File attachments
   - @mentions
   - Activity timeline
   - Task watchers/followers

3. **Organization**
   - Task lists/boards
   - Kanban board view
   - List view
   - Calendar view
   - Filter and search

4. **Meeting Notes**
   - Create meeting notes
   - Link tasks to meetings
   - Action items from meetings
   - Meeting attendees
   - Meeting templates

### **Database Schema:**
```sql
-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'blocked')),
  priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  category VARCHAR(100),
  tags TEXT[],
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task comments
CREATE TABLE task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task attachments
CREATE TABLE task_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meeting notes
CREATE TABLE meeting_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
  attendees TEXT[],
  notes TEXT,
  action_items TEXT[],
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meeting tasks (link tasks to meetings)
CREATE TABLE meeting_tasks (
  meeting_id UUID REFERENCES meeting_notes(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  PRIMARY KEY (meeting_id, task_id)
);

-- Indexes
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX idx_meeting_notes_meeting_date ON meeting_notes(meeting_date DESC);
```

### **NPM Packages Needed:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable date-fns
```

### **Files to Create:**
- `app/api/tasks/route.ts` - Task CRUD
- `app/api/tasks/[id]/route.ts` - Single task operations
- `app/api/tasks/[id]/comments/route.ts` - Task comments
- `app/api/meetings/route.ts` - Meeting notes CRUD
- `components/admin-tasks.tsx` - Task management UI
- `components/task-board.tsx` - Kanban board
- `components/task-list.tsx` - List view
- `components/task-detail.tsx` - Task detail modal
- `components/meeting-notes.tsx` - Meeting notes UI

### **Time Estimate:** 4-6 hours

---

## **📊 IMPLEMENTATION ORDER:**

### **Recommended Order:**
1. **Phase 2 First** (Multi-User Admin System)
   - Provides authentication foundation
   - Required for user assignment in Phases 3 & 4
   - Most critical for security

2. **Phase 4 Second** (Task Management)
   - Doesn't require file storage
   - Can be used immediately
   - High value for reunion planning

3. **Phase 3 Last** (File Storage)
   - Can integrate with Phase 4 (task attachments)
   - Less critical for immediate use
   - Can be added later if needed

### **Alternative Order (If you want files first):**
1. Phase 2 (Authentication)
2. Phase 3 (File Storage)
3. Phase 4 (Task Management with file attachments)

---

## **⏱️ TOTAL TIME ESTIMATE:**

| Phase | Time | Complexity |
|-------|------|------------|
| Phase 2: Multi-User Admin | 4-6 hours | High |
| Phase 3: File Storage | 3-5 hours | Medium |
| Phase 4: Task Management | 4-6 hours | High |
| **TOTAL** | **11-17 hours** | |

**Note:** This is development time. Testing and refinement will add 20-30% more time.

---

## **🎯 DECISION POINTS:**

### **1. Storage Provider for Phase 3:**
- **Cloudinary** (Recommended) - Free tier, easy setup, image optimization
- **AWS S3** - More control, scalable, requires AWS account
- **Vercel Blob** - Simple, integrated with Vercel, limited free tier

**Recommendation:** Start with Cloudinary (easiest), can migrate later if needed.

### **2. Implementation Approach:**
- **Option A:** Implement all phases sequentially (11-17 hours total)
- **Option B:** Implement Phase 2 only first, then decide (4-6 hours)
- **Option C:** Implement Phases 2 & 4 only, skip file storage (8-12 hours)

**Recommendation:** Option A (all phases) for complete admin system.

---

## **📝 NEXT STEPS:**

**Please confirm:**
1. ✅ Implementation order: Phase 2 → Phase 4 → Phase 3?
2. ✅ Storage provider: Cloudinary for Phase 3?
3. ✅ Ready to start with Phase 2 (Multi-User Admin System)?

**Once confirmed, I'll:**
1. Update task list with detailed subtasks
2. Create database migration SQL
3. Start implementing Phase 2
4. Provide progress updates

---

**Ready to begin? Let me know and I'll start with Phase 2!** 🚀

