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
const POSTS_FILE = 'posts.json';

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

// Get all blog posts
app.get('/posts', (req, res) => {
  fs.readFile(POSTS_FILE, (err, data) => {
    if (err) return res.status(500).send("Error reading posts.");
    res.json(JSON.parse(data));
  });
});

// Get single blog post
app.get('/posts/:id', (req, res) => {
  fs.readFile(POSTS_FILE, (err, data) => {
    if (err) return res.status(500).send("Error reading posts.");
    const posts = JSON.parse(data);
    const post = posts.find(p => p.id === Number(req.params.id));
    if (!post) return res.status(404).send("Post not found");
    res.json(post);
  });
});

// Create new blog post (protected)
app.post('/posts', isAuthenticated, (req, res) => {
  const newPost = {
    ...req.body,
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    author: req.session.user,
    comments: []
  };
  
  fs.readFile(POSTS_FILE, (err, data) => {
    const posts = err ? [] : JSON.parse(data);
    posts.push(newPost);
    fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2), err => {
      if (err) return res.status(500).send("Error saving post.");
      res.status(200).json(newPost);
    });
  });
});

// Add comment to post (protected)
app.post('/posts/:id/comments', isAuthenticated, (req, res) => {
  const { comment } = req.body;
  fs.readFile(POSTS_FILE, (err, data) => {
    if (err) return res.status(500).send("Error reading posts.");
    const posts = JSON.parse(data);
    const postIndex = posts.findIndex(p => p.id === Number(req.params.id));
    if (postIndex === -1) return res.status(404).send("Post not found");
    
    const newComment = {
      username: req.session.user,
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    
    posts[postIndex].comments.push(newComment);
    fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2), err => {
      if (err) return res.status(500).send("Error saving comment.");
      res.status(200).json(newComment);
    });
  });
});

// Serve static files only after login
app.use('/public', isAuthenticated, express.static(path.join(__dirname, 'public')));

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
