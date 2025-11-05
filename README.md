# LatamBrokerReviews - Latin America Broker Reviews Platform

A comprehensive web platform for broker reviews in Latin America, featuring Libertex as the main broker and supporting multiple languages (English/Spanish).

## 🌟 Features

### Public Features
- **Multi-language Support**: English and Spanish with easy language switching
- **Broker Reviews**: Comprehensive reviews and ratings for Latin American brokers
- **Featured Brokers**: Libertex and other leading brokers prominently displayed
- **Search & Filter**: Advanced search and filtering capabilities
- **Responsive Design**: Mobile-first design that works on all devices
- **AI Integration Ready**: Framework for AI tools and API integrations

### Admin Features
- **Dashboard**: Comprehensive admin dashboard with statistics
- **Broker Management**: Add, edit, delete, and manage brokers
- **Review Management**: Moderate and approve user reviews
- **Category Management**: Organize brokers by categories
- **Contact Management**: Handle user inquiries and support requests
- **AI Tools Integration**: Connect with OpenAI, Anthropic Claude, Google AI
- **User Authentication**: Secure admin login system

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd latam-broker-reviews
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/latam-broker-reviews
   SESSION_SECRET=your-session-secret
   JWT_SECRET=your-jwt-secret
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Seed the database**
   ```bash
   node seed.js
   ```

6. **Start the application**
   ```bash
   npm start
   ```

7. **Access the application**
   - Website: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin
   - Login: http://localhost:3000/login

## 🔑 Default Admin Credentials

- **Email**: admin@latambrokerreviews.com
- **Password**: admin123

## 📁 Project Structure

```
latam-broker-reviews/
├── models/                 # Database models
│   ├── User.js
│   ├── Broker.js
│   ├── Review.js
│   ├── Category.js
│   └── Contact.js
├── routes/                 # API routes
│   ├── auth.js
│   ├── admin.js
│   ├── brokers.js
│   ├── reviews.js
│   └── ai.js
├── views/                  # HTML templates
│   ├── index.html
│   ├── admin.html
│   └── login.html
├── public/                 # Static assets
│   ├── css/
│   │   ├── style.css
│   │   └── admin.css
│   ├── js/
│   │   ├── main.js
│   │   ├── admin.js
│   │   └── languages.js
│   └── images/
├── middleware/             # Custom middleware
├── server.js              # Main server file
├── seed.js                # Database seeding script
└── package.json
```

## 🌐 Language Support

The platform supports both English and Spanish with automatic language detection and manual switching:

- **Language Switcher**: Located in the navigation menu
- **Persistent Selection**: User's language choice is saved
- **Complete Translation**: All interface elements are translated
- **SEO Friendly**: Proper language attributes and meta tags

## 🤖 AI Integration Framework

The platform includes a comprehensive AI integration framework:

### Available AI Services
- **OpenAI**: GPT models for content analysis and generation
- **Anthropic Claude**: Advanced content generation and analysis
- **Google AI**: Translation and sentiment analysis services

### AI Features
- Content moderation
- Sentiment analysis
- Review summarization
- Personalized recommendations
- Multi-language support

## 📊 Database Models

### User Model
- Admin authentication
- Role-based access control
- Secure password hashing

### Broker Model
- Comprehensive broker information
- Ratings and reviews
- Features and trading platforms
- Regulatory information
- Multi-language support

### Review Model
- User reviews and ratings
- Moderation system
- Helpfulness voting
- Verification system

### Category Model
- Broker categorization
- Customizable categories
- Visual organization

### Contact Model
- User inquiries
- Support ticket system
- Priority management

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/brokers` - List all brokers
- `GET /api/brokers/featured` - Featured brokers
- `GET /api/brokers/:slug` - Single broker details
- `GET /api/reviews` - List reviews
- `POST /api/reviews` - Submit review
- `POST /api/contacts` - Contact form

### Admin Endpoints
- `POST /api/auth/login` - Admin login
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/brokers` - Manage brokers
- `GET /api/admin/reviews` - Manage reviews
- `GET /api/admin/categories` - Manage categories
- `GET /api/admin/contacts` - Manage contacts

### AI Endpoints
- `POST /api/ai/openai/analyze-review` - OpenAI integration
- `POST /api/ai/anthropic/generate-content` - Claude integration
- `POST /api/ai/google/translate` - Google AI integration

## 🎨 Customization

### Adding New Brokers
1. Use the admin panel to add brokers
2. Or use the API endpoint: `POST /api/admin/brokers`
3. Include all required fields: name, description, website, category

### Customizing Categories
1. Access the admin panel
2. Go to Categories section
3. Add/edit categories with custom colors and icons

### Language Customization
1. Edit `/public/js/languages.js`
2. Add new language objects
3. Update the language switcher

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure production MongoDB
3. Set secure session and JWT secrets
4. Configure AI API keys
5. Set up SSL/HTTPS
6. Configure domain and DNS

### Environment Variables
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://your-production-db
SESSION_SECRET=your-secure-session-secret
JWT_SECRET=your-secure-jwt-secret
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_AI_API_KEY=your-google-ai-key
```

## 📱 Mobile Support

The platform is fully responsive and mobile-optimized:
- Mobile-first design
- Touch-friendly interface
- Optimized for all screen sizes
- Fast loading on mobile networks

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Session management
- Rate limiting
- Input validation
- XSS protection
- CSRF protection

## 🧪 Testing

To test the application:
1. Start the server: `npm start`
2. Visit: http://localhost:3000
3. Test language switching
4. Test admin login: http://localhost:3000/login
5. Test broker management in admin panel

## 📈 Performance

- Optimized database queries
- Efficient caching
- Compressed assets
- Lazy loading
- Mobile optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: info@latambrokerreviews.com
- Documentation: Check this README
- Issues: Use GitHub issues

## 🔮 Future Enhancements

- Advanced AI features
- Real-time notifications
- Mobile app
- Advanced analytics
- Social features
- API for third-party integrations

---

**LatamBrokerReviews** - The leading platform for broker reviews in Latin America 🇲🇽🇨🇴🇦🇷🇧🇷🇨🇱🇵🇪
