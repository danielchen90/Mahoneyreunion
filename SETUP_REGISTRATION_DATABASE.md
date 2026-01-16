# 🗄️ Setup Registration Database Tables

## ⚡ Quick Setup (2 minutes)

Before deploying to Vercel, you need to create the database tables for storing registrations.

---

## 📋 **STEP 1: Open Neon Console**

1. Go to: **https://console.neon.tech**
2. Sign in to your account
3. Select your database: **`neondb`**
4. Click **"SQL Editor"** in the left sidebar

---

## 📝 **STEP 2: Run SQL Schema**

1. Open the file: **`database-schema-registrations.sql`** in your code editor
2. **Copy all the SQL** (Ctrl+A, Ctrl+C)
3. **Paste into Neon SQL Editor**
4. Click **"Run"** button
5. Wait for execution (~5 seconds)

---

## ✅ **STEP 3: Verify Tables Created**

Run this query in the SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('registrations', 'payments', 'attendees')
ORDER BY table_name;
```

**You should see 3 tables:**
- `attendees`
- `payments`
- `registrations`

✅ **Database setup complete!**

---

## 📊 **What These Tables Store**

### **`registrations` table**
- Main registration record
- Email, phone, number of adults/children
- Total amount, currency, payment type
- Stripe session ID and customer ID
- Payment status (pending, completed, failed, refunded)
- Special requests

### **`payments` table**
- Individual payment transactions
- Links to registration via `registration_id`
- Stripe payment intent ID and charge ID
- Amount, currency, status
- Payment method (card, etc.)
- Receipt URL

### **`attendees` table**
- Individual attendee information
- Links to registration via `registration_id`
- Full name, email, phone
- Age group (adult/child)
- Dietary restrictions
- Emergency contact information

---

## 🔄 **How It Works**

1. **User fills out registration form** on `/register`
2. **Clicks "Pay with Card"** → Redirected to Stripe Checkout
3. **Completes payment** on Stripe
4. **Stripe webhook fires** → Calls `/api/stripe/webhook`
5. **Webhook handler saves data** to database:
   - Creates registration record
   - Creates payment record
   - Creates attendee records for each person
6. **Admin can view all registrations** in admin dashboard → Registrations tab

---

## 🎯 **Next Steps**

After creating the tables:

1. ✅ Push code to GitHub
2. ✅ Deploy to Vercel
3. ✅ Add environment variables to Vercel
4. ✅ Create Stripe webhook
5. ✅ Test a registration
6. ✅ Check admin panel to see the data!

---

## 🔍 **View Registration Data**

To view all registrations in the database:

```sql
-- View all registrations
SELECT * FROM registrations ORDER BY created_at DESC;

-- View all attendees
SELECT * FROM attendees ORDER BY created_at DESC;

-- View all payments
SELECT * FROM payments ORDER BY created_at DESC;

-- View registrations with attendee count
SELECT 
  r.id,
  r.email,
  r.adults + r.children as total_people,
  r.total_amount,
  r.currency,
  r.payment_status,
  r.created_at,
  COUNT(a.id) as attendee_records
FROM registrations r
LEFT JOIN attendees a ON a.registration_id = r.id
GROUP BY r.id
ORDER BY r.created_at DESC;
```

---

## 🚨 **Troubleshooting**

### **Error: "relation does not exist"**
- You haven't created the tables yet
- Run the SQL schema from `database-schema-registrations.sql`

### **Error: "column does not exist"**
- The table structure doesn't match the code
- Drop the tables and recreate them:
  ```sql
  DROP TABLE IF EXISTS attendees CASCADE;
  DROP TABLE IF EXISTS payments CASCADE;
  DROP TABLE IF EXISTS registrations CASCADE;
  ```
- Then run the schema again

---

**Ready to deploy? Let's go!** 🚀

