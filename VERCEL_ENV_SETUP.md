# 🔐 Vercel Environment Variables Setup

## ⚠️ **DEPLOYMENT FAILED - MISSING ENVIRONMENT VARIABLES**

The deployment failed because environment variables are not configured in Vercel. You need to add them before the build can succeed.

---

## 📋 **REQUIRED ENVIRONMENT VARIABLES**

### **1. Database (Neon PostgreSQL)** ✅ Already Have
```
DATABASE_URL=postgresql://neondb_owner:npg_fsx4FAbh5WGY@ep-odd-pond-adw85oit-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### **2. JWT Secret (Authentication)** ⚠️ Need to Set
```
JWT_SECRET=your-secure-random-string-here
```
**Generate a secure random string:**
```bash
openssl rand -base64 32
```

### **3. Resend (Email Notifications)** ⚠️ Need to Get API Key
```
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=noreply@mahoneyfamily.com
ADMIN_EMAIL_ADDRESSES=your-email@example.com
```
**Get API key from:** https://resend.com/api-keys

### **4. Cloudinary (File Storage)** ⚠️ Need to Get Credentials
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```
**Get credentials from:** https://cloudinary.com/console

### **5. PayPal (Payment Processing)** ✅ Already Have
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=Afku1SqAhc9pnV4719LUq0qWvWwIPr1ZuXl3Y7iEV18jOQ6nNGGTMtZoVXbgq0piCJ9Bd4NWuGgbttNn
PAYPAL_CLIENT_SECRET=EOTJZXVFxaK9lKdf2FbM39NtJiJQlcdQZDskeb5JaCO0y2OVHNY9HzYHvYC0-MyBQfs0Rg2BajZD6Ckh
```

### **6. Site Configuration** ⚠️ Need to Update
```
NEXT_PUBLIC_SITE_URL=https://mahoneyreunion.vercel.app
NEXT_PUBLIC_BASE_URL=https://mahoneyreunion.vercel.app
NODE_ENV=production
```

---

## 🚀 **HOW TO ADD ENVIRONMENT VARIABLES TO VERCEL**

### **Option 1: Via Vercel Dashboard (Recommended)**

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/chensolutions/mahoneyreunion
   - Or click the "Inspect" link from the deployment output

2. **Navigate to Settings:**
   - Click on "Settings" tab
   - Click on "Environment Variables" in the left sidebar

3. **Add Each Variable:**
   - Click "Add New" button
   - Enter the variable name (e.g., `DATABASE_URL`)
   - Enter the variable value
   - Select environments: **Production**, **Preview**, **Development**
   - Click "Save"

4. **Repeat for All Variables:**
   - Add all variables from the list above

5. **Redeploy:**
   - Go back to "Deployments" tab
   - Click "Redeploy" on the latest deployment
   - Or run `vercel --prod` again from terminal

---

### **Option 2: Via Vercel CLI**

```bash
# Add environment variables one by one
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add RESEND_API_KEY production
vercel env add FROM_EMAIL production
vercel env add ADMIN_EMAIL_ADDRESSES production
vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME production
vercel env add CLOUDINARY_API_KEY production
vercel env add CLOUDINARY_API_SECRET production
vercel env add NEXT_PUBLIC_PAYPAL_CLIENT_ID production
vercel env add PAYPAL_CLIENT_SECRET production
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env add NEXT_PUBLIC_BASE_URL production
vercel env add NODE_ENV production

# Then redeploy
vercel --prod
```

---

## 📝 **STEP-BY-STEP GUIDE**

### **Step 1: Generate JWT Secret**
```bash
openssl rand -base64 32
```
Copy the output and use it as `JWT_SECRET`

---

### **Step 2: Get Resend API Key**

1. Go to: https://resend.com
2. Sign up or log in
3. Go to "API Keys" section
4. Click "Create API Key"
5. Copy the key (starts with `re_`)
6. Use it as `RESEND_API_KEY`

**Note:** You'll also need to verify your domain in Resend to send emails from `noreply@mahoneyfamily.com`. For testing, you can use Resend's test domain.

---

### **Step 3: Get Cloudinary Credentials**

1. Go to: https://cloudinary.com
2. Sign up or log in
3. Go to Dashboard
4. Copy the following:
   - **Cloud Name** → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET`

---

### **Step 4: Update Site URLs**

Replace with your actual Vercel domain:
```
NEXT_PUBLIC_SITE_URL=https://mahoneyreunion.vercel.app
NEXT_PUBLIC_BASE_URL=https://mahoneyreunion.vercel.app
```

Or if you have a custom domain:
```
NEXT_PUBLIC_SITE_URL=https://mahoneyfamily.com
NEXT_PUBLIC_BASE_URL=https://mahoneyfamily.com
```

---

## ⚡ **QUICK SETUP (Minimum Required)**

If you want to deploy quickly and add features later, here's the **minimum** required:

### **Required for Basic Site:**
```
DATABASE_URL=<your-neon-url>
JWT_SECRET=<generate-with-openssl>
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://mahoneyreunion.vercel.app
NEXT_PUBLIC_BASE_URL=https://mahoneyreunion.vercel.app
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<your-paypal-client-id>
PAYPAL_CLIENT_SECRET=<your-paypal-secret>
```

### **Optional (Can Add Later):**
```
RESEND_API_KEY=<for-email-notifications>
FROM_EMAIL=<for-email-notifications>
ADMIN_EMAIL_ADDRESSES=<for-email-notifications>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<for-file-uploads>
CLOUDINARY_API_KEY=<for-file-uploads>
CLOUDINARY_API_SECRET=<for-file-uploads>
```

**Note:** Without Resend, contact form emails won't be sent (but submissions will still be saved to database). Without Cloudinary, file uploads in admin won't work.

---

## 🔄 **AFTER ADDING ENVIRONMENT VARIABLES**

### **Option 1: Redeploy via Dashboard**
1. Go to: https://vercel.com/chensolutions/mahoneyreunion
2. Click "Deployments" tab
3. Click "..." menu on latest deployment
4. Click "Redeploy"

### **Option 2: Redeploy via CLI**
```bash
vercel --prod
```

---

## ✅ **VERIFICATION CHECKLIST**

After deployment succeeds, test:

- [ ] Homepage loads
- [ ] Registration page works
- [ ] Budget calculator works
- [ ] Contact form submits (check database)
- [ ] Admin login works
- [ ] Admin dashboard loads
- [ ] Email notifications sent (if Resend configured)
- [ ] File uploads work (if Cloudinary configured)

---

## 🆘 **TROUBLESHOOTING**

### **Build Still Fails After Adding Variables:**
1. Make sure all variables are added to **Production** environment
2. Check for typos in variable names (they're case-sensitive)
3. Make sure there are no extra spaces in values
4. Try redeploying: `vercel --prod`

### **Contact Form Doesn't Send Emails:**
- Check if `RESEND_API_KEY` is set correctly
- Verify domain in Resend dashboard
- Check Vercel deployment logs for errors

### **File Uploads Don't Work:**
- Check if all 3 Cloudinary variables are set
- Verify credentials in Cloudinary dashboard
- Check browser console for errors

### **Admin Login Doesn't Work:**
- Check if `JWT_SECRET` is set
- Check if `DATABASE_URL` is correct
- Make sure super admin user was created (run init script)

---

## 📚 **USEFUL LINKS**

- **Vercel Dashboard:** https://vercel.com/chensolutions/mahoneyreunion
- **Vercel Env Docs:** https://vercel.com/docs/projects/environment-variables
- **Resend:** https://resend.com
- **Cloudinary:** https://cloudinary.com
- **Neon Database:** https://neon.tech

---

## 🎯 **NEXT STEPS**

1. ✅ Generate JWT secret
2. ✅ Get Resend API key (optional but recommended)
3. ✅ Get Cloudinary credentials (optional but recommended)
4. ✅ Add all environment variables to Vercel
5. ✅ Redeploy to production
6. ✅ Test the deployed site
7. ✅ Initialize super admin user (if needed)

---

**Status:** ⚠️ **Waiting for Environment Variables**  
**Action Required:** Add environment variables to Vercel and redeploy

