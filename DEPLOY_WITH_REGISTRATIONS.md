# 🚀 Deploy Registration System to Vercel

**Note:** This project uses npm for package management. The pnpm-lock.yaml has been removed.

## ✅ What's Included in This Deployment

### **New Features:**
1. ✅ **Registration Database Integration**
   - 3 database tables: `registrations`, `payments`, `attendees`
   - Automatic data storage via Stripe webhooks

2. ✅ **Stripe Payment Integration**
   - Checkout session creation
   - Webhook handler for payment confirmations
   - Session retrieval for success page

3. ✅ **Admin Registrations Panel**
   - View all registrations
   - See attendee details
   - Track payment status
   - Monitor revenue

4. ✅ **Updated Registration Form**
   - Stripe payment button
   - Attendee data collection
   - Proper data flow to database

---

## 📋 Pre-Deployment Checklist

### **1. Database Tables** ⚠️ **CRITICAL**

Before deploying, you **MUST** create the database tables in Neon:

1. Go to: https://console.neon.tech
2. Select your database: `neondb`
3. Click **"SQL Editor"**
4. Copy all SQL from: `database-schema-registrations.sql`
5. Paste and click **"Run"**
6. Verify 3 tables created:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('registrations', 'payments', 'attendees');
   ```

**If you skip this step, the registration system will fail!**

---

## 🚀 Deployment Steps

### **Step 1: Push to GitHub**

```bash
git add -A
git commit -m "Add registration database and admin panel integration"
git push origin main
```

### **Step 2: Vercel Auto-Deploy**

Vercel will automatically deploy when you push to GitHub.

**Monitor deployment:**
1. Go to: https://vercel.com/dashboard
2. Click on your project
3. Watch the deployment progress
4. Wait for "Ready" status

---

## 🔧 Environment Variables (Already Set)

These should already be configured in Vercel:

✅ `DATABASE_URL` - Neon connection string  
✅ `STRIPE_SECRET_KEY` - Stripe secret key  
✅ `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key  
⚠️ `STRIPE_WEBHOOK_SECRET` - **NEEDS UPDATE** (see below)

---

## 🪝 Create Stripe Webhook (REQUIRED)

After deployment, you need to create a webhook for production:

### **1. Get Your Production URL**
After Vercel deploys, your URL will be something like:
- `https://your-project.vercel.app`

### **2. Create Webhook in Stripe**

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. Enter endpoint URL:
   ```
   https://your-project.vercel.app/api/stripe/webhook
   ```
4. Select events to listen for:
   - ✅ `checkout.session.completed`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_...`)

### **3. Update Vercel Environment Variable**

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Find `STRIPE_WEBHOOK_SECRET`
3. Update with the new production webhook secret
4. Click **"Save"**
5. **Redeploy** the project (Settings → Deployments → Latest → Redeploy)

---

## ✅ Verify Deployment

### **1. Check Admin Panel**

1. Go to: `https://your-project.vercel.app/admin`
2. Login with password: `mahoney2026`
3. Click **"Registrations"** tab
4. Should show "No registrations found" (empty state)

### **2. Test Registration Flow**

1. Go to: `https://your-project.vercel.app/register`
2. Fill out registration form
3. Click **"Pay with Card"**
4. Use Stripe test card: `4242 4242 4242 4242`
5. Complete payment
6. Check admin panel → Should see the registration! 🎉

---

## 📊 What Gets Deployed

### **New Files:**
- `app/admin/page.tsx` - Admin page route
- `components/admin-registrations.tsx` - Registrations UI
- `components/stripe-button.tsx` - Payment button
- `app/api/stripe/checkout/route.ts` - Checkout API
- `app/api/stripe/webhook/route.ts` - Webhook handler
- `app/api/stripe/session/route.ts` - Session retrieval
- `app/api/registrations/list/route.ts` - List registrations
- `database-schema-registrations.sql` - Database schema

### **Modified Files:**
- `components/admin-dashboard.tsx` - Added Registrations tab
- `components/registration-section.tsx` - Integrated Stripe payment

---

## 🔍 Troubleshooting

### **"No registrations found" after test payment**

**Possible causes:**
1. ❌ Database tables not created → Run SQL schema
2. ❌ Webhook not configured → Create webhook in Stripe
3. ❌ Wrong webhook secret → Update environment variable
4. ❌ Webhook failed → Check Stripe Dashboard → Webhooks → Events

### **Check webhook logs:**
1. Go to: https://dashboard.stripe.com/webhooks
2. Click on your webhook
3. Click **"Events"** tab
4. Look for failed events
5. Click on event to see error details

### **"Cannot read properties of undefined"**

This error is fixed in the latest code. Make sure you've pushed the latest commit.

---

## 🎯 Success Criteria

✅ Admin panel loads at `/admin`  
✅ Registrations tab shows empty state  
✅ Registration form has "Pay with Card" button  
✅ Test payment redirects to Stripe Checkout  
✅ After payment, registration appears in admin panel  
✅ Attendee details are visible  
✅ Payment status shows "completed"  

---

## 📝 Post-Deployment

After successful deployment:

1. ✅ Test the full registration flow
2. ✅ Verify data appears in admin panel
3. ✅ Check database tables have data
4. ✅ Share admin credentials with family organizers
5. ✅ Monitor registrations as they come in

---

**Ready to deploy? Run the commands above!** 🚀

