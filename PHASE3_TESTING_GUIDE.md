# 🧪 PHASE 3 TESTING GUIDE - File Storage System

## 📋 PREREQUISITES

Before testing Phase 3, ensure you have:

1. ✅ **Database Setup Complete**
   - Run `DATABASE_SCHEMA_ALL_PHASES.sql` in Neon console
   - Verify `files` and `folders` tables exist

2. ✅ **Cloudinary Account Setup**
   - Sign up at https://cloudinary.com/ (free tier)
   - Get credentials from Dashboard
   - Add to `.env.local`:
     ```env
     NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     ```
   - Restart dev server: `npm run dev`

3. ✅ **Super Admin Account Created**
   - Run `node scripts/create-super-admin.js`
   - Default credentials: admin@mahoneyfamily.com / mahoney2026

---

## 🚀 TESTING PROCEDURE

### **Step 1: Access Files Tab**

1. Go to http://localhost:3000/admin
2. Log in with super admin credentials
3. Click the **"Files"** tab in the navigation
4. You should see the file browser interface

**Expected Result:**
- Files tab is visible and clickable
- File browser loads with empty state message
- "New Folder" and "Upload File" buttons are visible

---

### **Step 2: Create Folders**

#### **Test 2.1: Create Root Folder**

1. Click **"New Folder"** button
2. Enter folder name: "Photos"
3. Click **"Create Folder"**

**Expected Result:**
- Success message: "Folder created successfully!"
- "Photos" folder appears in the file browser
- Folder has yellow folder icon
- Folder shows creation date

#### **Test 2.2: Create Multiple Folders**

Repeat the process to create:
- "Documents"
- "Videos"
- "Receipts"

**Expected Result:**
- All folders appear in the file browser
- Folders are sorted alphabetically

#### **Test 2.3: Create Nested Folder**

1. Click on "Photos" folder to navigate into it
2. Click **"New Folder"**
3. Enter folder name: "Day 1"
4. Click **"Create Folder"**

**Expected Result:**
- Breadcrumb shows: Root → (current folder indicator)
- "Day 1" folder appears inside "Photos"
- Can navigate back using breadcrumb

---

### **Step 3: Upload Files**

#### **Test 3.1: Upload Image to Root**

1. Navigate to root directory (click "Root" in breadcrumb)
2. Click **"Upload File"** button
3. Select an image file (JPG, PNG, or GIF)
4. Click **"Upload"** in the dialog

**Expected Result:**
- Upload dialog shows file preview with name and size
- "Uploading..." message appears
- Success message: "File uploaded successfully!"
- File appears in the file browser
- File has appropriate icon (image icon)
- File size is displayed

#### **Test 3.2: Upload File to Folder**

1. Navigate into "Documents" folder
2. Click **"Upload File"**
3. Select a PDF file
4. Click **"Upload"**

**Expected Result:**
- File uploads to "Documents" folder
- File appears in the folder view
- PDF icon is displayed

#### **Test 3.3: Upload Multiple File Types**

Test uploading:
- Image (JPG, PNG, GIF)
- PDF document
- Word document (DOCX)
- Excel spreadsheet (XLSX)
- Video file (MP4)

**Expected Result:**
- All file types upload successfully
- Correct icons display for each file type
- File sizes display correctly

#### **Test 3.4: File Size Validation**

1. Try to upload a file larger than 10MB

**Expected Result:**
- Error message: "File size exceeds 10MB limit"
- File is not uploaded

#### **Test 3.5: File Type Validation**

1. Try to upload an unsupported file type (e.g., .exe)

**Expected Result:**
- Error message: "File type not allowed"
- File is not uploaded

---

### **Step 4: View Files**

#### **Test 4.1: Grid View**

1. Ensure grid view is selected (grid icon button)
2. View files and folders

**Expected Result:**
- Files and folders display in a responsive grid
- 4 columns on desktop, fewer on mobile
- Cards have glassmorphism effect
- Hover effects work

#### **Test 4.2: List View**

1. Click the list view button (list icon)
2. View files and folders

**Expected Result:**
- Files and folders display in a list
- Each row shows icon, name, size, date, type badge
- Action buttons are visible

#### **Test 4.3: Switch Between Views**

1. Toggle between grid and list views multiple times

**Expected Result:**
- View switches smoothly
- Data persists between view changes
- Selected view button is highlighted

---

### **Step 5: Preview Files**

#### **Test 5.1: Preview Image**

1. Find an image file in the browser
2. Click the **eye icon** (preview button)

**Expected Result:**
- Preview modal opens
- Image displays at full size
- File name and size shown in header
- "Download" button is visible
- "Close" button works

#### **Test 5.2: Preview Non-Image File**

1. Find a PDF or document file
2. Note that preview button is not available

**Expected Result:**
- Preview button only appears for images
- Other file types show download button only

---

### **Step 6: Download Files**

#### **Test 6.1: Download from Browser**

1. Find any file
2. Click the **download icon** button

**Expected Result:**
- File opens in a new browser tab
- File can be downloaded from the new tab

#### **Test 6.2: Download from Preview**

1. Open image preview
2. Click **"Download"** button

**Expected Result:**
- File opens in a new tab
- File can be downloaded

---

### **Step 7: Rename Files and Folders**

#### **Test 7.1: Rename File**

1. Find any file
2. Click the **edit icon** (rename button)
3. Enter new name: "Updated File Name"
4. Click **"Rename"**

**Expected Result:**
- Success message: "Renamed successfully!"
- File name updates in the browser
- File URL remains the same (Cloudinary URL)

#### **Test 7.2: Rename Folder**

1. Find any folder
2. Click the **edit icon**
3. Enter new name: "Updated Folder"
4. Click **"Rename"**

**Expected Result:**
- Success message: "Renamed successfully!"
- Folder name updates in the browser

#### **Test 7.3: Rename Validation**

1. Try to rename with empty name
2. Click **"Rename"**

**Expected Result:**
- Rename button is disabled
- Cannot submit empty name

---

### **Step 8: Delete Files and Folders**

#### **Test 8.1: Delete File**

1. Find any file
2. Click the **trash icon** (delete button)
3. Confirm deletion in the dialog

**Expected Result:**
- Confirmation dialog appears
- Warning message about permanent deletion
- After confirming: Success message "File deleted successfully!"
- File disappears from browser
- File is deleted from Cloudinary

#### **Test 8.2: Delete Empty Folder**

1. Create a new empty folder
2. Click the **trash icon**
3. Confirm deletion

**Expected Result:**
- Confirmation dialog appears
- After confirming: Success message "Folder deleted successfully!"
- Folder disappears from browser

#### **Test 8.3: Delete Folder with Contents**

1. Find a folder with files inside
2. Click the **trash icon**
3. Read the warning message

**Expected Result:**
- Confirmation dialog shows cascade warning
- Warning: "This will also delete all files and subfolders inside it"
- After confirming: Folder and all contents are deleted

---

### **Step 9: Folder Navigation**

#### **Test 9.1: Navigate Into Folder**

1. Click on any folder card

**Expected Result:**
- Browser navigates into the folder
- Breadcrumb updates to show current location
- Only files and subfolders in this folder are shown

#### **Test 9.2: Navigate Back to Root**

1. Click **"Root"** in the breadcrumb

**Expected Result:**
- Browser returns to root directory
- All root-level files and folders are shown

#### **Test 9.3: Deep Navigation**

1. Navigate: Root → Photos → Day 1
2. Upload a file
3. Navigate back to root
4. Navigate back to Photos → Day 1

**Expected Result:**
- File is still there
- Navigation works smoothly
- Breadcrumb updates correctly

---

### **Step 10: Permission Testing**

#### **Test 10.1: Super Admin Access**

1. Log in as super admin
2. Access Files tab

**Expected Result:**
- Can view files and folders
- Can upload files
- Can delete files
- Can manage folders
- All buttons are visible and functional

#### **Test 10.2: Admin Access**

1. Create an admin user (if not exists)
2. Log in as admin
3. Access Files tab

**Expected Result:**
- Can view files and folders
- Can upload files
- Can delete files
- Can manage folders
- Same access as super admin for files

#### **Test 10.3: Moderator Access**

1. Create a moderator user (if not exists)
2. Log in as moderator
3. Access Files tab

**Expected Result:**
- Can view files and folders
- Cannot upload files (button hidden or disabled)
- Cannot delete files (button hidden or disabled)
- Cannot manage folders (button hidden or disabled)
- Read-only access

#### **Test 10.4: Viewer Access**

1. Create a viewer user (if not exists)
2. Log in as viewer
3. Access Files tab

**Expected Result:**
- Can view files and folders
- Cannot upload files
- Cannot delete files
- Cannot manage folders
- Read-only access

---

## 🐛 COMMON ISSUES & SOLUTIONS

### **Issue 1: "Failed to upload file"**

**Possible Causes:**
- Cloudinary credentials not set
- Invalid Cloudinary credentials
- Network error

**Solutions:**
1. Check `.env.local` has correct Cloudinary credentials
2. Restart dev server after adding credentials
3. Verify credentials in Cloudinary dashboard
4. Check browser console for detailed error

### **Issue 2: "Files not displaying"**

**Possible Causes:**
- Database tables not created
- Database connection error

**Solutions:**
1. Verify `files` and `folders` tables exist in Neon
2. Check `DATABASE_URL` in `.env.local`
3. Check browser console for API errors

### **Issue 3: "Preview not working"**

**Possible Causes:**
- File is not an image
- Cloudinary URL is invalid

**Solutions:**
1. Preview only works for images
2. Check file URL in database
3. Verify file exists in Cloudinary dashboard

### **Issue 4: "Permission denied"**

**Possible Causes:**
- User role doesn't have required permissions
- JWT token expired

**Solutions:**
1. Check user role in database
2. Log out and log back in
3. Verify role permissions in `lib/permissions.ts`

---

## ✅ TESTING CHECKLIST

Use this checklist to track your testing progress:

### **Folder Management:**
- [ ] Create root folder
- [ ] Create multiple folders
- [ ] Create nested folder
- [ ] Rename folder
- [ ] Delete empty folder
- [ ] Delete folder with contents
- [ ] Navigate into folder
- [ ] Navigate back to root

### **File Upload:**
- [ ] Upload image to root
- [ ] Upload file to folder
- [ ] Upload PDF
- [ ] Upload document (DOCX)
- [ ] Upload spreadsheet (XLSX)
- [ ] Upload video
- [ ] File size validation (>10MB)
- [ ] File type validation

### **File Management:**
- [ ] View files in grid view
- [ ] View files in list view
- [ ] Switch between views
- [ ] Preview image
- [ ] Download file
- [ ] Rename file
- [ ] Delete file

### **Navigation:**
- [ ] Breadcrumb navigation
- [ ] Deep folder navigation
- [ ] Empty state displays

### **Permissions:**
- [ ] Super admin full access
- [ ] Admin full access
- [ ] Moderator read-only
- [ ] Viewer read-only

### **UI/UX:**
- [ ] Loading states work
- [ ] Error messages display
- [ ] Success messages display
- [ ] Dialogs open/close
- [ ] Responsive on mobile
- [ ] Icons display correctly
- [ ] File sizes format correctly

---

## 🎉 TESTING COMPLETE!

Once you've completed all tests and verified everything works:

1. ✅ Phase 3 is fully functional
2. ✅ All features are working as expected
3. ✅ Ready for production use

**Congratulations! Phase 3 (File Storage System) is complete!** 🚀

---

## 📝 NOTES

- Free Cloudinary tier: 25GB storage, 25GB bandwidth/month
- Max file size: 10MB (configurable in `lib/cloudinary.ts`)
- Supported file types: Images, videos, PDFs, documents
- Files are stored in Cloudinary, metadata in Neon database
- Folder hierarchy is unlimited depth
- File preview only works for images (PDFs require additional setup)

