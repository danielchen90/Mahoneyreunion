import { NextRequest, NextResponse } from "next/server"
import { contactSubmissionsDB } from "@/lib/database"
// Email notifications temporarily disabled for initial deployment
// import { sendContactFormNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    const timestamp = new Date().toISOString()

    // Save to Supabase database
    const { data: submission, error: dbError } = await contactSubmissionsDB.create({
      name,
      email,
      phone: phone || undefined,
      subject,
      message,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      // Continue even if database fails - don't block the user
    }

    // Log the submission (for debugging)
    console.log("Contact form submission:", {
      name,
      email,
      phone: phone || "Not provided",
      subject,
      message,
      timestamp,
      submissionId: submission?.id || "N/A",
    })

    // Email notifications temporarily disabled for initial deployment
    // TODO: Re-enable once RESEND_API_KEY is configured in Vercel
    // sendContactFormNotification({
    //   name,
    //   email,
    //   phone,
    //   subject,
    //   message,
    //   timestamp,
    //   submissionId: submission?.id,
    // }).catch((error) => {
    //   console.error("Error sending email notification:", error)
    //   // Don't fail the request if email fails
    // })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Message received successfully",
        submissionId: submission?.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

