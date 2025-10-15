"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  Folder,
  File as FileIcon,
  Image as ImageIcon,
  FileText,
  Video,
  FolderPlus,
  Trash2,
  Edit,
  Download,
  Eye,
  Grid3x3,
  List,
  ChevronRight,
  Home,
} from "lucide-react"

interface Folder {
  id: string
  name: string
  parent_id?: string
  created_by: string
  created_at: string
  updated_at: string
}

interface File {
  id: string
  name: string
  file_url: string
  file_type: string
  file_size: number
  folder_id?: string
  cloudinary_public_id: string
  uploaded_by: string
  created_at: string
  updated_at: string
}

export default function AdminFiles() {
  const [files, setFiles] = useState<File[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Dialogs
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  
  // Selected items
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null)
  const [itemToDelete, setItemToDelete] = useState<{ type: 'file' | 'folder'; id: string; name: string } | null>(null)
  
  // Form data
  const [folderName, setFolderName] = useState('')
  const [renameName, setRenameName] = useState('')
  const [uploadingFile, setUploadingFile] = useState<File | null>(null)
  
  // Messages
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploading, setUploading] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch data on mount and when folder changes
  useEffect(() => {
    fetchData()
  }, [currentFolderId])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch files
      const filesUrl = currentFolderId 
        ? `/api/admin/files?folder_id=${currentFolderId}`
        : '/api/admin/files'
      const filesResponse = await fetch(filesUrl)
      
      if (filesResponse.ok) {
        const filesData = await filesResponse.json()
        setFiles(filesData.files || [])
      }

      // Fetch folders
      const foldersUrl = currentFolderId
        ? `/api/admin/folders?parent_id=${currentFolderId}`
        : '/api/admin/folders'
      const foldersResponse = await fetch(foldersUrl)
      
      if (foldersResponse.ok) {
        const foldersData = await foldersResponse.json()
        setFolders(foldersData.folders || [])
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load files and folders')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadingFile(file)
      setShowUploadDialog(true)
    }
  }

  const handleUpload = async () => {
    if (!uploadingFile) return

    try {
      setUploading(true)
      setError('')
      setSuccess('')

      const formData = new FormData()
      formData.append('file', uploadingFile)
      if (currentFolderId) {
        formData.append('folder_id', currentFolderId)
      }

      const response = await fetch('/api/admin/files/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to upload file')
      }

      setSuccess('File uploaded successfully!')
      setShowUploadDialog(false)
      setUploadingFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      fetchData()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleCreateFolder = async () => {
    try {
      setError('')
      setSuccess('')

      const response = await fetch('/api/admin/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: folderName,
          parent_id: currentFolderId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create folder')
      }

      setSuccess('Folder created successfully!')
      setShowCreateFolderDialog(false)
      setFolderName('')
      fetchData()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleRename = async () => {
    if (!selectedFile && !selectedFolder) return

    try {
      setError('')
      setSuccess('')

      const endpoint = selectedFile
        ? `/api/admin/files/${selectedFile.id}`
        : `/api/admin/folders/${selectedFolder!.id}`

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: renameName }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to rename')
      }

      setSuccess('Renamed successfully!')
      setShowRenameDialog(false)
      setSelectedFile(null)
      setSelectedFolder(null)
      setRenameName('')
      fetchData()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDelete = async () => {
    if (!itemToDelete) return

    try {
      setError('')
      setSuccess('')

      const endpoint = itemToDelete.type === 'file'
        ? `/api/admin/files/${itemToDelete.id}`
        : `/api/admin/folders/${itemToDelete.id}`

      const response = await fetch(endpoint, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete')
      }

      setSuccess(`${itemToDelete.type === 'file' ? 'File' : 'Folder'} deleted successfully!`)
      setShowDeleteDialog(false)
      setItemToDelete(null)
      fetchData()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const openRenameDialog = (item: File | Folder, type: 'file' | 'folder') => {
    if (type === 'file') {
      setSelectedFile(item as File)
      setSelectedFolder(null)
    } else {
      setSelectedFolder(item as Folder)
      setSelectedFile(null)
    }
    setRenameName(item.name)
    setShowRenameDialog(true)
  }

  const openDeleteDialog = (id: string, name: string, type: 'file' | 'folder') => {
    setItemToDelete({ type, id, name })
    setShowDeleteDialog(true)
  }

  const openPreview = (file: File) => {
    setSelectedFile(file)
    setShowPreviewDialog(true)
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="w-8 h-8" />
    if (fileType.startsWith('video/')) return <Video className="w-8 h-8" />
    if (fileType.includes('pdf') || fileType.includes('document')) return <FileText className="w-8 h-8" />
    return <FileIcon className="w-8 h-8" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-lg">Loading files...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">File Management</h2>
          <p className="text-white/70 drop-shadow-md">Upload and organize reunion documents</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowCreateFolderDialog(true)}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Messages */}
      {error && (
        <Card className="bg-red-500/20 border-red-500/50 p-4">
          <p className="text-red-200">{error}</p>
        </Card>
      )}
      {success && (
        <Card className="bg-green-500/20 border-green-500/50 p-4">
          <p className="text-green-200">{success}</p>
        </Card>
      )}

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-white/70">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentFolderId(null)}
          className="hover:text-white"
        >
          <Home className="w-4 h-4 mr-1" />
          Root
        </Button>
        {currentFolderId && <ChevronRight className="w-4 h-4" />}
      </div>

      {/* View Toggle */}
      <div className="flex justify-end gap-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('grid')}
          className={viewMode === 'grid' ? 'bg-white/20' : 'text-white/70'}
        >
          <Grid3x3 className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('list')}
          className={viewMode === 'list' ? 'bg-white/20' : 'text-white/70'}
        >
          <List className="w-4 h-4" />
        </Button>
      </div>

      {/* Files and Folders Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Folders */}
          {folders.map((folder) => (
            <Card
              key={folder.id}
              className="bg-white/10 backdrop-blur-md border-white/30 p-4 hover:bg-white/20 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  className="flex items-center gap-3 flex-1"
                  onClick={() => setCurrentFolderId(folder.id)}
                >
                  <Folder className="w-8 h-8 text-yellow-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{folder.name}</p>
                    <p className="text-white/50 text-xs">
                      {new Date(folder.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      openRenameDialog(folder, 'folder')
                    }}
                    className="h-8 w-8 p-0 hover:bg-white/20"
                  >
                    <Edit className="w-4 h-4 text-white/70" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      openDeleteDialog(folder.id, folder.name, 'folder')
                    }}
                    className="h-8 w-8 p-0 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4 text-red-300" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {/* Files */}
          {files.map((file) => (
            <Card
              key={file.id}
              className="bg-white/10 backdrop-blur-md border-white/30 p-4 hover:bg-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-blue-400">
                    {getFileIcon(file.file_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{file.name}</p>
                    <p className="text-white/50 text-xs">{formatFileSize(file.file_size)}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {file.file_type.startsWith('image/') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openPreview(file)}
                      className="h-8 w-8 p-0 hover:bg-white/20"
                    >
                      <Eye className="w-4 h-4 text-white/70" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(file.file_url, '_blank')}
                    className="h-8 w-8 p-0 hover:bg-white/20"
                  >
                    <Download className="w-4 h-4 text-white/70" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openRenameDialog(file, 'file')}
                    className="h-8 w-8 p-0 hover:bg-white/20"
                  >
                    <Edit className="w-4 h-4 text-white/70" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteDialog(file.id, file.name, 'file')}
                    className="h-8 w-8 p-0 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4 text-red-300" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <Card className="bg-white/10 backdrop-blur-md border-white/30">
          <div className="divide-y divide-white/10">
            {/* Folders */}
            {folders.map((folder) => (
              <div
                key={folder.id}
                className="p-4 hover:bg-white/10 transition-all flex items-center justify-between"
              >
                <div
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => setCurrentFolderId(folder.id)}
                >
                  <Folder className="w-6 h-6 text-yellow-400" />
                  <div className="flex-1">
                    <p className="text-white font-medium">{folder.name}</p>
                    <p className="text-white/50 text-sm">
                      Created {new Date(folder.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className="bg-yellow-500/30 text-yellow-200">Folder</Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openRenameDialog(folder, 'folder')}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteDialog(folder.id, folder.name, 'folder')}
                  >
                    <Trash2 className="w-4 h-4 text-red-300" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Files */}
            {files.map((file) => (
              <div
                key={file.id}
                className="p-4 hover:bg-white/10 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-blue-400">
                    {getFileIcon(file.file_type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-white/50 text-sm">
                      {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className="bg-blue-500/30 text-blue-200">File</Badge>
                </div>
                <div className="flex gap-2">
                  {file.file_type.startsWith('image/') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openPreview(file)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(file.file_url, '_blank')}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openRenameDialog(file, 'file')}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteDialog(file.id, file.name, 'file')}
                  >
                    <Trash2 className="w-4 h-4 text-red-300" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Empty State */}
      {folders.length === 0 && files.length === 0 && (
        <Card className="bg-white/10 backdrop-blur-md border-white/30 p-12 text-center">
          <Upload className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <p className="text-white/70 text-lg mb-2">No files or folders yet</p>
          <p className="text-white/50 text-sm">Upload your first file or create a folder to get started</p>
        </Card>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="bg-gray-900 border-white/30 text-white">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription className="text-white/70">
              Upload a file to {currentFolderId ? 'this folder' : 'the root directory'}
            </DialogDescription>
          </DialogHeader>

          {uploadingFile && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded">
                <div className="text-blue-400">
                  {getFileIcon(uploadingFile.type)}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{uploadingFile.name}</p>
                  <p className="text-white/50 text-sm">{formatFileSize(uploadingFile.size)}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowUploadDialog(false)
                setUploadingFile(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog open={showCreateFolderDialog} onOpenChange={setShowCreateFolderDialog}>
        <DialogContent className="bg-gray-900 border-white/30 text-white">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription className="text-white/70">
              Create a new folder to organize your files
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="folder-name">Folder Name *</Label>
              <Input
                id="folder-name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="e.g., Photos, Documents"
                className="bg-white/10 border-white/30 text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateFolderDialog(false)
                setFolderName('')
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={!folderName.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="bg-gray-900 border-white/30 text-white">
          <DialogHeader>
            <DialogTitle>Rename {selectedFile ? 'File' : 'Folder'}</DialogTitle>
            <DialogDescription className="text-white/70">
              Enter a new name
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="rename-name">Name *</Label>
              <Input
                id="rename-name"
                value={renameName}
                onChange={(e) => setRenameName(e.target.value)}
                className="bg-white/10 border-white/30 text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRenameDialog(false)
                setSelectedFile(null)
                setSelectedFolder(null)
                setRenameName('')
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={!renameName.trim()}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-900 border-white/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {itemToDelete?.type === 'file' ? 'File' : 'Folder'}?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete "{itemToDelete?.name}"?
              {itemToDelete?.type === 'folder' && ' This will also delete all files and subfolders inside it.'}
              {' '}This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false)
                setItemToDelete(null)
              }}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="bg-gray-900 border-white/30 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedFile?.name}</DialogTitle>
            <DialogDescription className="text-white/70">
              {selectedFile && formatFileSize(selectedFile.file_size)}
            </DialogDescription>
          </DialogHeader>

          {selectedFile && selectedFile.file_type.startsWith('image/') && (
            <div className="relative w-full h-[500px] bg-black/50 rounded-lg overflow-hidden">
              <img
                src={selectedFile.file_url}
                alt={selectedFile.name}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPreviewDialog(false)
                setSelectedFile(null)
              }}
            >
              Close
            </Button>
            <Button
              onClick={() => window.open(selectedFile?.file_url, '_blank')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


