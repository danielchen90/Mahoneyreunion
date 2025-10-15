"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { logout, getSessionTimeRemaining } from "@/lib/admin-auth"
import {
  getPageVisibility,
  togglePageVisibility,
  resetPageVisibility,
  type PageConfig
} from "@/lib/page-visibility"
import {
  Settings,
  LogOut,
  Eye,
  EyeOff,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  Mail,
  LayoutDashboard,
  Users,
  CheckSquare,
  FileText,
  FolderOpen
} from "lucide-react"
import AdminContactMessages from "@/components/admin-contact-messages"
import AdminUsers from "@/components/admin-users"
import AdminTasks from "@/components/admin-tasks"
import AdminMeetings from "@/components/admin-meetings"
import AdminFiles from "@/components/admin-files"

interface AdminDashboardProps {
  onLogout: () => void
}

type TabType = 'overview' | 'messages' | 'users' | 'tasks' | 'meetings' | 'files'

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [pages, setPages] = useState<PageConfig[]>([])
  const [sessionTime, setSessionTime] = useState(0)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  useEffect(() => {
    // Load page visibility on mount
    setPages(getPageVisibility())

    // Update session time every minute
    const updateSessionTime = () => {
      setSessionTime(getSessionTimeRemaining())
    }
    updateSessionTime()
    const interval = setInterval(updateSessionTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const handleToggle = (pageId: string) => {
    const updatedPages = togglePageVisibility(pageId)
    setPages(updatedPages)
    
    // Trigger a custom event to notify Navigation component
    window.dispatchEvent(new Event('pageVisibilityChanged'))
  }

  const handleReset = () => {
    const resetPages = resetPageVisibility()
    setPages(resetPages)
    setShowResetConfirm(false)
    
    // Trigger a custom event to notify Navigation component
    window.dispatchEvent(new Event('pageVisibilityChanged'))
  }

  const handleLogout = () => {
    logout()
    onLogout()
  }

  const visibleCount = pages.filter(p => p.isVisible).length
  const hiddenCount = pages.filter(p => !p.isVisible).length

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/30 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-sm rounded-lg border border-blue-400/40">
                  <Settings className="w-6 h-6 text-cyan-300 drop-shadow-lg" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                    Admin Dashboard
                  </h1>
                  <p className="text-white/80 drop-shadow-md text-sm">
                    Manage your reunion website
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Session Time */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg">
                <Clock className="w-4 h-4 text-cyan-300" />
                <span className="text-sm text-white/90 drop-shadow-md">
                  {sessionTime}m left
                </span>
              </div>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-red-500/20 hover:bg-red-500/30 border-red-400/40 text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <Card className="p-2 bg-white/10 backdrop-blur-md border border-white/30 shadow-xl">
          <div className="flex gap-2">
            <Button
              onClick={() => setActiveTab('overview')}
              variant={activeTab === 'overview' ? 'default' : 'ghost'}
              className={activeTab === 'overview'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
              }
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button
              onClick={() => setActiveTab('messages')}
              variant={activeTab === 'messages' ? 'default' : 'ghost'}
              className={activeTab === 'messages'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
              }
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Messages
            </Button>
            <Button
              onClick={() => setActiveTab('users')}
              variant={activeTab === 'users' ? 'default' : 'ghost'}
              className={activeTab === 'users'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
              }
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </Button>
            <Button
              onClick={() => setActiveTab('tasks')}
              variant={activeTab === 'tasks' ? 'default' : 'ghost'}
              className={activeTab === 'tasks'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
              }
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              Tasks
            </Button>
            <Button
              onClick={() => setActiveTab('meetings')}
              variant={activeTab === 'meetings' ? 'default' : 'ghost'}
              className={activeTab === 'meetings'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
              }
            >
              <FileText className="w-4 h-4 mr-2" />
              Meetings
            </Button>
            <Button
              onClick={() => setActiveTab('files')}
              variant={activeTab === 'files' ? 'default' : 'ghost'}
              className={activeTab === 'files'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
              }
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Files
            </Button>
          </div>
        </Card>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/30 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500/30 backdrop-blur-sm rounded-lg border border-green-400/40">
                  <Eye className="w-6 h-6 text-green-300 drop-shadow-lg" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white drop-shadow-lg">{visibleCount}</p>
                  <p className="text-sm text-white/80 drop-shadow-md">Visible Pages</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/30 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-500/30 backdrop-blur-sm rounded-lg border border-orange-400/40">
                  <EyeOff className="w-6 h-6 text-orange-300 drop-shadow-lg" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white drop-shadow-lg">{hiddenCount}</p>
                  <p className="text-sm text-white/80 drop-shadow-md">Hidden Pages</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/30 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500/30 backdrop-blur-sm rounded-lg border border-blue-400/40">
                  <Shield className="w-6 h-6 text-cyan-300 drop-shadow-lg" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white drop-shadow-lg">{pages.length}</p>
                  <p className="text-sm text-white/80 drop-shadow-md">Total Pages</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Page Visibility Controls */}
          <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/30 shadow-xl mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">
            Page Visibility Controls
          </h2>
          <Button
            onClick={() => setShowResetConfirm(true)}
            variant="outline"
            size="sm"
            className="bg-white/10 hover:bg-white/20 border-white/30 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>

        <div className="space-y-3">
          {pages.map((page) => (
            <div
              key={page.id}
              className={`p-4 rounded-lg border transition-all ${
                page.isVisible
                  ? 'bg-green-500/10 border-green-400/30'
                  : 'bg-orange-500/10 border-orange-400/30'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  {/* Status Icon */}
                  {page.isVisible ? (
                    <CheckCircle2 className="w-6 h-6 text-green-300 drop-shadow-lg flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-orange-300 drop-shadow-lg flex-shrink-0" />
                  )}

                  {/* Page Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-white drop-shadow-md">
                        {page.name}
                      </h3>
                      <Badge
                        variant={page.isVisible ? "default" : "secondary"}
                        className={`${
                          page.isVisible
                            ? 'bg-green-500/30 text-green-200 border-green-400/40'
                            : 'bg-orange-500/30 text-orange-200 border-orange-400/40'
                        }`}
                      >
                        {page.isVisible ? 'Visible' : 'Hidden'}
                      </Badge>
                      {page.alwaysVisible && (
                        <Badge className="bg-blue-500/30 text-blue-200 border-blue-400/40">
                          Always Visible
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-white/70 drop-shadow-sm">
                      {page.description}
                    </p>
                    <p className="text-xs text-white/50 drop-shadow-sm mt-1">
                      Path: {page.path}
                    </p>
                  </div>
                </div>

                {/* Toggle Button */}
                <Button
                  onClick={() => handleToggle(page.id)}
                  disabled={page.alwaysVisible}
                  className={`${
                    page.isVisible
                      ? 'bg-orange-500/30 hover:bg-orange-500/40 border-orange-400/40'
                      : 'bg-green-500/30 hover:bg-green-500/40 border-green-400/40'
                  } text-white border-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {page.isVisible ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Show
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
        </>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <AdminContactMessages />
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <AdminUsers />
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <AdminTasks />
      )}

      {/* Meetings Tab */}
      {activeTab === 'meetings' && (
        <AdminMeetings />
      )}

      {/* Files Tab */}
      {activeTab === 'files' && (
        <AdminFiles />
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="max-w-md w-full p-6 bg-white/10 backdrop-blur-md border border-white/30 shadow-2xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-500/30 backdrop-blur-sm rounded-lg border border-orange-400/40 flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-orange-300 drop-shadow-lg" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
                  Reset to Default Settings?
                </h3>
                <p className="text-white/80 drop-shadow-md text-sm">
                  This will restore all pages to their default visibility settings. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowResetConfirm(false)}
                variant="outline"
                className="flex-1 bg-white/10 hover:bg-white/20 border-white/30 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReset}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-2 border-orange-400/50"
              >
                Reset Settings
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

