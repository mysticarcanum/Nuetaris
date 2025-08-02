const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "https://api.github.com"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving
app.use(express.static(path.join(__dirname, '../dist')));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Validation middleware
const validateEmail = [
  body('email').isEmail().normalizeEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Neutaris server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// User authentication endpoints
app.post('/api/auth/signup', validateEmail, async (req, res) => {
  try {
    const { email, name, goal } = req.body;
    
    // Validate input
    if (!email || !name || !goal) {
      return res.status(400).json({ 
        error: 'Email, name, and goal are required' 
      });
    }
    
    // Check for inappropriate content
    const inappropriateWords = ['inappropriate', 'bad', 'words']; // Add your list
    const containsInappropriate = inappropriateWords.some(word => 
      name.toLowerCase().includes(word) || 
      goal.toLowerCase().includes(word)
    );
    
    if (containsInappropriate) {
      return res.status(400).json({ 
        error: 'Please use appropriate language' 
      });
    }
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    // Store OTP (in production, use Redis or database)
    // For now, we'll simulate storage
    console.log(`OTP for ${email}: ${otp}`);
    
    // Send email (configure your email service)
    // await sendOTPEmail(email, otp);
    
    res.json({ 
      message: 'OTP sent to email',
      email: email
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', validateEmail, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Generate OTP for login
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    console.log(`Login OTP for ${email}: ${otp}`);
    
    // Send email (configure your email service)
    // await sendOTPEmail(email, otp);
    
    res.json({ 
      message: 'OTP sent to email',
      email: email
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }
    
    // Verify OTP (in production, check against stored OTP)
    // For now, accept any 6-digit number
    if (otp.toString().length !== 6) {
      return res.status(400).json({ error: 'Invalid OTP format' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { email: email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    res.json({ 
      message: 'Authentication successful',
      token: token,
      user: { email: email }
    });
    
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Profile management endpoints
app.post('/api/profiles', async (req, res) => {
  try {
    const { name, email, goal, weight, height, gender, character } = req.body;
    
    if (!name || !email || !goal) {
      return res.status(400).json({ error: 'Name, email, and goal are required' });
    }
    
    // Create profile (in production, save to database)
    const profile = {
      id: Date.now().toString(),
      name,
      email,
      goal,
      weight,
      height,
      gender,
      character,
      createdAt: new Date().toISOString()
    };
    
    res.json({ 
      message: 'Profile created successfully',
      profile: profile
    });
    
  } catch (error) {
    console.error('Profile creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/profiles/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    // Get profiles for user (in production, query database)
    // For now, return mock data
    const profiles = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: email,
        goal: 'build-strength',
        weight: 62,
        height: 5.7,
        gender: 'female',
        character: { eyes: 0, hair: 0, body: 0, face: 0, clothing: 0, skinTone: 0 },
        createdAt: new Date().toISOString()
      }
    ];
    
    res.json({ profiles });
    
  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Workout and meal tracking endpoints
app.post('/api/workouts', async (req, res) => {
  try {
    const { profileId, workout, date } = req.body;
    
    if (!profileId || !workout || !date) {
      return res.status(400).json({ error: 'Profile ID, workout, and date are required' });
    }
    
    // Save workout (in production, save to database)
    const workoutRecord = {
      id: Date.now().toString(),
      profileId,
      workout,
      date,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    res.json({ 
      message: 'Workout saved successfully',
      workout: workoutRecord
    });
    
  } catch (error) {
    console.error('Workout save error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/meals', async (req, res) => {
  try {
    const { profileId, meal, date, nutrition } = req.body;
    
    if (!profileId || !meal || !date) {
      return res.status(400).json({ error: 'Profile ID, meal, and date are required' });
    }
    
    // Save meal (in production, save to database)
    const mealRecord = {
      id: Date.now().toString(),
      profileId,
      meal,
      date,
      nutrition,
      createdAt: new Date().toISOString()
    };
    
    res.json({ 
      message: 'Meal saved successfully',
      meal: mealRecord
    });
    
  } catch (error) {
    console.error('Meal save error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// File upload endpoint
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({ 
      message: 'File uploaded successfully',
      fileUrl: fileUrl,
      filename: req.file.filename
    });
    
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Character customization endpoint
app.post('/api/character', async (req, res) => {
  try {
    const { profileId, character } = req.body;
    
    if (!profileId || !character) {
      return res.status(400).json({ error: 'Profile ID and character data are required' });
    }
    
    // Save character (in production, save to database)
    const characterRecord = {
      profileId,
      character,
      updatedAt: new Date().toISOString()
    };
    
    res.json({ 
      message: 'Character saved successfully',
      character: characterRecord
    });
    
  } catch (error) {
    console.error('Character save error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Neutaris server running on port ${PORT}`);
  console.log(`📱 Client should be available at http://localhost:3000`);
  console.log(`🔧 API health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
2. Create server/emailService.js (Email Service)
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendOTPEmail(email, otp) {
    try {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Neutaris - Your Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ff8c00; text-align: center;">Neutaris</h2>
            <h3 style="color: #333;">Your Verification Code</h3>
            <p>Hello!</p>
            <p>Your verification code is:</p>
            <div style="background: #f4f1eb; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
              <h1 style="color: #ff8c00; font-size: 32px; margin: 0;">${otp}</h1>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px; text-align: center;">
              © 2024 Neutaris. All rights reserved.
            </p>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async sendWelcomeEmail(email, name) {
    try {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Welcome to Neutaris!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ff8c00; text-align: center;">Welcome to Neutaris!</h2>
            <h3 style="color: #333;">Hello ${name}!</h3>
            <p>Welcome to your fitness journey with Neutaris!</p>
            <p>We're excited to help you achieve your fitness goals with our personalized workout and meal planning features.</p>
            <div style="background: #f4f1eb; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h4 style="color: #333; margin-top: 0;">What you can do:</h4>
              <ul style="color: #666;">
                <li>Create your unique character</li>
                <li>Plan personalized workouts</li>
                <li>Track your nutrition</li>
                <li>Monitor your progress</li>
              </ul>
            </div>
            <p>Start your journey today!</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px; text-align: center;">
              © 2024 Neutaris. All rights reserved.
            </p>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Welcome email sending failed:', error);
      return false;
    }
  }
}

module.exports = EmailService;
