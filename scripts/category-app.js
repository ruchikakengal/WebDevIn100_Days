/**
 * Category-specific App for WebDevIn_100Days
 * Handles domain-based filtering and project display
 */

class CategoryApp extends WebDev100Days {
    constructor(domain) {
        super();
        this.domain = domain;
        this.domainProjects = [];
        
        // Override the init method to handle domain filtering
        this.initCategory();
    }

    async initCategory() {
        this.setupEventListeners();
        this.setupThemeToggle();
        this.setupScrollProgress();
        this.setupScrollToTop();
        this.setupMobileMenu();
        await this.loadProjects();
        this.filterByDomain();
        this.updateCategoryStatistics();
        this.renderTable();
    }

    /**
     * Filter projects by the current domain
     */
    filterByDomain() {
        this.domainProjects = this.projects.filter(project => project.domain === this.domain);
        this.filteredProjects = [...this.domainProjects];
        
        console.log(`Filtered ${this.domainProjects.length} projects for domain: ${this.domain}`);
    }

    /**
     * Override filterProjects to work within the domain
     */
    filterProjects() {
        let filtered = [...this.domainProjects]; // Start with domain-filtered projects

        // Apply category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(project => project.category === this.currentFilter);
        }

        // Apply search filter
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

    /**
     * Update statistics for the current domain
     */
    updateCategoryStatistics() {
        // Update project count in hero section
        const countElement = document.getElementById(`${this.domain.replace('-', '')}-count`);
        if (countElement) {
            countElement.textContent = this.domainProjects.length;
        }

        // Update any other domain-specific statistics
        this.updateDomainStats();
    }

    /**
     * Update domain-specific statistics
     */
    updateDomainStats() {
        const domainStats = {
            'webdev': {
                categories: [...new Set(this.domainProjects.map(p => p.category))].length,
                technologies: [...new Set(this.domainProjects.flatMap(p => p.technologies))].length
            },
            'ai-ml': {
                advancedProjects: this.domainProjects.filter(p => p.category === 'advanced' || p.category === 'utilities').length,
                apiProjects: this.domainProjects.filter(p => p.technologies.some(t => t.toLowerCase().includes('api'))).length
            },
            'modern-ui': {
                creativeProjects: this.domainProjects.filter(p => p.category === 'creativity').length,
                portfolioProjects: this.domainProjects.filter(p => p.name.toLowerCase().includes('portfolio') || p.name.toLowerCase().includes('website')).length
            }
        };

        // Log domain-specific statistics
        console.log(`Domain stats for ${this.domain}:`, domainStats[this.domain] || {});
    }

    /**
     * Override setupEventListeners to handle domain-specific functionality
     */
    setupEventListeners() {
        super.setupEventListeners();
        
        // Add any domain-specific event listeners here
        this.setupDomainSpecificEvents();
    }

    /**
     * Setup domain-specific event listeners
     */
    setupDomainSpecificEvents() {
        // Add domain-specific functionality here
        // For example, special handling for certain project types
        
        document.addEventListener('click', (e) => {
            if (e.target.matches('.demo-btn') || e.target.closest('.demo-btn')) {
                e.preventDefault();
                const demoBtn = e.target.closest('.demo-btn');
                if (demoBtn && demoBtn.href) {
                    // Track domain-specific analytics if needed
                    console.log(`Opening ${this.domain} project: ${demoBtn.href}`);
                    window.open(demoBtn.href, '_blank');
                }
            }
        });
    }

    /**
     * Get domain display name
     */
    getDomainDisplayName() {
        const domainNames = {
            'webdev': 'Web Development',
            'ai-ml': 'AI/ML',
            'modern-ui': 'Modern UI'
        };
        return domainNames[this.domain] || this.domain;
    }

    /**
     * Get domain description
     */
    getDomainDescription() {
        const descriptions = {
            'webdev': 'Classic web projects using HTML, CSS, and JavaScript',
            'ai-ml': 'Advanced projects with AI/ML concepts and data visualization',
            'modern-ui': 'Cutting-edge user interfaces with modern design patterns'
        };
        return descriptions[this.domain] || '';
    }

    /**
     * Override renderTable to show domain-specific information
     */
    renderTable() {
        super.renderTable();
        
        // Add domain-specific styling or information to the table
        this.enhanceTableForDomain();
    }

    /**
     * Enhance table with domain-specific features
     */
    enhanceTableForDomain() {
        const table = document.querySelector('.projects-table');
        if (!table) return;

        // Add domain-specific CSS class
        table.classList.add(`${this.domain}-table`);

        // Add domain-specific enhancements
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.classList.add(`${this.domain}-row`);
        });
    }
}

// Initialize the category app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get the domain from the script tag's data attribute
    const script = document.querySelector('script[data-domain]');
    const domain = script ? script.getAttribute('data-domain') : 'webdev';
    
    // Create the category app instance
    window.categoryApp = new CategoryApp(domain);
    
    // Also expose as 'app' for compatibility with existing code
    window.app = window.categoryApp;
    
    console.log(`Category app initialized for domain: ${domain}`);
});

// Add CSS for category hero sections
const categoryStyles = `
/* Category Hero Section Styles */
.category-hero-section {
    padding: 6rem 0 4rem;
    background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
    position: relative;
    overflow: hidden;
}

[data-theme="dark"] .category-hero-section {
    background: linear-gradient(135deg, var(--dark-bg-secondary) 0%, var(--dark-bg-primary) 100%);
}

.category-hero-section.aiml-theme {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, var(--bg-primary) 100%);
}

[data-theme="dark"] .category-hero-section.aiml-theme {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, var(--dark-bg-primary) 100%);
}

.category-hero-section.modernui-theme {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, var(--bg-primary) 100%);
}

[data-theme="dark"] .category-hero-section.modernui-theme {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, var(--dark-bg-primary) 100%);
}

.category-hero-content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
}

.category-breadcrumb {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

[data-theme="dark"] .category-breadcrumb {
    color: var(--dark-text-secondary);
}

.category-breadcrumb a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color 0.3s ease;
}

.category-breadcrumb a:hover {
    color: var(--primary-hover);
}

.category-hero-title {
    font-size: 3rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
}

[data-theme="dark"] .category-hero-title {
    color: var(--dark-text-primary);
}

.category-icon-large {
    color: var(--primary-color);
}

.aiml-theme .category-icon-large {
    color: var(--secondary-color);
}

.modernui-theme .category-icon-large {
    color: #f59e0b;
}

.category-hero-subtitle {
    font-size: 1.25rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 2rem;
}

[data-theme="dark"] .category-hero-subtitle {
    color: var(--dark-text-secondary);
}

.category-stats-hero {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
}

.stat-hero {
    text-align: center;
}

.stat-hero .stat-number {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
}

.aiml-theme .stat-hero .stat-number {
    color: var(--secondary-color);
}

.modernui-theme .stat-hero .stat-number {
    color: #f59e0b;
}

.stat-hero .stat-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

[data-theme="dark"] .stat-hero .stat-label {
    color: var(--dark-text-secondary);
}

/* Responsive Design */
@media (max-width: 768px) {
    .category-hero-section {
        padding: 4rem 0 3rem;
    }
    
    .category-hero-title {
        font-size: 2.25rem;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .category-hero-subtitle {
        font-size: 1.125rem;
    }
    
    .category-stats-hero {
        gap: 2rem;
    }
}

@media (max-width: 480px) {
    .category-hero-title {
        font-size: 2rem;
    }
    
    .category-hero-subtitle {
        font-size: 1rem;
    }
    
    .category-stats-hero {
        gap: 1.5rem;
    }
    
    .stat-hero .stat-number {
        font-size: 1.5rem;
    }
}
`;

// Inject category styles
const styleSheet = document.createElement('style');
styleSheet.textContent = categoryStyles;
document.head.appendChild(styleSheet);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CategoryApp;
}

