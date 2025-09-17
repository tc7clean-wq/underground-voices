// This tells Node.js to use modern JavaScript features
"use strict";

// Import the tools we need
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import our custom route files
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const storyboardRoutes = require('./routes/storyboards');

// Create the Express app (this is like creating a web server)
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - these are like filters that process requests
app.use(cors()); // Allows frontend to talk to backend
app.use(express.json()); // Converts JSON data to JavaScript objects

// Routes - these tell the server what to do when someone visits different URLs
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/storyboards', storyboardRoutes);

// Serve static files from the React app build folder
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

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
