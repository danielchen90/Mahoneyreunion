# Phase 1: Contact Form Management System - Setup Guide

## 📋 Overview

This guide will walk you through setting up the Contact Form Management System for the Mahoney Family Reunion website. This system includes:

- ✅ Database storage for contact form submissions
- ✅ Email notifications to admins when forms are submitted
- ✅ Admin dashboard to view, manage, and respond to messages
- ✅ Real-time updates and search/filter functionality
- ✅ Mark messages as read/unread
- ✅ Archive and delete messages

---

## 🗄️ Step 1: Supabase Database Setup

### 1.1 Create Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up (free tier is sufficient)
3. Create a new project:
   - **Project name:** `mahoney-reunion` (or your choice)
   - **Database password:** Choose a strong password (save it!)
   - **Region:** Choose closest to your users
   - **Pricing plan:** Free tier is fine for this project

4. Wait for the project to be created (takes ~2 minutes)

### 1.2 Get Your Supabase Credentials

1. Once your project is ready, go to **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### 1.3 Create Database Table

1. In your Supabase project, click **SQL Editor** in the sidebar
2. Click **New query**
3. Copy and paste the following SQL:

```sql
-- Contact Form Submissions Table
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read')),
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_archived ON contact_submissions(archived);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (admins)
-- This allows anyone to insert (public form submission)
CREATE POLICY "Enable insert for all users" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- This allows authenticated users to read/update/delete
CREATE POLICY "Enable all access for authenticated users" ON contact_submissions
  FOR ALL USING (auth.role() = 'authenticated');
```

4. Click **Run** (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned" - this is correct!

### 1.4 Verify Table Creation

1. Click **Table Editor** in the sidebar
2. You should see `contact_submissions` table listed
3. Click on it to see the empty table with all columns

---

## 📧 Step 2: Resend Email Service Setup

### 2.1 Create Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Click "Start Building" and sign up (free tier: 100 emails/day, 3,000/month)
3. Verify your email address

### 2.2 Domain Verification (Production)

**For Production (Recommended):**
1. Go to **Domains** in the Resend dashboard
2. Click **Add Domain**
3. Enter your domain (e.g., `mahoneyfamily.com`)
4. Follow the DNS setup instructions to add the required records
5. Wait for verification (usually takes a few minutes)

**For Development/Testing:**
- Resend provides a test domain: `onboarding@resend.dev`
- You can use this for testing, but emails will only be sent to verified addresses
- To verify your personal email for testing:
  1. Go to **Settings** > **Email Addresses**
  2. Add your email and verify it

### 2.3 Generate API Key

1. Go to **API Keys** in the Resend dashboard
2. Click **Create API Key**
3. Give it a name: `Mahoney Reunion - Production` (or `Development`)
4. Select permissions: **Full Access** (or **Sending access** only)
5. Click **Create**
6. **IMPORTANT:** Copy the API key immediately (you won't see it again!)
7. Save it securely

---

## ⚙️ Step 3: Configure Environment Variables

### 3.1 Create .env.local File

1. In your project root, create a file named `.env.local`
2. Copy the contents from `.env.local.example`
3. Fill in your actual values:

```bash
# SUPABASE CONFIGURATION
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# EMAIL CONFIGURATION (RESEND)
RESEND_API_KEY=re_123456789...
FROM_EMAIL=noreply@mahoneyfamily.com
ADMIN_EMAIL_ADDRESSES=admin@mahoneyfamily.com,organizer@mahoneyfamily.com

# SITE CONFIGURATION
NEXT_PUBLIC_SITE_URL=https://mahoney-reunion.vercel.app
```

### 3.2 Important Notes

- **Never commit `.env.local` to Git!** (it's already in `.gitignore`)
- For production deployment on Vercel:
  1. Go to your project settings on Vercel
  2. Navigate to **Environment Variables**
  3. Add all the variables from `.env.local`
  4. Redeploy your site

---

## 🧪 Step 4: Test the System

### 4.1 Start Development Server

```bash
npm run dev
```

### 4.2 Test Contact Form Submission

1. Open your browser to `http://localhost:3000/contact`
2. Fill out the contact form with test data
3. Submit the form
4. Check your terminal - you should see a log message
5. Check your email - you should receive a notification

### 4.3 Test Admin Dashboard

1. Go to `http://localhost:3000/admin`
2. Log in with password: `mahoney2026`
3. Click the **Contact Messages** tab
4. You should see your test submission
5. Try the following actions:
   - Click on a message to view details
   - Mark as read/unread
   - Archive a message
   - Search for messages
   - Filter by status (All/Unread/Read)
   - Delete a message

---

## 🚀 Step 5: Deploy to Production

### 5.1 Update Vercel Environment Variables

1. Go to [https://vercel.com](https://vercel.com)
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add all variables from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`
   - `FROM_EMAIL`
   - `ADMIN_EMAIL_ADDRESSES`
   - `NEXT_PUBLIC_SITE_URL`

### 5.2 Deploy

```bash
git add .
git commit -m "Add Phase 1: Contact Form Management System"
git push
```

Vercel will automatically deploy your changes.

### 5.3 Test Production

1. Visit your production URL
2. Submit a test contact form
3. Check admin dashboard
4. Verify email notifications

---

## 📊 Database Schema Reference

### contact_submissions Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `name` | VARCHAR(255) | Submitter's name |
| `email` | VARCHAR(255) | Submitter's email |
| `phone` | VARCHAR(50) | Submitter's phone (optional) |
| `subject` | VARCHAR(500) | Message subject |
| `message` | TEXT | Message content |
| `status` | VARCHAR(20) | 'unread' or 'read' |
| `archived` | BOOLEAN | Whether message is archived |
| `created_at` | TIMESTAMP | When submitted |
| `updated_at` | TIMESTAMP | Last updated |

---

## 🔧 Troubleshooting

### Issue: "Module not found: @supabase/supabase-js"

**Solution:**
```bash
npm install @supabase/supabase-js resend date-fns
```

### Issue: "Failed to fetch submissions"

**Possible causes:**
1. Supabase credentials are incorrect
2. Table doesn't exist
3. RLS policies are too restrictive

**Solution:**
- Check `.env.local` values
- Verify table exists in Supabase
- Check browser console for detailed error

### Issue: "Email not sending"

**Possible causes:**
1. Resend API key is incorrect
2. FROM_EMAIL domain not verified
3. Recipient email not verified (in development)

**Solution:**
- Check Resend API key
- Verify domain in Resend dashboard
- For testing, verify recipient email in Resend

### Issue: "CORS errors"

**Solution:**
- Supabase automatically handles CORS
- Make sure you're using `NEXT_PUBLIC_` prefix for client-side variables

---

## 📝 API Endpoints

### POST /api/contact/submit
Submit a new contact form
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "subject": "Question about reunion",
  "message": "When is the reunion?"
}
```

### GET /api/contact/list
Get all submissions (with optional filters)
```
?status=unread&archived=false&search=john
```

### PATCH /api/contact/update
Update submission status or archived state
```json
{
  "id": "uuid",
  "status": "read"
}
```

### DELETE /api/contact/delete
Delete a submission
```json
{
  "id": "uuid"
}
```

---

## ✅ Phase 1 Complete!

You now have a fully functional contact form management system with:
- ✅ Database storage
- ✅ Email notifications
- ✅ Admin dashboard
- ✅ Search and filter
- ✅ Read/unread tracking
- ✅ Archive and delete

**Next Steps:**
- Phase 2: Multi-User Admin System with Permissions
- Phase 3: File Storage System
- Phase 4: Project/Task Manager

---

## 📞 Support

If you encounter any issues during setup, check:
1. Browser console for client-side errors
2. Terminal/server logs for server-side errors
3. Supabase logs (in Supabase dashboard)
4. Resend logs (in Resend dashboard)

