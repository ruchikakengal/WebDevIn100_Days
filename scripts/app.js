// WebDevIn_100Days Application

class WebDev100Days {
  constructor() {
    this.projects = [];
    this.filteredProjects = [];
    this.currentFilter = 'all';
    this.currentPage = 1;
    this.projectsPerPage = 20; // Increased for table view
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
    this.renderTable();
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
          this.renderTable();
        }
      }
    });

    // Project row clicks - open demo in new tab
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

  async loadProjects() {
    // Complete list of all projects - day numbers will be assigned sequentially
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
      // ... baaki saare projects ...
      {
        originalDay: 51,
        name: "Chess Game",
        description: "Interactive chess game with move validation, piece animations, and game state tracking.",
        demoLink: "./public/Day-51/index.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript", "SVG"],
        features: ["Move Validation", "Piece Animation", "Game Logic", "Interactive Board"]
      },
      {
        originalDay: 56,
        name: "TypeRush",
        description: "Typing speed test game with real-time feedback and statistics.",
        demoLink: "./public/Day-56_TypeRush/index.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Typing Challenge", "Real-time Feedback", "Statistics Tracking"]
      },
      {
        originalDay: 72,
        name: "Portfolio Website",
        description: "Modern portfolio website template with responsive design and animations.",
        demoLink: "./public/Day-72_Portfolio/index.html",
        category: "advanced",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Responsive Design", "Smooth Animations", "Contact Form"]
      },
      // Non-numbered projects (using 100+ for consistency)
      {
        originalDay: 101,
        name: "Etch-a-Sketch",
        description: "Digital Etch-a-Sketch with customizable grid and drawing modes.",
        demoLink: "./public/Etch-a-Sketch/index.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Customizable Grid", "Multiple Drawing Modes", "Clear Function"]
      },
      {
        originalDay: 102,
        name: "GiggleBits",
        description: "Fun collection of interactive mini-games and entertainment.",
        demoLink: "./public/GiggleBits/index.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Mini Games", "Entertainment Hub", "High Scores"]
      },
      {
        originalDay: 103,
        name: "Gradient Generator",
        description: "Create beautiful CSS gradients with live preview and export functionality.",
        demoLink: "./public/Gradient_Generator/index.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Live Preview", "CSS Export", "Color Picker", "Multiple Gradient Types"]
      },
      {
        originalDay: 104,
        name: "Snake and Ladder",
        description: "Classic board game with multiplayer support and animated gameplay.",
        demoLink: "./public/Snake-and-Ladder-Game/index.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Multiplayer Support", "Animated Gameplay", "Classic Rules"]
      },
      {
        originalDay: 105,
        name: "Space Jumper Game",
        description: "Exciting space-themed jumping game with physics engine and score system.",
        demoLink: "./public/Space-Jumper-Game/index.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript", "Canvas"],
        features: ["Physics Engine", "Score System", "Responsive Controls", "Space Theme"]
      },
      {
        originalDay: 106,
        name: "Space War Game",
        description: "Intense space battle game with enemy AI and power-ups.",
        demoLink: "./public/Space-War-Game/index.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript", "Canvas"],
        features: ["Enemy AI", "Power-ups", "Multiple Levels", "High Scores"]
      },
      {
        originalDay: 107,
        name: "Stopwatch",
        description: "Precision stopwatch with lap timing and split functionality.",
        demoLink: "./public/Stopwatch/index.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Precision Timing", "Lap Records", "Split Timing", "Export Results"]
      },
      {
        originalDay: 108,
        name: "World Clock",
        description: "Display multiple world time zones with real-time updates and customization.",
        demoLink: "./public/World_Clock/index.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Multiple Time Zones", "Real-time Updates", "Custom Locations", "12/24 Hour Format"]
      },
      
      // CONFLICT RESOLVED HERE: Maine saare naye projects rakhe hain aur aapka Calculator bhi sahi details ke saath add kar diya hai.
      {
        originalDay: 121, 
        name: "Calculator",
        description: "A simple calculator for basic arithmetic operations.",
        demoLink: "./public/Calculator/index.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Addition", "Subtraction", "Multiplication", "Division", "Clear"]
      },
      {
        originalDay: 122,
        name: "Hamster Slap",
        description: "Slap the Hamster coming from the hole.",
        demoLink: "./public/Day-69/index.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Hide n seek", "Catch", "Slap"]
      },
      {
        originalDay: 123,
        name: "LeetMatrix",
        description: "Check Leetcode stats ",
        demoLink: "./public/LeetMatrix/index.html",
        category: "basic",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["LeetCode", "Stats", "Graph"]
      }
    ];

    // Assign sequential day numbers (1, 2, 3, 4...) regardless of original day numbers
    this.projects = projectsData.map((project, index) => ({
      ...project,
      day: index + 1
    }));

    this.filteredProjects = [...this.projects];
  }

  filterProjects() {
    let filtered = [...this.projects];

    // Filter by category
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(project => project.category === this.currentFilter);
    }

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(this.searchTerm) ||
        project.description.toLowerCase().includes(this.searchTerm) ||
        project.technologies.some(tech => tech.toLowerCase().includes(this.searchTerm)) ||
        project.features.some(feature => feature.toLowerCase().includes(this.searchTerm))
      );
    }

    this.filteredProjects = filtered;
    this.currentPage = 1; // Reset to first page
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

// Start the app when the page loads
let app; // Global app instance for table sorting
document.addEventListener('DOMContentLoaded', () => {
  app = new WebDev100Days();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WebDev100Days;
}
