const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Broker = require('../models/Broker');
const Review = require('../models/Review');
const Category = require('../models/Category');
const Contact = require('../models/Contact');
const router = express.Router();

// Middleware to verify admin access
const verifyAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Dashboard statistics
router.get('/dashboard', verifyAdmin, async (req, res) => {
  try {
    const totalBrokers = await Broker.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalContacts = await Contact.countDocuments();
    const pendingReviews = await Review.countDocuments({ isApproved: false });
    const newContacts = await Contact.countDocuments({ status: 'new' });

    const recentReviews = await Review.find()
      .populate('broker', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalBrokers,
        totalReviews,
        totalContacts,
        pendingReviews,
        newContacts
      },
      recentReviews,
      recentContacts
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Broker management
router.get('/brokers', verifyAdmin, async (req, res) => {
  try {
    const brokers = await Broker.find().sort({ createdAt: -1 });
    res.json({ brokers });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/brokers', verifyAdmin, [
  body('name').notEmpty().trim(),
  body('description').notEmpty(),
  body('website').isURL(),
  body('category').isIn(['forex', 'stocks', 'crypto', 'cfd', 'commodities'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const broker = new Broker(req.body);
    await broker.save();
    res.status(201).json({ broker });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/brokers/:id', verifyAdmin, async (req, res) => {
  try {
    const broker = await Broker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!broker) {
      return res.status(404).json({ error: 'Broker not found' });
    }
    
    res.json({ broker });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/brokers/:id', verifyAdmin, async (req, res) => {
  try {
    const broker = await Broker.findByIdAndDelete(req.params.id);
    if (!broker) {
      return res.status(404).json({ error: 'Broker not found' });
    }
    res.json({ message: 'Broker deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Review management
router.get('/reviews', verifyAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { isApproved: status === 'approved' } : {};
    
    const reviews = await Review.find(query)
      .populate('broker', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);
    
    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/reviews/:id/approve', verifyAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json({ review });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/reviews/:id/reject', verifyAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: false },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json({ review });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Category management
router.get('/categories', verifyAdmin, async (req, res) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1 });
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/categories', verifyAdmin, [
  body('name').notEmpty().trim(),
  body('description').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const category = new Category(req.body);
    await category.save();
    res.status(201).json({ category });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Contact management
router.get('/contacts', verifyAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { status } : {};
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments(query);
    
    res.json({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/contacts/:id', verifyAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { ...req.body, respondedBy: req.user.userId },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json({ contact });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
