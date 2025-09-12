class WebDev100Days {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.currentFilter = 'all';
        this.currentPage = 1;
        this.projectsPerPage = 20;
        this.searchTerm = '';

        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupThemeToggle();
        this.setupScrollProgress();
        this.setupScrollToTop();
        this.setupMobileMenu();
        this.setupVantaGlobe();
        await this.loadProjects();
        this.updateStatistics();
        this.setupAnimatedCounters();
        this.renderTable();
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');

        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.searchTerm = searchInput.value.toLowerCase();
                this.filterProjects();
            }, 300));
        }

        if (searchButton) {
            searchButton.addEventListener('click', () => {
                this.searchTerm = searchInput.value.toLowerCase();
                this.filterProjects();
            });
        }

        document.addEventListener('click', (e) => {
            if (e.target.matches('.filter-tab')) {
                this.setActiveFilter(e.target.dataset.filter);
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('.pagination-btn')) {
                const page = parseInt(e.target.dataset.page);
                if (page && page !== this.currentPage) {
                    this.currentPage = page;
                    this.renderTable();

                    // Scroll headings se start ho
                    setTimeout(() => {
                        const tableHead = document.querySelector("table thead");
                        if (tableHead) {
                            // Agar koi fixed header ya navbar height hai to uska offset nikal lo
                            const headerOffset = 80; // yahan apne header ki actual height set karo
                            const y = tableHead.getBoundingClientRect().top + window.scrollY - headerOffset;
                            window.scrollTo({ top: y, behavior: "smooth" });
                        }
                    }, 50);

                }
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('.demo-btn') || e.target.closest('.demo-btn')) {
                e.preventDefault();
                const demoBtn = e.target.closest('.demo-btn');
                if (demoBtn && demoBtn.href) {
                    window.open(demoBtn.href, '_blank');
                }
            }
        });
    }

    setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        const currentTheme = localStorage.getItem('theme') || 'light';

        document.documentElement.setAttribute('data-theme', currentTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                const next = current === 'dark' ? 'light' : 'dark';

                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('theme', next);

                this.updateThemeIcon(next);
            });
        }

        this.updateThemeIcon(currentTheme);
    }

    updateThemeIcon(theme) {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'dark'
                ? '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>';
        }
    }

    setupScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress-bar');
        if (progressBar) {
            window.addEventListener('scroll', () => {
                const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                progressBar.style.width = `${scrolled}%`;
            });
        }
    }

    setupScrollToTop() {
        const scrollBtn = document.querySelector('.scroll-top');
        if (scrollBtn) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    scrollBtn.classList.add('visible');
                } else {
                    scrollBtn.classList.remove('visible');
                }
            });

            scrollBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileNav = document.querySelector('.mobile-nav');

        if (mobileMenuBtn && mobileNav) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenuBtn.classList.toggle('active');
                mobileNav.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
                    mobileMenuBtn.classList.remove('active');
                    mobileNav.classList.remove('active');
                }
            });
        }
    }

    /**
     * Setup animated counters with IntersectionObserver
     * Animates numbers from 0 to target values when stats section becomes visible
     */
    setupAnimatedCounters() {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback: animate immediately if IntersectionObserver not supported
            this.animateCounters();
            return;
        }

        // Create intersection observer to trigger animation when stats section is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Start animation when stats section is visible
                    this.animateCounters();
                    // Stop observing after animation starts to prevent re-triggering
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3, // Trigger when 30% of the element is visible
            rootMargin: '0px 0px -50px 0px' // Start animation slightly before element is fully visible
        });

        // Observe the challenge stats section
        const statsSection = document.querySelector('.challenge-stats');
        if (statsSection) {
            observer.observe(statsSection);
        } else {
            console.warn('Challenge stats section not found for counter animation');
        }
    }

    /**
     * Animate counter elements from 0 to their target values
     * Uses smooth easing animation with configurable duration
     */
    animateCounters() {
        const counters = document.querySelectorAll('.counter');
        console.log(`Found ${counters.length} counter elements to animate`);
        
        counters.forEach((counter, index) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds animation duration
            const startTime = performance.now();
            
            console.log(`Counter ${index}: target=${target}`);
            
            // Skip animation for infinity symbol or invalid targets
            if (isNaN(target) || target === Infinity) {
                console.log(`Skipping counter ${index}: invalid target`);
                return;
            }

            /**
             * Animation frame function that updates counter value
             * Uses easeOutCubic easing for smooth deceleration
             */
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // EaseOutCubic easing function for smooth animation
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.floor(easeOutCubic * target);
                
                counter.textContent = currentValue;
                
                // Continue animation if not complete
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Ensure final value is exactly the target
                    counter.textContent = target;
                    console.log(`Counter ${index} animation completed: ${target}`);
                }
            };
            
            // Start the animation
            requestAnimationFrame(animate);
        });
    }

    /**
     * Setup Vanta.js Globe Background
     * Creates an interactive 3D globe background that adapts to the site's color palette
     * Includes fallback handling for WebGL failures and theme switching
     */
    setupVantaGlobe() {
        // Only initialize on homepage
        if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
            return;
        }

        const vantaContainer = document.getElementById('vanta-bg');
        if (!vantaContainer) {
            console.warn('Vanta.js container not found');
            return;
        }

        // Check if Vanta.js and Three.js are available
        if (typeof VANTA === 'undefined' || typeof THREE === 'undefined') {
            console.warn('Vanta.js or Three.js not loaded, using fallback background');
            this.showFallbackBackground();
            return;
        }

        try {
            // Get current theme colors
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const primaryColor = isDark ? 0x6366f1 : 0x4f46e5; // Primary color from CSS variables
            const secondaryColor = isDark ? 0x10b981 : 0x059669; // Secondary color from CSS variables

            // Initialize Vanta.js Globe effect
            this.vantaEffect = VANTA.GLOBE({
                el: vantaContainer,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: primaryColor,
                color2: secondaryColor,
                backgroundColor: isDark ? 0x0f172a : 0xf8fafc,
                size: 1.20,
                speed: 1.20
            });

            // Listen for theme changes to update globe colors
            this.setupThemeChangeListener();

        } catch (error) {
            console.error('Failed to initialize Vanta.js globe:', error);
            this.showFallbackBackground();
        }
    }

    /**
     * Setup theme change listener for Vanta.js globe
     * Updates globe colors when user switches between light and dark themes
     */
    setupThemeChangeListener() {
        // Create a MutationObserver to watch for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    this.updateVantaTheme();
                }
            });
        });

        // Start observing the document element for theme changes
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }

    /**
     * Update Vanta.js globe colors based on current theme
     * Destroys and recreates the effect with new colors
     */
    updateVantaTheme() {
        if (!this.vantaEffect) return;

        try {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const primaryColor = isDark ? 0x6366f1 : 0x4f46e5;
            const secondaryColor = isDark ? 0x10b981 : 0x059669;

            // Destroy existing effect
            this.vantaEffect.destroy();

            // Recreate with new colors
            this.vantaEffect = VANTA.GLOBE({
                el: document.getElementById('vanta-bg'),
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: primaryColor,
                color2: secondaryColor,
                backgroundColor: isDark ? 0x0f172a : 0xf8fafc,
                size: 1.20,
                speed: 1.20
            });
        } catch (error) {
            console.error('Failed to update Vanta.js theme:', error);
            this.showFallbackBackground();
        }
    }

    /**
     * Show fallback background when Vanta.js fails
     * Ensures the site remains functional even if WebGL is not supported
     */
    showFallbackBackground() {
        const vantaContainer = document.getElementById('vanta-bg');
        if (vantaContainer) {
            vantaContainer.style.opacity = '0';
            vantaContainer.style.pointerEvents = 'none';
        }
    }

    async loadProjects() {
        const projectsData = [
            {
                originalDay: 1,
                name: "Todo List",
                description: "A simple and elegant todo list application with local storage support.",
                demoLink: "./public/Day-1_TodoList/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Add/Remove Tasks", "Mark Complete", "Local Storage"]
            },
            {
                originalDay: 2,
                name: "Digital Clock",
                description: "A beautiful digital clock with customizable themes and formats.",
                demoLink: "./public/Day-2_digital_clock/digitalclock.html",
                category: "basic",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Real-time Updates", "Multiple Formats", "Theme Options"]
            },
            {
                originalDay: 3,
                name: "ASCII Art Generator",
                description: "Convert text into ASCII art with various font styles and customization options.",
                demoLink: "./public/Day-3_AsciiArtGenerator/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Multiple Fonts", "Customizable Output", "Copy to Clipboard"]
            },
            {
                originalDay: 4,
                name: "Password Visualizer",
                description: "Visualize password strength and complexity with interactive graphics.",
                demoLink: "./public/Day-4_password_visualizer/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Strength Analysis", "Visual Feedback", "Security Tips"]
            },
            {
                originalDay: 5,
                name: "Physics Simulation",
                description: "Interactive physics simulation with bouncing balls and gravity effects.",
                demoLink: "./public/Day-5_physics_simulation/index.html",
                category: "advanced",
                technologies: ["HTML", "CSS", "JavaScript", "Canvas"],
                features: ["Physics Engine", "Interactive Controls", "Real-time Animation"]
            },
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
                originalDay: 12,
                name: "Coin Flip",
                description: "A realistic coin flipping animation with statistics tracking.",
                demoLink: "./public/Day-13_Coin_Flip/index.html",
                category: "basic",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Realistic Animation", "Statistics", "Sound Effects"]
            },
            {
                originalDay: 13,
                name: "E-Waste Management Hub",
                description: "Educational platform for e-waste management with location finder.",
                demoLink: "./public/Day-14_E-WasteManagementHub/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Location Finder", "Educational Content", "Environmental Impact"]
            },
            {
                originalDay: 14,
                name: "Currency Converter",
                description: "Convert between different currencies with real-time exchange rates.",
                demoLink: "./public/Day-15_Currency_Converter/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript", "API"],
                features: ["Real-time Rates", "Multiple Currencies", "History"]
            },
            {
                originalDay: 15,
                name: "Random User Generator",
                description: "Generate random user profiles with photos and detailed information.",
                demoLink: "./public/Day-16_Random_User_Generator/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript", "API"],
                features: ["Random Profiles", "Photo Gallery", "Export Data"]
            },
            {
                originalDay: 16,
                name: "Image Search App",
                description: "Search and browse high-quality images with advanced filtering options.",
                demoLink: "./public/Day-17_Image_Search_App/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript", "API"],
                features: ["Image Search", "High Quality", "Download Options"]
            },
            {
                originalDay: 17,
                name: "Tic Tac Toe",
                description: "Classic tic-tac-toe game with AI opponent and score tracking.",
                demoLink: "./public/Day-20_tictactoe/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["AI Opponent", "Score Tracking", "Responsive Design"]
            },
            {
                originalDay: 18,
                name: "Candy Crush",
                description: "Match-3 puzzle game inspired by the popular Candy Crush saga.",
                demoLink: "./public/Day-21_candycrush/candy_crush.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Match-3 Gameplay", "Score System", "Power-ups"]
            },
            {
                originalDay: 19,
                name: "Palette Generator",
                description: "Generate beautiful color palettes for your design projects.",
                demoLink: "./public/Day-22_Palette_generator/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Random Generation", "Export Options", "Color Codes"]
            },
            {
                originalDay: 20,
                name: "QR Code Generator",
                description: "Generate QR codes for text, URLs, and other data types.",
                demoLink: "./public/Day-23_QRCodeGenerator/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Multiple Data Types", "Customizable Size", "Download Option"]
            },
            {
                originalDay: 21,
                name: "Rock Paper Scissors",
                description: "Classic rock paper scissors game with computer opponent.",
                demoLink: "./public/Day-23_RockPaperScissor/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Computer AI", "Score Tracking", "Animated Results"]
            },
            {
                originalDay: 22,
                name: "Drawing App",
                description: "Digital drawing canvas with multiple brush tools and colors.",
                demoLink: "./public/Day-26_Drawing/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript", "Canvas"],
                features: ["Multiple Brushes", "Color Picker", "Save Drawing"]
            },
            {
                originalDay: 23,
                name: "Target Reflex Test",
                description: "Test your reflexes by clicking on moving targets as fast as possible.",
                demoLink: "./public/Day-28_Target_Reflex_Test/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Reflex Testing", "High Scores", "Difficulty Levels"]
            },
            {
                originalDay: 24,
                name: "Memory Game",
                description: "Classic memory card matching game with multiple difficulty levels.",
                demoLink: "./public/Day-31/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Memory Training", "Multiple Levels", "Timer Challenge"]
            },
            {
                originalDay: 25,
                name: "Color Picker",
                description: "Advanced color picker with multiple format outputs and palette saving.",
                demoLink: "./public/Day-34-Colour_picker/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Multiple Formats", "Palette Saving", "Color History"]
            },
            {
                originalDay: 26,
                name: "Advanced Drawing",
                description: "Professional drawing application with layers and advanced tools.",
                demoLink: "./public/Day-35-Drawing/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript", "Canvas"],
                features: ["Layer Support", "Advanced Tools", "Export Options"]
            },
            {
                originalDay: 27,
                name: "Notes App",
                description: "Feature-rich notes application with search and organization tools.",
                demoLink: "./public/Day-36_Notes_App/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Rich Text Editor", "Search Function", "Tag Organization"]
            },
            {
                originalDay: 28,
                name: "Note Taker",
                description: "Simple and efficient note-taking app with markdown support.",
                demoLink: "./public/Day-42_NoteTaker/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Markdown Support", "Auto-save", "Export Notes"]
            },
            {
                originalDay: 29,
                name: "Audio Visualizer",
                description: "Interactive audio visualizer with particle effects and real-time frequency analysis.",
                demoLink: "./public/Day-45/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript", "Web Audio API"],
                features: ["Audio Analysis", "Particle Effects", "Real-time Visualization", "Multiple Themes"]
            },
            {
                originalDay: 30,
                name: "Pomodoro Timer",
                description: "Productivity timer with task management, customizable themes, and session tracking.",
                demoLink: "./public/Day-47_Pomodoro-app/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Timer Sessions", "Task Management", "Dark Mode", "Custom Themes", "Statistics"]
            },
            {
                originalDay: 31,
                name: "Chess Game",
                description: "Interactive chess game with move validation, piece animations, and game state tracking.",
                demoLink: "./public/Day-51/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript", "SVG"],
                features: ["Move Validation", "Piece Animation", "Game Logic", "Interactive Board"]
            },
            {
                originalDay: 32,
                name: "Rock Paper Scissors",
                description: "Interactive rock paper scissors game with user vs computer gameplay.",
                demoLink: "./public/Day-54_RockPaperSessior/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Move Validation", "Piece Animation", "Game Logic", "Interactive Board"]
            },

            {
                originalDay: 33,
                name: "Portfolio Website",
                description: "Modern portfolio website template with responsive design and animations.",
                demoLink: "./public/Day-72_Portfolio/index.html",
                category: "advanced",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Responsive Design", "Smooth Animations", "Contact Form"]
            },
            {
                originalDay: 34,
                name: "Etch-a-Sketch",
                description: "Digital Etch-a-Sketch with customizable grid and drawing modes.",
                demoLink: "./public/Etch-a-Sketch/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Customizable Grid", "Multiple Drawing Modes", "Clear Function"]
            },
            {
                originalDay: 35,
                name: "GiggleBits",
                description: "Fun collection of interactive mini-games and entertainment.",
                demoLink: "./public/GiggleBits/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Mini Games", "Entertainment Hub", "High Scores"]
            },
            {
                originalDay: 36,
                name: "Gradient Generator",
                description: "Create beautiful CSS gradients with live preview and export functionality.",
                demoLink: "./public/Gradient_Generator/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Live Preview", "CSS Export", "Color Picker", "Multiple Gradient Types"]
            },
            {
                originalDay: 37,
                name: "Snake and Ladder",
                description: "Classic board game with multiplayer support and animated gameplay.",
                demoLink: "./public/Snake-and-Ladder-Game/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Multiplayer Support", "Animated Gameplay", "Classic Rules"]
            },
            {
                originalDay: 38,
                name: "Space Jumper Game",
                description: "Exciting space-themed jumping game with physics engine and score system.",
                demoLink: "./public/Space-Jumper-Game/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript", "Canvas"],
                features: ["Physics Engine", "Score System", "Responsive Controls", "Space Theme"]
            },
            {
                originalDay: 39,
                name: "Space War Game",
                description: "Intense space battle game with enemy AI and power-ups.",
                demoLink: "./public/Space-War-Game/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript", "Canvas"],
                features: ["Enemy AI", "Power-ups", "Multiple Levels", "High Scores"]
            },
            {
                originalDay: 40,
                name: "Stopwatch",
                description: "Precision stopwatch with lap timing and split functionality.",
                demoLink: "./public/Stopwatch/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Precision Timing", "Lap Records", "Split Timing", "Export Results"]
            },
            {
                originalDay: 41,
                name: "World Clock",
                description: "Display multiple world time zones with real-time updates and customization.",
                demoLink: "./public/World_Clock/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Multiple Time Zones", "Real-time Updates", "Custom Locations", "12/24 Hour Format"]
            },
            {
                originalDay: 42,
                name: "Notes Tracker",
                description: "A simple and organized digital notebook to create, update, and manage notes efficiently.",
                demoLink: "./public/Day-42_NoteTaker/index.html",
                category: "productivity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Add/Edit/Delete Notes", "Persistent Local Storage", "Search Functionality", "Dark Mode"]
            },
            {
                originalDay: 43,
                name: "Alien Hunt",
                description: "A fun and fast-paced shooting game where players hunt down aliens and score points.",
                demoLink: "./public/Day-31/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Alien Spawning", "Score Counter", "Sound Effects", "Game Over Logic"]
            },
            {
                originalDay: 44,
                name: "Book Recommendation",
                description: "Suggests books based on user-selected genres, moods, or interests with a clean UI.",
                demoLink: "https://book-recomendation.netlify.app/",
                category: "education",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Genre-Based Suggestions", "Book Covers & Descriptions", "Responsive Design", "Interactive Filters"]
            },
            {
                originalDay: 45,
                name: "Student Grade Analyzer",
                description: "Analyzes student marks and provides insights like total, average, grade, and performance level.",
                demoLink: "./public/Student_Grade_Analyzer/index.html",
                category: "education",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Marks Input", "Total & Average Calculation", "Grade Assignment", "Performance Feedback"]
            },
            {
                originalDay: 46,
                name: "Mood Based Music Suggester",
                description: "Recommends music tracks based on the user's selected mood for a personalized listening experience.",
                demoLink: "./public/Mood_Music_Suggester/index.html",
                category: "entertainment",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Mood Selection", "Curated Song List", "Audio Player Integration", "Responsive UI"]
            },
            {
                originalDay: 47,
                name: "CalRace",
                description: "A fast-paced calculator racing game where players solve math problems under time pressure to advance.",
                demoLink: "./public/Day-45/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Math Problem Challenges", "Timer-Based Gameplay", "Score Tracking", "Level Progression"]
            },
            {
                originalDay: 48,
                name: "Word Guess Game",
                description: "An interactive word guessing game where players try to reveal the hidden word within limited attempts.",
                demoLink: "./public/Day53-Word-Guess-Game/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Random Word Generation", "Limited Attempts", "Letter Hints", "Win/Loss Feedback"]
            },
            {
                originalDay: 49,
                name: "4 in a Row",
                description: "A strategic two-player game where the goal is to connect four discs in a row vertically, horizontally, or diagonally.",
                demoLink: "./public/Day-57_4_in_a_row/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Two Player Mode", "Win Detection", "Interactive Grid", "Game Reset"]
            },
            {
                originalDay: 50,
                name: "Budget Tracker",
                description: "A simple financial tracking tool to manage income, expenses, and visualize spending habits.",
                demoLink: "./public/Budget-Tracker/index.html",
                category: "productivity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Add Income & Expenses", "Balance Calculation", "Expense Categories", "Persistent Local Storage"]
            },
            {
                originalDay: 51,
                name: "Memory Game App",
                description: "A classic card-flipping memory game where players match pairs to win with the fewest moves.",
                demoLink: "./public/Memory Game App/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Card Matching Logic", "Move Counter", "Timer", "Game Reset Functionality"]
            },
            {
                originalDay: 52,
                name: "MyPaint",
                description: "A simple and fun digital drawing app that allows users to sketch, doodle, and paint freely on a canvas.",
                demoLink: "./public/day75-mypaint/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Canvas Drawing", "Color Picker", "Brush Size Control", "Clear Canvas Button"]
            },
            {
                originalDay: 53,
                name: "Fruit Slicer",
                description: "Every slice counts. Miss and it’s game over!",
                demoLink: "./public/Fruit_Slicer_Game/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Score System", "Lifes", "Fruit Cutting"]
            },
            {
                originalDay: 54,
                name: "BattleShip",
                description: "Destroy the enemy ship",
                demoLink: "./public/Day-71/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript", "Node.js"],
                features: ["Hide 'n' seek", "Catch"]
            },
            {
                originalDay: 55,
                name: "Github Profle Finder ",
                description: "Find Github Profile ",
                demoLink: "./public/Github_Profile_Finder/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Github", "Github Followers ", "Creative"]
            },
            {
                originalDay: 56,
                name: "HeliFly",
                description: "Fly the Helicopter",
                demoLink: "./public/Day-55/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Fly"]
            },
            {
                originalDay: 57,
                name: "RoboBuilder",
                description: "Buildd the Robot",
                demoLink: "./public/Day-72/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Repair", "Fix"]
            },
            {
                originalDay: 58,
                name: "Github Profile Finder",
                description: "Find Github Profile",
                demoLink: "./public/Github_Profile_Finder/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Github", "Github Followers", "Creative"]
            },
            {
                originalDay: 59,
                name: "Hamster Slap",
                description: "Slap the Hamster coming from the hole.",
                demoLink: "./public/Day-69/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Hide n seek", "Catch", "Slap"]
            },

            {
                originalDay: 60,
                name: "LeetMatrix",
                description: "Check Leetcode stats",
                demoLink: "./public/LeetMatrix/index.html",
                category: "basic",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["LeetCode", "Stats", "Graph"]
            },
            {
                originalDay: 61,
                name: "LoveVerse",
                description: "A Lovely Website with some crazy stuffs.",
                demoLink: "./public/Day-70/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Love Game", "Romantic"]
            },
            {
                originalDay: 62,
                name: "QuizProgram",
                description: "Take a random quiz",
                demoLink: "./public/QuizProgram/index.html",
                category: "basic",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Quiz", "Scores"]
            },
            {
                originalDay: 63,
                name: "University Management System",
                description: "Manage university operations including courses, students, and faculty.",
                demoLink: "./public/University_managment_system/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript", "API"],
                features: ["Visitor Management", "History Tracking", "Search Functionality"]
            },
            {
                originalDay: 64,
                name: " Pixel Art Maker",
                description: "Create pixel art with a simple grid interface.",
                demoLink: "./public/Day-76_PixelArt/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Grid Creation", "Color Selection", "Download Art", "Reset Canvas"]

            },
            {
                originalDay: 65,
                name: "CineSearch",
                description: "stylish and responsive movie search web app that allows users to search for any movie using the OMDB API.",
                demoLink: "./public/CineSearch/index.html",
                category: "entertainment",
                technologies: ["HTML", "CSS", "JavaScript", "API"],
                features: [
                    "Live Movie Search Functionality",
                    "Poster, Title & Year Display",
                    "Responsive Grid Layout",
                    "OMDb API Integration",
                    "Error Handling & No Result Messages",
                    "Dark-Themed UI with Neon Accents",
                    "Clean Separation of HTML, CSS, and JS"
                ]
            },
            {

                originalDay: 66,
                name: "Fruit Ninja",
                description: "Play with fruits",
                demoLink: "./public/Day-59/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Cut"]
            },
            {

                originalDay: 67,
                name: "Solitaire",
                description: "Play with Cards",
                demoLink: "./public/Day-90/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Ace", "King"]
            },
            {

                originalDay: 68,
                name: "Door Game",
                description: "Open the Doors of your luck",
                demoLink: "./public/Day-91/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Luck", "Doors"]
            },
            {

                originalDay: 69,
                name: "Roast Battle",
                description: "Roast Your self by AI",
                demoLink: "./public/Day-92/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Roast"]
            },
            {

                originalDay: 70,
                name: "Compliment Generator",
                description: "Generate Compliment for your love once",
                demoLink: "./public/Day-93/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Compliments"]
            },
            {

                originalDay: 71,
                name: "PickUp Lines",
                description: "Generate PickUp Lines for your someonce",
                demoLink: "./public/Day-94/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["PickUp Lines"]
            },
            {

                originalDay: 72,
                name: "Hero Identity",
                description: "Know who you are",
                demoLink: "./public/Day-95/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Hero", "Powers"]
            },
            {

                originalDay: 73,
                name: "Fotune Teller",
                description: "Know your future",
                demoLink: "./public/Day-96/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Future", "Fortune"]
            },
            {
                originalDay: 74,
                name: "Fitness Tracker",
                description: "Advanced, vibrant web app to track daily steps and water intake with charts, themes, and responsive design.",
                demoLink: "./public/Fitness_Tracker/index.html",
                category: "productivity",
                technologies: ["HTML", "CSS", "JavaScript", "Chart.js"],
                features: ["Daily Steps & Water Input", "Dark/Light Mode", "Chart.js Visualizations", "Responsive Design", "Duplicate Prevention", "Tooltips on Charts"]
            },


            {

                originalDay: 75,
                name: "Super Mario",
                description: "Mario is back.",
                demoLink: "./public/Day-62/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Mario", "Jump"]
            },

            {

                originalDay: 76,
                name: "Netflix",
                description: "Netflix Clone",
                demoLink: "./public/Day-97/index.html",
                category: "Utility",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Clone"]
            },
            {

                originalDay: 77,
                name: "Spin",
                description: "Spin the wheel",
                demoLink: "./public/Day-98/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Spin", "Wheel"]
            },
            {

                originalDay: 78,
                name: "PuckMan",
                description: "Escape from the ghost",
                demoLink: "./public/Day-99/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["PuckMan", "Ghost"]
            },
            {

                originalDay: 79,
                name: "EduGames phase 1",
                description: "Class 1 - Class 8",
                demoLink: "./public/Day-100/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Games", "MCQ"]
            },
            {

                originalDay: 80,
                name: "EduGames phase 2",
                description: "Class 9 - Class 12",
                demoLink: "./public/Day-80/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Games", "MCQ"]
            },
            {

                originalDay: 81,
                name: "Tank Battle",
                description: "Fight with Tanks",
                demoLink: "./public/Day-81/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Future", "Fortune"]
            },
            {

                originalDay: 82,
                name: "Carrom",
                description: "Play carrom",
                demoLink: "./public/Day-82/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Carrom", "Fun"]
            },
            {

                originalDay: 83,
                name: "Pong",
                description: "Play Pong",
                demoLink: "./public/Day-83/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Future", "Fortune"]
            },
            {

                originalDay: 84,
                name: "404 Escape Room",
                description: "Find the hidden clues",
                demoLink: "./public/Day-84/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Hidden", "Clues"]
            },
            {

                originalDay: 85,
                name: "Sudoku",
                description: "Play with numbers",
                demoLink: "./public/Day-85/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Numbers"]
            },
            {

                originalDay: 86,
                name: "KBC",
                description: "Kaun Banega crorepati?",
                demoLink: "./public/Day-86/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["MCQ", "Lifelines"]
            },
            {

                originalDay: 87,
                name: "Past Life Finder",
                description: "Know your Past",
                demoLink: "./public/Day-87/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Past"]
            },
            {

                originalDay: 88,
                name: "Tetris",
                description: "Play Tetris",
                demoLink: "./public/Day-88/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Tetris", "Boxes"]
            },
            {

                originalDay: 89,
                name: "Puzzle",
                description: "Slides the boxes",
                demoLink: "./public/Day-89/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Slide", "Solve"]
            },
            {

                originalDay: 90,
                name: "Archery",
                description: "Aim the target",
                demoLink: "./public/Day-61/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Slide", "Solve"]
            },


            {
                originalDay: 91,
                name: "Flappy Bird",
                description: "Play with Bird",
                demoLink: "./public/flappy-bird/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Bird", "Score", "Hard"]
            },

            {


                originalDay: 92,
                name: "Fanta Website Clone",
                description: "Enjoy your first Drink ",
                demoLink: "./public/Fanta-Website/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Fanta", "Coldrink", "Animation"]
            },
            {
                originalDay: 93,
                name: "Ruchii Tiffin ",
                description: "Simple Homely Tasty Meals ",
                demoLink: "./public/Ruchii-Tiffin/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["food", "meals", "creativity"]
            },

            {

                originalDay: 94,
                name: "Invoice Builder",
                description: "Generate Product Invoice",
                demoLink: "./public/Invoice-Builder/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Invoice", "Product Invoice ", "Invoice Generator"]
            },

            {
                originalDay: 95,
                name: "Fitness Club ",
                description: "Your Only Gym",
                demoLink: "./public/Gym-Website/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Gym", "Weight", "Fitness"]
            },

            {
                originalDay: 96,
                name: "Bubble Pop",
                description: "Engaging bubble popping game where players clear groups of matching bubbles under a timer with increasing difficulty and score multipliers.",
                demoLink: "./public/Bubble_Pop/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Dynamic 8x8 bubble grid", "group matching and popping", "multi-levels with timer", "score tracking", "light/dark mode", "responsive design", "keyboard accessible", "animations", "sound effects"]
            },

            {
                originalDay: 97,
                name: "Library Book Manager",
                description: "A stylish, accessible, and fully functional library management app to add, edit, delete, and track reading status of books with persistent storage.",
                demoLink: "./public/Library_Book_Manager/index.html",
                category: "productivity",
                technologies: ["HTML", "CSS", "JavaScript", "LocalStorage"],
                features: [
                    "Add, Edit, and Delete Books",
                    "Reading Status Toggle (Unread, Reading, Read)",
                    "Dark/Light Mode Toggle with Persistence",
                    "Responsive and Accessible UI",
                    "Animated Border Gradient Styling",
                    "Empty Library Message Handling"
                ]
            },
            {
                originalDay: 98,
                name: "Memory Grid Rush",
                description: "Fast-paced memory game where players repeat flashing grid patterns that get progressively harder with each level.",
                demoLink: "./public/Memory_Grid_Rush/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: [
                    "Dynamic grid scaling, pattern generation & replay, dark/light mode, score & level tracking, keyboard accessibility, animated feedback, and replay option."
                ]
            },

            {
                originalDay: 99,
                name: "Fitness Club ",
                description: "Your Only Gym",
                demoLink: "./public/Gym-Website/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Gym", "Weight", "Fitness"]
            },


            {
                originalDay: 100,
                name: "Library Book Manager",
                description: "A stylish, accessible, and fully functional library management app to add, edit, delete, and track reading status of books with persistent storage.",
                demoLink: "./public/Library_Book_Manager/index.html",
                category: "productivity",
                technologies: ["HTML", "CSS", "JavaScript", "LocalStorage"],
                features: [
                    "Add, Edit, and Delete Books", "Reading Status Toggle (Unread, Reading, Read)",
                    "Dark/Light Mode Toggle with Persistence", "Responsive and Accessible UI",
                    "Animated Border Gradient Styling", "Empty Library Message Handling"]
            },
            {
                originalDay: 101,
                name: "Drum Kit",
                description: "Play the Drum",
                demoLink: "./public/Drum-Kit/index.html",
                category: "productivity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Music", "Drum"]
            },

            {
                originalDay: 102,
                name: "Memory Grid Rush",
                description: "Fast-paced memory game where players repeat flashing grid patterns that get progressively harder with each level.",
                demoLink: "./public/Memory_Grid_Rush/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: [
                    "Dynamic grid scaling, pattern generation & replay, dark/light mode, score & level tracking, keyboard accessibility, animated feedback, and replay option."
                ]
            },

            {
                originalDay: 103,
                name: "Salon Website ",
                description: "Firt Cut Free",
                demoLink: "./public/Salon-Website/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["salon", "cutting", "glow up"]
            },
            {
                originalDay: 104,
                name: "Agency Website",
                description: "Showcase your agency",
                demoLink: "./public/Agency-Website/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["agency", "showcase", "portfolio"]
            },


            {
                originalDay: 105,
                name: "RAM Website",
                description: "A website for showcasing RAM products",
                demoLink: "./public/RAM-Website/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["RAM", "Computer", "Website"]
            },

            {
                originalDay: 106,
                name: "Lagunitas Website",
                description: "A website for showcasing Lagunitas products",
                demoLink: "./public/Lagunitas-Website/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Lagunitas", "Beer", "Website"]
            },


            {
                originalDay: 107,
                name: "Pirate Website",
                description: "A website for showcasing pirate-themed products",
                demoLink: "./public/Pirates-Website/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Pirate", "Website", "Showcase"]
            },

            {
                originalDay: 108,
                name: "Christmas Lights",
                description: "A website for showcasing Christmas lights",
                demoLink: "./public/Christmas-Website/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Christmas", "Lights", "Website"]
            },
            {
                originalDay: 109,
                name: "Bottle Spin",
                description: "Play truth & dare with friends",
                demoLink: "./public/Day-150/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Truth", "Dare", "Fun"]
            },
            {
                originalDay: 110,
                name: "Travel Bucket List App",
                description: "A website for your Travel Bucket List",
                demoLink: "./public/Day-151/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Travel", "List", "Planning"]
            },
            {
                originalDay: 111,
                name: "Lost & Found Hub",
                description: "A website for Lost & Found products",
                demoLink: "./public/Day-152/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Items", "Lost", "Found"]
            },
            {
                originalDay: 112,
                name: "Recipe Finder",
                description: "A website which helps you in finding your favorait Recipes",
                demoLink: "./public/Day-153/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Recipes"]
            },
            {
                originalDay: 113,
                name: "Cross the road",
                description: "Beaware from Cars",
                demoLink: "./public/Day-154/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Car", "Road"]
            },
            {
                originalDay: 114,
                name: "Borderland",
                description: "A website for Browser-Based Survival Game",
                demoLink: "./public/Day-155/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Cards", "survival"]
            },
            {
                originalDay: 115,
                name: "Rolling numbers",
                description: "Match the 3 numbers",
                demoLink: "./public/Day-156/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Numbers"]
            },
            {
                originalDay: 116,
                name: "Time Vault",
                description: "A website where you hide your message",
                demoLink: "./public/Day-157/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Message", "Vault", "Time"]
            },
            {
                originalDay: 117,
                name: "Puzzle",
                description: "Puzzle Game",
                demoLink: "./public/Day-158/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Game"]
            },
            {
                originalDay: 118,
                name: "Lighthouse Building",
                description: "Build the Lighthouse",
                demoLink: "./public/Day-159/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Lighthouse", "Building"]
            },
            {
                originalDay: 119,
                name: "Car Racing",
                description: "Car Racing game",
                demoLink: "./public/Day-160/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Racing"]
            },
            {
                originalDay: 120,
                name: "Baloon Buster",
                description: "Bust the Baloon",
                demoLink: "./public/Day-161/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Baloon"]
            },
            {
                originalDay: 121,
                name: "Hacker Website",
                description: "A Hacker themed Website",
                demoLink: "./public/Day-162/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Website"]
            },
            {
                originalDay: 122,
                name: "Story Generator",
                description: "Generate Stories",
                demoLink: "./public/Day-163/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Stories"]
            },
            {
                originalDay: 123,
                name: "Alien Language translator",
                description: "Translate Alien Language",
                demoLink: "./public/Day-164/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Translator"]
            },
            {
                originalDay: 124,
                name: "Dino Game",
                description: "Chrome Dino Game",
                demoLink: "./public/Day-165/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Dino"]
            },
            {
                originalDay: 125,
                name: "Past Life Finder",
                description: "Past Life Finder website",
                demoLink: "./public/Day-166/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Website"]
            },
            {
                originalDay: 126,
                name: "Health Checkup Appointment",
                description: "Doctor appointment scheduled for a routine health checkup on 25th Aug, 2025 at 10:30 AM.",
                demoLink: "Home.html", // link to details page
                category: "Basic",
                technologies: ["HTML", "CSS", "JS"],
                features: [
                    "Doctor consultation details",
                    "Date & time reminder",
                    "Hospital/Clinic information"
                ]
            },
            {
                originalDay: 127,
                name: "Reaction Time Test 2.0",
                description: "Challenging reaction game where players quickly identify and click the correct shape and color among multiple targets with increasing levels and timed responses.",
                demoLink: "./public/Reaction_Time_Test_2.0/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Multiple colorful shapes display", "timed reaction tracking", "progressive levels", "scoring system", "light/dark mode", "responsive layout", "keyboard accessibility", "animations", "sound effects"]
            },
            {
                originalDay: 128,
                name: "Save Animals Website ",
                description: "A website for saving animals",
                demoLink: "./public/Save-Animals-Website/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Animal", "Save", "Website"]
            },
            {
                originalDay: 129,
                name: "Zombie Shooter",
                description: "A website for showcasing a zombie shooter game",
                demoLink: "./public/Zombie-Shooter-Game/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Zombie", "Shooter", "Game"]
            },
            {
                originalDay: 130,
                name: "HangMan Game",
                description: "A classic word-guessing game where players try to guess a hidden word by suggesting letters within a certain number of guesses.",
                demoLink: "./public/HangmanGame/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["HangMan", "Game", "Word Guessing"]
            },
            {
                originalDay: 131,
                name: "Movie Seat Booking",
                description: "A website for booking movie seats",
                demoLink: "./public/MovieSeatBooking/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Movie", "Seat", "Booking"]
            },
            {
                originalDay: 132,
                name: "Discord Clone",
                description: "Discord UI Clone ",
                demoLink: "./public/Discord-Clone/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Chat", "UI", "Channels"]
            },
            {
                originalDay: 133,
                name: "Cups & Ball",
                description: "Play with cups",
                demoLink: "./public/Day-167/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Cups", "Ball"]
            },
            {
                originalDay: 134,
                name: "BINGO",
                description: "Play BINGO",
                demoLink: "./public/Day-168/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["BINGO"]
            },
            {
                originalDay: 135,
                name: "Casino Roulette",
                description: "Spin the wheel",
                demoLink: "./public/Day-169/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Wheel", "Luck"]
            },
            {
                originalDay: 136,
                name: "Shooting",
                description: "Aim the target",
                demoLink: "./public/Day-170/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Shoot", "Aim"]
            },
            {
                originalDay: 137,
                name: "Car Racing",
                description: "A website for Car Racing Game",
                demoLink: "./public/Day-171/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Car", "Race"]
            },
            {
                originalDay: 138,
                name: "Tattoo Designer",
                description: "A website for Tattoo Designer",
                demoLink: "./public/Day-172/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Tattoo", "Designer"]
            },
            {
                originalDay: 139,
                name: "Signature Maker",
                description: "A website for Signature Maker",
                demoLink: "./public/Day-173/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Signature"]
            },
            {
                originalDay: 140,
                name: "Car rental website",
                description: "A website for Car rent",
                demoLink: "./public/Day-174/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Cars", "Rent"]
            },
            {
                originalDay: 141,
                name: "Admin Dashboard",
                description: "A website for Admin Dashboard",
                demoLink: "./public/Day-175/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Dashboard"]
            },
            {
                originalDay: 142,
                name: "Treasure Hunt",
                description: "A website for Browser-Based Treasure Hunt Game",
                demoLink: "./public/Day-176/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Treasure Hunt"]
            },
            {
                originalDay: 143,
                name: "Rubik Cube",
                description: "A website for Rubik Cube solve",
                demoLink: "./public/Day-177/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Rubik Cube"]
            },
            {
                originalDay: 144,
                name: "Rocket Fighting",
                description: "A website for Rocket Fighting Games",
                demoLink: "./public/Day-178/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Rocket", "Fighting"]
            },
            {
                originalDay: 145,
                name: "Basketball",
                description: "Play Basketball Game",
                demoLink: "./public/Day-179/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Basketball"]
            },
            {
                originalDay: 146,
                name: "Blocks Smash",
                description: "A Blocks Smash Game",
                demoLink: "./public/Day-180/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Blocks", "Smash"]
            },
            {
                originalDay: 147,
                name: "Temple run",
                description: "A Temple run type game",
                demoLink: "./public/Day-181/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Run"]
            },

            {

                originalDay: 148,
                name: "Yoga Website",
                description: "A website for showcasing yoga classes",
                demoLink: "./public/Yoga-Website/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Yoga", "Website", "Showcase"]

            },
            {
                originalDay: 149,
                name: "Email Validator",
                description: "A website for real time email validation",
                demoLink: "./public/Day-101_Email_Validator/index.html",
                category: "Utility",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Real time email validation", "Clean UI", "Website"]
            },
            {
                originalDay: 150,
                name: "TATA 1mg Website Clone",
                description: "A website for online pharmacy services",
                demoLink: "./public/TATA-1mg-Clone/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Online Pharmacy", "Health", "Wellness"]

            },
            {
                originalDay: 151,
                name: "Jewellery Website",
                description: "A website for showcasing jewellery products",
                demoLink: "./public/Jwellery-Website/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Jewellery", "Website", "Showcase"]
            },
            {
                originalDay: 152,
                name: "Myntra Clone",
                description: "Myntra Clone",
                demoLink: "./public/Day-182/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Myntra Clone", "Website"]
            },
            {
                originalDay: 153,
                name: "8 Ball Pool",
                description: "8 Ball Pool game",
                demoLink: "./public/Day-183/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["8 Ball"]
            },
            {
                originalDay: 154,
                name: "Dart Game",
                description: "Aim the board",
                demoLink: "./public/Day-184/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Dart", "Aim"]
            },
            {
                originalDay: 155,
                name: "Gun War",
                description: "Shooting Game",
                demoLink: "./public/Day-185/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Gun"]
            },
            {
                originalDay: 156,
                name: "Watch website",
                description: "A website for showcasing Watches",
                demoLink: "./public/Day-186/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Watches", "Website", "Showcase"]
            },
            {
                originalDay: 157,
                name: "Coffee website",
                description: "A website for showcasing Coffee",
                demoLink: "./public/Day-187/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Coffee", "Website"]
            },
            {
                originalDay: 158,
                name: "Social Media Dashboard",
                description: "A Dashboard for Social Media",
                demoLink: "./public/Day-188/index.html",
                category: "creativity",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Dashboard", "Social Media"]
            },
            {
                originalDay: 159,
                name: "Hunter",
                description: "Shoot The Bird",
                demoLink: "./public/Day-189/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Shooting"]
            },
            {
                originalDay: 160,
                name: "Ghost Jumper",
                description: "Ghost Jumper Game",
                demoLink: "./public/Day-190/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Ghost", "Jumper"]
            },
            {
                originalDay: 161,
                name: "Monkey Runner",
                description: "Monkey Runner Game",
                demoLink: "./public/Day-191/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Monkey", "Runner"]
            },
            {
                originalDay: 162,
                name: "War Game",
                description: "Soldier War Game",
                demoLink: "./public/Day-192/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["War"]
            },
            {
                originalDay: 163,
                name: "Pinball",
                description: "Pinball Game",
                demoLink: "./public/Day-193/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Pinball"]
            },
            {
                originalDay: 164,
                name: "Flip Tiles Puzzle",
                description: "An advanced logic puzzle game where players must flip all tiles to the same color. Clicking a tile toggles its state along with adjacent tiles. The goal is achieved when the entire board is uniform in color.",
                demoLink: "./public/Flip_Tiles_Puzzle/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: [
                    "Interactive 5x5 puzzle grid",
                    "Stylish instructions before gameplay",
                    "Dark and light mode support",
                    "Responsive modern UI with animations",
                    "Reset and Start functionality",
                    "Win detection when all tiles match color",
                    "Hover effects and smooth transitions",
                    "Attractive gradients, shadows, and game-like polish"]
            },
            {
                originalDay: 165,
                name: "Hospital Website",
                description: "A Hospital Website",
                demoLink: "./public/Day-194/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Hospital"]
            },
            {
                originalDay: 166,
                name: "Photography Portfolio Website",
                description: "A Photography Portfolio Website",
                demoLink: "./public/Day-195/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["Photography"]
            },
            {
                originalDay: 167,
                name: "Recipe Finder",
                description: "Find a Recipe using Recipe Finder with the help of API ",
                demoLink: "./public/Day-196/index.html",
                category: "utilities",
                technologies: ["HTML", "CSS", "Javascript", "API"],
                features: ["Recipe Finder"]
            },
            {
                originalDay: 168,
                name: "AI Doc Studio",
                description: "Summerize your Docs",
                demoLink: "./public/Day-200/index.html",
                category: "AI/ML",
                technologies: ["HTML", "CSS", "Javascript", "Python"],
                features: ["Summerizer","Txt","Doc","Pdf"]
            },
            {
                originalDay: 169,
                name: "Colour Blindness Simulator",
                description:"Understand color blindness effects with real-time simulation",
                demoLink: "./public/Day-197/index.html",
                category: "games",
                technologies: ["HTML", "CSS", "Javascript"],
                features:["Simulation", "Interactive","Awareness"]
            },
          {
           originalDay: 170,
               name: "Testimonial Carousel",
               description: "An interactive testimonial carousel with auto-slide, navigation buttons, and a grid of student reviews.",
               demoLink: "./public/TestimonialCarousel/index.html",
               category: "components",
               technologies: ["HTML", "CSS", "JavaScript"],
               features: [
                 "Auto-sliding testimonial carousel",
                 "Previous/Next navigation buttons",
                 "Interactive dots for quick navigation",
                 "Dynamic testimonial grid with 12 student reviews",
                 "Responsive design with hover effects",
                 "Custom styled cards with profile photos and reviews"
                         ]
          },


            {
                originalDay: 171,
                name: "Online Lie Detector",
                description: "Detect truth or lie based on user inputs with interactive analysis",
                demoLink: "./public/day171-online-lie-detector/project.html",
                category: "games",
                technologies: ["HTML", "CSS", "JavaScript"],
                features: ["User interaction", "Fun project", "Basic simulation"]

            }
        ];

        this.projects = projectsData.map((project, index) => ({
            ...project,
            day: index + 1
        }));

        this.filteredProjects = [...this.projects];
    }

    updateStatistics() {
        const statsContainer = document.querySelector('.challenge-stats');
        if (!statsContainer) return;

        // Calculate unique technologies
        const uniqueTechnologies = [...new Set(
            this.projects.flatMap(project => project.technologies)
        )].length;

        // Update stats with counter classes for animation
        statsContainer.innerHTML = `
      <h3 class="challenge-stats-title">Challenge Statistics</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number counter" data-target="${this.projects.length}">0</div>
          <div class="stat-label">Projects Completed</div>
        </div>
        <div class="stat-item">
          <div class="stat-number counter" data-target="100">0</div>
          <div class="stat-label">Total Goal</div>
        </div>
        <div class="stat-item">
          <div class="stat-number counter" data-target="${uniqueTechnologies}">0</div>
          <div class="stat-label">Technologies</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">∞</div>
          <div class="stat-label">Learning</div>
        </div>
      </div>
    `;
    }

    filterProjects() {
        let filtered = [...this.projects];

        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(project => project.category === this.currentFilter);
        }

        if (this.searchTerm) {
            filtered = filtered.filter(project =>
                project.name.toLowerCase().includes(this.searchTerm) ||
                project.description.toLowerCase().includes(this.searchTerm) ||
                project.technologies.some(tech => tech.toLowerCase().includes(this.searchTerm)) ||
                project.features.some(feature => feature.toLowerCase().includes(this.searchTerm))
            );
        }

        this.filteredProjects = filtered;
        this.currentPage = 1;
        this.renderTable();
    }

    setActiveFilter(filter) {
        this.currentFilter = filter;
        this.currentPage = 1;

        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        this.filterProjects();
    }

    renderTable() {
        const tableContainer = document.querySelector('.projects-table-container');
        const emptyState = document.querySelector('.empty-state');

        if (!tableContainer) return;

        const startIndex = (this.currentPage - 1) * this.projectsPerPage;
        const endIndex = startIndex + this.projectsPerPage;
        const projectsToShow = this.filteredProjects.slice(startIndex, endIndex);

        tableContainer.innerHTML = '';

        if (projectsToShow.length === 0) {
            if (emptyState) {
                emptyState.classList.add('show');
            }
            return;
        }

        if (emptyState) {
            emptyState.classList.remove('show');
        }

        const table = document.createElement('table');
        table.className = 'projects-table';

        table.innerHTML = `
      <thead>
        <tr>
          <th onclick="app.sortTable('day')" class="sortable">Day <span class="sort-icon">↕</span></th>
          <th onclick="app.sortTable('name')" class="sortable">Project Name <span class="sort-icon">↕</span></th>
          <th onclick="app.sortTable('category')" class="sortable">Category <span class="sort-icon">↕</span></th>
          <th>Technologies</th>
          <th>Features</th>
          <th>Demo</th>
        </tr>
      </thead>
      <tbody>
        ${projectsToShow.map(project => `
          <tr class="table-row" data-category="${project.category}">
            <td class="day-cell">Day ${project.day}</td>
            <td class="name-cell">
              <div class="project-name">${project.name}</div>
              <div class="project-desc">${project.description}</div>
            </td>
            <td class="category-cell">
              <span class="category-badge category-${project.category}">${project.category}</span>
            </td>
            <td class="tech-cell">
              <div class="tech-tags">
                ${project.technologies.map(tech => `<span class="tech-tag-small">${tech}</span>`).join('')}
              </div>
            </td>
            <td class="features-cell">
              <div class="features-preview">
                ${project.features.slice(0, 2).map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                ${project.features.length > 2 ? `<span class="feature-more">+${project.features.length - 2} more</span>` : ''}
              </div>
            </td>
            <td class="demo-cell">
              <a href="${project.demoLink}" target="_blank" class="demo-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15,3 21,3 21,9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                Demo
              </a>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;

        tableContainer.appendChild(table);

        this.renderPagination();
    }

    sortTable(column) {
        this.filteredProjects.sort((a, b) => {
            if (column === 'day') {
                return a.day - b.day;
            } else if (column === 'name') {
                return a.name.localeCompare(b.name);
            } else if (column === 'category') {
                return a.category.localeCompare(b.category);
            }
            return 0;
        });

        this.renderTable();
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredProjects.length / this.projectsPerPage);
        const paginationContainer = document.querySelector('.pagination');

        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'flex';
        paginationContainer.innerHTML = '';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.innerHTML = '‹';
        prevBtn.dataset.page = this.currentPage - 1;
        paginationContainer.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `pagination-btn ${i === this.currentPage ? 'active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.dataset.page = i;
                paginationContainer.appendChild(pageBtn);
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'pagination-info';
                paginationContainer.appendChild(ellipsis);
            }
        }

        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.disabled = this.currentPage === totalPages;
        nextBtn.innerHTML = '›';
        nextBtn.dataset.page = this.currentPage + 1;
        paginationContainer.appendChild(nextBtn);

        const pageInfo = document.createElement('div');
        pageInfo.className = 'pagination-info';
        pageInfo.textContent = `${this.currentPage} of ${totalPages}`;
        paginationContainer.appendChild(pageInfo);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new WebDev100Days();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebDev100Days;
}
