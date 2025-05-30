const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(session({
  secret: 'your_secret_key', // Replace with a strong secret in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Use true only with HTTPS
}));

const USERS_FILE = 'users.json';
const ORDERS_FILE = 'orders.json';

// ---------- Helper Middleware ----------
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
}

// ---------- Routes ----------

// Serve login page at root
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/public/index.html');
  } else {
    res.sendFile(path.join(__dirname, 'auth/login.html'));
  }
});

// Serve register page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'auth/register.html'));
});

// Login handler
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  fs.readFile(USERS_FILE, (err, data) => {
    if (err) return res.status(500).send("Server error");
    const users = JSON.parse(data);
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      req.session.user = username;
      res.status(200).send("Login successful");
    } else {
      res.status(401).send("Invalid credentials");
    }
  });
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send("Error logging out");
    res.send("Logged out");
  });
});

// Register handler
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  fs.readFile(USERS_FILE, (err, data) => {
    const users = err ? [] : JSON.parse(data);
    if (users.find(u => u.username === username)) {
      return res.status(400).send("User already exists");
    }
    users.push({ username, password });
    fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), err => {
      if (err) return res.status(500).send("Error saving user.");
      res.status(200).send("User registered.");
    });
  });
});

// Serve products (optional: keep public or protect)
app.get('/products', (req, res) => {
  fs.readFile('./public/products.json', (err, data) => {
    if (err) return res.status(500).send("Error reading products.");
    res.json(JSON.parse(data));
  });
});

// Place order - protected
app.post('/order', isAuthenticated, (req, res) => {
  const order = req.body;
  fs.readFile(ORDERS_FILE, (err, data) => {
    const orders = err ? [] : JSON.parse(data);
    orders.push({ ...order, user: req.session.user });
    fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), err => {
      if (err) return res.status(500).send("Error saving order.");
      res.status(200).send("Order saved.");
    });
  });
});

// Serve static files only after login
app.use('/public', isAuthenticated, express.static(path.join(__dirname, 'public')));

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
