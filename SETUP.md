# 🚀 Neutaris Full-Stack Setup Guide

Complete setup instructions for the Neutaris fitness application with Supabase backend and OTP authentication.

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- Supabase account (free tier available)
- Gmail account (for OTP emails)
- Code editor (VS Code recommended)

## 🗄️ Database Setup

### **Step 1: Create Supabase Project**

1. **Go to Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Sign up or log in
   - Click "New Project"

2. **Configure Project**
   - Choose your organization
   - Enter project name: `neutaris-db`
   - Enter database password (save this!)
   - Choose region closest to you
   - Click "Create new project"

3. **Wait for Setup**
   - Project creation takes 2-3 minutes
   - You'll receive an email when ready

### **Step 2: Get API Keys**

1. **Navigate to Settings**
   - Go to Settings → API
   - Copy the following values:
     - Project URL
     - Anon (public) key
     - Service role key

2. **Save These Securely**
   - You'll need these for environment variables
   - Keep them private and secure

### **Step 3: Run Database Setup**

1. **Open SQL Editor**
   - Go to SQL Editor in your Supabase dashboard
   - Click "New query"

2. **Run Setup Script**
   - Copy the entire content of `database/setup.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute

3. **Verify Setup**
   - Go to Table Editor
   - You should see these tables:
     - `users`
     - `profiles`
     - `workouts`
     - `otp_codes`

4. **Check Functions**
   - Go to Database → Functions
   - Verify these functions exist:
     - `cleanup_expired_otp()` (manual cleanup function)
     - `get_weekly_calories()`

### **Step 4: Configure Row Level Security**

The setup script automatically configures RLS policies, but verify:

1. **Check RLS Status**
   - Go to Table Editor
   - Click on each table
   - Verify "RLS" is enabled

2. **Test Policies**
   - Try inserting test data
   - Verify policies work as expected

### **Step 5: Manual OTP Cleanup (Important!)**

Since Supabase doesn't support cron jobs by default, OTP cleanup is handled manually:

1. **Automatic Cleanup**
   - The backend automatically calls `cleanup_expired_otp()` before each OTP request
   - This keeps the database clean during normal operation

2. **Manual Cleanup (Optional)**
   - If you want to manually clean up expired OTPs:
   ```sql
   SELECT cleanup_expired_otp();
