import { NextRequest, NextResponse } from "next/server"
import { contactSubmissionsDB } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') as 'unread' | 'read' | null
    const archived = searchParams.get('archived')
    const search = searchParams.get('search')

    // Build filters object
    const filters: any = {}
    
    if (status) {
      filters.status = status
    }
    
    if (archived !== null) {
      filters.archived = archived === 'true'
    }
    
    if (search) {
      filters.search = search
    }

    // Get submissions from database
    const { data: submissions, error } = await contactSubmissionsDB.getAll(filters)

    if (error) {
      console.error("Error fetching submissions:", error)
      return NextResponse.json(
        { error: "Failed to fetch submissions" },
        { status: 500 }
      )
    }

    // Get unread count
    const { count: unreadCount } = await contactSubmissionsDB.getUnreadCount()

    return NextResponse.json(
      {
        success: true,
        submissions: submissions || [],
        unreadCount,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in list endpoint:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

