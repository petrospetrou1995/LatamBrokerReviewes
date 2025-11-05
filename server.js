const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https:"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:", "https://i.ytimg.com", "https://i1.ytimg.com", "https://i2.ytimg.com", "https://i3.ytimg.com", "https://i4.ytimg.com"],
            fontSrc: ["'self'", "https:", "data:"],
            connectSrc: ["'self'"],
            frameSrc: ["'self'", "https://www.youtube.com", "https://www.youtube-nocookie.com"],
            mediaSrc: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
}));
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'latam-broker-reviews-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/latam-broker-reviews', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/brokers', require('./routes/brokers'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/ai', require('./routes/ai'));

// Serve brokers page
app.get('/brokers', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'brokers.html'));
});

// Serve broker category pages
app.get('/brokers/forex', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'forex-trading.html'));
});

app.get('/brokers/stocks', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'stocks-trading.html'));
});

app.get('/brokers/crypto', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'crypto-trading.html'));
});

app.get('/brokers/cfd', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cfd-trading.html'));
});

app.get('/brokers/commodities', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'commodities-trading.html'));
});

// Serve reviews page
app.get('/reviews', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'reviews.html'));
});

// Serve individual broker detail page
app.get('/broker/:slug', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'broker-detail.html'));
});

// Serve category-specific trading pages
app.get('/forex-trading', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'forex-trading.html'));
});

app.get('/stocks-trading', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'stocks-trading.html'));
});

app.get('/crypto-trading', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'crypto-trading.html'));
});

app.get('/cfd-trading', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cfd-trading.html'));
});

app.get('/commodities-trading', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'commodities-trading.html'));
});

app.get('/education-training', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'education-training.html'));
});

// Main routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Favicon route (prevent 404)
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler - should be last
app.use((req, res) => {
  // Check if request is for an API endpoint
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'Endpoint not found' });
  } else {
    // For HTML pages, try to serve a 404 page or fallback
    res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>404 - Page Not Found</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          h1 { color: #667eea; }
        </style>
      </head>
      <body>
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a href="/">Go to Home</a>
      </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`LatamBrokerReviews server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
