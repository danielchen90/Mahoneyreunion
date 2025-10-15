"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Mail,
  Search,
  Filter,
  RefreshCw,
  Archive,
  Trash2,
  Eye,
  EyeOff,
  Phone,
  Calendar,
  User,
  MessageSquare,
} from "lucide-react"
import { format } from "date-fns"

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'unread' | 'read'
  archived: boolean
  created_at: string
  updated_at: string
}

export default function AdminContactMessages() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [showArchived, setShowArchived] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null)

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }
      
      params.append('archived', showArchived.toString())
      
      if (searchQuery) {
        params.append('search', searchQuery)
      }

      const response = await fetch(`/api/contact/list?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setSubmissions(data.submissions)
        setFilteredSubmissions(data.submissions)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error("Error fetching submissions:", error)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchSubmissions()
  }, [statusFilter, showArchived])

  // Search filter
  useEffect(() => {
    if (searchQuery) {
      const filtered = submissions.filter(
        (sub) =>
          sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredSubmissions(filtered)
    } else {
      setFilteredSubmissions(submissions)
    }
  }, [searchQuery, submissions])

  // Mark as read/unread
  const toggleReadStatus = async (id: string, currentStatus: 'unread' | 'read') => {
    try {
      const newStatus = currentStatus === 'read' ? 'unread' : 'read'
      const response = await fetch('/api/contact/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })

      if (response.ok) {
        fetchSubmissions()
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  // Archive/unarchive
  const toggleArchived = async (id: string, currentArchived: boolean) => {
    try {
      const response = await fetch('/api/contact/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, archived: !currentArchived }),
      })

      if (response.ok) {
        fetchSubmissions()
      }
    } catch (error) {
      console.error("Error updating archived status:", error)
    }
  }

  // Delete submission
  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch('/api/contact/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        fetchSubmissions()
        if (selectedMessage?.id === id) {
          setSelectedMessage(null)
        }
      }
    } catch (error) {
      console.error("Error deleting submission:", error)
    }
  }

  // View message details
  const viewMessage = async (submission: ContactSubmission) => {
    setSelectedMessage(submission)
    
    // Mark as read if unread
    if (submission.status === 'unread') {
      await toggleReadStatus(submission.id, 'unread')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">Contact Messages</h2>
          <p className="text-white/70 text-sm drop-shadow-md">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}` : 'All messages read'}
          </p>
        </div>
        <Button
          onClick={fetchSubmissions}
          variant="outline"
          size="sm"
          className="bg-white/10 hover:bg-white/20 text-white border-white/30"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white/10 backdrop-blur-md border border-white/30">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <Input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <Button
              onClick={() => setStatusFilter('all')}
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              className={statusFilter === 'all' ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-white/10 hover:bg-white/20 text-white border-white/30'}
            >
              All
            </Button>
            <Button
              onClick={() => setStatusFilter('unread')}
              variant={statusFilter === 'unread' ? 'default' : 'outline'}
              size="sm"
              className={statusFilter === 'unread' ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-white/10 hover:bg-white/20 text-white border-white/30'}
            >
              Unread
            </Button>
            <Button
              onClick={() => setStatusFilter('read')}
              variant={statusFilter === 'read' ? 'default' : 'outline'}
              size="sm"
              className={statusFilter === 'read' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-white/10 hover:bg-white/20 text-white border-white/30'}
            >
              Read
            </Button>
          </div>

          {/* Show Archived */}
          <Button
            onClick={() => setShowArchived(!showArchived)}
            variant="outline"
            size="sm"
            className={showArchived ? 'bg-purple-500/20 border-purple-400/50 text-white' : 'bg-white/10 hover:bg-white/20 text-white border-white/30'}
          >
            <Archive className="w-4 h-4 mr-2" />
            {showArchived ? 'Hide Archived' : 'Show Archived'}
          </Button>
        </div>
      </Card>

      {/* Messages List */}
      {loading ? (
        <Card className="p-8 bg-white/10 backdrop-blur-md border border-white/30 text-center">
          <div className="text-white/70">Loading messages...</div>
        </Card>
      ) : filteredSubmissions.length === 0 ? (
        <Card className="p-8 bg-white/10 backdrop-blur-md border border-white/30 text-center">
          <Mail className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <div className="text-white/70">No messages found</div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredSubmissions.map((submission) => (
            <Card
              key={submission.id}
              className={`p-4 backdrop-blur-md border transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                submission.status === 'unread'
                  ? 'bg-orange-500/10 border-orange-400/50'
                  : 'bg-white/10 border-white/30'
              }`}
              onClick={() => viewMessage(submission)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {submission.status === 'unread' && (
                      <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                    )}
                    <h3 className="text-lg font-semibold text-white truncate drop-shadow-lg">
                      {submission.subject}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/70 mb-2">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{submission.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{submission.email}</span>
                    </div>
                    {submission.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{submission.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(submission.created_at), 'MMM d, yyyy h:mm a')}</span>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm line-clamp-2">{submission.message}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleReadStatus(submission.id, submission.status)
                    }}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                    title={submission.status === 'read' ? 'Mark as unread' : 'Mark as read'}
                  >
                    {submission.status === 'read' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleArchived(submission.id, submission.archived)
                    }}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                    title={submission.archived ? 'Unarchive' : 'Archive'}
                  >
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSubmission(submission.id)
                    }}
                    variant="outline"
                    size="sm"
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-400/50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <Card
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-md border border-white/30 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">{selectedMessage.subject}</h3>
              <Button
                onClick={() => setSelectedMessage(null)}
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30"
              >
                Close
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-white/50 text-sm mb-1">From</div>
                  <div className="text-white font-semibold">{selectedMessage.name}</div>
                </div>
                <div>
                  <div className="text-white/50 text-sm mb-1">Email</div>
                  <a href={`mailto:${selectedMessage.email}`} className="text-cyan-300 hover:text-cyan-200">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <div className="text-white/50 text-sm mb-1">Phone</div>
                    <a href={`tel:${selectedMessage.phone}`} className="text-cyan-300 hover:text-cyan-200">
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
                <div>
                  <div className="text-white/50 text-sm mb-1">Received</div>
                  <div className="text-white">{format(new Date(selectedMessage.created_at), 'PPpp')}</div>
                </div>
              </div>

              <div>
                <div className="text-white/50 text-sm mb-2">Message</div>
                <div className="bg-white/5 border border-white/20 rounded-lg p-4 text-white whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-white/20">
                <Button
                  onClick={() => toggleReadStatus(selectedMessage.id, selectedMessage.status)}
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                >
                  {selectedMessage.status === 'read' ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  Mark as {selectedMessage.status === 'read' ? 'Unread' : 'Read'}
                </Button>
                <Button
                  onClick={() => toggleArchived(selectedMessage.id, selectedMessage.archived)}
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  {selectedMessage.archived ? 'Unarchive' : 'Archive'}
                </Button>
                <Button
                  onClick={() => deleteSubmission(selectedMessage.id)}
                  variant="outline"
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-400/50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

