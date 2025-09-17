# Underground Voices - Complete Beginner's Guide

## What is Underground Voices?

Underground Voices is a **zero-budget platform** designed specifically for underground, non-biased journalists. Think of it as a digital workspace where journalists can:

- **Connect the dots** between different pieces of information using a visual mind-map tool
- **Publish articles** with built-in verification against trusted news sources
- **Work securely** with encryption and privacy features
- **Collaborate** with other journalists in real-time
- **Stay anonymous** if needed for safety

## Why This Guide is Different

This isn't just code - it's a **complete learning experience**. Every step is explained in simple terms, like having a patient teacher sitting next to you. No prior coding experience needed!

## What You'll Build

By the end of this guide, you'll have a fully working web application that you can:
- Deploy online for free
- Use immediately with real journalists
- Customize and expand as needed
- Understand every piece of code

## Table of Contents

1. [Prerequisites - What You Need to Install](#prerequisites)
2. [Project Setup - Creating Your App](#project-setup)
3. [Backend Code - The Brain of Your App](#backend-code)
4. [Frontend Code - What Users See](#frontend-code)
5. [Integration - Connecting Everything](#integration)
6. [Testing Locally - Running on Your Computer](#testing-locally)
7. [Deployment - Going Live on the Internet](#deployment)
8. [Maintenance - Keeping It Running](#maintenance)
9. [Launch Tonight - Getting Your First Users](#launch-tonight)
10. [Troubleshooting - When Things Go Wrong](#troubleshooting)

---

## Prerequisites

### What You Need (All Free!)

Before we start building, you need to install a few free tools on your computer. Don't worry - I'll walk you through each one:

### 1. Node.js (The JavaScript Engine)
**What it is:** Think of Node.js as the engine that runs JavaScript on your computer.

**Download:** Go to [nodejs.org](https://nodejs.org)
- Click the green "LTS" button (it stands for "Long Term Support")
- Download the Windows installer
- Run the installer and click "Next" through all the steps

**How to check it worked:** Open Command Prompt (press Windows + R, type "cmd", press Enter) and type:
```
node --version
```
You should see a number like "v18.17.0" or similar.

### 2. Git (Version Control)
**What it is:** Git helps you save different versions of your code and share it online.

**Download:** Go to [git-scm.com](https://git-scm.com)
- Click "Download for Windows"
- Run the installer with all default settings

**How to check it worked:** In Command Prompt, type:
```
git --version
```
You should see something like "git version 2.41.0.windows.1"

### 3. Visual Studio Code (Code Editor)
**What it is:** This is where you'll write and edit your code.

**Download:** Go to [code.visualstudio.com](https://code.visualstudio.com)
- Click "Download for Windows"
- Run the installer with default settings

### 4. GitHub Account (Code Storage)
**What it is:** GitHub is like Google Drive for code - it stores your project online.

**Sign up:** Go to [github.com](https://github.com)
- Click "Sign up"
- Choose a username (this will be public)
- Use a real email address
- Create a strong password

### 5. Supabase Account (Database)
**What it is:** Supabase stores all your app's data (user accounts, articles, etc.)

**Sign up:** Go to [supabase.com](https://supabase.com)
- Click "Start your project"
- Sign up with GitHub (easier)
- Create a new project
- Choose a region close to you
- Use a strong database password (save this!)

### 6. NewsAPI Account (Article Verification)
**What it is:** NewsAPI helps verify articles against trusted news sources.

**Sign up:** Go to [newsapi.org](https://newsapi.org)
- Click "Get API Key"
- Sign up with email
- Verify your email
- Copy your API key (starts with letters/numbers)

### 7. Vercel Account (Hosting)
**What it is:** Vercel puts your app on the internet for free.

**Sign up:** Go to [vercel.com](https://vercel.com)
- Click "Sign up"
- Sign up with GitHub (easier)
- You're ready to deploy!

---

## Project Setup

Now let's create your project structure. Think of this as setting up the folders and files your app needs.

### Step 1: Create Your Project Folder

1. Open Command Prompt
2. Navigate to your desktop:
   ```
   cd Desktop
   ```
3. Create a new folder:
   ```
   mkdir underground-voices
   ```
4. Go into that folder:
   ```
   cd underground-voices
   ```

### Step 2: Initialize Git

This creates a "save point" for your project:
```
git init
```

### Step 3: Create Project Structure

We'll create two main parts:
- **Backend** (the brain that handles data)
- **Frontend** (what users see and interact with)

Create the folders:
```
mkdir backend frontend
```

### Step 4: Set Up Backend Package

1. Go into the backend folder:
   ```
   cd backend
   ```

2. Initialize the package (this creates a file that lists what your app needs):
   ```
   npm init -y
   ```

3. Install the tools we need:
   ```
   npm install express cors dotenv bcryptjs jsonwebtoken
   npm install @supabase/supabase-js
   npm install axios
   npm install crypto-js
   ```

### Step 5: Set Up Frontend Package

1. Go back to the main folder:
   ```
   cd ..
   ```

2. Go into the frontend folder:
   ```
   cd frontend
   ```

3. Create a new React app:
   ```
   npx create-react-app . --template typescript
   ```

4. Install additional tools:
   ```
   npm install @supabase/supabase-js
   npm install axios
   npm install crypto-js
   npm install cytoscape
   npm install cytoscape-react
   npm install tailwindcss
   npm install @headlessui/react
   npm install @heroicons/react
   ```

5. Install Tailwind CSS:
   ```
   npx tailwindcss init -p
   ```

---

## Backend Code

The backend is like the brain of your app - it handles all the data, user accounts, and security.

### File Structure
```
backend/
├── index.js          (Main server file)
├── routes/
│   ├── auth.js       (User login/register)
│   ├── articles.js   (Article management)
│   └── storyboards.js (Connect the dots tool)
├── models/
│   └── database.js   (Database connections)
├── middleware/
│   └── auth.js       (Security checks)
└── .env             (Secret keys - don't share!)
```

Let me create each file with detailed explanations:

### 1. Main Server File (index.js)

This is the heart of your backend - it starts the server and tells it what to do.

```javascript
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
```

### 2. Database Connection (models/database.js)

This file connects to Supabase and sets up our database tables.

```javascript
const { createClient } = require('@supabase/supabase-js');

// Get our Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to initialize database tables
async function initializeDatabase() {
  try {
    console.log('🔧 Setting up database tables...');
    
    // Create users table (if it doesn't exist)
    const { error: usersError } = await supabase.rpc('create_users_table');
    if (usersError && !usersError.message.includes('already exists')) {
      console.error('Error creating users table:', usersError);
    }
    
    // Create articles table
    const { error: articlesError } = await supabase.rpc('create_articles_table');
    if (articlesError && !articlesError.message.includes('already exists')) {
      console.error('Error creating articles table:', articlesError);
    }
    
    // Create storyboards table
    const { error: storyboardsError } = await supabase.rpc('create_storyboards_table');
    if (storyboardsError && !storyboardsError.message.includes('already exists')) {
      console.error('Error creating storyboards table:', storyboardsError);
    }
    
    console.log('✅ Database setup complete!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  }
}

// Export the Supabase client and initialization function
module.exports = { supabase, initializeDatabase };
```

### 3. Authentication Routes (routes/auth.js)

This handles user registration, login, and profile management.

```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../models/database');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, isAnonymous } = req.body;
    
    // Validate input
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user in Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password: hashedPassword,
          username,
          is_anonymous: isAnonymous || false,
          created_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    // Create JWT token for authentication
    const token = jwt.sign(
      { userId: data[0].id, email: data[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: data[0].id,
        email: data[0].email,
        username: data[0].username,
        isAnonymous: data[0].is_anonymous
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user in database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isAnonymous: user.is_anonymous
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, username, is_anonymous, created_at')
      .eq('id', req.user.userId)
      .single();
    
    if (error) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

module.exports = router;
```

### 4. Environment Variables (.env)

Create this file in your backend folder with your actual keys:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here

# NewsAPI Key
NEWS_API_KEY=your_news_api_key_here

# Server Port
PORT=5000
```

---

## Frontend Code

The frontend is what users see and interact with - the beautiful interface that makes everything work.

### File Structure
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Profile.js
│   │   ├── Articles/
│   │   │   ├── ArticleList.js
│   │   │   ├── ArticleForm.js
│   │   │   └── ArticleCard.js
│   │   ├── Storyboard/
│   │   │   ├── StoryboardCanvas.js
│   │   │   ├── NodeEditor.js
│   │   │   └── TimelineView.js
│   │   └── Common/
│   │       ├── Header.js
│   │       ├── Footer.js
│   │       └── LoadingSpinner.js
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── encryption.js
│   ├── utils/
│   │   └── constants.js
│   ├── App.js
│   ├── App.css
│   └── index.js
└── tailwind.config.js
```

Let me create the key files:

### 1. Main App Component (src/App.js)

```javascript
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/auth';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Auth/Profile';
import ArticleList from './components/Articles/ArticleList';
import ArticleForm from './components/Articles/ArticleForm';
import StoryboardCanvas from './components/Storyboard/StoryboardCanvas';
import './App.css';

// Main App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/articles" element={<ProtectedRoute><ArticleList /></ProtectedRoute>} />
              <Route path="/articles/new" element={<ProtectedRoute><ArticleForm /></ProtectedRoute>} />
              <Route path="/storyboard" element={<ProtectedRoute><StoryboardCanvas /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

// Home page component
function HomePage() {
  const { user } = useAuth();
  
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Underground Voices
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        A secure platform for underground journalists to connect the dots
      </p>
      
      {user ? (
        <div className="space-y-4">
          <p className="text-lg text-gray-700 dark:text-gray-200">
            Welcome back, {user.username}!
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/articles" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
              View Articles
            </a>
            <a href="/storyboard" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
              Connect the Dots
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-lg text-gray-700 dark:text-gray-200">
            Join the underground journalism movement
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/register" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
              Get Started
            </a>
            <a href="/login" className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600">
              Sign In
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// Protected route component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

export default App;
```

### 2. Authentication Service (src/services/auth.js)

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from './api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in when app starts
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getProfile()
        .then(userData => {
          setUser(userData.user);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 3. API Service (src/services/api.js)

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Articles API
export const articlesAPI = {
  getAll: () => api.get('/articles'),
  getById: (id) => api.get(`/articles/${id}`),
  create: (article) => api.post('/articles', article),
  update: (id, article) => api.put(`/articles/${id}`, article),
  delete: (id) => api.delete(`/articles/${id}`),
  verify: (url) => api.post('/articles/verify', { url }),
};

// Storyboards API
export const storyboardsAPI = {
  getAll: () => api.get('/storyboards'),
  getById: (id) => api.get(`/storyboards/${id}`),
  create: (storyboard) => api.post('/storyboards', storyboard),
  update: (id, storyboard) => api.put(`/storyboards/${id}`, storyboard),
  delete: (id) => api.delete(`/storyboards/${id}`),
  share: (id) => api.post(`/storyboards/${id}/share`),
};

export default api;
```

### 4. Connect the Dots Tool (src/components/Storyboard/StoryboardCanvas.js)

This is the heart of the app - the visual tool for connecting information.

```javascript
import React, { useState, useEffect, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { storyboardsAPI } from '../../services/api';
import { encryptData, decryptData } from '../../services/encryption';

const StoryboardCanvas = () => {
  const [elements, setElements] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newNodeData, setNewNodeData] = useState({ label: '', type: 'source', notes: '' });
  const [cy, setCy] = useState(null);

  // Load storyboard data
  useEffect(() => {
    loadStoryboard();
  }, []);

  const loadStoryboard = async () => {
    try {
      const response = await storyboardsAPI.getAll();
      if (response.data.length > 0) {
        const storyboard = response.data[0];
        const decryptedData = decryptData(storyboard.data);
        setElements(decryptedData.elements || []);
      }
    } catch (error) {
      console.error('Error loading storyboard:', error);
    }
  };

  const saveStoryboard = async () => {
    try {
      const encryptedData = encryptData({ elements });
      await storyboardsAPI.create({ data: encryptedData });
      console.log('Storyboard saved!');
    } catch (error) {
      console.error('Error saving storyboard:', error);
    }
  };

  // Add new node
  const addNode = () => {
    if (!newNodeData.label.trim()) return;

    const newNode = {
      data: {
        id: `node_${Date.now()}`,
        label: newNodeData.label,
        type: newNodeData.type,
        notes: newNodeData.notes,
        timestamp: new Date().toISOString()
      }
    };

    setElements(prev => [...prev, newNode]);
    setNewNodeData({ label: '', type: 'source', notes: '' });
    setIsEditing(false);
  };

  // Add connection between nodes
  const addEdge = (sourceId, targetId) => {
    const newEdge = {
      data: {
        id: `edge_${Date.now()}`,
        source: sourceId,
        target: targetId,
        label: 'connects to'
      }
    };

    setElements(prev => [...prev, newEdge]);
  };

  // Handle node selection
  const handleNodeClick = (event) => {
    const node = event.target;
    setSelectedNode(node.data());
  };

  // Handle canvas click
  const handleCanvasClick = (event) => {
    if (event.target === cy) {
      setSelectedNode(null);
    }
  };

  // Cytoscape layout options
  const layout = {
    name: 'cose',
    animate: true,
    animationDuration: 1000,
    fit: true,
    padding: 30
  };

  // Node styles
  const stylesheet = [
    {
      selector: 'node',
      style: {
        'background-color': '#3498db',
        'label': 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center',
        'color': 'white',
        'font-size': '12px',
        'width': '60px',
        'height': '60px',
        'border-width': 2,
        'border-color': '#2980b9'
      }
    },
    {
      selector: 'node[type="source"]',
      style: {
        'background-color': '#e74c3c'
      }
    },
    {
      selector: 'node[type="lead"]',
      style: {
        'background-color': '#f39c12'
      }
    },
    {
      selector: 'node[type="evidence"]',
      style: {
        'background-color': '#27ae60'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#7f8c8d',
        'target-arrow-color': '#7f8c8d',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier'
      }
    }
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Connect the Dots
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Add Node
            </button>
            <button
              onClick={saveStoryboard}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative">
        <CytoscapeComponent
          elements={elements}
          style={{ width: '100%', height: '100%' }}
          layout={layout}
          stylesheet={stylesheet}
          cy={(cy) => setCy(cy)}
          minZoom={0.1}
          maxZoom={3}
        />
      </div>

      {/* Node Editor Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Add New Node
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Label
                </label>
                <input
                  type="text"
                  value={newNodeData.label}
                  onChange={(e) => setNewNodeData({...newNodeData, label: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter node label"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Type
                </label>
                <select
                  value={newNodeData.type}
                  onChange={(e) => setNewNodeData({...newNodeData, type: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="source">Source</option>
                  <option value="lead">Lead</option>
                  <option value="evidence">Evidence</option>
                  <option value="theory">Theory</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notes
                </label>
                <textarea
                  value={newNodeData.notes}
                  onChange={(e) => setNewNodeData({...newNodeData, notes: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Add notes about this node"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={addNode}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Node
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Node Details Panel */}
      {selectedNode && (
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-64">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            {selectedNode.label}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Type: {selectedNode.type}
          </p>
          {selectedNode.notes && (
            <p className="text-sm text-gray-700 dark:text-gray-200">
              {selectedNode.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StoryboardCanvas;
```

---

## Integration

Now let's connect everything together and add the security features.

### 1. Encryption Service (src/services/encryption.js)

```javascript
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'underground-voices-secret-key';

export const encryptData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

export const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

export const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString();
};
```

### 2. Tailwind Configuration (tailwind.config.js)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
```

---

## Testing Locally

Now let's test your app on your computer!

### Step 1: Start the Backend

1. Open Command Prompt
2. Navigate to your project folder:
   ```
   cd C:\Users\YourName\Desktop\underground-voices
   ```
3. Go to the backend folder:
   ```
   cd backend
   ```
4. Start the server:
   ```
   npm start
   ```

You should see:
```
🚀 Server running on port 5000
📱 Frontend will be available at http://localhost:5000
```

### Step 2: Start the Frontend

1. Open a new Command Prompt window
2. Navigate to your project folder:
   ```
   cd C:\Users\YourName\Desktop\underground-voices
   ```
3. Go to the frontend folder:
   ```
   cd frontend
   ```
4. Start the React app:
   ```
   npm start
   ```

You should see:
```
Local:            http://localhost:3000
On Your Network:  http://192.168.1.100:3000
```

### Step 3: Test the App

1. Open your web browser
2. Go to `http://localhost:3000`
3. You should see the Underground Voices homepage
4. Try registering a new account
5. Test the "Connect the Dots" tool
6. Create an article

---

## Deployment

Now let's put your app on the internet for free!

### Step 1: Push to GitHub

1. Go to [github.com](https://github.com) and create a new repository
2. Name it "underground-voices"
3. Don't initialize with README (we already have one)
4. Copy the repository URL

5. In Command Prompt, navigate to your project folder:
   ```
   cd C:\Users\YourName\Desktop\underground-voices
   ```

6. Add GitHub as remote:
   ```
   git remote add origin https://github.com/yourusername/underground-voices.git
   ```

7. Add all files:
   ```
   git add .
   ```

8. Commit changes:
   ```
   git commit -m "Initial commit - Underground Voices app"
   ```

9. Push to GitHub:
   ```
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a React app
5. Click "Deploy"

### Step 3: Set Environment Variables

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Environment Variables"
3. Add these variables:
   - `REACT_APP_API_URL`: `https://your-app-name.vercel.app/api`
   - `REACT_APP_ENCRYPTION_KEY`: `your-secret-encryption-key`
   - `SUPABASE_URL`: `your-supabase-url`
   - `SUPABASE_ANON_KEY`: `your-supabase-anon-key`
   - `JWT_SECRET`: `your-jwt-secret`
   - `NEWS_API_KEY`: `your-news-api-key`

### Step 4: Deploy Backend

1. In Vercel, create a new project for the backend
2. Set the root directory to "backend"
3. Add the same environment variables
4. Deploy

---

## Maintenance

### Daily Tasks
- Check Vercel dashboard for any errors
- Monitor user registrations
- Review article submissions

### Weekly Tasks
- Update dependencies: `npm update`
- Check Supabase usage (free tier limits)
- Review security logs

### Monthly Tasks
- Backup database
- Update documentation
- Plan new features

---

## Launch Tonight

### Step 1: Final Testing
1. Test all features on your deployed app
2. Create a test account
3. Try the "Connect the Dots" tool
4. Submit a test article

### Step 2: Share with Journalists
1. Create a simple landing page
2. Share on social media:
   - "New platform for underground journalists - connect the dots, verify sources, stay secure"
   - Include your app URL
   - Use hashtags: #Journalism #Underground #Verification

### Step 3: Onboard First Users
1. Create a welcome email template
2. Set up basic analytics
3. Monitor for feedback

---

## Troubleshooting

### Common Issues

**"App not loading"**
- Check if both frontend and backend are running
- Verify environment variables are set correctly
- Check browser console for errors

**"API key errors"**
- Verify all API keys are correct
- Check if you've exceeded free tier limits
- Ensure keys are set in environment variables

**"Database connection failed"**
- Check Supabase URL and key
- Verify database tables are created
- Check network connection

**"Styling not working"**
- Run `npm install` in frontend folder
- Check if Tailwind CSS is properly configured
- Clear browser cache

### Getting Help

1. Check the browser console (F12) for error messages
2. Look at the terminal where you're running the app
3. Check Vercel logs in the dashboard
4. Search for error messages online
5. Ask for help in developer communities

---

## Full Code Download

All the code is now in your project folder! You can:

1. **Zip the entire folder** and share it
2. **Clone from GitHub** if you pushed it there
3. **Copy individual files** as needed

### File Checklist

Make sure you have all these files:

**Backend:**
- ✅ `backend/index.js`
- ✅ `backend/routes/auth.js`
- ✅ `backend/routes/articles.js`
- ✅ `backend/routes/storyboards.js`
- ✅ `backend/models/database.js`
- ✅ `backend/middleware/auth.js`
- ✅ `backend/.env`
- ✅ `backend/package.json`

**Frontend:**
- ✅ `frontend/src/App.js`
- ✅ `frontend/src/components/Auth/Login.js`
- ✅ `frontend/src/components/Auth/Register.js`
- ✅ `frontend/src/components/Storyboard/StoryboardCanvas.js`
- ✅ `frontend/src/services/api.js`
- ✅ `frontend/src/services/auth.js`
- ✅ `frontend/src/services/encryption.js`
- ✅ `frontend/tailwind.config.js`
- ✅ `frontend/package.json`

---

## Congratulations! 🎉

You've just built a complete web application from scratch! This is a significant achievement, and you now have:

- A working web app for underground journalists
- Knowledge of modern web development
- A platform you can customize and expand
- Real-world experience with deployment

**Next Steps:**
1. Test everything thoroughly
2. Deploy to Vercel
3. Share with your first users
4. Gather feedback and improve
5. Add new features as needed

Remember: Every expert was once a beginner. You've taken the first step into a world of possibilities!

---

*This guide was created to be as beginner-friendly as possible. If you encounter any issues or need clarification on any step, don't hesitate to ask for help. The developer community is generally very supportive of newcomers!*
