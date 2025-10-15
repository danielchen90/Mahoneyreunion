import { NextRequest, NextResponse } from "next/server"
import { contactSubmissionsDB } from "@/lib/database"

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, archived } = body

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: "Missing submission ID" },
        { status: 400 }
      )
    }

    // Update status if provided
    if (status !== undefined) {
      if (status !== 'read' && status !== 'unread') {
        return NextResponse.json(
          { error: "Invalid status value" },
          { status: 400 }
        )
      }

      const { data, error } = await contactSubmissionsDB.updateStatus(id, status)

      if (error) {
        console.error("Error updating status:", error)
        return NextResponse.json(
          { error: "Failed to update status" },
          { status: 500 }
        )
      }

      return NextResponse.json(
        {
          success: true,
          message: "Status updated successfully",
          submission: data,
        },
        { status: 200 }
      )
    }

    // Update archived status if provided
    if (archived !== undefined) {
      const { data, error } = await contactSubmissionsDB.updateArchived(id, archived)

      if (error) {
        console.error("Error updating archived status:", error)
        return NextResponse.json(
          { error: "Failed to update archived status" },
          { status: 500 }
        )
      }

      return NextResponse.json(
        {
          success: true,
          message: "Archived status updated successfully",
          submission: data,
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { error: "No update fields provided" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error in update endpoint:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

