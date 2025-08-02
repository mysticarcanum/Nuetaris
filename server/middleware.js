const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Rate limiting for specific endpoints
const createRateLimiter = (windowMs, max) => {
  return require('express-rate-limit')({
    windowMs,
    max,
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Input validation middleware
const validateProfile = (req, res, next) => {
  const { name, email, goal } = req.body;
  
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' });
  }
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  
  if (!goal) {
    return res.status(400).json({ error: 'Fitness goal is required' });
  }
  
  next();
};

// Error logging middleware
const errorLogger = (error, req, res, next) => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  next(error);
};

module.exports = {
  authenticateToken,
  createRateLimiter,
  validateProfile,
  errorLogger
};
