// Blog Post Content Loader
// Wait for languages.js to load before executing blog post code
console.log('Blog post script starting...');

// Check if languages.js is loaded
if (typeof languages === 'undefined') {
    console.warn('languages.js not loaded yet, will wait...');
} else {
    console.log('languages.js already loaded');
}

// Map blog post slugs to translation keys
const blogPostMap = {
    'guia-forex-principiantes': {
        titleKey: 'blog.posts.forexGuide.title',
        descriptionKey: 'blog.posts.forexGuide.description',
        categoryKey: 'blog.categories.forex',
        date: '15 Dic 2024',
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop',
        contentKey: 'blog.posts.forexGuide.content'
    },
    'futuro-criptomonedas-latam': {
        titleKey: 'blog.posts.cryptoFuture.title',
        descriptionKey: 'blog.posts.cryptoFuture.description',
        categoryKey: 'blog.categories.crypto',
        date: '10 Dic 2024',
        imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=600&fit=crop',
        contentKey: 'blog.posts.cryptoFuture.content'
    },
    'errores-comunes-trading': {
        titleKey: 'blog.posts.commonMistakes.title',
        descriptionKey: 'blog.posts.commonMistakes.description',
        categoryKey: 'blog.categories.education',
        date: '5 Dic 2024',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop',
        contentKey: 'blog.posts.commonMistakes.content'
    },
    'elegir-mejor-broker-2024': {
        titleKey: 'blog.posts.chooseBroker.title',
        descriptionKey: 'blog.posts.chooseBroker.description',
        categoryKey: 'blog.categories.brokers',
        date: '1 Dic 2024',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
        contentKey: 'blog.posts.chooseBroker.content'
    },
    'seguridad-trading-proteger-capital': {
        titleKey: 'blog.posts.security.title',
        descriptionKey: 'blog.posts.security.description',
        categoryKey: 'blog.categories.security',
        date: '28 Nov 2024',
        imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=600&fit=crop',
        contentKey: 'blog.posts.security.content'
    },
    'trading-oro-guia-completa': {
        titleKey: 'blog.posts.goldTrading.title',
        descriptionKey: 'blog.posts.goldTrading.description',
        categoryKey: 'blog.categories.commodities',
        date: '25 Nov 2024',
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop',
        contentKey: 'blog.posts.goldTrading.content'
    },
    'psicologia-trading-control-emocional': {
        titleKey: 'blog.posts.psychology.title',
        descriptionKey: 'blog.posts.psychology.description',
        categoryKey: 'blog.categories.psychology',
        date: '20 Nov 2024',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
        contentKey: 'blog.posts.psychology.content'
    },
    'analisis-tecnico-vs-fundamental': {
        titleKey: 'blog.posts.analysisComparison.title',
        descriptionKey: 'blog.posts.analysisComparison.description',
        categoryKey: 'blog.categories.analysis',
        date: '15 Nov 2024',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
        contentKey: 'blog.posts.analysisComparison.content'
    },
    'metatrader-4-vs-5': {
        titleKey: 'blog.posts.metatrader.title',
        descriptionKey: 'blog.posts.metatrader.description',
        categoryKey: 'blog.categories.platforms',
        date: '10 Nov 2024',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
        contentKey: 'blog.posts.metatrader.content'
    },
    'gestion-riesgo-trading': {
        titleKey: 'blog.posts.riskManagement.title',
        descriptionKey: 'blog.posts.riskManagement.description',
        categoryKey: 'blog.categories.education',
        date: '5 Nov 2024',
        imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=600&fit=crop',
        contentKey: 'blog.posts.riskManagement.content'
    },
    'metodos-pago-latam': {
        titleKey: 'blog.posts.paymentMethods.title',
        descriptionKey: 'blog.posts.paymentMethods.description',
        categoryKey: 'blog.categories.brokers',
        date: '1 Nov 2024',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
        contentKey: 'blog.posts.paymentMethods.content'
    },
    'cuentas-demo-trading': {
        titleKey: 'blog.posts.demoAccount.title',
        descriptionKey: 'blog.posts.demoAccount.description',
        categoryKey: 'blog.categories.education',
        date: '28 Oct 2024',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop',
        contentKey: 'blog.posts.demoAccount.content'
    },
    'estrategias-trading-principiantes': {
        titleKey: 'blog.posts.tradingStrategies.title',
        descriptionKey: 'blog.posts.tradingStrategies.description',
        categoryKey: 'blog.categories.analysis',
        date: '25 Oct 2024',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
        contentKey: 'blog.posts.tradingStrategies.content'
    },
    'trading-movil-apps': {
        titleKey: 'blog.posts.mobileTrading.title',
        descriptionKey: 'blog.posts.mobileTrading.description',
        categoryKey: 'blog.categories.platforms',
        date: '20 Oct 2024',
        imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=600&fit=crop',
        contentKey: 'blog.posts.mobileTrading.content'
    },
    'social-trading-guia': {
        titleKey: 'blog.posts.socialTrading.title',
        descriptionKey: 'blog.posts.socialTrading.description',
        categoryKey: 'blog.categories.education',
        date: '15 Oct 2024',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
        contentKey: 'blog.posts.socialTrading.content'
    },
    'impuestos-trading-latam': {
        titleKey: 'blog.posts.taxes.title',
        descriptionKey: 'blog.posts.taxes.description',
        categoryKey: 'blog.categories.regulation',
        date: '10 Oct 2024',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
        contentKey: 'blog.posts.taxes.content'
    }
};

// Get the slug from URL - handle trailing slashes and query params
let slug = window.location.pathname.split('/blog/')[1];
if (slug) {
    slug = slug.split('/')[0].split('?')[0]; // Remove trailing slash and query params
}
const postData = blogPostMap[slug];

// Debug: Log slug and postData
console.log('=== BLOG POST INITIALIZATION ===');
console.log('Full URL:', window.location.href);
console.log('Pathname:', window.location.pathname);
console.log('Blog post slug:', slug);
console.log('Post data found:', !!postData);
if (postData) {
    console.log('Title key:', postData.titleKey);
    console.log('Content key:', postData.contentKey);
    console.log('Image URL:', postData.imageUrl);
} else {
    console.error('No post data found for slug:', slug);
    console.error('Available slugs:', Object.keys(blogPostMap));
}

// Initialize blog post content
function initializeBlogPost() {
    if (typeof languages === 'undefined' || !languages.es || !languages.es.blog) {
        console.warn('Languages not ready yet');
        return;
    }
    
    if (!postData) {
        console.error('No post data found for slug:', slug);
        const postContentDiv = document.getElementById('postContent');
        if (postContentDiv) {
            postContentDiv.innerHTML = '<p style="color: red;">Error: Blog post not found. Please check the URL.</p>';
        }
        return;
    }
    
    const currentLang = localStorage.getItem('language') || 'es';
    const translations = languages[currentLang];
    
    if (!translations || !translations.blog) {
        console.error('Translations not found for language:', currentLang);
        const postContentDiv = document.getElementById('postContent');
        if (postContentDiv) {
            postContentDiv.innerHTML = '<p style="color: red;">Error: Translations not loaded. Please refresh the page.</p>';
        }
        return;
    }
    
    const title = getNestedValue(translations, postData.titleKey);
    const description = getNestedValue(translations, postData.descriptionKey);
    const category = getNestedValue(translations, postData.categoryKey);
    
    if (title) {
        const heading = document.getElementById('postHeading');
        const titleEl = document.getElementById('postTitle');
        const pageTitle = document.querySelector('title');
        if (heading) heading.textContent = title;
        if (titleEl) titleEl.textContent = title;
        if (pageTitle) pageTitle.textContent = title + ' - LatamBrokerReviews';
    }
    
    if (category) {
        const catEl = document.getElementById('postCategory');
        if (catEl) catEl.textContent = category;
    }
    
    const dateEl = document.getElementById('postDate');
    if (dateEl && postData.date) dateEl.textContent = postData.date;
    
    // Load and display image
    if (postData.imageUrl) {
        const imageEl = document.getElementById('postImage');
        const imageContainer = document.getElementById('postImageContainer');
        if (imageEl && imageContainer) {
            imageEl.src = postData.imageUrl;
            imageEl.alt = title || 'Blog post image';
            imageEl.onload = function() {
                imageEl.style.display = 'block';
            };
            imageEl.onerror = function() {
                imageEl.style.display = 'none';
                imageContainer.style.display = 'none';
            };
        }
    }
    
    // Update data-translate attributes
    const heading = document.getElementById('postHeading');
    if (heading) heading.setAttribute('data-translate', postData.titleKey);
    const catEl = document.getElementById('postCategory');
    if (catEl) catEl.setAttribute('data-translate', postData.categoryKey);
    
    // Load detailed content if available - this will replace the placeholder
    if (postData.contentKey) {
        console.log('=== CONTENT LOADING ===');
        console.log('Content key:', postData.contentKey);
        
        // Extract post key from contentKey (e.g., 'forexGuide' from 'blog.posts.forexGuide.content')
        const postKey = postData.contentKey.split('.')[2];
        console.log('Post key extracted:', postKey);
        console.log('Translations object:', !!translations);
        console.log('Blog object:', !!translations?.blog);
        console.log('Posts object:', !!translations?.blog?.posts);
        console.log('Available posts:', Object.keys(translations.blog?.posts || {}));
        
        // Use direct access (more reliable than nested path)
        const content = translations.blog?.posts?.[postKey]?.content;
        console.log('Content found:', !!content);
        console.log('Content type:', typeof content);
        if (content) {
            console.log('Content keys:', Object.keys(content));
            console.log('Has introduction:', !!content.introduction);
            console.log('Has sections:', !!content.sections);
            console.log('Sections count:', content.sections ? content.sections.length : 0);
        }
        
        if (content && typeof content === 'object' && (content.introduction || content.sections)) {
            console.log('✓ Loading content successfully');
            loadDetailedContent(content, description);
        } else {
            console.error('✗ Content not found or invalid!', {
                contentKey: postData.contentKey,
                postKey: postKey,
                content: !!content,
                contentType: typeof content,
                hasIntroduction: content?.introduction ? true : false,
                hasSections: content?.sections ? true : false,
                availablePosts: Object.keys(translations.blog?.posts || {}),
                translationsBlog: !!translations?.blog,
                translationsBlogPosts: !!translations?.blog?.posts
            });
            
            // Fallback: show description if content not found
            const postContentDiv = document.getElementById('postContent');
            if (postContentDiv && description) {
                postContentDiv.innerHTML = `<p style="font-size: 1.1rem; line-height: 1.8;">${description}</p>`;
            } else {
                postContentDiv.innerHTML = '<p style="color: red;">Error: Content not found. Please check the console for details.</p>';
            }
        }
    } else if (description) {
        // If no contentKey, just show description
        const postContentDiv = document.getElementById('postContent');
        if (postContentDiv) {
            postContentDiv.innerHTML = `<p style="font-size: 1.1rem; line-height: 1.8;">${description}</p>`;
        }
    }
}

// Wait for languages.js to load before initializing
let initAttempts = 0;
const maxAttempts = 50; // 5 seconds max wait

function waitForLanguages() {
    initAttempts++;
    if (typeof languages !== 'undefined' && languages.es && languages.es.blog && languages.es.blog.posts) {
        console.log('Languages loaded, initializing blog post...');
        console.log('Available blog posts:', Object.keys(languages.es.blog.posts));
        initializeBlogPost();
    } else if (initAttempts < maxAttempts) {
        console.log('Waiting for languages.js to load... (attempt ' + initAttempts + ')', {
            languages: typeof languages,
            es: typeof languages !== 'undefined' ? !!languages.es : false,
            blog: typeof languages !== 'undefined' && languages.es ? !!languages.es.blog : false,
            posts: typeof languages !== 'undefined' && languages.es && languages.es.blog ? !!languages.es.blog.posts : false
        });
        setTimeout(waitForLanguages, 100);
    } else {
        console.error('Failed to load languages.js after ' + maxAttempts + ' attempts');
        const postContentDiv = document.getElementById('postContent');
        if (postContentDiv) {
            postContentDiv.innerHTML = '<p style="color: red;">Error: Failed to load content. Please refresh the page.</p>';
        }
    }
}

// Initialize when DOM is ready
function startInit() {
    console.log('Starting initialization, document readyState:', document.readyState);
    waitForLanguages();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startInit);
} else {
    startInit();
}

// Also listen for window load as backup
window.addEventListener('load', function() {
    console.log('Window loaded event fired');
    if (typeof languages === 'undefined') {
        console.warn('languages.js still not loaded after window load!');
    } else {
        // Try initializing again if content still shows "Loading content..."
        const postContentDiv = document.getElementById('postContent');
        if (postContentDiv && postContentDiv.textContent.includes('Loading content')) {
            console.log('Retrying initialization after window load');
            waitForLanguages();
        }
    }
});

function loadDetailedContent(content, description) {
    const postContentDiv = document.getElementById('postContent');
    if (!postContentDiv || !content) return;
    
    // Start with description paragraph
    let htmlContent = description ? `<p style="margin-bottom: 20px; font-size: 1.15rem; font-weight: 500; color: #555;">${description}</p>` : '';
    
    // Add introduction
    if (content.introduction) {
        htmlContent += `<h2 style="margin-top: 40px; margin-bottom: 20px; color: #333; font-size: 1.8rem;">${content.introduction.title || 'Introducción'}</h2>`;
        if (Array.isArray(content.introduction.paragraphs)) {
            content.introduction.paragraphs.forEach(p => {
                htmlContent += `<p style="margin-bottom: 15px; line-height: 1.8;">${p}</p>`;
            });
        }
    }
    
    // Add sections
    if (content.sections && Array.isArray(content.sections)) {
        content.sections.forEach(section => {
            htmlContent += `<h2 style="margin-top: 40px; margin-bottom: 20px; color: #333; font-size: 1.6rem; border-bottom: 2px solid #e1e5e9; padding-bottom: 10px;">${section.title}</h2>`;
            if (Array.isArray(section.paragraphs)) {
                section.paragraphs.forEach(p => {
                    htmlContent += `<p style="margin-bottom: 15px; line-height: 1.8;">${p}</p>`;
                });
            }
            if (section.list && Array.isArray(section.list)) {
                htmlContent += '<ul style="margin: 20px 0; padding-left: 30px; line-height: 1.8; background: #f8f9fa; padding: 20px 30px; border-radius: 8px; border-left: 4px solid #667eea;">';
                section.list.forEach(item => {
                    htmlContent += `<li style="margin-bottom: 10px;">${item}</li>`;
                });
                htmlContent += '</ul>';
            }
        });
    }
    
    // Add conclusion
    if (content.conclusion) {
        htmlContent += `<h2 style="margin-top: 50px; margin-bottom: 20px; color: #333; font-size: 1.8rem; border-top: 2px solid #e1e5e9; padding-top: 20px;">${content.conclusion.title || 'Conclusión'}</h2>`;
        if (Array.isArray(content.conclusion.paragraphs)) {
            content.conclusion.paragraphs.forEach(p => {
                htmlContent += `<p style="margin-bottom: 15px; line-height: 1.8; font-size: 1.05rem;">${p}</p>`;
            });
        }
    }
    
    postContentDiv.innerHTML = htmlContent;
}

function getNestedValue(obj, path) {
    if (!obj || !path) {
        console.warn('getNestedValue: Invalid input', { obj: !!obj, path });
        return undefined;
    }
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length; i++) {
        if (current && typeof current === 'object' && keys[i] in current) {
            current = current[keys[i]];
        } else {
            console.warn('getNestedValue: Key not found', { path, key: keys[i], current: typeof current, availableKeys: current ? Object.keys(current) : [] });
            return undefined;
        }
    }
    return current;
}


