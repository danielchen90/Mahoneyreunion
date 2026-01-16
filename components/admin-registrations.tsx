"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Download,
  Eye,
} from "lucide-react"

interface Attendee {
  id: string
  full_name: string
  email?: string
  phone?: string
  age_group: string
  dietary_restrictions?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
}

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  created_at: string
}

interface Registration {
  id: string
  email: string
  phone?: string
  adults: number
  children: number
  total_amount: number
  currency: string
  payment_type: string
  payment_status: string
  special_requests?: string
  created_at: string
  attendees: Attendee[]
  payments: Payment[]
}

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)

  // Fetch registrations
  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/registrations/list')
      const data = await response.json()

      if (data.success) {
        setRegistrations(data.registrations)
      }
    } catch (error) {
      console.error("Error fetching registrations:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRegistrations()
  }, [])

  // Filter registrations by search query
  const filteredRegistrations = registrations.filter(reg =>
    reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.attendees.some(att => att.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Calculate stats
  const totalRegistrations = registrations.length
  const totalAttendees = registrations.reduce((sum, reg) => sum + reg.adults + reg.children, 0)
  const totalRevenue = registrations.reduce((sum, reg) => sum + reg.total_amount, 0)
  const completedPayments = registrations.filter(reg => reg.payment_status === 'completed').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">Registrations</h2>
          <p className="text-white/70 drop-shadow-md">View and manage family reunion registrations</p>
        </div>
        <Button
          onClick={fetchRegistrations}
          className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 hover:bg-cyan-500/30"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white/10 backdrop-blur-md border border-white/30">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-cyan-300" />
            <div>
              <p className="text-2xl font-bold text-white">{totalRegistrations}</p>
              <p className="text-sm text-white/70">Registrations</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/10 backdrop-blur-md border border-white/30">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-green-300" />
            <div>
              <p className="text-2xl font-bold text-white">{totalAttendees}</p>
              <p className="text-sm text-white/70">Total Attendees</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/10 backdrop-blur-md border border-white/30">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-yellow-300" />
            <div>
              <p className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-white/70">Total Revenue</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/10 backdrop-blur-md border border-white/30">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-green-300" />
            <div>
              <p className="text-2xl font-bold text-white">{completedPayments}</p>
              <p className="text-sm text-white/70">Completed</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 bg-white/10 backdrop-blur-md border border-white/30">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-white/50" />
          <input
            type="text"
            placeholder="Search by email or attendee name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/50"
          />
        </div>
      </Card>

      {/* Registrations List */}
      {loading ? (
        <Card className="p-8 bg-white/10 backdrop-blur-md border border-white/30 text-center">
          <div className="text-white/70">Loading registrations...</div>
        </Card>
      ) : filteredRegistrations.length === 0 ? (
        <Card className="p-8 bg-white/10 backdrop-blur-md border border-white/30 text-center">
          <Users className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <div className="text-white/70">No registrations found</div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRegistrations.map((registration) => (
            <Card
              key={registration.id}
              className="p-4 bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/15 transition-all cursor-pointer"
              onClick={() => setSelectedRegistration(registration)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {registration.attendees[0]?.full_name || 'Unknown'}
                    </h3>
                    <Badge className={
                      registration.payment_status === 'completed'
                        ? 'bg-green-500/20 text-green-300 border-green-400/50'
                        : 'bg-orange-500/20 text-orange-300 border-orange-400/50'
                    }>
                      {registration.payment_status === 'completed' ? (
                        <><CheckCircle2 className="w-3 h-3 mr-1" /> Paid</>
                      ) : (
                        <><XCircle className="w-3 h-3 mr-1" /> Pending</>
                      )}
                    </Badge>
                    <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/50">
                      {registration.payment_type === 'deposit' ? 'Deposit' : 'Full Payment'}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm text-white/70">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{registration.email}</span>
                    </div>
                    {registration.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{registration.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{registration.adults} adults, {registration.children} children</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-2 text-white/70">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold text-white">
                        {registration.currency} ${registration.total_amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(registration.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedRegistration(registration)
                  }}
                  className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 hover:bg-cyan-500/30"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Registration Details Modal */}
      {selectedRegistration && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedRegistration(null)}
        >
          <Card
            className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-md border border-white/30 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Registration Details</h2>
              <Button
                onClick={() => setSelectedRegistration(null)}
                className="bg-white/10 text-white border border-white/30 hover:bg-white/20"
              >
                Close
              </Button>
            </div>

            <div className="space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/50 text-sm">Email</p>
                    <p className="text-white">{selectedRegistration.email}</p>
                  </div>
                  {selectedRegistration.phone && (
                    <div>
                      <p className="text-white/50 text-sm">Phone</p>
                      <p className="text-white">{selectedRegistration.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Attendees */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Attendees ({selectedRegistration.attendees.length})</h3>
                <div className="space-y-3">
                  {selectedRegistration.attendees.map((attendee, index) => (
                    <Card key={attendee.id} className="p-4 bg-white/10 backdrop-blur-md border border-white/30">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-semibold text-white">{attendee.full_name}</p>
                            <Badge className={
                              attendee.age_group === 'adult'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-400/50'
                                : 'bg-green-500/20 text-green-300 border-green-400/50'
                            }>
                              {attendee.age_group}
                            </Badge>
                          </div>
                          <div className="grid md:grid-cols-2 gap-2 text-sm text-white/70">
                            {attendee.email && (
                              <div>
                                <span className="text-white/50">Email:</span> {attendee.email}
                              </div>
                            )}
                            {attendee.phone && (
                              <div>
                                <span className="text-white/50">Phone:</span> {attendee.phone}
                              </div>
                            )}
                            {attendee.dietary_restrictions && (
                              <div className="md:col-span-2">
                                <span className="text-white/50">Dietary:</span> {attendee.dietary_restrictions}
                              </div>
                            )}
                            {attendee.emergency_contact_name && (
                              <div>
                                <span className="text-white/50">Emergency Contact:</span> {attendee.emergency_contact_name}
                              </div>
                            )}
                            {attendee.emergency_contact_phone && (
                              <div>
                                <span className="text-white/50">Emergency Phone:</span> {attendee.emergency_contact_phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Payment Information</h3>
                <Card className="p-4 bg-white/10 backdrop-blur-md border border-white/30">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/50 text-sm">Amount</p>
                      <p className="text-white font-semibold">
                        {selectedRegistration.currency} ${selectedRegistration.total_amount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">Type</p>
                      <p className="text-white">
                        {selectedRegistration.payment_type === 'deposit' ? 'Deposit' : 'Full Payment'}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">Status</p>
                      <Badge className={
                        selectedRegistration.payment_status === 'completed'
                          ? 'bg-green-500/20 text-green-300 border-green-400/50'
                          : 'bg-orange-500/20 text-orange-300 border-orange-400/50'
                      }>
                        {selectedRegistration.payment_status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">Date</p>
                      <p className="text-white">
                        {new Date(selectedRegistration.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Special Requests */}
              {selectedRegistration.special_requests && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Special Requests</h3>
                  <Card className="p-4 bg-white/10 backdrop-blur-md border border-white/30">
                    <p className="text-white">{selectedRegistration.special_requests}</p>
                  </Card>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

