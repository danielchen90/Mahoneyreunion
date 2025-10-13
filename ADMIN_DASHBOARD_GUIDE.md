# Admin Dashboard Guide
## Mahoney Family Reunion Website - Page Visibility Management

---

## 📋 Overview

The Admin Dashboard provides a secure, user-friendly interface for managing which pages are visible to the public on the Mahoney Family Reunion website. This is essential for controlling content visibility during different phases of reunion planning.

---

## 🔐 Accessing the Admin Dashboard

### URL
Navigate to: **http://localhost:3000/admin**

### Login Credentials
- **Default Password**: `mahoney2026`
- **Session Duration**: 24 hours
- **Security Note**: Change the password in `lib/admin-auth.ts` before deploying to production

### Login Process
1. Visit `/admin` page
2. Enter the admin password
3. Click "Login"
4. You'll be authenticated for 24 hours

---

## 🎛️ Dashboard Features

### 1. **Page Visibility Controls**
Toggle each page on/off to control navigation visibility:

| Page | Default Status | Description |
|------|---------------|-------------|
| **Home** | ✅ Visible (Always) | Homepage - cannot be hidden |
| **About** | ✅ Visible | About the reunion and resort |
| **Schedule** | ❌ Hidden | Event schedule (Coming Soon page) |
| **Travel** | ✅ Visible | Travel information and directions |
| **Budget** | ✅ Visible | Budget calculator |
| **Register** | ❌ Hidden | Registration form and payment |
| **FAQ** | ✅ Visible | Frequently asked questions |
| **Contact** | ✅ Visible | Contact information |
| **Family Tree** | ✅ Visible | Mahoney family tree |

### 2. **Statistics Dashboard**
- **Visible Pages**: Count of currently visible pages
- **Hidden Pages**: Count of currently hidden pages
- **Total Pages**: Total number of pages in the system

### 3. **Session Management**
- **Session Timer**: Shows remaining session time in minutes
- **Logout Button**: Manually end your session

### 4. **Reset to Defaults**
- Restore all pages to their default visibility settings
- Confirmation dialog prevents accidental resets

---

## 🔧 How It Works

### Page Visibility System

#### 1. **Configuration Storage** (`lib/page-visibility.ts`)
- Page visibility settings are stored in browser `localStorage`
- Settings persist across page refreshes
- Default configuration is defined in code

#### 2. **Authentication** (`lib/admin-auth.ts`)
- Simple password-based authentication
- Session expires after 24 hours
- Session data stored in `localStorage`

#### 3. **Navigation Integration** (`components/navigation.tsx`)
- Navigation menu automatically updates when visibility changes
- Hidden pages are removed from navigation
- "Register Now" CTA button only shows when Register page is visible
- Real-time updates without page refresh

#### 4. **Route Protection** (`components/page-guard.tsx`)
- Protects hidden pages from direct URL access
- Two modes:
  - **Redirect Mode**: Automatically redirects to homepage
  - **Coming Soon Mode**: Shows "Page Not Available" message

---

## 📝 Usage Scenarios

### Scenario 1: Before Information Session
**Goal**: Show basic information, hide registration

**Settings**:
- ✅ Home, About, Travel, Budget, FAQ, Contact, Family Tree
- ❌ Register, Schedule

**Result**: Family can learn about the reunion but cannot register yet

---

### Scenario 2: After Information Session
**Goal**: Open registration, keep schedule hidden

**Settings**:
- ✅ Home, About, Travel, Budget, Register, FAQ, Contact, Family Tree
- ❌ Schedule (still being finalized)

**Result**: Family can now register while schedule is being finalized

---

### Scenario 3: Full Launch
**Goal**: All pages visible

**Settings**:
- ✅ All pages visible

**Result**: Complete website access for all family members

---

## 🛠️ Technical Implementation

### Files Created

1. **`lib/page-visibility.ts`**
   - Page configuration and visibility management
   - localStorage integration
   - Helper functions for checking/toggling visibility

2. **`lib/admin-auth.ts`**
   - Authentication system
   - Session management
   - Password verification

3. **`app/admin/page.tsx`**
   - Admin page route
   - Authentication check
   - Login/Dashboard routing

4. **`components/admin-login.tsx`**
   - Login form component
   - Password input
   - Error handling

5. **`components/admin-dashboard.tsx`**
   - Main dashboard interface
   - Page visibility toggles
   - Statistics display
   - Reset functionality

6. **`components/page-guard.tsx`**
   - Route protection component
   - Visibility checking
   - "Coming Soon" display

### Files Modified

1. **`components/navigation.tsx`**
   - Integrated page visibility system
   - Dynamic navigation menu
   - Real-time updates via event listeners
   - Conditional "Register Now" button

2. **`app/register/page.tsx`**
   - Added PageGuard wrapper
   - Shows "Coming Soon" when hidden

3. **`app/schedule/page.tsx`**
   - Added PageGuard wrapper
   - Shows "Coming Soon" when hidden

---

## 🔄 How Visibility Changes Work

### Step-by-Step Process:

1. **Admin toggles a page** in the dashboard
2. **Setting is saved** to localStorage
3. **Custom event is dispatched** (`pageVisibilityChanged`)
4. **Navigation component listens** for the event
5. **Navigation menu updates** immediately
6. **Page guards check** visibility on protected pages
7. **Changes take effect** without page refresh

### Event System:
```javascript
// Dashboard dispatches event
window.dispatchEvent(new Event('pageVisibilityChanged'))

// Navigation listens for event
window.addEventListener('pageVisibilityChanged', handleVisibilityChange)
```

---

## 🚀 Quick Start Guide

### For Administrators:

1. **Access Dashboard**
   ```
   http://localhost:3000/admin
   ```

2. **Login**
   - Enter password: `mahoney2026`
   - Click "Login"

3. **Toggle Pages**
   - Click "Hide" to remove a page from navigation
   - Click "Show" to add a page back to navigation
   - Changes take effect immediately

4. **Monitor Session**
   - Check session timer in top-right corner
   - Logout when finished

5. **Reset if Needed**
   - Click "Reset to Defaults" button
   - Confirm in dialog
   - All pages return to default visibility

---

## 🔒 Security Considerations

### Current Implementation:
- ✅ Password-protected admin access
- ✅ Session expiration (24 hours)
- ✅ Client-side authentication
- ✅ Hidden pages protected from direct access

### For Production:
- ⚠️ **Change default password** in `lib/admin-auth.ts`
- ⚠️ Consider server-side authentication
- ⚠️ Add HTTPS for secure password transmission
- ⚠️ Implement rate limiting for login attempts
- ⚠️ Consider database storage instead of localStorage

---

## 📱 Responsive Design

The admin dashboard is fully responsive:
- **Desktop**: Full dashboard with all features
- **Tablet**: Optimized layout with stacked elements
- **Mobile**: Touch-friendly toggles and buttons

---

## 🎨 Design Features

- **Glassmorphism styling** matching the main site
- **Color-coded status indicators**:
  - 🟢 Green = Visible pages
  - 🟠 Orange = Hidden pages
  - 🔵 Blue = Always visible (Home)
- **Real-time statistics**
- **Confirmation dialogs** for destructive actions
- **Session timer** for security awareness

---

## 🐛 Troubleshooting

### Issue: Changes not appearing
**Solution**: Refresh the page or check if JavaScript is enabled

### Issue: Session expired
**Solution**: Login again with the admin password

### Issue: Can't access hidden page
**Solution**: This is expected behavior - toggle the page to visible in admin dashboard

### Issue: Navigation not updating
**Solution**: Check browser console for errors, ensure localStorage is enabled

---

## 📞 Support

For technical issues or questions about the admin dashboard:
- Check this guide first
- Review the code comments in the implementation files
- Contact the development team

---

## 🎯 Best Practices

1. **Before Information Session**
   - Hide Registration and Schedule pages
   - Keep informational pages visible

2. **After Information Session**
   - Enable Registration page
   - Keep Schedule hidden until finalized

3. **Regular Monitoring**
   - Check which pages are visible
   - Update as reunion planning progresses

4. **Security**
   - Logout when finished
   - Don't share admin password
   - Change default password for production

---

**Last Updated**: 2025-10-05  
**Version**: 1.0  
**Status**: ✅ Fully Functional

