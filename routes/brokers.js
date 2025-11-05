const express = require('express');
const Broker = require('../models/Broker');
const Review = require('../models/Review');
const router = express.Router();

// Get all brokers
router.get('/', async (req, res) => {
  try {
    const { category, country, featured, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    
    if (category) query.category = category;
    if (country) query.countries = { $in: [country] };
    if (featured === 'true') query.isFeatured = true;
    
    const brokers = await Broker.find(query)
      .sort({ rating: -1, totalReviews: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Broker.countDocuments(query);
    
    res.json({
      brokers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get broker by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const broker = await Broker.findOne({ slug: req.params.slug, isActive: true });
    if (!broker) {
      return res.status(404).json({ error: 'Broker not found' });
    }
    res.json(broker);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get featured brokers
router.get('/featured', async (req, res) => {
  try {
    const brokers = await Broker.find({ 
      isActive: true, 
      isFeatured: true 
    }).sort({ rating: -1 }).limit(6);
    
    res.json({ brokers });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single broker by slug
router.get('/:slug', async (req, res) => {
  try {
    const broker = await Broker.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    });
    
    if (!broker) {
      return res.status(404).json({ error: 'Broker not found' });
    }
    
    // Get recent reviews for this broker
    const reviews = await Review.find({ 
      broker: broker._id, 
      isApproved: true 
    })
    .sort({ createdAt: -1 })
    .limit(10);
    
    res.json({ broker, reviews });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get broker reviews
router.get('/:slug/reviews', async (req, res) => {
  try {
    const broker = await Broker.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    });
    
    if (!broker) {
      return res.status(404).json({ error: 'Broker not found' });
    }
    
    const { page = 1, limit = 10, rating } = req.query;
    const query = { 
      broker: broker._id, 
      isApproved: true 
    };
    
    if (rating) query.rating = parseInt(rating);
    
    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Review.countDocuments(query);
    
    // Calculate rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { broker: broker._id, isApproved: true } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);
    
    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      ratingDistribution
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Search brokers
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 12 } = req.query;
    
    const brokers = await Broker.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    })
    .sort({ rating: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
    const total = await Broker.countDocuments({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    });
    
    res.json({
      brokers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
