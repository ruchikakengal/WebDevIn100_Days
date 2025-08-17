// Main application JavaScript with theme switching and enhanced features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme system
    initThemeSystem();
    
    // Initialize particles
    initParticles();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize form handling
    initFormHandling();
    
    // Initialize animations on scroll
    initScrollAnimations();
    
    // Initialize global services with error handling
    try {
        // Initialize services one by one with individual error handling
        try {
            window.geminiService = new GeminiService();
            console.log('✓ Gemini Service initialized');
        } catch (error) {
            console.error('Error initializing Gemini Service:', error);
            throw new Error('Gemini Service failed to initialize');
        }
        
        try {
            window.deploymentService = new DeploymentService();
            console.log('✓ Deployment Service initialized');
        } catch (error) {
            console.error('Error initializing Deployment Service:', error);
            throw new Error('Deployment Service failed to initialize');
        }
        
        try {
            window.explanationService = new ExplanationService();
            console.log('✓ Explanation Service initialized');
        } catch (error) {
            console.error('Error initializing Explanation Service:', error);
            throw new Error('Explanation Service failed to initialize');
        }
        
        try {
            window.previewManager = new PreviewManager();
            console.log('✓ Preview Manager initialized');
        } catch (error) {
            console.error('Error initializing Preview Manager:', error);
            throw new Error('Preview Manager failed to initialize');
        }
        
        try {
            window.chatManager = new ChatManager();
            console.log('✓ Chat Manager initialized');
        } catch (error) {
            console.error('Error initializing Chat Manager:', error);
            throw new Error('Chat Manager failed to initialize');
        }
        
        try {
            window.voiceService = new VoiceService();
            console.log('✓ Voice Service initialized');
        } catch (error) {
            console.error('Error initializing Voice Service:', error);
            // Voice service is optional, so we don't throw an error
        }
        
        try {
            window.fileManager = new FileManager();
            console.log('✓ File Manager initialized');
        } catch (error) {
            console.error('Error initializing File Manager:', error);
            throw new Error('File Manager failed to initialize');
        }
        
        console.log('🚀 AI Website Builder initialized successfully!');
        
        // Only show success toast after a small delay to ensure all DOM elements are ready
        setTimeout(() => {
            if (typeof showToast === 'function') {
                showToast('AI Website Builder is ready!', 'success');
            } else {
                console.log('Toast: AI Website Builder is ready!');
            }
        }, 100);
        
    } catch (error) {
        console.error('❌ Error initializing services:', error);
        setTimeout(() => {
            if (typeof showToast === 'function') {
                showToast('Failed to initialize application: ' + error.message, 'error');
            } else {
                console.error('Failed to initialize application:', error.message);
                alert('Failed to initialize application: ' + error.message);
            }
        }, 100);
    }
});

// Theme System
function initThemeSystem() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeDropdown = document.getElementById('theme-dropdown');
    const themeOptions = document.querySelectorAll('.theme-option');
    
    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('ai-website-theme') || 'dark';
    applyTheme(savedTheme);
    updateActiveThemeOption(savedTheme);
    
    // Theme toggle dropdown
    if (themeToggleBtn && themeDropdown) {
        themeToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            themeDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!themeToggleBtn.contains(e.target) && !themeDropdown.contains(e.target)) {
                themeDropdown.classList.remove('active');
            }
        });
    }
    
    // Theme option selection
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.dataset.theme;
            applyTheme(theme);
            updateActiveThemeOption(theme);
            localStorage.setItem('ai-website-theme', theme);
            themeDropdown.classList.remove('active');
            
            // Show toast notification
            showToast(`Theme changed to ${theme.charAt(0).toUpperCase() + theme.slice(1)}`, 'success');
        });
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update particles colors based on theme
    updateParticleColors(theme);
}

function updateActiveThemeOption(theme) {
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.theme === theme);
    });
}

function updateParticleColors(theme) {
    // This will be used when recreating particles
    const themeColors = {
        dark: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
        light: ['#3b82f6', '#06b6d4', '#10b981', '#8b5cf6'],
        neon: ['#00ff00', '#ff00ff', '#00ffff', '#39ff14'],
        ocean: ['#4f46e5', '#06b6d4', '#8b5cf6', '#0ea5e9']
    };
    
    window.currentThemeColors = themeColors[theme] || themeColors.dark;
}

// Particle system for hero background
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Set initial theme colors
    updateParticleColors(localStorage.getItem('ai-website-theme') || 'dark');
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Use current theme colors
    const colors = window.currentThemeColors || ['#667eea', '#764ba2', '#f093fb', '#f5576c'];
    
    // Random properties
    const size = Math.random() * 6 + 3;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const delay = Math.random() * 8;
    const duration = Math.random() * 15 + 15;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const opacity = Math.random() * 0.6 + 0.2;
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, ${color}, transparent);
        opacity: ${opacity};
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        filter: blur(${Math.random() * 2}px);
        box-shadow: 0 0 ${size * 2}px ${color};
    `;
    
    container.appendChild(particle);
    
    // Remove and recreate particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            createParticle(container);
        }
    }, (duration + delay) * 1000);
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Hamburger menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Initial active link update
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form handling
function initFormHandling() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            showToast('Thank you for your message! We\'ll get back to you soon.', 'success');
            this.reset();
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.about-card, .feature-item, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Global functions for navigation and modals
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function openChat() {
    const chatModal = document.getElementById('chat-modal');
    if (chatModal) {
        chatModal.style.display = 'block';
        document.body.classList.add('no-scroll');
        
        // Focus on input
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            setTimeout(() => chatInput.focus(), 100);
        }
    }
}

function closeChat() {
    const chatModal = document.getElementById('chat-modal');
    if (chatModal) {
        chatModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
}

function openPreview() {
    const previewModal = document.getElementById('preview-modal');
    if (previewModal) {
        previewModal.style.display = 'block';
        document.body.classList.add('no-scroll');
    }
}

function closePreview() {
    const previewModal = document.getElementById('preview-modal');
    if (previewModal) {
        previewModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
}

function openExplanation() {
    const explanationModal = document.getElementById('explanation-modal');
    if (explanationModal) {
        explanationModal.style.display = 'block';
        document.body.classList.add('no-scroll');
    }
}

function closeExplanation() {
    const explanationModal = document.getElementById('explanation-modal');
    if (explanationModal) {
        explanationModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
}

function openDeployment() {
    const deploymentModal = document.getElementById('deployment-modal');
    if (deploymentModal) {
        deploymentModal.style.display = 'block';
        document.body.classList.add('no-scroll');
    }
}

function closeDeployment() {
    const deploymentModal = document.getElementById('deployment-modal');
    if (deploymentModal) {
        deploymentModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
}

// Copy to clipboard function
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('Copied to clipboard!', 'success');
    } catch (err) {
        console.error('Fallback copy failed: ', err);
        showToast('Failed to copy to clipboard', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }
    });
});

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }
        });
    }
});

// Error handling for uncaught errors
window.addEventListener('error', function(e) {
    console.error('Uncaught error:', e.error);
    showToast('An unexpected error occurred. Please try again.', 'error');
});

// Error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showToast('An unexpected error occurred. Please try again.', 'error');
});

// Show loading overlay
function showLoading(message = 'Loading...') {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        const text = overlay.querySelector('p');
        if (text) text.textContent = message;
        overlay.style.display = 'flex';
    }
}

// Hide loading overlay
function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Service worker registration for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker would be registered here for offline support
        console.log('Service worker support available');
    });
}
