// Static version - loads brokers from JSON file instead of API
(async function() {
    'use strict';
    
    let brokersData = null;
    
    async function loadBrokersData() {
        if (brokersData) return brokersData;
        
        try {
            const response = await fetch('/public/data/brokers.json');
            const data = await response.json();
            brokersData = data.brokers || [];
            return brokersData;
        } catch (error) {
            console.error('Error loading brokers data:', error);
            return [];
        }
    }
    
    async function loadReviewsData() {
        try {
            const response = await fetch('/public/data/reviews.json');
            const data = await response.json();
            return data.reviews || [];
        } catch (error) {
            console.error('Error loading reviews data:', error);
            return [];
        }
    }
    
    // Replace API calls with static data loading
    window.loadBrokers = async function(filters = {}) {
        const brokers = await loadBrokersData();
        
        // Apply filters
        let filtered = brokers;
        
        if (filters.category) {
            filtered = filtered.filter(b => b.category === filters.category);
        }
        
        if (filters.country) {
            filtered = filtered.filter(b => 
                b.countries && b.countries.includes(filters.country)
            );
        }
        
        if (filters.featured) {
            filtered = filtered.filter(b => b.isFeatured === true);
        }
        
        // Sort
        filtered.sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return (b.totalReviews || 0) - (a.totalReviews || 0);
        });
        
        return {
            brokers: filtered,
            total: filtered.length,
            totalPages: 1,
            currentPage: 1
        };
    };
    
    window.loadBrokerBySlug = async function(slug) {
        const brokers = await loadBrokersData();
        const broker = brokers.find(b => b.slug === slug);
        
        if (!broker) return null;
        
        // Load reviews for this broker
        const reviews = await loadReviewsData();
        const brokerReviews = reviews.filter(r => 
            r.broker && (r.broker._id === broker._id || r.broker.slug === broker.slug)
        );
        
        return {
            broker: broker,
            reviews: brokerReviews.slice(0, 10)
        };
    };
    
    window.loadReviews = async function(filters = {}) {
        const reviews = await loadReviewsData();
        
        let filtered = reviews;
        
        if (filters.rating) {
            filtered = filtered.filter(r => r.rating === parseInt(filters.rating));
        }
        
        if (filters.broker) {
            filtered = filtered.filter(r => 
                r.broker && (r.broker._id === filters.broker || r.broker.slug === filters.broker)
            );
        }
        
        // Sort by date
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        return {
            reviews: filtered,
            total: filtered.length,
            totalPages: 1,
            currentPage: 1
        };
    };
    
    console.log('✅ Static brokers loader initialized');
})();

