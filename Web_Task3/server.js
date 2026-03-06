const express = require('express');
const session = require('express-session');
const connectDB = require('./db');
const { User } = require('./User');

const app = express();
const PORT = 3000;

// ─────────────────────────────────────────────
// Connect to MongoDB
// ─────────────────────────────────────────────
connectDB();

// ─────────────────────────────────────────────
// Middleware Setup
// ─────────────────────────────────────────────

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'mySecretKey123',   // Secret key to sign the session ID cookie
  resave: false,               // Don't save session if nothing changed
  saveUninitialized: false,    // Don't create session until something is stored
  cookie: {
    maxAge: 1000 * 60 * 60    // Session lasts 1 hour (in milliseconds)
  }
}));

// ─────────────────────────────────────────────
// Authentication Middleware
// Protects routes that require login
// ─────────────────────────────────────────────
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    // User is logged in — continue to the route
    next();
  } else {
    // User is NOT logged in — block access
    res.status(401).json({ message: 'Unauthorized. Please login first.' });
  }
}

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────

// POST /register — Create a new account
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Basic input validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const newUser = new User(username, password);
    const result = await newUser.register();
    res.status(201).json(result);
    // Output: { success: true, message: "User registered successfully" }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /login — Login with existing credentials
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Basic input validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const loginUser = new User(username, password);
    const result = await loginUser.login();

    // Create session — store username in session
    req.session.user = result.username;

    res.status(200).json({ message: 'Login successful' });
    // Output: { message: "Login successful" }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// GET /dashboard — Protected route (requires login)
app.get('/dashboard', isAuthenticated, (req, res) => {
  // req.session.user holds the logged-in username
  res.status(200).json({ message: `Welcome ${req.session.user}` });
  // Output: { message: "Welcome username" }
});

// GET /logout — Destroy session and logout
app.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.status(200).json({ message: 'Logout successful' });
    // Output: { message: "Logout successful" }
  });
});

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
