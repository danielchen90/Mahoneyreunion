/**
 * Page Visibility Management System
 * Controls which pages are visible in navigation and accessible to users
 */

export interface PageConfig {
  id: string
  name: string
  path: string
  description: string
  isVisible: boolean
  alwaysVisible?: boolean // Pages that cannot be hidden (e.g., homepage)
}

export const DEFAULT_PAGE_VISIBILITY: PageConfig[] = [
  {
    id: 'home',
    name: 'Home',
    path: '/',
    description: 'Homepage with reunion overview',
    isVisible: true,
    alwaysVisible: true, // Homepage always visible
  },
  {
    id: 'about',
    name: 'About',
    path: '/about',
    description: 'About the reunion and resort information',
    isVisible: true,
  },
  {
    id: 'schedule',
    name: 'Schedule',
    path: '/schedule',
    description: 'Event schedule and itinerary',
    isVisible: false, // HIDDEN - Coming Soon page
  },
  {
    id: 'travel',
    name: 'Travel',
    path: '/travel',
    description: 'Travel information and directions',
    isVisible: true,
  },
  {
    id: 'budget',
    name: 'Budget',
    path: '/budget',
    description: 'Budget calculator and cost estimates',
    isVisible: true,
  },
  {
    id: 'register',
    name: 'Register',
    path: '/register',
    description: 'Registration form and payment options',
    isVisible: false, // HIDDEN - Most important to hide
  },
  {
    id: 'faq',
    name: 'FAQ',
    path: '/faq',
    description: 'Frequently asked questions',
    isVisible: true, // VISIBLE - Helpful for information session
  },
  {
    id: 'contact',
    name: 'Contact',
    path: '/contact',
    description: 'Contact information and travel details',
    isVisible: true, // VISIBLE - Important for inquiries
  },
  {
    id: 'family-tree',
    name: 'Family Tree',
    path: '/family-tree',
    description: 'Mahoney family tree and history',
    isVisible: true, // VISIBLE - Good for family engagement
  },
]

const STORAGE_KEY = 'mahoney-reunion-page-visibility'

/**
 * Get page visibility configuration from localStorage
 */
export function getPageVisibility(): PageConfig[] {
  if (typeof window === 'undefined') {
    return DEFAULT_PAGE_VISIBILITY
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as PageConfig[]
      // Merge with defaults to ensure all pages are present
      return DEFAULT_PAGE_VISIBILITY.map(defaultPage => {
        const storedPage = parsed.find(p => p.id === defaultPage.id)
        return storedPage ? { ...defaultPage, isVisible: storedPage.isVisible } : defaultPage
      })
    }
  } catch (error) {
    console.error('Error loading page visibility:', error)
  }

  return DEFAULT_PAGE_VISIBILITY
}

/**
 * Save page visibility configuration to localStorage
 */
export function savePageVisibility(pages: PageConfig[]): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages))
  } catch (error) {
    console.error('Error saving page visibility:', error)
  }
}

/**
 * Check if a specific page is visible
 */
export function isPageVisible(pageId: string): boolean {
  const pages = getPageVisibility()
  const page = pages.find(p => p.id === pageId)
  return page?.isVisible ?? false
}

/**
 * Toggle visibility of a specific page
 */
export function togglePageVisibility(pageId: string): PageConfig[] {
  const pages = getPageVisibility()
  const updatedPages = pages.map(page => {
    if (page.id === pageId && !page.alwaysVisible) {
      return { ...page, isVisible: !page.isVisible }
    }
    return page
  })
  savePageVisibility(updatedPages)
  return updatedPages
}

/**
 * Get only visible pages for navigation
 */
export function getVisiblePages(): PageConfig[] {
  return getPageVisibility().filter(page => page.isVisible)
}

/**
 * Reset to default visibility settings
 */
export function resetPageVisibility(): PageConfig[] {
  savePageVisibility(DEFAULT_PAGE_VISIBILITY)
  return DEFAULT_PAGE_VISIBILITY
}

