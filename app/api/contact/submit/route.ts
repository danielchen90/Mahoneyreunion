import { NextRequest, NextResponse } from "next/server"

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

    // TODO: Phase 2 - Save to Supabase database
    // TODO: Phase 2 - Send email notification to admin
    
    // For now, just log the submission
    console.log("Contact form submission:", {
      name,
      email,
      phone: phone || "Not provided",
      subject,
      message,
      timestamp: new Date().toISOString()
    })

    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: "Message received successfully" 
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

