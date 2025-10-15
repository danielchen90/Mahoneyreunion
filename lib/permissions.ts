/**
 * Permission System
 * Role-based access control (RBAC) for admin features
 */

import { JWTPayload } from './auth-edge'

// Role hierarchy (higher number = more permissions)
export enum Role {
  VIEWER = 1,
  MODERATOR = 2,
  ADMIN = 3,
  SUPER_ADMIN = 4,
}

// Map string roles to enum
export const roleMap: Record<string, Role> = {
  viewer: Role.VIEWER,
  moderator: Role.MODERATOR,
  admin: Role.ADMIN,
  super_admin: Role.SUPER_ADMIN,
}

// Permission types
export enum Permission {
  // Contact Messages
  VIEW_MESSAGES = 'view_messages',
  MANAGE_MESSAGES = 'manage_messages',
  DELETE_MESSAGES = 'delete_messages',

  // Users
  VIEW_USERS = 'view_users',
  CREATE_USERS = 'create_users',
  EDIT_USERS = 'edit_users',
  DELETE_USERS = 'delete_users',
  MANAGE_ROLES = 'manage_roles',

  // Files
  VIEW_FILES = 'view_files',
  UPLOAD_FILES = 'upload_files',
  DELETE_FILES = 'delete_files',
  MANAGE_FOLDERS = 'manage_folders',

  // Tasks
  VIEW_TASKS = 'view_tasks',
  CREATE_TASKS = 'create_tasks',
  EDIT_TASKS = 'edit_tasks',
  DELETE_TASKS = 'delete_tasks',
  ASSIGN_TASKS = 'assign_tasks',
  COMMENT_TASKS = 'comment_tasks',

  // Meetings
  VIEW_MEETINGS = 'view_meetings',
  CREATE_MEETINGS = 'create_meetings',
  EDIT_MEETINGS = 'edit_meetings',
  DELETE_MEETINGS = 'delete_meetings',

  // Activity Logs
  VIEW_ACTIVITY_LOGS = 'view_activity_logs',

  // Page Visibility
  MANAGE_PAGE_VISIBILITY = 'manage_page_visibility',
}

// Define permissions for each role separately first
const viewerPermissions: Permission[] = [
  // Read-only access
  Permission.VIEW_MESSAGES,
  Permission.VIEW_USERS,
  Permission.VIEW_FILES,
  Permission.VIEW_TASKS,
  Permission.VIEW_MEETINGS,
]

const moderatorPermissions: Permission[] = [
  // All viewer permissions
  ...viewerPermissions,
  // Plus message management
  Permission.MANAGE_MESSAGES,
  Permission.DELETE_MESSAGES,
  // Plus task viewing and commenting
  Permission.CREATE_TASKS,
  Permission.EDIT_TASKS,
  Permission.COMMENT_TASKS,
]

const adminPermissions: Permission[] = [
  // All moderator permissions
  ...moderatorPermissions,
  // Plus file management
  Permission.UPLOAD_FILES,
  Permission.DELETE_FILES,
  Permission.MANAGE_FOLDERS,
  // Plus full task management
  Permission.DELETE_TASKS,
  Permission.ASSIGN_TASKS,
  // Plus meeting management
  Permission.CREATE_MEETINGS,
  Permission.EDIT_MEETINGS,
    Permission.DELETE_MEETINGS,
    // Plus activity logs
    Permission.VIEW_ACTIVITY_LOGS,
]

const superAdminPermissions: Permission[] = [
  // All admin permissions
  ...adminPermissions,
  // Plus user management
  Permission.CREATE_USERS,
  Permission.EDIT_USERS,
  Permission.DELETE_USERS,
  Permission.MANAGE_ROLES,
  // Plus page visibility
  Permission.MANAGE_PAGE_VISIBILITY,
]

// Role permissions mapping
const rolePermissions: Record<Role, Permission[]> = {
  [Role.VIEWER]: viewerPermissions,
  [Role.MODERATOR]: moderatorPermissions,
  [Role.ADMIN]: adminPermissions,
  [Role.SUPER_ADMIN]: superAdminPermissions,
}

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: string, permission: Permission): boolean {
  const roleEnum = roleMap[role]
  if (!roleEnum) return false

  const permissions = rolePermissions[roleEnum]
  return permissions.includes(permission)
}

/**
 * Check if a user has a specific permission
 */
export function userHasPermission(
  user: JWTPayload | null,
  permission: Permission
): boolean {
  if (!user) return false
  return hasPermission(user.role, permission)
}

/**
 * Check if a role can perform an action on another role
 * (e.g., can an admin edit a super_admin?)
 */
export function canManageRole(
  actorRole: string,
  targetRole: string
): boolean {
  const actorRoleEnum = roleMap[actorRole]
  const targetRoleEnum = roleMap[targetRole]

  if (!actorRoleEnum || !targetRoleEnum) return false

  // Can only manage roles lower than your own
  return actorRoleEnum > targetRoleEnum
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: string): Permission[] {
  const roleEnum = roleMap[role]
  if (!roleEnum) return []

  return rolePermissions[roleEnum]
}

/**
 * Check if user has minimum required role
 */
export function hasMinimumRole(
  userRole: string,
  requiredRole: Role
): boolean {
  const userRoleEnum = roleMap[userRole]
  if (!userRoleEnum) return false

  return userRoleEnum >= requiredRole
}

/**
 * Require specific permission (throws error if not authorized)
 */
export function requirePermission(
  user: JWTPayload | null,
  permission: Permission
): void {
  if (!userHasPermission(user, permission)) {
    throw new Error(`Permission denied: ${permission}`)
  }
}

/**
 * Require minimum role (throws error if not authorized)
 */
export function requireRole(
  user: JWTPayload | null,
  requiredRole: Role
): void {
  if (!user || !hasMinimumRole(user.role, requiredRole)) {
    throw new Error(`Role required: ${Role[requiredRole]}`)
  }
}

/**
 * Get user-friendly role name
 */
export function getRoleName(role: string): string {
  const roleNames: Record<string, string> = {
    viewer: 'Viewer',
    moderator: 'Moderator',
    admin: 'Admin',
    super_admin: 'Super Admin',
  }
  return roleNames[role] || role
}

/**
 * Get role description
 */
export function getRoleDescription(role: string): string {
  const descriptions: Record<string, string> = {
    viewer: 'Read-only access to all content',
    moderator: 'Can manage contact messages and tasks',
    admin: 'Full access except user management',
    super_admin: 'Complete access to all features',
  }
  return descriptions[role] || ''
}

/**
 * Get all available roles
 */
export function getAllRoles(): Array<{
  value: string
  label: string
  description: string
  level: number
}> {
  return [
    {
      value: 'viewer',
      label: 'Viewer',
      description: getRoleDescription('viewer'),
      level: Role.VIEWER,
    },
    {
      value: 'moderator',
      label: 'Moderator',
      description: getRoleDescription('moderator'),
      level: Role.MODERATOR,
    },
    {
      value: 'admin',
      label: 'Admin',
      description: getRoleDescription('admin'),
      level: Role.ADMIN,
    },
    {
      value: 'super_admin',
      label: 'Super Admin',
      description: getRoleDescription('super_admin'),
      level: Role.SUPER_ADMIN,
    },
  ]
}

/**
 * Check if user can access a specific admin tab
 */
export function canAccessTab(
  user: JWTPayload | null,
  tab: string
): boolean {
  if (!user) return false

  switch (tab) {
    case 'overview':
      return hasMinimumRole(user.role, Role.VIEWER)
    case 'messages':
      return userHasPermission(user, Permission.VIEW_MESSAGES)
    case 'users':
      return userHasPermission(user, Permission.VIEW_USERS)
    case 'files':
      return userHasPermission(user, Permission.VIEW_FILES)
    case 'tasks':
      return userHasPermission(user, Permission.VIEW_TASKS)
    case 'meetings':
      return userHasPermission(user, Permission.VIEW_MEETINGS)
    case 'activity':
      return userHasPermission(user, Permission.VIEW_ACTIVITY_LOGS)
    default:
      return false
  }
}

