class ChatbotWidget {
    constructor() {
        // DOM elements
        this.chatIcon = document.getElementById('chat-icon');
        this.chatWindow = document.getElementById('chat-window');
        this.closeButton = document.getElementById('close-chat');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        this.messagesContainer = document.getElementById('chat-messages');

        // State
        this.isOpen = false;
        this.isTyping = false;

        // Initialize the chatbot
        this.init();
    }

    // Projects database
    projectsData = [
        { originalDay: 1, name: "Todo List", description: "A simple and elegant todo list application with local storage support.", demoLink: "./public/Day-1_TodoList/index.html", category: "utilities", technologies: ["HTML", "CSS", "JavaScript"], features: ["Add/Remove Tasks", "Mark Complete", "Local Storage"] },
        { originalDay: 2, name: "Digital Clock", description: "A beautiful digital clock with customizable themes and formats.", demoLink: "./public/Day-2_digital_clock/digitalclock.html", category: "basic", technologies: ["HTML", "CSS", "JavaScript"], features: ["Real-time Updates", "Multiple Formats", "Theme Options"] },
        { originalDay: 3, name: "ASCII Art Generator", description: "Convert text into ASCII art with various font styles and customization options.", demoLink: "./public/Day-3_AsciiArtGenerator/index.html", category: "utilities", technologies: ["HTML", "CSS", "JavaScript"], features: ["Multiple Fonts", "Customizable Output", "Copy to Clipboard"] },
        {
            originalDay: 4, name: "Password Visualizer",
            description: "Visualize password strength and complexity with interactive graphics.",
            demoLink: "./public/Day-4_password_visualizer/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Strength Analysis", "Visual Feedback", "Security Tips"]
        },
        { originalDay: 5, name: "Physics Simulation", description: "Interactive physics simulation with bouncing balls and gravity effects.", demoLink: "./public/Day-5_physics_simulation/index.html", category: "advanced", technologies: ["HTML", "CSS", "JavaScript", "Canvas"], features: ["Physics Engine", "Interactive Controls", "Real-time Animation"] },
        {
            originalDay: 6,
            name: "Quote Generator",
            description: "Generate inspirational quotes with beautiful backgrounds and sharing options.",
            demoLink: "./public/Day-6_QuoteGenerator/index.html",
            category: "basic",
            technologies: ["HTML", "CSS", "JavaScript", "API"],
            features: ["Random Quotes", "Category Filter", "Social Sharing"]
        },
        {
            originalDay: 7,
            name: "Character Word Counter",
            description: "Count characters, words, and paragraphs in real-time with detailed statistics.",
            demoLink: "./public/Day-7_CharacterWordCounter/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Real-time Counting", "Statistics", "Word Analysis"]
        },
        {
            originalDay: 8,
            name: "Dice Roll Simulator",
            description: "Simulate dice rolls with realistic 3D animations and multiple dice options.",
            demoLink: "./public/Day-8_DiceRollSimulator/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["3D Animation", "Multiple Dice", "Statistics Tracking"]
        },
        {
            originalDay: 9,
            name: "Guess My Number",
            description: "A fun number guessing game with hints and score tracking.",
            demoLink: "./public/Day-9_Guess_My_Number/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Hint System", "Score Tracking", "Difficulty Levels"]
        },
        {
            originalDay: 10,
            name: "Neon Brick Breaker",
            description: "A modern twist on the classic brick breaker game with neon graphics.",
            demoLink: "./public/Day-10_Neon_Brick_Breaker/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript", "Canvas"],
            features: ["Neon Graphics", "Power-ups", "Score System"]
        },
        {
            originalDay: 11,
            name: "Weather App",
            description: "Get real-time weather information for any city with a beautiful interface.",
            demoLink: "./public/Day-11_WeatherApp/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript", "API"],
            features: ["Real-time Data", "City Search", "Weather Icons"]
        },
        {
            originalDay: 13,
            name: "Coin Flip",
            description: "A realistic coin flipping animation with statistics tracking.",
            demoLink: "./public/Day-13_Coin_Flip/index.html",
            category: "basic",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Realistic Animation", "Statistics", "Sound Effects"]
        },
        {
            originalDay: 14,
            name: "E-Waste Management Hub",
            description: "Educational platform for e-waste management with location finder.",
            demoLink: "./public/Day-14_E-WasteManagementHub/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Location Finder", "Educational Content", "Environmental Impact"]
        },
        {
            originalDay: 15,
            name: "Currency Converter",
            description: "Convert between different currencies with real-time exchange rates.",
            demoLink: "./public/Day-15_Currency_Converter/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript", "API"],
            features: ["Real-time Rates", "Multiple Currencies", "History"]
        },
        {
            originalDay: 16,
            name: "Random User Generator",
            description: "Generate random user profiles with photos and detailed information.",
            demoLink: "./public/Day-16_Random_User_Generator/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript", "API"],
            features: ["Random Profiles", "Photo Gallery", "Export Data"]
        },
        {
            originalDay: 17,
            name: "Image Search App",
            description: "Search and browse high-quality images with advanced filtering options.",
            demoLink: "./public/Day-17_Image_Search_App/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript", "API"],
            features: ["Image Search", "High Quality", "Download Options"]
        },
        {
            originalDay: 20,
            name: "Tic Tac Toe",
            description: "Classic tic-tac-toe game with AI opponent and score tracking.",
            demoLink: "./public/Day-20_tictactoe/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["AI Opponent", "Score Tracking", "Responsive Design"]
        }
    ];

    // Enhanced Q&A database with project-focused responses
    qnaDatabase = [
        {
            keywords: ['hello', 'hi', 'hey', 'greeting', 'good morning', 'good afternoon'],
            answer: 'Hello! Welcome to our portfolio of 100+ web projects. I can help you explore games, utilities, creative tools, and educational apps. What type of project interests you?'
        },
        {
            keywords: ['projects', 'portfolio', 'work', 'examples', 'apps', 'applications'],
            answer: 'We have 100+ amazing projects including:\n\n🎮 Games: Chess, Space War, Candy Crush, Neon Brick Breaker\n🛠️ Utilities: Weather App, QR Generator, Currency Converter\n🎨 Creative: Drawing Apps, Audio Visualizer, Gradient Generator\n📚 Education: Grade Analyzer, Book Recommendations\n\nWhich category interests you most?'
        },
        {
            keywords: ['games', 'gaming', 'play', 'fun', 'entertainment'],
            answer: 'Our game collection includes:\n\n🎯 Arcade: Neon Brick Breaker, Space Jumper, Fruit Ninja\n🧩 Puzzle: Chess, Memory Game, Candy Crush\n🎲 Casual: Rock Paper Scissors, Coin Flip, Tic Tac Toe\n🚁 Action: Space War, Alien Hunt, Flappy Bird\n\nWhich game would you like to try?'
        },
        {
            keywords: ['utilities', 'tools', 'useful', 'productivity', 'practical'],
            answer: 'Our utility collection:\n\n⏰ Time: Pomodoro Timer, World Clock, Stopwatch\n📝 Organization: Todo List, Notes App, Note Tracker\n🎨 Creative: Drawing App, Color Picker, Palette Generator\n💱 Converters: Currency, QR Code Generator\n🌤️ Information: Weather App, GitHub Profile Finder\n\nWhat tool do you need?'
        },
        {
            keywords: ['weather', 'climate', 'forecast', 'temperature'],
            answer: 'Our Weather App shows real-time weather for any city! Features: current conditions, weather icons, city search, and responsive design. Perfect for staying updated on weather conditions.'
        },
        {
            keywords: ['drawing', 'art', 'creative', 'design', 'paint'],
            answer: 'Creative tools available:\n\n🎨 Drawing Apps: Basic and advanced with layers\n🖌️ Design: Pixel Art Maker, ASCII Art Generator\n🌈 Colors: Palette Generator, Color Picker, Gradient Generator\n\nGreat for artists and designers!'
        },
        {
            keywords: ['chess', 'board game', 'strategy'],
            answer: 'Our Chess Game features move validation, piece animations, and complete game logic. Perfect for chess enthusiasts wanting to play in the browser!'
        },
        {
            keywords: ['audio', 'music', 'sound', 'visualizer'],
            answer: 'Audio projects:\n\n🎵 Audio Visualizer: Real-time frequency analysis with particle effects\n🎭 Mood Music Suggester: Music recommendations based on mood\n\nBoth offer unique interactive audio experiences!'
        },
        {
            keywords: ['technologies', 'tech', 'programming', 'code', 'built'],
            answer: 'Our projects showcase:\n\n💻 Core: HTML5, CSS3, JavaScript (ES6+)\n🎨 Graphics: Canvas API, SVG, CSS Animations\n🔊 Audio: Web Audio API\n📱 Responsive: Mobile-first design\n🎮 Games: Physics engines, collision detection\n\nAll built with vanilla JavaScript!'
        },
        {
            keywords: ['Day-1', 'Day1', 'day-1', 'day 1', 'Day 1'],
            answer: 'Name: Todo List<br>Description: A simple and elegant todo list application with local storage support.<br>DemoLink: <a href="./public/Day-1_TodoList/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-2', 'Day2', 'day-2', 'day 2', 'Day 2'],
            answer: 'Name: Digital Clock<br>Description: A real-time clock application with multiple formats and customizable themes.<br>DemoLink: <a href="./public/Day-2_digital_clock/digitalclock.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-3', 'Day3', 'day-3', 'day 3', 'Day 3'],
            answer: 'Name: ASCII Art Generator<br>Description: Generate ASCII art from text with various fonts and customizable output.<br>DemoLink: <a href="./public/Day-3_AsciiArtGenerator/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-4', 'Day4', 'day-4', 'day 4', 'Day 4'],
            answer: 'Name: Password Visualizer<br>Description: Visual representation of password strength with analysis and tips.<br>DemoLink: <a href="./public/Day-4_password_visualizer/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-5', 'Day5', 'day-5', 'day 5', 'Day 5'],
            answer: 'Name: Physics Simulation<br>Description: An interactive physics engine simulation with controls and animations.<br>DemoLink: <a href="./public/Day-5_physics_simulation/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-6', 'Day6', 'day-6', 'day 6', 'Day 6'],
            answer: 'Name: Quote Generator<br>Description: Generates random quotes with category filtering and sharing options.<br>DemoLink: <a href="./public/Day-6_QuoteGenerator/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-7', 'Day7', 'day-7', 'day 7', 'Day 7'],
            answer: 'Name: Character Word Counter<br>Description: Counts characters and words in real-time with detailed statistics.<br>DemoLink: <a href="./public/Day-7_CharacterWordCounter/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-8', 'Day8', 'day-8', 'day 8', 'Day 8'],
            answer: 'Name: Dice Roll Simulator<br>Description: Simulates dice rolls with 3D animation and statistics tracking.<br>DemoLink: <a href="./public/Day-8_DiceRollSimulator/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-9', 'Day9', 'day-9', 'day 9', 'Day 9'],
            answer: 'Name: Guess My Number<br>Description: A number guessing game with hints, score tracking, and difficulty levels.<br>DemoLink: <a href="./public/Day-9_Guess_My_Number/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-10', 'Day10', 'day-10', 'day 10', 'Day 10'],
            answer: 'Name: Neon Brick Breaker<br>Description: Classic brick breaker game with neon graphics, power-ups, and score tracking.<br>DemoLink: <a href="./public/Day-10_Neon_Brick_Breaker/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-11', 'Day11', 'day-11', 'day 11', 'Day 11'],
            answer: 'Name: Weather App<br>Description: Real-time weather updates with search and weather icons.<br>DemoLink: <a href="./public/Day-11_WeatherApp/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-13', 'Day13', 'day-13', 'day 13', 'Day 13'],
            answer: 'Name: Coin Flip<br>Description: Flip a coin with animation, sound effects, and statistics tracking.<br>DemoLink: <a href="./public/Day-13_Coin_Flip/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-14', 'Day14', 'day-14', 'day 14', 'Day 14'],
            answer: 'Name: E-Waste Management Hub<br>Description: Educational platform for e-waste management with location finder and impact info.<br>DemoLink: <a href="./public/Day-14_E-WasteManagementHub/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-15', 'Day15', 'day-15', 'day 15', 'Day 15'],
            answer: 'Name: Currency Converter<br>Description: Convert between currencies with real-time rates and history tracking.<br>DemoLink: <a href="./public/Day-15_Currency_Converter/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-16', 'Day16', 'day-16', 'day 16', 'Day 16'],
            answer: 'Name: Random User Generator<br>Description: Generate random user profiles with gallery view and export option.<br>DemoLink: <a href="./public/Day-16_Random_User_Generator/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-17', 'Day17', 'day-17', 'day 17', 'Day 17'],
            answer: 'Name: Image Search App<br>Description: Search and view high-quality images with download functionality.<br>DemoLink: <a href="./public/Day-17_Image_Search_App/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-20', 'Day20', 'day-20', 'day 20', 'Day 20'],
            answer: 'Name: Tic Tac Toe<br>Description: Classic Tic Tac Toe game with AI opponent and score tracking.<br>DemoLink: <a href="./public/Day-20_tictactoe/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['categories', 'types', 'kinds', 'organize'],
            answer: 'Project categories:\n\n🎮 Games - Interactive entertainment\n🛠️ Utilities - Practical daily tools\n📚 Education - Learning applications\n🎨 Creative - Art and design tools\n📈 Productivity - Organization helpers\n\nWhich category interests you?'
        }
    ];

    /**
     * Initialize the chatbot widget
     */
    init() {
        this.bindEvents();
        this.setupKeyboardNavigation();
        this.loadChatHistory();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Toggle chat window
        this.chatIcon.addEventListener('click', () => this.toggleChat());
        this.chatIcon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleChat();
            }
        });

        // Close chat window
        this.closeButton.addEventListener('click', () => this.closeChat());

        // Send message events
        this.sendButton.addEventListener('click', () => this.handleSendMessage());
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        // Input validation
        this.chatInput.addEventListener('input', () => this.validateInput());

        // Quick action buttons
        this.setupQuickActions();

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.chatWindow.contains(e.target) && !this.chatIcon.contains(e.target)) {
                this.closeChat();
            }
        });

        // Escape key to close chat
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });
    }

    /**
     * Setup quick action buttons
     */
    setupQuickActions() {
        const quickButtons = document.querySelectorAll('.quick-btn');
        quickButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const message = e.currentTarget.dataset.message;
                if (message) {
                    this.chatInput.value = message;
                    this.handleSendMessage();

                    // Hide quick actions after first use
                    const quickActions = document.querySelector('.quick-actions');
                    if (quickActions) {
                        quickActions.style.display = 'none';
                    }
                }
            });
        });
    }

    /**
     * Setup keyboard navigation for accessibility
     */
    setupKeyboardNavigation() {
        // Trap focus within chat window when open
        this.chatWindow.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = this.chatWindow.querySelectorAll(
                    'button, input, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    /**
     * Toggle chat window open/close
     */
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    /**
     * Open chat window
     */
    openChat() {
        this.isOpen = true;
        this.chatWindow.classList.add('open');
        this.chatWindow.setAttribute('aria-hidden', 'false');
        this.chatIcon.setAttribute('aria-expanded', 'true');

        // Focus on input field
        setTimeout(() => {
            this.chatInput.focus();
        }, 300);

        // Mark messages as read
        this.markMessagesAsRead();
    }

    /**
     * Close chat window
     */
    closeChat() {
        this.isOpen = false;
        this.chatWindow.classList.remove('open');
        this.chatWindow.setAttribute('aria-hidden', 'true');
        this.chatIcon.setAttribute('aria-expanded', 'false');

        // Return focus to chat icon
        this.chatIcon.focus();

        // Save chat history
        this.saveChatHistory();
    }

    /**
     * Handle sending a message
     */
    async handleSendMessage() {
        const message = this.chatInput.value.trim();

        if (!message || this.isTyping) return;

        // Clear input
        this.chatInput.value = '';
        this.validateInput();

        // Add user message
        this.addMessage(message, 'user');

        // Show typing indicator
        this.showTypingIndicator();

        // Process message and get response
        try {
            const response = await this.processMessage(message);

            // Remove typing indicator and add bot response
            setTimeout(() => {
                this.hideTypingIndicator();
                this.addMessage(response, 'bot');
            }, 1000 + Math.random() * 1000); // Simulate realistic response time

        } catch (error) {
            console.error('Error processing message:', error);
            this.hideTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    }

    /**
     * Process user message and return appropriate response
     */
    async processMessage(message) {
        const lowercaseMessage = message.toLowerCase();

        // Check for specific project searches first
        const projectMatch = this.searchProjects(lowercaseMessage);
        if (projectMatch) {
            return projectMatch;
        }

        // Find matching Q&A based on keywords
        for (const qa of this.qnaDatabase) {
            const hasMatch = qa.keywords.some(keyword => {
                const pattern = `\\b${keyword.replace(/\s+/g, '\\s*')}\\b`;
                const regex = new RegExp(pattern, 'i');
                return regex.test(message);
            });

            if (hasMatch) {
                return qa.answer;
            }
        }


        // Fallback response with helpful suggestions
        return "I'd love to help! I can tell you about:\n\n🎮 **Our Games**: Chess, Space War, Candy Crush, Memory Game\n🛠️ **Utility Apps**: Weather App, QR Generator, Todo List\n🎨 **Creative Tools**: Drawing Apps, Color Tools\n📚 **Educational Apps**: Grade Analyzer, Quiz Programs\n\nTry asking about 'games', 'utilities', or a specific project name!";
    }

    /**
     * Search for specific projects based on user query
     */
    searchProjects(query) {
        // Look for exact project name matches
        for (const project of this.projectsData) {
            if (query.includes(project.name.toLowerCase())) {
                return `**${project.name}** - ${project.description}\n\n🔧 **Tech**: ${project.technologies.join(', ')}\n✨ **Features**: ${project.features.join(', ')}\n📂 **Category**: ${project.category}\n\nWould you like to explore more ${project.category} projects?`;
            }
        }

        // Look for category matches
        const categories = ['games', 'utilities', 'productivity', 'education', 'creative'];
        for (const category of categories) {
            if (query.includes(category)) {
                const categoryProjects = this.projectsData.filter(p =>
                    p.category === category ||
                    (category === 'games' && p.category === 'games') ||
                    (category === 'creative' && p.category === 'creativity')
                );

                if (categoryProjects.length > 0) {
                    const projectList = categoryProjects.slice(0, 5).map(p =>
                        `• **${p.name}**: ${p.description}`
                    ).join('\n');

                    return `Here are some ${category} projects:\n\n${projectList}\n\n${categoryProjects.length > 5 ? `...and ${categoryProjects.length - 5} more!` : ''}`;
                }
            }
        }

        return null;
    }

    /**
     * Add a message to the chat with smooth animation
     */
    addMessage(content, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(20px)';
        messageElement.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        if (sender === 'bot') {
            // Allow HTML in bot messages
            messageContent.innerHTML = `<p>${content.replace(/\n/g, '<br>')}</p>`;
        } else {
            // Escape HTML for user messages
            messageContent.innerHTML = `<p>${this.escapeHtml(content).replace(/\n/g, '<br>')}</p>`;
        }

        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = this.formatTime(new Date());

        messageElement.appendChild(messageContent);
        messageElement.appendChild(messageTime);

        this.messagesContainer.appendChild(messageElement);

        requestAnimationFrame(() => {
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            this.scrollToBottom();
        }, 100);

        this.saveChatHistory();
    }


    /**
     * Format message content with proper line breaks and emojis
     */
    formatMessageContent(content) {
        return this.escapeHtml(content).replace(/\n/g, '<br>');
    }

    /**
     * Show typing indicator
     */
    showTypingIndicator() {
        if (this.isTyping) return;

        this.isTyping = true;

        const typingElement = document.createElement('div');
        typingElement.className = 'message bot-message';
        typingElement.id = 'typing-indicator';

        const typingContent = document.createElement('div');
        typingContent.className = 'typing-indicator';

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingContent.appendChild(dot);
        }

        typingElement.appendChild(typingContent);
        this.messagesContainer.appendChild(typingElement);

        this.scrollToBottom();
    }

    /**
     * Hide typing indicator
     */
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
    }

    /**
     * Validate input and update send button state
     */
    validateInput() {
        const message = this.chatInput.value.trim();
        const isValid = message.length > 0 && message.length <= 500;

        this.sendButton.disabled = !isValid || this.isTyping;
    }

    /**
     * Scroll chat to bottom
     */
    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    /**
     * Format time for message timestamps
     */
    formatTime(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hr ago`;

        return date.toLocaleDateString();
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Save chat history to localStorage
     */
    saveChatHistory() {
        try {
            const messages = Array.from(this.messagesContainer.children)
                .filter(msg => !msg.id || msg.id !== 'typing-indicator')
                .map(msg => ({
                    content: msg.querySelector('.message-content p').textContent,
                    sender: msg.classList.contains('bot-message') ? 'bot' : 'user',
                    timestamp: msg.querySelector('.message-time').textContent
                }));

            localStorage.setItem('chatbot-history', JSON.stringify(messages.slice(-50))); // Keep last 50 messages
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }

    /**
     * Load chat history from localStorage
     */
    loadChatHistory() {
        try {
            const history = localStorage.getItem('chatbot-history');
            if (history) {
                const messages = JSON.parse(history);

                // Clear current messages except welcome message
                const welcomeMessage = this.messagesContainer.firstElementChild;
                this.messagesContainer.innerHTML = '';
                if (welcomeMessage) {
                    this.messagesContainer.appendChild(welcomeMessage);
                }

                // Restore messages
                messages.forEach(msg => {
                    if (msg.sender !== 'bot' || msg.content !== welcomeMessage?.querySelector('p')?.textContent) {
                        const messageElement = document.createElement('div');
                        messageElement.className = `message ${msg.sender}-message`;

                        const messageContent = document.createElement('div');
                        messageContent.className = 'message-content';
                        messageContent.innerHTML = `<p>${this.escapeHtml(msg.content)}</p>`;

                        const messageTime = document.createElement('div');
                        messageTime.className = 'message-time';
                        messageTime.textContent = msg.timestamp;

                        messageElement.appendChild(messageContent);
                        messageElement.appendChild(messageTime);

                        this.messagesContainer.appendChild(messageElement);
                    }
                });

                this.scrollToBottom();
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }

    /**
     * Mark messages as read (for potential notification features)
     */
    markMessagesAsRead() {
        // This method can be extended for notification features
        console.log('Messages marked as read');
    }

    /**
     * Clear chat history
     */
    clearHistory() {
        try {
            localStorage.removeItem('chatbot-history');

            // Reset to welcome message only
            this.messagesContainer.innerHTML = `
                <div class="message bot-message">
                    <div class="message-content">
                        <p>Hello! I'm here to help you with questions about our website, services, and contact information. How can I assist you today?</p>
                    </div>
                    <div class="message-time">Just now</div>
                </div>
            `;

            this.scrollToBottom();
        } catch (error) {
            console.error('Error clearing chat history:', error);
        }
    }
}

// Initialize the chatbot when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new ChatbotWidget();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotWidget;
}