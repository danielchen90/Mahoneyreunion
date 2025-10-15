# 🧪 Phase 2 Testing Guide - Multi-User Admin System

## ✅ PHASE 2 IMPLEMENTATION COMPLETE!

All Phase 2 features have been implemented. This guide will help you test everything.

---

## 📋 PRE-TESTING CHECKLIST

Before you can test Phase 2, you MUST complete these steps:

### ✅ Step 1: Database Setup
- [ ] Run `DATABASE_SCHEMA_ALL_PHASES.sql` in Neon SQL Editor
- [ ] Verify all tables were created (13 tables total)
- [ ] Check for any SQL errors

**How to verify:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- admin_activity_logs
- admin_users
- contact_submissions
- files
- folders
- meeting_notes
- meeting_tasks
- password_reset_tokens
- task_attachments
- task_comments
- tasks

---

### ✅ Step 2: Create Super Admin User
```bash
node scripts/create-super-admin.js
```

**Expected Output:**
```
✅ Super admin user created successfully!
📋 USER DETAILS:
   ID: [uuid]
   Email: admin@mahoneyfamily.com
   Name: Super Admin
   Role: super_admin
   Created: [timestamp]

🎉 SUCCESS! You can now log in with:
   Email: admin@mahoneyfamily.com
   Password: mahoney2026
```

---

### ✅ Step 3: Environment Variables
Make sure `.env.local` has:
```bash
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key-here  # Optional, has default
```

---

### ✅ Step 4: Start Dev Server
```bash
npm run dev
```

Server should start on `http://localhost:3000`

---

## 🧪 TESTING PHASE 2 FEATURES

### **Test 1: Super Admin Login** ✅

**Steps:**
1. Go to `http://localhost:3000/admin`
2. You should see the admin dashboard (old password system still works)
3. Enter password: `mahoney2026`
4. Click "Sign In"

**Expected Result:**
- ✅ Dashboard loads successfully
- ✅ You see 3 tabs: Overview, Contact Messages, Users
- ✅ Session timer shows in header
- ✅ Logout button visible

**If it fails:**
- Check browser console for errors
- Check terminal for server errors
- Verify database tables exist

---

### **Test 2: Access Users Tab** ✅

**Steps:**
1. Click the "Users" tab in the admin dashboard

**Expected Result:**
- ✅ User management interface loads
- ✅ You see the super admin user in the list
- ✅ User card shows:
  - Name: Super Admin
  - Email: admin@mahoneyfamily.com
  - Role badge: Super Admin (purple gradient)
  - Status: Active (green)
  - Created date
- ✅ "Add User" button visible in top right

---

### **Test 3: Create New User (Viewer Role)** ✅

**Steps:**
1. Click "Add User" button
2. Fill in the form:
   - Name: `Test Viewer`
   - Email: `viewer@test.com`
   - Password: `TestPass123`
   - Role: `Viewer - Read-only access`
3. Click "Create User"

**Expected Result:**
- ✅ Success message appears
- ✅ New user appears in the list
- ✅ User has "Viewer" role badge (gray gradient)
- ✅ User is marked as "Active"

**If it fails:**
- Check password meets requirements (8+ chars, uppercase, lowercase, number)
- Check email format is valid
- Check browser console for errors

---

### **Test 4: Create User (Moderator Role)** ✅

**Steps:**
1. Click "Add User"
2. Create user:
   - Name: `Test Moderator`
   - Email: `moderator@test.com`
   - Password: `TestPass123`
   - Role: `Moderator - Manage messages & tasks`
3. Click "Create User"

**Expected Result:**
- ✅ User created successfully
- ✅ Role badge is green gradient

---

### **Test 5: Create User (Admin Role)** ✅

**Steps:**
1. Click "Add User"
2. Create user:
   - Name: `Test Admin`
   - Email: `admin@test.com`
   - Password: `TestPass123`
   - Role: `Admin - Full access except users`
3. Click "Create User"

**Expected Result:**
- ✅ User created successfully
- ✅ Role badge is blue gradient

---

### **Test 6: Edit User** ✅

**Steps:**
1. Find the "Test Viewer" user
2. Click the Edit button (pencil icon)
3. Change name to: `Updated Viewer`
4. Change role to: `Moderator`
5. Leave password blank (keep current)
6. Click "Update User"

**Expected Result:**
- ✅ Success message appears
- ✅ User name updated to "Updated Viewer"
- ✅ Role badge changed to green (Moderator)

---

### **Test 7: Change User Password** ✅

**Steps:**
1. Edit the "Updated Viewer" user
2. Enter new password: `NewPass456`
3. Click "Update User"

**Expected Result:**
- ✅ Success message appears
- ✅ Password updated (you'll test login later)

---

### **Test 8: Delete User** ✅

**Steps:**
1. Find the "Test Admin" user
2. Click the Delete button (trash icon)
3. Confirm deletion in the dialog

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ After confirming, user is removed from list
- ✅ Success message appears

---

### **Test 9: Password Validation** ✅

**Steps:**
1. Try to create a user with weak password: `test123`

**Expected Result:**
- ❌ Error message appears
- ❌ User not created
- ✅ Error details show password requirements

---

### **Test 10: Email Validation** ✅

**Steps:**
1. Try to create a user with invalid email: `notanemail`

**Expected Result:**
- ❌ Error message: "Invalid email format"
- ❌ User not created

---

### **Test 11: Duplicate Email** ✅

**Steps:**
1. Try to create a user with existing email: `admin@mahoneyfamily.com`

**Expected Result:**
- ❌ Error message: "Email already exists"
- ❌ User not created

---

### **Test 12: Route Protection (Middleware)** ✅

**Steps:**
1. Open a new incognito/private browser window
2. Try to access: `http://localhost:3000/admin`

**Expected Result:**
- ✅ You are redirected to homepage (not logged in)
- ✅ Cannot access admin dashboard without authentication

---

### **Test 13: API Authentication** ✅

**Steps:**
1. Open browser DevTools → Network tab
2. In the admin dashboard, click "Users" tab
3. Look for the request to `/api/admin/users`

**Expected Result:**
- ✅ Request includes authentication cookie
- ✅ Response status: 200 OK
- ✅ Response includes user list

**Test without auth:**
1. Open a new incognito window
2. Try to access: `http://localhost:3000/api/admin/users`

**Expected Result:**
- ❌ Response status: 401 Unauthorized
- ❌ Error: "Authentication required"

---

### **Test 14: Session Expiry** ✅

**Steps:**
1. Log in to admin dashboard
2. Note the session timer in the header
3. Wait for session to expire (24 hours - or modify JWT_EXPIRY for testing)

**Expected Result:**
- ✅ After expiry, next API call returns 401
- ✅ User is redirected to login

**Note:** For quick testing, you can modify `TOKEN_EXPIRY` in `lib/auth.ts` to `'1m'` (1 minute)

---

### **Test 15: Account Locking** ✅

**Steps:**
1. Log out of admin dashboard
2. Try to log in with wrong password 5 times
3. Try to log in with correct password

**Expected Result:**
- ✅ After 5 failed attempts, account is locked
- ✅ Error message: "Account is locked for 30 minutes"
- ✅ Cannot log in even with correct password
- ✅ Lock expires after 30 minutes

**Note:** Check database to verify:
```sql
SELECT email, failed_login_attempts, locked_until 
FROM admin_users 
WHERE email = 'admin@mahoneyfamily.com';
```

---

### **Test 16: Role-Based Permissions** ✅

**Steps:**
1. Log in as super admin
2. Create a new admin user
3. Log out
4. Log in as the new admin user
5. Try to access Users tab

**Expected Result:**
- ✅ Super admin can access Users tab
- ✅ Admin user can access Users tab
- ✅ Admin user can view users
- ❌ Admin user CANNOT create/edit/delete users with higher roles

**Test with Moderator:**
1. Log in as moderator
2. Try to access Users tab

**Expected Result:**
- ✅ Moderator can see Users tab
- ✅ Moderator can view users
- ❌ Moderator CANNOT create/edit/delete users

**Test with Viewer:**
1. Log in as viewer
2. Try to access Users tab

**Expected Result:**
- ✅ Viewer can see Users tab
- ✅ Viewer can view users
- ❌ Viewer CANNOT create/edit/delete users

---

## 📊 TESTING CHECKLIST

### **Authentication:**
- [ ] Super admin can log in
- [ ] Wrong password shows error
- [ ] Account locks after 5 failed attempts
- [ ] Session expires after 24 hours
- [ ] Logout works correctly
- [ ] Middleware protects /admin routes
- [ ] API endpoints require authentication

### **User Management:**
- [ ] Can create users with all roles
- [ ] Can edit user details
- [ ] Can change user password
- [ ] Can change user role
- [ ] Can delete users
- [ ] Cannot delete own account
- [ ] Cannot deactivate own account

### **Validation:**
- [ ] Password validation works (8+ chars, uppercase, lowercase, number)
- [ ] Email validation works
- [ ] Duplicate email prevention works
- [ ] Required fields validation works

### **Permissions:**
- [ ] Super admin has full access
- [ ] Admin can manage content but not users
- [ ] Moderator can manage messages only
- [ ] Viewer has read-only access
- [ ] Role hierarchy prevents privilege escalation

### **UI/UX:**
- [ ] User list displays correctly
- [ ] Role badges show correct colors
- [ ] Active/inactive status shows correctly
- [ ] Create dialog works
- [ ] Edit dialog works
- [ ] Delete confirmation works
- [ ] Success/error messages display
- [ ] Loading states work

---

## 🐛 TROUBLESHOOTING

### **Issue: Cannot log in**
- Check database tables exist
- Check super admin user was created
- Check DATABASE_URL in .env.local
- Check browser console for errors

### **Issue: "Authentication required" error**
- Check JWT_SECRET is set (or using default)
- Check cookies are enabled in browser
- Check middleware.ts is working
- Clear browser cookies and try again

### **Issue: Cannot create users**
- Check admin_users table exists
- Check you're logged in as super admin
- Check password meets requirements
- Check email format is valid

### **Issue: Middleware not working**
- Check middleware.ts exists in root directory
- Restart dev server
- Clear .next cache: `rm -rf .next`

---

## ✅ PHASE 2 COMPLETE!

Once all tests pass, Phase 2 is fully functional!

**Next Steps:**
1. Mark Phase 2 as complete
2. Move to Phase 4 (Task Management)
3. Then Phase 3 (File Storage)

---

**Ready to continue with Phase 4?** 🚀

