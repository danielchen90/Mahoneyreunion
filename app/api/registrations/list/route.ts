import { NextRequest, NextResponse } from 'next/server'
import { registrationsDB, attendeesDB, paymentsDB } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get all registrations
    const { data: registrations, error: regError } = await registrationsDB.getAll()

    if (regError) {
      console.error('Error fetching registrations:', regError)
      return NextResponse.json(
        { error: 'Failed to fetch registrations' },
        { status: 500 }
      )
    }

    // For each registration, get attendees and payments
    const registrationsWithDetails = await Promise.all(
      (registrations || []).map(async (registration) => {
        const { data: attendees } = await attendeesDB.getByRegistrationId(registration.id)
        const { data: payments } = await paymentsDB.getByRegistrationId(registration.id)

        return {
          ...registration,
          attendees: attendees || [],
          payments: payments || [],
        }
      })
    )

    return NextResponse.json({
      success: true,
      registrations: registrationsWithDetails,
      total: registrationsWithDetails.length,
    })

  } catch (error) {
    console.error('Error in registrations list:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

