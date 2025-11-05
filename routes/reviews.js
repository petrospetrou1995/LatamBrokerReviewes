const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Broker = require('../models/Broker');
const router = express.Router();

// Get reviews for a specific broker
router.get('/broker/:brokerId', async (req, res) => {
  try {
    const { brokerId } = req.params;
    const { page = 1, limit = 6 } = req.query;
    
    const reviews = await Review.find({ broker: brokerId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('broker', 'name');
    
    const total = await Review.countDocuments({ broker: brokerId });
    
    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit a new review
router.post('/', [
  body('broker').isMongoId(),
  body('user.name').notEmpty().trim(),
  body('user.email').isEmail().normalizeEmail(),
  body('user.country').notEmpty().trim(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('title').notEmpty().trim().isLength({ max: 200 }),
  body('content').notEmpty().trim().isLength({ max: 2000 }),
  body('experience').isIn(['beginner', 'intermediate', 'advanced', 'expert']),
  body('tradingDuration').isIn(['less-than-1-year', '1-3-years', '3-5-years', 'more-than-5-years'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if broker exists
    const broker = await Broker.findById(req.body.broker);
    if (!broker) {
      return res.status(404).json({ error: 'Broker not found' });
    }

    const review = new Review(req.body);
    await review.save();

    res.status(201).json({ 
      success: true, 
      message: 'Review submitted successfully. It will be reviewed before publication.',
      review 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get reviews for a specific broker
router.get('/broker/:brokerId', async (req, res) => {
  try {
    const { page = 1, limit = 10, rating, sort = 'newest' } = req.query;
    const query = { 
      broker: req.params.brokerId, 
      isApproved: true 
    };
    
    if (rating) query.rating = parseInt(rating);
    
    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'highest') sortOption = { rating: -1 };
    if (sort === 'lowest') sortOption = { rating: 1 };
    if (sort === 'most-helpful') sortOption = { helpful: -1 };
    
    const reviews = await Review.find(query)
      .sort(sortOption)
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

// Get all reviews (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, rating, broker, lang = 'en' } = req.query;
    console.log('Language parameter:', lang);
    const query = { isApproved: true };
    
    if (rating) query.rating = parseInt(rating);
    if (broker) query.broker = broker;
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    
    const reviews = await Review.find(query)
      .populate('broker', 'name slug logo')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);
    
    const total = await Review.countDocuments(query);
    
    // Add translation support
    const reviewsWithTranslation = reviews.map(review => {
      let translated = null;
      if (lang === 'en') {
        translated = getEnglishTranslation(review);
        console.log('Review title:', review.title);
        console.log('Translated title:', translated?.title);
      }
      return {
        ...review.toObject(),
        translated: translated
      };
    });
    
    res.json({
      reviews: reviewsWithTranslation,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper function to get English translations for reviews
function getEnglishTranslation(review) {
  const translations = {
    // Titles
    'Excelente plataforma para trading': 'Excellent trading platform',
    'Buena opción para principiantes': 'Good option for beginners',
    'Muy buena experiencia': 'Very good experience',
    'Innovador y fácil de usar': 'Innovative and easy to use',
    'Muy confiable y profesional': 'Very reliable and professional',
    
    // Content - partial matches for better coverage
    'He estado usando Libertex por más de 2 años': 'I have been using Libertex for more than 2 years',
    'La plataforma es muy intuitiva': 'The platform is very intuitive',
    'soporte al cliente es excepcional': 'customer support is exceptional',
    'spreads son competitivos': 'spreads are competitive',
    'ejecución es rápida': 'execution is fast',
    'Lo recomiendo totalmente': 'I totally recommend it',
    'Como principiante en el trading': 'As a trading beginner',
    'cuenta demo es perfecta': 'demo account is perfect',
    'soporte al cliente responde rápido': 'customer support responds quickly',
    'XM es un broker muy profesional': 'XM is a very professional broker',
    'variedad de instrumentos es impresionante': 'variety of instruments is impressive',
    'educación que ofrecen es excelente': 'education they offer is excellent',
    'eToro es una plataforma muy innovadora': 'eToro is a very innovative platform',
    'trading social es una excelente idea': 'social trading is an excellent idea',
    'plataforma es muy fácil de usar': 'platform is very easy to use'
  };
  
  const prosTranslations = {
    'Plataforma fácil de usar': 'Easy to use platform',
    'Soporte en español': 'Spanish support',
    'Spreads competitivos': 'Competitive spreads',
    'Cuenta demo gratuita': 'Free demo account',
    'Fácil de usar': 'Easy to use',
    'Plataforma estable': 'Stable platform',
    'Soporte profesional': 'Professional support',
    'Función de copiar traders': 'Copy trading feature',
    'Bueno para principiantes': 'Good for beginners',
    'Trading social': 'Social trading',
    'Criptomonedas': 'Cryptocurrencies',
    'Muchos instrumentos': 'Many instruments',
    'Spreads bajos': 'Low spreads',
    'Educación gratuita': 'Free education'
  };
  
  const consTranslations = {
    'Limitado en algunos países': 'Limited in some countries',
    'Pocas herramientas de análisis': 'Few analysis tools',
    'Depósito mínimo alto': 'High minimum deposit',
    'Spreads altos en Forex': 'High Forex spreads',
    'No disponible en todos los países': 'Not available in all countries'
  };
  
  // Simple translation function for content
  function translateContent(text) {
    let translated = text;
    Object.keys(translations).forEach(spanish => {
      const english = translations[spanish];
      translated = translated.replace(new RegExp(spanish, 'gi'), english);
    });
    return translated;
  }
  
  return {
    title: translations[review.title] || translateContent(review.title),
    content: translateContent(review.content),
    pros: review.pros.map(pro => prosTranslations[pro] || pro),
    cons: review.cons.map(con => consTranslations[con] || con)
  };
}

// Rate review helpfulness
router.post('/:id/helpful', async (req, res) => {
  try {
    const { helpful } = req.body; // true for helpful, false for not helpful
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    if (helpful) {
      review.helpful += 1;
    } else {
      review.notHelpful += 1;
    }
    
    await review.save();
    
    res.json({ 
      success: true, 
      helpful: review.helpful,
      notHelpful: review.notHelpful
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get review statistics
router.get('/stats/:brokerId', async (req, res) => {
  try {
    const broker = await Broker.findById(req.params.brokerId);
    if (!broker) {
      return res.status(404).json({ error: 'Broker not found' });
    }
    
    const stats = await Review.aggregate([
      { $match: { broker: broker._id, isApproved: true } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);
    
    if (stats.length === 0) {
      return res.json({
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    }
    
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stats[0].ratingDistribution.forEach(rating => {
      ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
    });
    
    res.json({
      totalReviews: stats[0].totalReviews,
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      ratingDistribution: ratingCounts
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
