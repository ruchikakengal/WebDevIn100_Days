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
    await this.loadProjects();
    this.updateStatistics();
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

  async loadProjects() {
    const projectsData = [
      {
        originalDay: 1,
        name: "Todo List",
        description: "A simple and elegant todo list application with local storage support.",
        demoLink: "Pages/Todo-List.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Add/Remove Tasks", "Mark Complete", "Local Storage"]
      },
      {
        originalDay: 2,
        name: "Digital Clock",
        description: "A beautiful digital clock with customizable themes and formats.",
        demoLink: "Pages/digitalclock.html",
        category: "basic",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Real-time Updates", "Multiple Formats", "Theme Options"]
      },
      {
        originalDay: 3,
        name: "ASCII Art Generator",
        description: "Convert text into ASCII art with various font styles and customization options.",
        demoLink: "Pages/Ascii-Art-Generator.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Multiple Fonts", "Customizable Output", "Copy to Clipboard"]
      },
      {
        originalDay: 4,
        name: "Password Visualizer",
        description: "Visualize password strength and complexity with interactive graphics.",
        demoLink: "Pages/Ascii-Art-Generator.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Strength Analysis", "Visual Feedback", "Security Tips"]
      },
      {
        originalDay: 5,
        name: "Physics Simulation",
        description: "Interactive physics simulation with bouncing balls and gravity effects.",
        demoLink: "Pages/Physics-Simulation.html",
        category: "advanced",
        technologies: ["HTML", "CSS", "JavaScript", "Canvas"],
        features: ["Physics Engine", "Interactive Controls", "Real-time Animation"]
      },
      {
        originalDay: 6,
        name: "Quote Generator",
        description: "Generate inspirational quotes with beautiful backgrounds and sharing options.",
        demoLink: "Pages/Quote-Generator.html",
        category: "basic",
        technologies: ["HTML", "CSS", "JavaScript", "API"],
        features: ["Random Quotes", "Category Filter", "Social Sharing"]
      },
      {
        originalDay: 7,
        name: "Character Word Counter",
        description: "Count characters, words, and paragraphs in real-time with detailed statistics.",
        demoLink: "Pages/CharacterWordCount.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Real-time Counting", "Statistics", "Word Analysis"]
      },
      {
        originalDay: 8,
        name: "Dice Roll Simulator",
        description: "Simulate dice rolls with realistic 3D animations and multiple dice options.",
        demoLink: "Pages/DiceRoll-Simulator.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["3D Animation", "Multiple Dice", "Statistics Tracking"]
      },
      {
        originalDay: 9,
        name: "Guess My Number",
        description: "A fun number guessing game with hints and score tracking.",
        demoLink: "Pages/Guess-My-Number.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Hint System", "Score Tracking", "Difficulty Levels"]
      },
      {
        originalDay: 10,
        name: "Neon Brick Breaker",
        description: "A modern twist on the classic brick breaker game with neon graphics.",
        demoLink: "Pages/Neon-Brick-Breaker.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript", "Canvas"],
        features: ["Neon Graphics", "Power-ups", "Score System"]
      },
      {
        originalDay: 11,
        name: "Weather App",
        description: "Get real-time weather information for any city with a beautiful interface.",
        demoLink: "Pages/WeatherApp.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript", "API"],
        features: ["Real-time Data", "City Search", "Weather Icons"]
      },
      {
        originalDay: 13,
        name: "Coin Flip",
        description: "A realistic coin flipping animation with statistics tracking.",
        demoLink: "Pages/CoinFlip.html",
        category: "basic",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Realistic Animation", "Statistics", "Sound Effects"]
      },
      {
        originalDay: 14,
        name: "E-Waste Management Hub",
        description: "Educational platform for e-waste management with location finder.",
        demoLink: "Pages/E-WasteManagement.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Location Finder", "Educational Content", "Environmental Impact"]
      },
      {
        originalDay: 15,
        name: "Currency Converter",
        description: "Convert between different currencies with real-time exchange rates.",
        demoLink: "Pages/Currency-Converter.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript", "API"],
        features: ["Real-time Rates", "Multiple Currencies", "History"]
      },
      {
        originalDay: 16,
        name: "Random User Generator",
        description: "Generate random user profiles with photos and detailed information.",
        demoLink: "Pages/Randon-User-Generator.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript", "API"],
        features: ["Random Profiles", "Photo Gallery", "Export Data"]
      },
      {
        originalDay: 17,
        name: "Image Search App",
        description: "Search and browse high-quality images with advanced filtering options.",
        demoLink: ".Special Project/Image Search.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript", "API"],
        features: ["Image Search", "High Quality", "Download Options"]
      },
      {
        originalDay: 20,
        name: "Tic Tac Toe",
        description: "Classic tic-tac-toe game with AI opponent and score tracking.",
        demoLink: "Pages/TicTacToe.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["AI Opponent", "Score Tracking", "Responsive Design"]
      },
      {
        originalDay: 21,
        name: "Candy Crush",
        description: "Match-3 puzzle game inspired by the popular Candy Crush saga.",
        demoLink: "Pages/candy_crush.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Match-3 Gameplay", "Score System", "Power-ups"]
      },
      {
        originalDay: 22,
        name: "Palette Generator",
        description: "Generate beautiful color palettes for your design projects.",
        demoLink: "Pages/Palette-Generator.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Random Generation", "Export Options", "Color Codes"]
      },
      {
        originalDay: 23,
        name: "QR Code Generator",
        description: "Generate QR codes for text, URLs, and other data types.",
        demoLink: "Pages/QR Generator.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Multiple Data Types", "Customizable Size", "Download Option"]
      },
      {
        originalDay: 23,
        name: "Rock Paper Scissors",
        description: "Classic rock paper scissors game with computer opponent.",
        demoLink: "Pages/Rock Paper Scissor.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Computer AI", "Score Tracking", "Animated Results"]
      },
      {
        originalDay: 26,
        name: "Drawing App",
        description: "Digital drawing canvas with multiple brush tools and colors.",
        demoLink: "Pages/Drawing.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript", "Canvas"],
        features: ["Multiple Brushes", "Color Picker", "Save Drawing"]
      },
      {
        originalDay: 28,
        name: "Target Reflex Test",
        description: "Test your reflexes by clicking on moving targets as fast as possible.",
        demoLink: "Pages/Target Reflex Test.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Reflex Testing", "High Scores", "Difficulty Levels"]
      },
      {
        originalDay: 31,
        name: "Memory Game",
        description: "Classic memory card matching game with multiple difficulty levels.",
        demoLink: "Pages/Memory Game.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Memory Training", "Multiple Levels", "Timer Challenge"]
      },
      {
        originalDay: 34,
        name: "Color Picker",
        description: "Advanced color picker with multiple format outputs and palette saving.",
        demoLink: "Pages/Color Picker.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Multiple Formats", "Palette Saving", "Color History"]
      },
      
      {
        originalDay: 35,
        name: "Notes App",
        description: "Feature-rich notes application with search and organization tools.",
        demoLink: "Pages/Notes Home.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Rich Text Editor", "Search Function", "Tag Organization"]
      },
      {
        originalDay: 36,
        name: "Note Taker",
        description: "Simple and efficient note-taking app with markdown support.",
        demoLink: "Pages/Note.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Markdown Support", "Auto-save", "Export Notes"]
      },
      
      {
        originalDay: 37,
        name: "Pomodoro Timer",
        description: "Productivity timer with task management, customizable themes, and session tracking.",
        demoLink: "Pages/PromoDoro Timer.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Timer Sessions", "Task Management", "Dark Mode", "Custom Themes", "Statistics"]
      },
      {
        originalDay: 38,
        name: "Chess Game",
        description: "Interactive chess game with move validation, piece animations, and game state tracking.",
        demoLink: "Pages/Chess.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript", "SVG"],
        features: ["Move Validation", "Piece Animation", "Game Logic", "Interactive Board"]
      },
      {
        originalDay: 39,
        name: "Rock Paper Scissors",
        description: "Interactive rock paper scissors game with user vs computer gameplay.",
        demoLink: "Pages/Rock Paper Scissor.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Move Validation", "Piece Animation", "Game Logic", "Interactive Board"]
      },

      {
        originalDay: 40,
        name: "Portfolio Website",
        description: "Modern portfolio website template with responsive design and animations.",
        demoLink: "Pages/Portfolio.html",
        category: "advanced",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Responsive Design", "Smooth Animations", "Contact Form"]
      },
      {
        originalDay: 41,
        name: "Etch-a-Sketch",
        description: "Digital Etch-a-Sketch with customizable grid and drawing modes.",
        demoLink: "Pages/Sketch.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Customizable Grid", "Multiple Drawing Modes", "Clear Function"]
      },
      {
        originalDay: 42,
        name: "GiggleBits",
        description: "Fun collection of interactive mini-games and entertainment.",
        demoLink: "Pages/Giggle Bits.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Mini Games", "Entertainment Hub", "High Scores"]
      },
      {
        originalDay: 43,
        name: "Gradient Generator",
        description: "Create beautiful CSS gradients with live preview and export functionality.",
        demoLink: "Pages/Gradient Generator.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Live Preview", "CSS Export", "Color Picker", "Multiple Gradient Types"]
      },
      {
        originalDay: 44,
        name: "Snake and Ladder",
        description: "Classic board game with multiplayer support and animated gameplay.",
        demoLink: "Pages/Snake & Ladder.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Multiplayer Support", "Animated Gameplay", "Classic Rules"]
      },
      {
        originalDay: 45,
        name: "Space Jumper Game",
        description: "Exciting space-themed jumping game with physics engine and score system.",
        demoLink: "Pages/Space Jumper.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript", "Canvas"],
        features: ["Physics Engine", "Score System", "Responsive Controls", "Space Theme"]
      },
      {
        originalDay: 46,
        name: "Space War Game",
        description: "Intense space battle game with enemy AI and power-ups.",
        demoLink: "Pages/Space Shooter.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript", "Canvas"],
        features: ["Enemy AI", "Power-ups", "Multiple Levels", "High Scores"]
      },
      {
        originalDay: 47,
        name: "Stopwatch",
        description: "Precision stopwatch with lap timing and split functionality.",
        demoLink: "Pages/StopWatch.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Precision Timing", "Lap Records", "Split Timing", "Export Results"]
      },
      {
        originalDay: 48,
        name: "World Clock",
        description: "Display multiple world time zones with real-time updates and customization.",
        demoLink: "Pages/Clock.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Multiple Time Zones", "Real-time Updates", "Custom Locations", "12/24 Hour Format"]
      
      },
      {
        originalDay: 49,
        name: "Alien Hunt",
        description: "A fun and fast-paced shooting game where players hunt down aliens and score points.",
        demoLink: "Pages/Alien Hunt.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Alien Spawning", "Score Counter", "Sound Effects", "Game Over Logic"]
      },
      {
        originalDay: 50,
        name: "Student Grade Analyzer",
        description: "Analyzes student marks and provides insights like total, average, grade, and performance level.",
        demoLink: "Pages/Student Grade Analyzer.html",
        category: "education",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Marks Input", "Total & Average Calculation", "Grade Assignment", "Performance Feedback"]
      },
      {
        originalDay: 51,
        name: "Mood Based Music Suggester",
        description: "Recommends music tracks based on the user's selected mood for a personalized listening experience.",
        demoLink: "Pages/Music Suggester.html",
        category: "entertainment",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Mood Selection", "Curated Song List", "Audio Player Integration", "Responsive UI"]
      },
      {
        originalDay: 52,
        name: "CalRace",
        description: "A fast-paced calculator racing game where players solve math problems under time pressure to advance.",
        demoLink: "Pages/CalRace.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Math Problem Challenges", "Timer-Based Gameplay", "Score Tracking", "Level Progression"]
      },
      {
        originalDay: 53,
        name: "Word Guess Game",
        description: "An interactive word guessing game where players try to reveal the hidden word within limited attempts.",
        demoLink: "Pages/Word Guess.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Random Word Generation", "Limited Attempts", "Letter Hints", "Win/Loss Feedback"]
      },
      {
        originalDay: 54,
        name: "4 in a Row",
        description: "A strategic two-player game where the goal is to connect four discs in a row vertically, horizontally, or diagonally.",
        demoLink: "Pages/4 in Row.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Two Player Mode", "Win Detection", "Interactive Grid", "Game Reset"]
      },
      {
        originalDay: 55,
        name: "Budget Tracker",
        description: "A simple financial tracking tool to manage income, expenses, and visualize spending habits.",
        demoLink: "Pages/Budget-Tracker.html",
        category: "productivity",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Add Income & Expenses", "Balance Calculation", "Expense Categories", "Persistent Local Storage"]
      },
      {
        originalDay: 56,
        name: "MyPaint",
        description: "A simple and fun digital drawing app that allows users to sketch, doodle, and paint freely on a canvas.",
        demoLink: "Pages/Paint.html",
        category: "creativity",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Canvas Drawing", "Color Picker", "Brush Size Control", "Clear Canvas Button"]
      },
      {
        originalDay: 57,
        name: "Fruit Slicer",
        description: "Every slice counts. Miss and it’s game over!",
        demoLink: "Pages/Fruit Slicer.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Score System", "Lifes", "Fruit Cutting"]
      },
      {
        originalDay: 58,
        name: "Github Profle Finder ",
        description: "Find Github Profile ",
        demoLink: "Pages/Github Finder.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Github", "Github Followers ", "Creative"]
      },
      {
        originalDay: 59,

        name: "Hamster Slap",
        description: "Slap the Hamster coming from the hole.",
        demoLink: "Pages/Hamster Slap.html",
        category: "games",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Hide n seek", "Catch", "Slap"]
      },

{

  originalDay: 60,
    name: "Amazon",
      description: "Amazon Clone",
        demoLink: "Pages/Amazon Clone.html",
          category: "Utility",
            technologies: ["HTML", "CSS", "JavaScript"],
              features: ["Clone"]
},
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

  // Update stats
  statsContainer.innerHTML = `
      <h3 class="challenge-stats-title">Challenge Statistics</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">${this.projects.length}</div>
          <div class="stat-label">Projects Completed</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">100</div>
          <div class="stat-label">Total Goal</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${uniqueTechnologies}</div>
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
