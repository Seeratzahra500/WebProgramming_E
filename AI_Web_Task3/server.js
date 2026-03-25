const express = require('express');
const session = require('express-session');
const connectDB = require('./db');
const { User } = require('./User');

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'aiSecretKey',
  resave: false,
  saveUninitialized: false
}));

const authMiddleware = (req, res, next) => {
  req.session.user ? next() : res.status(401).json({ message: 'Unauthorized. Please login first.' });
};

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User(username, password);
    const result = await user.register();
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User(username, password);
    const result = await user.login();
    req.session.user = result.username;
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

app.get('/dashboard', authMiddleware, (req, res) => {
  res.status(200).json({ message: `Welcome ${req.session.user}` });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: 'Logout successful' });
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
