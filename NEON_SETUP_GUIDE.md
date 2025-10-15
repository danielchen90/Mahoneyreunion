# Neon Database Setup Guide - Phase 1

## 🎉 Good News!

You already have a Neon database set up! Your connection string is already configured in `.env.local`.

---

## 📋 What You Need to Do

### Step 1: Create the Database Table (5 minutes)

You need to run the SQL schema to create the `contact_submissions` table in your Neon database.

#### Option A: Using Neon Console (Recommended)

1. Go to [https://console.neon.tech](https://console.neon.tech)
2. Log in to your account
3. Select your project (the one with the database `neondb`)
4. Click on **SQL Editor** in the left sidebar
5. Copy and paste the SQL below
6. Click **Run** (or press Cmd/Ctrl + Enter)

#### Option B: Using psql Command Line

```bash
psql "postgresql://neondb_owner:npg_fsx4FAbh5WGY@ep-odd-pond-adw85oit-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

Then paste the SQL schema below.

---

## 📝 SQL Schema to Run

```sql
-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_archived ON contact_submissions(archived);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- Add a comment to the table
COMMENT ON TABLE contact_submissions IS 'Stores contact form submissions from the Mahoney Family Reunion website';
```

---

## ✅ Verify Table Creation

After running the SQL, verify the table was created:

```sql
-- Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'contact_submissions';

-- View table structure
\d contact_submissions

-- Or using SQL:
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'contact_submissions'
ORDER BY ordinal_position;
```

You should see the table with all 10 columns:
- `id` (UUID)
- `name` (VARCHAR)
- `email` (VARCHAR)
- `phone` (VARCHAR)
- `subject` (VARCHAR)
- `message` (TEXT)
- `status` (VARCHAR)
- `archived` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

---

## 🧪 Test with Sample Data (Optional)

You can insert a test record to verify everything works:

```sql
-- Insert a test submission
INSERT INTO contact_submissions (name, email, phone, subject, message)
VALUES (
  'Test User',
  'test@example.com',
  '555-1234',
  'Test Subject',
  'This is a test message to verify the database is working correctly.'
);

-- View all submissions
SELECT * FROM contact_submissions ORDER BY created_at DESC;

-- Delete test data (optional)
DELETE FROM contact_submissions WHERE email = 'test@example.com';
```

---

## 🔒 Security Notes

### Connection String Security

Your connection string contains sensitive credentials. **Never commit it to Git!**

✅ **Already protected:**
- `.env.local` is in `.gitignore`
- Connection string is only in environment variables

⚠️ **For production deployment:**
- Add `DATABASE_URL` to Vercel environment variables
- Use Neon's connection pooler URL (which you already have)
- Enable SSL mode (already configured with `?sslmode=require`)

### Database Access

Your current connection string uses:
- **User:** `neondb_owner` (full access)
- **Pooler:** Connection pooling enabled (good for serverless)
- **SSL:** Required (secure connection)

This is perfect for your use case!

---

## 📊 Database Schema Details

### Table: contact_submissions

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `name` | VARCHAR(255) | NO | - | Submitter's name |
| `email` | VARCHAR(255) | NO | - | Submitter's email |
| `phone` | VARCHAR(50) | YES | NULL | Submitter's phone (optional) |
| `subject` | VARCHAR(500) | NO | - | Message subject |
| `message` | TEXT | NO | - | Message content |
| `status` | VARCHAR(20) | NO | 'unread' | 'unread' or 'read' |
| `archived` | BOOLEAN | NO | false | Archive status |
| `created_at` | TIMESTAMP | NO | NOW() | When submitted |
| `updated_at` | TIMESTAMP | NO | NOW() | Last updated |

### Indexes

- **idx_contact_submissions_status** - Fast filtering by status
- **idx_contact_submissions_archived** - Fast filtering by archived
- **idx_contact_submissions_created_at** - Fast sorting by date

---

## 🚀 Next Steps

After creating the table:

1. ✅ **Database is ready!**
2. ⏭️ **Setup Resend for email notifications** (see main setup guide)
3. ⏭️ **Test the contact form** at `/contact`
4. ⏭️ **View submissions in admin dashboard** at `/admin`

---

## 🔧 Troubleshooting

### Issue: "relation 'contact_submissions' does not exist"

**Solution:** The table hasn't been created yet. Run the SQL schema above.

### Issue: "permission denied for table contact_submissions"

**Solution:** Your user (`neondb_owner`) should have full access. Check that you're using the correct connection string.

### Issue: "SSL connection required"

**Solution:** Your connection string already includes `?sslmode=require`. Make sure you're using the full connection string.

### Issue: "too many connections"

**Solution:** You're using the pooler URL (good!). If you still see this, check Neon dashboard for connection limits.

---

## 📞 Neon Resources

- **Dashboard:** [https://console.neon.tech](https://console.neon.tech)
- **Documentation:** [https://neon.tech/docs](https://neon.tech/docs)
- **SQL Editor:** Available in your project dashboard
- **Connection Pooling:** Already enabled in your URL

---

## ✅ Checklist

- [ ] Logged into Neon Console
- [ ] Opened SQL Editor
- [ ] Ran the CREATE TABLE SQL
- [ ] Verified table exists
- [ ] (Optional) Tested with sample data
- [ ] Ready to test contact form!

---

## 🎉 That's It!

Your Neon database is now ready for the Contact Form Management System!

**Total setup time: ~5 minutes**

Next: Setup Resend for email notifications (see main setup guide)

