# 🚀 Neutaris - Full-Stack Fitness App

A modern, full-stack fitness application with Supabase backend, OTP authentication, and comprehensive workout tracking.

## ✨ Features

### 🔐 **Authentication & Security**
- **OTP-based Login**: Email verification with 6-digit codes
- **Device Memory**: 30-day automatic login on trusted devices
- **Multi-Device Support**: Multiple devices per account with OTP verification
- **Input Validation**: Filters inappropriate content from names
- **JWT Tokens**: Secure authentication with automatic refresh

### 👤 **User Management**
- **Email-based Accounts**: Simple signup with email, name, and fitness goal
- **Profile System**: Up to 5 profiles per account
- **Character Creation**: Interactive body composition slider
- **Profile Memory**: Persistent profile data across sessions

### 💪 **Workout System**
- **5 Workout Plans**: Build Strength, Lose Weight, Build Muscle, Improve Fitness, General Fitness
- **Rest Day Management**: Automatic rest day scheduling
- **Progress Tracking**: Checkbox completion for each workout
- **Calorie Calculation**: Weekly calorie burn tracking
- **Calendar Integration**: Monthly workout scheduling

### 📊 **Analytics & Tracking**
- **Weekly Calories**: Automatic calorie calculation based on completed workouts
- **Progress Memory**: Persistent workout completion data
- **Profile-specific Data**: Separate tracking for each profile
- **Real-time Updates**: Live calorie counter updates

### 🎨 **Modern Design**
- **Dark Theme**: Beautiful dark interface with glassmorphism
- **Noctis Texturea Font**: Elegant typography for titles
- **Apple System Fonts**: Clean, readable body text
- **Smooth Animations**: GSAP-powered transitions
- **Responsive Design**: Works on all devices

## 🛠️ Technology Stack

### **Frontend**
- **React 18**: Modern UI framework
- **Vite**: Fast build tool and dev server
- **GSAP**: Professional animations
- **Framer Motion**: Component animations
- **js-cookie**: Cookie management

### **Backend**
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **Supabase**: Database and authentication
- **Nodemailer**: Email service
- **JWT**: Token-based authentication

### **Database**
- **PostgreSQL**: Primary database (via Supabase)
- **Row Level Security**: Data protection
- **Real-time subscriptions**: Live updates

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+
- Supabase account
- Gmail account (for OTP emails)

### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/neutaris-fullstack.git
cd neutaris-fullstack
