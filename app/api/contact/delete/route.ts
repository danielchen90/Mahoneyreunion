import { NextRequest, NextResponse } from "next/server"
import { contactSubmissionsDB } from "@/lib/database"

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: "Missing submission ID" },
        { status: 400 }
      )
    }

    // Delete submission from database
    const { error } = await contactSubmissionsDB.delete(id)

    if (error) {
      console.error("Error deleting submission:", error)
      return NextResponse.json(
        { error: "Failed to delete submission" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Submission deleted successfully",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in delete endpoint:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

