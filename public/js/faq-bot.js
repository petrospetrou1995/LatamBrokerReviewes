// FAQ AI Bot
(function() {
    'use strict';

    let currentLanguage = localStorage.getItem('language') || 'es';
    let chatBotLanguage = localStorage.getItem('chatbotLanguage') || null;
    let chatHistory = [];
    let isOpen = false;
    let languageSelected = false;

    // Initialize FAQ data from languages.js
    function getFAQData() {
        const lang = chatBotLanguage || currentLanguage;
        if (typeof languages === 'undefined' || !languages[lang]) {
            return [];
        }

        const faqData = languages[lang].faq;
        if (!faqData) return [];

        const questions = [];
        
        // Extract FAQ questions and answers
        Object.keys(faqData).forEach(key => {
            if (key.startsWith('q') && faqData[key].question && faqData[key].answer) {
                questions.push({
                    question: faqData[key].question.toLowerCase(),
                    answer: faqData[key].answer,
                    originalQuestion: faqData[key].question
                });
            }
        });

        return questions;
    }

    // Simple keyword matching for FAQ search
    function findFAQAnswer(userQuestion) {
        const faqData = getFAQData();
        const questionLower = userQuestion.toLowerCase().trim();
        
        if (!questionLower) return null;

        // Check for exact matches first
        for (const faq of faqData) {
            if (faq.question === questionLower) {
                return faq.answer;
            }
        }

        // Check for keyword matches
        const keywords = questionLower.split(/\s+/);
        let bestMatch = null;
        let bestScore = 0;

        for (const faq of faqData) {
            let score = 0;
            const faqKeywords = faq.question.split(/\s+/);
            
            keywords.forEach(keyword => {
                if (faqKeywords.some(faqKeyword => faqKeyword.includes(keyword) || keyword.includes(faqKeyword))) {
                    score++;
                }
            });

            if (score > bestScore && score >= 2) {
                bestScore = score;
                bestMatch = faq.answer;
            }
        }

        return bestMatch;
    }

    // Generate AI-like response
    function generateResponse(userQuestion) {
        const faqAnswer = findFAQAnswer(userQuestion);
        
        if (faqAnswer) {
            return faqAnswer;
        }

        // Fallback responses based on keywords
        const questionLower = userQuestion.toLowerCase();
        
        if (questionLower.includes('broker') || questionLower.includes('brokers')) {
            return getTranslation('faqBot.brokerInfo');
        }
        
        if (questionLower.includes('trading') || questionLower.includes('operar')) {
            return getTranslation('faqBot.tradingInfo');
        }
        
        if (questionLower.includes('regul') || questionLower.includes('regulacion')) {
            return getTranslation('faqBot.regulationInfo');
        }
        
        if (questionLower.includes('deposit') || questionLower.includes('deposito')) {
            return getTranslation('faqBot.depositInfo');
        }
        
        if (questionLower.includes('withdraw') || questionLower.includes('retiro')) {
            return getTranslation('faqBot.withdrawInfo');
        }

        // Default response
        return getTranslation('faqBot.defaultResponse');
    }

    // Get translation
    function getTranslation(key) {
        const lang = chatBotLanguage || currentLanguage;
        if (typeof languages !== 'undefined' && languages[lang]) {
            const keys = key.split('.');
            let value = languages[lang];
            
            for (const k of keys) {
                if (value && value[k]) {
                    value = value[k];
                } else {
                    return key;
                }
            }
            return value;
        }
        return key;
    }

    // Detect browser language
    function detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('es')) {
            return 'es';
        } else if (browserLang.startsWith('en')) {
            return 'en';
        }
        return 'es'; // Default to Spanish for Latin America
    }

    // Show language selection
    function showLanguageSelection() {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;

        const browserLang = detectBrowserLanguage();
        const detectedLang = browserLang === 'es' ? 'Español' : 'English';
        
        const langSelectionHTML = `
            <div class="chatbot-message bot-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p data-translate="faqBot.selectLanguage">Por favor, selecciona tu idioma preferido:</p>
                    <div class="language-buttons" style="margin-top: 12px; display: flex; gap: 10px; flex-wrap: wrap;">
                        <button class="lang-btn" data-lang="es" style="padding: 10px 20px; border: 2px solid #667eea; background: ${browserLang === 'es' ? '#667eea' : 'white'}; color: ${browserLang === 'es' ? 'white' : '#667eea'}; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">
                            🇪🇸 Español ${browserLang === 'es' ? '(Detectado)' : ''}
                        </button>
                        <button class="lang-btn" data-lang="en" style="padding: 10px 20px; border: 2px solid #667eea; background: ${browserLang === 'en' ? '#667eea' : 'white'}; color: ${browserLang === 'en' ? 'white' : '#667eea'}; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">
                            🇬🇧 English ${browserLang === 'en' ? '(Detected)' : ''}
                        </button>
                    </div>
                </div>
            </div>
        `;

        messagesContainer.innerHTML = langSelectionHTML;

        // Add event listeners to language buttons
        const langButtons = messagesContainer.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const selectedLang = this.getAttribute('data-lang');
                selectChatbotLanguage(selectedLang);
            });
            btn.addEventListener('mouseenter', function() {
                if (this.style.background !== '#667eea') {
                    this.style.background = '#f0f4ff';
                }
            });
            btn.addEventListener('mouseleave', function() {
                const lang = this.getAttribute('data-lang');
                if (this.style.background !== '#667eea') {
                    this.style.background = lang === browserLang ? '#667eea' : 'white';
                }
            });
        });
    }

    // Select chatbot language
    function selectChatbotLanguage(lang) {
        chatBotLanguage = lang;
        currentLanguage = lang;
        localStorage.setItem('chatbotLanguage', lang);
        localStorage.setItem('language', lang);
        languageSelected = true;

        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;

        // Update welcome message in selected language
        const welcomeMessage = getTranslation('faqBot.welcome');
        const languageSelectedMsg = getTranslation('faqBot.languageSelected');
        
        messagesContainer.innerHTML = `
            <div class="chatbot-message bot-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>${welcomeMessage}</p>
                </div>
            </div>
        `;

        // Update placeholder
        const input = document.getElementById('chatbotInput');
        if (input) {
            input.placeholder = getTranslation('faqBot.placeholder');
        }

        // Update title
        const title = document.querySelector('.chatbot-title span');
        if (title) {
            title.textContent = getTranslation('faqBot.title');
        }

        // Trigger language change event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }

    // Create chatbot HTML
    function createChatbotHTML() {
        const chatbotHTML = `
            <div id="faqChatbot" class="faq-chatbot">
                <div class="chatbot-header">
                    <div class="chatbot-title">
                        <i class="fas fa-robot"></i>
                        <span data-translate="faqBot.title">Asistente de Preguntas</span>
                    </div>
                    <button class="chatbot-close" id="chatbotClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="chatbot-messages" id="chatbotMessages">
                    <!-- Language selection or welcome message will be added here -->
                </div>
                <div class="chatbot-input-container">
                    <input type="text" id="chatbotInput" class="chatbot-input" placeholder="Escribe tu pregunta..." data-translate-placeholder="faqBot.placeholder" disabled>
                    <button id="chatbotSend" class="chatbot-send" disabled>
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
            <button id="chatbotToggle" class="chatbot-toggle">
                <i class="fas fa-comments"></i>
                <span class="chatbot-badge" id="chatbotBadge" style="display: none;">1</span>
            </button>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    // Add message to chat
    function addMessage(text, isBot = false) {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${isBot ? 'bot-message' : 'user-message'}`;
        
        const avatar = isBot 
            ? '<div class="message-avatar"><i class="fas fa-robot"></i></div>'
            : '<div class="message-avatar user-avatar"><i class="fas fa-user"></i></div>';
        
        messageDiv.innerHTML = `
            ${avatar}
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Update badge
        if (!isBot) {
            const badge = document.getElementById('chatbotBadge');
            if (badge) {
                const count = parseInt(badge.textContent) || 0;
                badge.textContent = count + 1;
            }
        }
    }

    // Send message
    function sendMessage() {
        const input = document.getElementById('chatbotInput');
        if (!input || !input.value.trim()) return;

        // Check if language is selected
        if (!chatBotLanguage) {
            showLanguageSelection();
            return;
        }

        const userQuestion = input.value.trim();
        addMessage(userQuestion, false);
        chatHistory.push({ role: 'user', content: userQuestion });
        
        input.value = '';
        input.disabled = true;

        // Show typing indicator
        const messagesContainer = document.getElementById('chatbotMessages');
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chatbot-message bot-message typing-indicator';
        typingIndicator.innerHTML = `
            <div class="message-avatar"><i class="fas fa-robot"></i></div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Generate response after delay
        setTimeout(() => {
            typingIndicator.remove();
            const response = generateResponse(userQuestion);
            addMessage(response, true);
            chatHistory.push({ role: 'assistant', content: response });
            input.disabled = false;
            input.focus();
        }, 1000 + Math.random() * 1000); // Simulate thinking time
    }

    // Toggle chatbot
    function toggleChatbot() {
        const chatbot = document.getElementById('faqChatbot');
        if (!chatbot) return;

        isOpen = !isOpen;
        chatbot.classList.toggle('open', isOpen);
        
        if (isOpen) {
            // Check if language is already selected
            if (!chatBotLanguage) {
                // Show language selection
                showLanguageSelection();
            } else {
                // Show welcome message if not already shown
                const messagesContainer = document.getElementById('chatbotMessages');
                if (messagesContainer && messagesContainer.children.length === 0) {
                    const welcomeMessage = getTranslation('faqBot.welcome');
                    messagesContainer.innerHTML = `
                        <div class="chatbot-message bot-message">
                            <div class="message-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="message-content">
                                <p>${welcomeMessage}</p>
                            </div>
                        </div>
                    `;
                }
                const input = document.getElementById('chatbotInput');
                if (input) {
                    input.disabled = false;
                    setTimeout(() => input.focus(), 300);
                }
                const sendBtn = document.getElementById('chatbotSend');
                if (sendBtn) {
                    sendBtn.disabled = false;
                }
            }
        }
    }

    // Initialize chatbot
    function initChatbot() {
        createChatbotHTML();
        
        // Check if chatbot language is already set
        if (chatBotLanguage) {
            languageSelected = true;
            currentLanguage = chatBotLanguage;
        }
        
        // Event listeners
        const toggle = document.getElementById('chatbotToggle');
        const close = document.getElementById('chatbotClose');
        const send = document.getElementById('chatbotSend');
        const input = document.getElementById('chatbotInput');

        if (toggle) {
            toggle.addEventListener('click', toggleChatbot);
        }

        if (close) {
            close.addEventListener('click', toggleChatbot);
        }

        if (send) {
            send.addEventListener('click', sendMessage);
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !input.disabled) {
                    sendMessage();
                }
            });
        }

        // Listen for language changes (from main language switcher)
        window.addEventListener('languageChanged', (event) => {
            const newLang = event.detail.language || localStorage.getItem('language') || 'es';
            
            // Only update if chatbot language is already set
            if (chatBotLanguage && chatBotLanguage !== newLang) {
                chatBotLanguage = newLang;
                currentLanguage = newLang;
                localStorage.setItem('chatbotLanguage', newLang);
                
                // Reload chatbot with new language
                const messagesContainer = document.getElementById('chatbotMessages');
                if (messagesContainer && languageSelected) {
                    const welcomeMessage = getTranslation('faqBot.welcome');
                    messagesContainer.innerHTML = `
                        <div class="chatbot-message bot-message">
                            <div class="message-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="message-content">
                                <p>${welcomeMessage}</p>
                            </div>
                        </div>
                    `;
                }
                
                // Update placeholder
                const input = document.getElementById('chatbotInput');
                if (input) {
                    const placeholder = getTranslation('faqBot.placeholder');
                    input.placeholder = placeholder;
                }
                
                // Update title
                const title = document.querySelector('.chatbot-title span');
                if (title) {
                    title.textContent = getTranslation('faqBot.title');
                }
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }
})();

