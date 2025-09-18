// This tells Node.js to use modern JavaScript features
"use strict";

// Import the tools we need
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Validate environment variables
function validateEnvironment() {
  const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'JWT_SECRET', 'NEWS_API_KEY'];
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    process.exit(1);
  }

  if (process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters long');
    process.exit(1);
  }

  console.log('✅ Environment validation passed');
}

// Validate environment on startup
validateEnvironment();

// Import our custom route files
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const storyboardRoutes = require('./routes/storyboards');

// Create the Express app (this is like creating a web server)
const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet()); // Adds security headers
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://frontend-rho-khaki-88.vercel.app', 'https://underground-voices-delta.vercel.app', 'https://underground-voices.vercel.app']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
})); // Restricted CORS

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true
});

app.use(generalLimiter);
app.use('/api/auth', authLimiter);

// Middleware - these are like filters that process requests
app.use(express.json({ limit: '10mb' })); // Converts JSON data to JavaScript objects with size limit

// Routes - these tell the server what to do when someone visits different URLs
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/storyboards', storyboardRoutes);

// In development, let the React dev server handle the frontend
// In production, serve static files from the React app build folder
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // Catch-all handler: send back React's index.html file for any non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
} else {
  // In development, just serve API routes
  app.get('/', (req, res) => {
    res.json({ message: 'Underground Voices API is running! Frontend should be at http://localhost:3000' });
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend will be available at http://localhost:${PORT}`);
});

// Handle errors gracefully
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
