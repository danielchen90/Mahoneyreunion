"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Calendar,
  Users,
  FileText,
  CheckSquare,
  Trash2,
  Edit,
} from "lucide-react"

interface MeetingNote {
  id: string
  title: string
  date: string
  attendees: string[]
  notes: string
  action_items?: string[]
  created_by: string
  created_at: string
  updated_at: string
}

export default function AdminMeetings() {
  const [meetings, setMeetings] = useState<MeetingNote[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingNote | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    attendees: [] as string[],
    attendeesInput: '',
    notes: '',
    action_items: [] as string[],
    actionItemInput: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch meetings on mount
  useEffect(() => {
    fetchMeetings()
  }, [])

  const fetchMeetings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/meetings')
      
      if (!response.ok) {
        throw new Error('Failed to fetch meetings')
      }

      const data = await response.json()
      setMeetings(data.meetings || [])
    } catch (err) {
      console.error('Error fetching meetings:', err)
      setError('Failed to load meetings')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMeeting = async () => {
    try {
      setError('')
      setSuccess('')

      const response = await fetch('/api/admin/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          date: formData.date,
          attendees: formData.attendees,
          notes: formData.notes,
          action_items: formData.action_items.length > 0 ? formData.action_items : undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create meeting')
      }

      setSuccess('Meeting created successfully!')
      setShowCreateDialog(false)
      resetForm()
      fetchMeetings()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleUpdateMeeting = async () => {
    if (!selectedMeeting) return

    try {
      setError('')
      setSuccess('')

      const response = await fetch(`/api/admin/meetings/${selectedMeeting.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          date: formData.date,
          attendees: formData.attendees,
          notes: formData.notes,
          action_items: formData.action_items.length > 0 ? formData.action_items : undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update meeting')
      }

      setSuccess('Meeting updated successfully!')
      setShowEditDialog(false)
      setSelectedMeeting(null)
      fetchMeetings()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDeleteMeeting = async (meetingId: string) => {
    if (!confirm('Are you sure you want to delete this meeting note?')) return

    try {
      setError('')
      setSuccess('')

      const response = await fetch(`/api/admin/meetings/${meetingId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete meeting')
      }

      setSuccess('Meeting deleted successfully!')
      fetchMeetings()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const openEditDialog = (meeting: MeetingNote) => {
    setSelectedMeeting(meeting)
    setFormData({
      title: meeting.title,
      date: meeting.date,
      attendees: meeting.attendees || [],
      attendeesInput: '',
      notes: meeting.notes,
      action_items: meeting.action_items || [],
      actionItemInput: '',
    })
    setShowEditDialog(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      attendees: [],
      attendeesInput: '',
      notes: '',
      action_items: [],
      actionItemInput: '',
    })
  }

  const addAttendee = () => {
    if (formData.attendeesInput.trim()) {
      setFormData({
        ...formData,
        attendees: [...formData.attendees, formData.attendeesInput.trim()],
        attendeesInput: '',
      })
    }
  }

  const removeAttendee = (index: number) => {
    setFormData({
      ...formData,
      attendees: formData.attendees.filter((_, i) => i !== index),
    })
  }

  const addActionItem = () => {
    if (formData.actionItemInput.trim()) {
      setFormData({
        ...formData,
        action_items: [...formData.action_items, formData.actionItemInput.trim()],
        actionItemInput: '',
      })
    }
  }

  const removeActionItem = (index: number) => {
    setFormData({
      ...formData,
      action_items: formData.action_items.filter((_, i) => i !== index),
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-lg">Loading meetings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">Meeting Notes</h2>
          <p className="text-white/70 drop-shadow-md">Track planning meetings and action items</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setShowCreateDialog(true)
          }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Meeting
        </Button>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <Card className="p-4 bg-red-500/20 border-red-500/50">
          <p className="text-red-200">{error}</p>
        </Card>
      )}
      {success && (
        <Card className="p-4 bg-green-500/20 border-green-500/50">
          <p className="text-green-200">{success}</p>
        </Card>
      )}

      {/* Meetings List */}
      <div className="grid gap-6">
        {meetings.length === 0 ? (
          <Card className="p-12 bg-white/5 border-white/20 border-dashed">
            <div className="text-center">
              <FileText className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/50 text-lg">No meeting notes yet</p>
              <p className="text-white/30 text-sm mt-2">Create your first meeting note to get started</p>
            </div>
          </Card>
        ) : (
          meetings.map(meeting => (
            <Card
              key={meeting.id}
              className="p-6 bg-white/10 backdrop-blur-md border-white/30 hover:bg-white/15 transition-all"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{meeting.title}</h3>
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="outline" className="border-white/30 text-white">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(meeting.date).toLocaleDateString()}
                      </Badge>
                      <Badge variant="outline" className="border-white/30 text-white">
                        <Users className="w-3 h-3 mr-1" />
                        {meeting.attendees.length} attendees
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(meeting)}
                      className="hover:bg-white/20"
                    >
                      <Edit className="w-4 h-4 text-white" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteMeeting(meeting.id)}
                      className="hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4 text-red-300" />
                    </Button>
                  </div>
                </div>

                {/* Attendees */}
                <div>
                  <h4 className="text-sm font-semibold text-white/80 mb-2">Attendees:</h4>
                  <div className="flex flex-wrap gap-2">
                    {meeting.attendees.map((attendee, index) => (
                      <Badge key={index} className="bg-blue-500/30 text-white">
                        {attendee}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h4 className="text-sm font-semibold text-white/80 mb-2">Notes:</h4>
                  <p className="text-white/70 whitespace-pre-wrap">{meeting.notes}</p>
                </div>

                {/* Action Items */}
                {meeting.action_items && meeting.action_items.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-white/80 mb-2">Action Items:</h4>
                    <ul className="space-y-2">
                      {meeting.action_items.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-white/70">
                          <CheckSquare className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Meeting Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-gray-900 border-white/30 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Meeting Note</DialogTitle>
            <DialogDescription className="text-white/70">
              Document a planning meeting with notes and action items
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="create-title">Meeting Title *</Label>
              <Input
                id="create-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Weekly Planning Meeting"
                className="bg-white/10 border-white/30 text-white"
              />
            </div>

            <div>
              <Label htmlFor="create-date">Meeting Date *</Label>
              <Input
                id="create-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-white/10 border-white/30 text-white"
              />
            </div>

            <div>
              <Label>Attendees *</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={formData.attendeesInput}
                  onChange={(e) => setFormData({ ...formData, attendeesInput: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
                  placeholder="Enter name and press Enter"
                  className="bg-white/10 border-white/30 text-white"
                />
                <Button type="button" onClick={addAttendee} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.attendees.map((attendee, index) => (
                  <Badge key={index} className="bg-blue-500/30 text-white">
                    {attendee}
                    <button
                      onClick={() => removeAttendee(index)}
                      className="ml-2 hover:text-red-300"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="create-notes">Meeting Notes *</Label>
              <Textarea
                id="create-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Enter meeting notes..."
                className="bg-white/10 border-white/30 text-white min-h-[150px]"
              />
            </div>

            <div>
              <Label>Action Items (Optional)</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={formData.actionItemInput}
                  onChange={(e) => setFormData({ ...formData, actionItemInput: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addActionItem())}
                  placeholder="Enter action item and press Enter"
                  className="bg-white/10 border-white/30 text-white"
                />
                <Button type="button" onClick={addActionItem} variant="outline">
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {formData.action_items.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-white/5 rounded">
                    <CheckSquare className="w-4 h-4 text-green-400 mt-0.5" />
                    <span className="flex-1 text-white/70">{item}</span>
                    <button
                      onClick={() => removeActionItem(index)}
                      className="text-red-300 hover:text-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateMeeting}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Create Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Meeting Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-gray-900 border-white/30 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Meeting Note</DialogTitle>
            <DialogDescription className="text-white/70">
              Update meeting details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Meeting Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-white/10 border-white/30 text-white"
              />
            </div>

            <div>
              <Label htmlFor="edit-date">Meeting Date *</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-white/10 border-white/30 text-white"
              />
            </div>

            <div>
              <Label>Attendees *</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={formData.attendeesInput}
                  onChange={(e) => setFormData({ ...formData, attendeesInput: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
                  placeholder="Enter name and press Enter"
                  className="bg-white/10 border-white/30 text-white"
                />
                <Button type="button" onClick={addAttendee} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.attendees.map((attendee, index) => (
                  <Badge key={index} className="bg-blue-500/30 text-white">
                    {attendee}
                    <button
                      onClick={() => removeAttendee(index)}
                      className="ml-2 hover:text-red-300"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="edit-notes">Meeting Notes *</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-white/10 border-white/30 text-white min-h-[150px]"
              />
            </div>

            <div>
              <Label>Action Items (Optional)</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={formData.actionItemInput}
                  onChange={(e) => setFormData({ ...formData, actionItemInput: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addActionItem())}
                  placeholder="Enter action item and press Enter"
                  className="bg-white/10 border-white/30 text-white"
                />
                <Button type="button" onClick={addActionItem} variant="outline">
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {formData.action_items.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-white/5 rounded">
                    <CheckSquare className="w-4 h-4 text-green-400 mt-0.5" />
                    <span className="flex-1 text-white/70">{item}</span>
                    <button
                      onClick={() => removeActionItem(index)}
                      className="text-red-300 hover:text-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateMeeting}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Update Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

