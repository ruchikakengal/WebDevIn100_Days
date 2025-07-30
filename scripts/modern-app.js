// Modern JavaScript for WebDevIn_100Days

class WebDev100Days {
  constructor() {
    this.projects = [];
    this.filteredProjects = [];
    this.currentFilter = 'all';
    this.currentPage = 1;
    this.projectsPerPage = 12;
    this.searchTerm = '';
    
    this.init();
  }

  async init() {
    this.setupEventListeners();
    this.setupThemeToggle();
    this.setupScrollProgress();
    this.setupScrollToTop();
    this.setupMobileMenu();
    await this.loadProjects();
    this.renderProjects();
    this.updateStats();
  }

  setupEventListeners() {
    // Search functionality
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

    // Filter tabs
    document.addEventListener('click', (e) => {
      if (e.target.matches('.filter-tab')) {
        this.setActiveFilter(e.target.dataset.filter);
      }
    });

    // Pagination
    document.addEventListener('click', (e) => {
      if (e.target.matches('.pagination-btn')) {
        const page = parseInt(e.target.dataset.page);
        if (page && page !== this.currentPage) {
          this.currentPage = page;
          this.renderProjects();
        }
      }
    });

    // Project card clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('.project-card') || e.target.closest('.project-card')) {
        const card = e.target.closest('.project-card');
        const demoLink = card.querySelector('.project-btn-primary');
        if (demoLink && demoLink.href) {
          window.open(demoLink.href, '_blank');
        }
      }
    });
  }

  setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        
        // Update icon
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

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
          mobileMenuBtn.classList.remove('active');
          mobileNav.classList.remove('active');
        }
      });
    }
  }

  async loadProjects() {
    // This would ideally load from a projects.json file
    // For now, we'll use the existing project data structure
    this.projects = [
      {
        day: 1,
        name: "Todo List",
        description: "A simple and elegant todo list application with local storage support.",
        demoLink: "./public/Day-1_TodoList/index.html",
        category: "basic",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Add/Remove Tasks", "Mark Complete", "Local Storage"]
      },
      {
        day: 2,
        name: "Digital Clock",
        description: "A beautiful digital clock with customizable themes and formats.",
        demoLink: "./public/Day-2_digital_clock/digitalclock.html",
        category: "basic",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Real-time Updates", "Multiple Formats", "Theme Options"]
      },
      {
        day: 3,
        name: "ASCII Art Generator",
        description: "Convert text into ASCII art with various font styles and customization options.",
        demoLink: "./public/Day-3_AsciiArtGenerator/index.html",
        category: "intermediate",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Multiple Fonts", "Customizable Output", "Copy to Clipboard"]
      },
      {
        day: 10,
        name: "Neon Brick Breaker",
        description: "A modern twist on the classic brick breaker game with neon graphics.",
        demoLink: "./public/Day-10_Neon_Brick_Breaker/index.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript", "Canvas"],
        features: ["Neon Graphics", "Power-ups", "Score System"]
      },
      {
        day: 11,
        name: "Weather App",
        description: "Get real-time weather information for any city with a beautiful interface.",
        demoLink: "./public/Day-11_WeatherApp/index.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript", "API"],
        features: ["Real-time Data", "City Search", "Weather Icons"]
      },
      {
        day: 13,
        name: "Coin Flip",
        description: "A realistic coin flipping animation with statistics tracking.",
        demoLink: "./public/Day-13_Coin_Flip/index.html",
        category: "basic",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Realistic Animation", "Statistics", "Sound Effects"]
      },
      {
        day: 15,
        name: "Currency Converter",
        description: "Convert between different currencies with real-time exchange rates.",
        demoLink: "./public/Day-15_Currency_Converter/index.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript", "API"],
        features: ["Real-time Rates", "Multiple Currencies", "History"]
      },
      {
        day: 20,
        name: "Tic Tac Toe",
        description: "Classic tic-tac-toe game with AI opponent and score tracking.",
        demoLink: "./public/Day-20_tictactoe/index.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["AI Opponent", "Score Tracking", "Responsive Design"]
      },
      {
        day: 22,
        name: "Palette Generator",
        description: "Generate beautiful color palettes for your design projects.",
        demoLink: "./public/Day-22_Palette_generator/index.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Random Generation", "Export Options", "Color Codes"]
      },
      {
        day: 23,
        name: "QR Code Generator",
        description: "Generate QR codes for text, URLs, and other data types.",
        demoLink: "./public/Day-23_QRCodeGenerator/index.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Multiple Data Types", "Customizable Size", "Download Option"]
      }
    ];

    this.filteredProjects = [...this.projects];
  }

  setActiveFilter(filter) {
    this.currentFilter = filter;
    this.currentPage = 1;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    this.filterProjects();
  }

  filterProjects() {
    let filtered = [...this.projects];

    // Apply category filter
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(project => project.category === this.currentFilter);
    }

    // Apply search filter
    if (this.searchTerm) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(this.searchTerm) ||
        project.description.toLowerCase().includes(this.searchTerm) ||
        project.technologies.some(tech => tech.toLowerCase().includes(this.searchTerm))
      );
    }

    this.filteredProjects = filtered;
    this.currentPage = 1;
    this.renderProjects();
  }

  renderProjects() {
    const container = document.querySelector('.projects-grid');
    const emptyState = document.querySelector('.empty-state');
    
    if (!container) return;

    // Calculate pagination
    const startIndex = (this.currentPage - 1) * this.projectsPerPage;
    const endIndex = startIndex + this.projectsPerPage;
    const projectsToShow = this.filteredProjects.slice(startIndex, endIndex);

    // Clear container
    container.innerHTML = '';

    if (projectsToShow.length === 0) {
      if (emptyState) {
        emptyState.classList.add('show');
      }
      return;
    }

    if (emptyState) {
      emptyState.classList.remove('show');
    }

    // Render projects
    projectsToShow.forEach((project, index) => {
      const projectCard = this.createProjectCard(project);
      projectCard.style.animationDelay = `${index * 0.1}s`;
      container.appendChild(projectCard);
    });

    this.renderPagination();
  }

  createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card animate-fade-in';
    card.setAttribute('data-category', project.category);

    card.innerHTML = `
      <div class="project-header">
        <div class="project-day">Day ${project.day}</div>
        <h3 class="project-title">${project.name}</h3>
        <p class="project-description">${project.description}</p>
      </div>
      <div class="project-content">
        <div class="project-tech-stack">
          ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        <div class="project-features">
          <h4 class="features-title">Features:</h4>
          <ul class="features-list">
            ${project.features.map(feature => `<li class="feature-item">${feature}</li>`).join('')}
          </ul>
        </div>
      </div>
      <div class="project-footer">
        <div class="project-actions">
          <a href="${project.demoLink}" target="_blank" class="project-btn project-btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15,3 21,3 21,9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            View Demo
          </a>
          <button class="project-btn project-btn-secondary" onclick="this.closest('.project-card').classList.toggle('bookmarked')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
            </svg>
            Save
          </button>
        </div>
        <div class="project-status">
          <div class="status-dot"></div>
          Live
        </div>
      </div>
    `;

    return card;
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

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.disabled = this.currentPage === 1;
    prevBtn.innerHTML = '‹';
    prevBtn.dataset.page = this.currentPage - 1;
    paginationContainer.appendChild(prevBtn);

    // Page numbers
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

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.disabled = this.currentPage === totalPages;
    nextBtn.innerHTML = '›';
    nextBtn.dataset.page = this.currentPage + 1;
    paginationContainer.appendChild(nextBtn);

    // Page info
    const pageInfo = document.createElement('div');
    pageInfo.className = 'pagination-info';
    pageInfo.textContent = `${this.currentPage} of ${totalPages}`;
    paginationContainer.appendChild(pageInfo);
  }

  updateStats() {
    const stats = {
      total: this.projects.length,
      basic: this.projects.filter(p => p.category === 'basic').length,
      games: this.projects.filter(p => p.category === 'games').length,
      utilities: this.projects.filter(p => p.category === 'utilities').length
    };

    // Update stat cards if they exist
    document.querySelectorAll('.stat-number').forEach(el => {
      const type = el.dataset.stat;
      if (stats[type] !== undefined) {
        this.animateNumber(el, stats[type]);
      }
    });
  }

  animateNumber(element, target) {
    const start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (target - start) * progress);
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
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

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new WebDev100Days();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WebDev100Days;
}
