// Roadmaps Data Structure
const roadmapsData = {
  'web-development': {
    title: 'Web Development',
    level: 'Beginner Friendly',
    duration: '3-6 months',
    projects: '25+ projects',
    description: 'Master frontend and backend web development from HTML basics to modern frameworks. Build responsive websites, interactive web applications, and full-stack projects.',
    icon: 'fas fa-code',
    stages: [
      {
        id: 'html-basics',
        title: 'HTML Fundamentals',
        level: 'Beginner',
        description: 'Learn the building blocks of web development. Master HTML structure, semantic elements, and accessibility best practices.',
        prerequisites: ['Basic computer skills', 'Text editor knowledge'],
        concepts: [
          'HTML structure and syntax',
          'Semantic HTML elements',
          'Forms and input types',
          'Tables and lists',
          'Links and navigation',
          'Images and media',
          'Accessibility basics'
        ],
        resources: [
          'MDN HTML Documentation',
          'HTML5 Semantic Elements Guide',
          'Web Accessibility Guidelines'
        ],
        projects: [
          { name: 'Personal Portfolio', path: 'public/Day-72_Portfolio' },
          { name: 'HTML Form Builder', path: 'public/Day-42_NoteTaker' },
          { name: 'Semantic Blog Layout', path: 'public/Day-1_SimpleWebpage' }
        ]
      },
      {
        id: 'css-styling',
        title: 'CSS Styling & Layout',
        level: 'Beginner',
        description: 'Transform your HTML with beautiful styling, responsive layouts, and modern CSS techniques.',
        prerequisites: ['HTML Fundamentals'],
        concepts: [
          'CSS selectors and specificity',
          'Box model and positioning',
          'Flexbox and CSS Grid',
          'Responsive design principles',
          'CSS animations and transitions',
          'CSS preprocessors (Sass/Less)',
          'CSS frameworks introduction'
        ],
        resources: [
          'CSS-Tricks Complete Guide',
          'Flexbox Froggy Game',
          'Grid Garden Game',
          'Responsive Web Design Principles'
        ],
        projects: [
          { name: 'Responsive Website', path: 'public/Day-211_Interior-Design-Website' },
          { name: 'CSS Animation Showcase', path: 'public/Day-70' },
          { name: 'Flexbox Layout Practice', path: 'public/Day-52_E-Commerce_UI' }
        ]
      },
      {
        id: 'javascript-fundamentals',
        title: 'JavaScript Fundamentals',
        level: 'Beginner',
        description: 'Add interactivity to your websites with JavaScript. Learn programming concepts and DOM manipulation.',
        prerequisites: ['HTML Fundamentals', 'CSS Styling & Layout'],
        concepts: [
          'Variables, data types, and operators',
          'Functions and scope',
          'Control structures (loops, conditionals)',
          'Arrays and objects',
          'DOM manipulation',
          'Event handling',
          'Error handling and debugging'
        ],
        resources: [
          'JavaScript.info Tutorial',
          'MDN JavaScript Guide',
          'Eloquent JavaScript Book',
          'JavaScript30 Challenge'
        ],
        projects: [
          { name: 'Interactive Calculator', path: 'public/Day-50_BMI_Calculator_Tanu' },
          { name: 'To-Do List App', path: 'public/Day-36_Notes_App' },
          { name: 'Quiz Application', path: 'public/Day-86' }
        ]
      },
      {
        id: 'advanced-javascript',
        title: 'Advanced JavaScript',
        level: 'Intermediate',
        description: 'Master advanced JavaScript concepts including ES6+, asynchronous programming, and modern development practices.',
        prerequisites: ['JavaScript Fundamentals'],
        concepts: [
          'ES6+ features (arrow functions, destructuring, modules)',
          'Promises and async/await',
          'Fetch API and AJAX',
          'Local storage and session storage',
          'Object-oriented programming',
          'Functional programming concepts',
          'Module bundlers and build tools'
        ],
        resources: [
          'You Don\'t Know JS Book Series',
          'ES6 Features Guide',
          'Async JavaScript Tutorial',
          'Modern JavaScript Tooling'
        ],
        projects: [
          { name: 'Weather App with API', path: 'public/Day-27_CineSearch' },
          { name: 'Memory Game', path: 'public/Memory Game App' },
          { name: 'Movie Search App', path: 'public/Day-27_CineSearch' }
        ]
      },
      {
        id: 'frontend-frameworks',
        title: 'Frontend Frameworks',
        level: 'Intermediate',
        description: 'Learn modern frontend frameworks to build scalable and maintainable web applications.',
        prerequisites: ['Advanced JavaScript'],
        concepts: [
          'React.js fundamentals',
          'Component-based architecture',
          'State management (Redux/Context)',
          'Routing and navigation',
          'Hooks and lifecycle methods',
          'Testing React components',
          'Build and deployment'
        ],
        resources: [
          'React Official Documentation',
          'React Router Guide',
          'Redux Toolkit Tutorial',
          'React Testing Library'
        ],
        projects: [
          { name: 'React Todo App', path: 'public/Day-36_Notes_App' },
          { name: 'E-commerce Frontend', path: 'public/Day-52_E-Commerce_UI' },
          { name: 'Social Media Dashboard', path: 'public/Day-99' }
        ]
      },
      {
        id: 'backend-basics',
        title: 'Backend Development',
        level: 'Intermediate',
        description: 'Build server-side applications, APIs, and work with databases to create full-stack applications.',
        prerequisites: ['Frontend Frameworks'],
        concepts: [
          'Node.js and Express.js',
          'RESTful API design',
          'Database integration (MongoDB/SQL)',
          'Authentication and authorization',
          'Server deployment',
          'API testing and documentation',
          'Security best practices'
        ],
        resources: [
          'Node.js Official Guide',
          'Express.js Documentation',
          'MongoDB University',
          'API Design Best Practices'
        ],
        projects: [
          { name: 'REST API Backend', path: 'public/Library_Book_Manager' },
          { name: 'User Authentication System', path: 'public/University_managment_system' },
          { name: 'Full-Stack Web App', path: 'public/TATA-1mg-Clone' }
        ]
      }
    ]
  },

  'ai-ml': {
    title: 'AI & Machine Learning',
    level: 'Intermediate',
    duration: '4-8 months',
    projects: '15+ projects',
    description: 'Learn artificial intelligence and machine learning from Python basics to advanced algorithms. Build intelligent applications and understand ML concepts.',
    icon: 'fas fa-brain',
    stages: [
      {
        id: 'python-basics',
        title: 'Python Fundamentals',
        level: 'Beginner',
        description: 'Master Python programming language essentials for data science and machine learning.',
        prerequisites: ['Basic programming concepts'],
        concepts: [
          'Python syntax and data types',
          'Control structures and functions',
          'Object-oriented programming',
          'File handling and modules',
          'Error handling and debugging',
          'Python standard library',
          'Virtual environments'
        ],
        resources: [
          'Python.org Official Tutorial',
          'Automate the Boring Stuff',
          'Python Crash Course Book',
          'Real Python Tutorials'
        ],
        projects: [
          { name: 'Python Calculator', path: 'public/Day-50_BMI_Calculator_Tanu' },
          { name: 'File Organizer Script', path: 'public/Day-42_NoteTaker' },
          { name: 'Web Scraping Tool', path: 'public/Day-27_CineSearch' }
        ]
      },
      {
        id: 'data-analysis',
        title: 'Data Analysis & Visualization',
        level: 'Beginner',
        description: 'Learn to work with data using pandas, numpy, and visualization libraries.',
        prerequisites: ['Python Fundamentals'],
        concepts: [
          'NumPy for numerical computing',
          'Pandas for data manipulation',
          'Matplotlib for plotting',
          'Seaborn for statistical visualization',
          'Data cleaning and preprocessing',
          'Exploratory data analysis',
          'Statistical analysis basics'
        ],
        resources: [
          'Pandas Documentation',
          'NumPy User Guide',
          'Matplotlib Tutorials',
          'Kaggle Learn Data Analysis'
        ],
        projects: [
          { name: 'Data Visualization Dashboard', path: 'public/Student_Grade_Analyzer' },
          { name: 'Sales Analysis Tool', path: 'public/Day-99' },
          { name: 'Stock Price Analyzer', path: 'public/Day-82' }
        ]
      },
      {
        id: 'machine-learning-basics',
        title: 'Machine Learning Fundamentals',
        level: 'Intermediate',
        description: 'Understand core ML concepts, algorithms, and implement your first machine learning models.',
        prerequisites: ['Data Analysis & Visualization'],
        concepts: [
          'Supervised vs unsupervised learning',
          'Linear and logistic regression',
          'Decision trees and random forests',
          'K-means clustering',
          'Model evaluation and validation',
          'Cross-validation and overfitting',
          'Scikit-learn library'
        ],
        resources: [
          'Scikit-learn Documentation',
          'Machine Learning Yearning',
          'Coursera ML Course',
          'Kaggle ML Courses'
        ],
        projects: [
          { name: 'House Price Predictor', path: 'public/Day-95' },
          { name: 'Customer Segmentation', path: 'public/Day-92' },
          { name: 'Recommendation System', path: 'public/Mood_Music_Suggester' }
        ]
      },
      {
        id: 'deep-learning',
        title: 'Deep Learning & Neural Networks',
        level: 'Advanced',
        description: 'Dive into neural networks, deep learning frameworks, and build AI applications.',
        prerequisites: ['Machine Learning Fundamentals'],
        concepts: [
          'Neural network fundamentals',
          'TensorFlow and Keras',
          'Convolutional Neural Networks (CNN)',
          'Recurrent Neural Networks (RNN)',
          'Transfer learning',
          'Model deployment',
          'Computer vision basics'
        ],
        resources: [
          'TensorFlow Documentation',
          'Deep Learning Specialization',
          'Fast.ai Course',
          'Papers With Code'
        ],
        projects: [
          { name: 'Image Classification App', path: 'public/Day-95' },
          { name: 'Chatbot with NLP', path: 'public/Day-88' },
          { name: 'AI Game Player', path: 'public/Day-83' }
        ]
      }
    ]
  },

  'ui-ux': {
    title: 'UI/UX Design',
    level: 'Beginner Friendly',
    duration: '2-4 months',
    projects: '20+ projects',
    description: 'Master user interface and experience design principles, tools, and best practices to create beautiful and functional designs.',
    icon: 'fas fa-paint-brush',
    stages: [
      {
        id: 'design-fundamentals',
        title: 'Design Fundamentals',
        level: 'Beginner',
        description: 'Learn core design principles, color theory, typography, and visual hierarchy.',
        prerequisites: ['Basic computer skills'],
        concepts: [
          'Design principles (contrast, alignment, repetition, proximity)',
          'Color theory and psychology',
          'Typography and font pairing',
          'Visual hierarchy and layout',
          'Grid systems and composition',
          'Design trends and styles',
          'Accessibility in design'
        ],
        resources: [
          'Design Principles Guide',
          'Color Theory Handbook',
          'Typography Fundamentals',
          'Accessibility Guidelines'
        ],
        projects: [
          { name: 'Brand Identity Design', path: 'public/Day-213_Jwellery-Website' },
          { name: 'Typography Poster', path: 'public/Day-72_Portfolio' },
          { name: 'Color Palette Generator', path: 'public/Day-22_Palette_generator' }
        ]
      },
      {
        id: 'design-tools',
        title: 'Design Tools Mastery',
        level: 'Beginner',
        description: 'Master industry-standard design tools like Figma, Adobe XD, and Sketch.',
        prerequisites: ['Design Fundamentals'],
        concepts: [
          'Figma interface and features',
          'Creating and managing design systems',
          'Prototyping and interactions',
          'Collaboration and handoff',
          'Adobe XD workflows',
          'Sketch basics',
          'Design file organization'
        ],
        resources: [
          'Figma Official Tutorials',
          'Adobe XD Documentation',
          'Sketch Learning Resources',
          'Design System Examples'
        ],
        projects: [
          { name: 'Mobile App Design', path: 'public/Day-52_E-Commerce_UI' },
          { name: 'Website Redesign', path: 'public/Day-211_Interior-Design-Website' },
          { name: 'Design System Creation', path: 'public/Day-99' }
        ]
      },
      {
        id: 'user-research',
        title: 'User Research & Testing',
        level: 'Intermediate',
        description: 'Learn to conduct user research, create personas, and validate design decisions.',
        prerequisites: ['Design Tools Mastery'],
        concepts: [
          'User research methods',
          'Creating user personas',
          'User journey mapping',
          'Usability testing',
          'A/B testing principles',
          'Analytics and metrics',
          'Interview techniques'
        ],
        resources: [
          'UX Research Methods',
          'Persona Creation Guide',
          'Usability Testing Handbook',
          'Google Analytics for Designers'
        ],
        projects: [
          { name: 'User Research Study', path: 'public/Day-86' },
          { name: 'Persona Development', path: 'public/Mood_Music_Suggester' },
          { name: 'Usability Test Report', path: 'public/Feedback.html' }
        ]
      },
      {
        id: 'interaction-design',
        title: 'Interaction & Motion Design',
        level: 'Intermediate',
        description: 'Create engaging user experiences with animations, micro-interactions, and motion design.',
        prerequisites: ['User Research & Testing'],
        concepts: [
          'Interaction design principles',
          'Micro-interactions and animations',
          'Motion design basics',
          'Prototyping advanced interactions',
          'Transition and easing',
          'Loading states and feedback',
          'Mobile interaction patterns'
        ],
        resources: [
          'Interaction Design Guide',
          'Motion Design Principles',
          'Prototyping Tools Comparison',
          'Animation Libraries'
        ],
        projects: [
          { name: 'Interactive Prototype', path: 'public/ParallaxScrollingDemo' },
          { name: 'Animation Showcase', path: 'public/Day-70' },
          { name: 'Mobile App Prototype', path: 'public/TestimonialCarousel' }
        ]
      }
    ]
  },

  'backend': {
    title: 'Backend Development',
    level: 'Intermediate',
    duration: '4-6 months',
    projects: '18+ projects',
    description: 'Build robust server-side applications, APIs, and database systems. Learn to create scalable backend architectures.',
    icon: 'fas fa-server',
    stages: [
      {
        id: 'server-fundamentals',
        title: 'Server & API Fundamentals',
        level: 'Beginner',
        description: 'Learn server-side programming concepts, HTTP protocols, and API design principles.',
        prerequisites: ['JavaScript Fundamentals'],
        concepts: [
          'Client-server architecture',
          'HTTP methods and status codes',
          'RESTful API design',
          'JSON and data formats',
          'Node.js runtime environment',
          'Express.js framework',
          'Middleware concepts'
        ],
        resources: [
          'Node.js Official Documentation',
          'Express.js Guide',
          'REST API Design Best Practices',
          'HTTP Protocol Explained'
        ],
        projects: [
          { name: 'Simple REST API', path: 'public/Library_Book_Manager' },
          { name: 'File Upload Service', path: 'public/Day-42_NoteTaker' },
          { name: 'URL Shortener API', path: 'public/Day-27_CineSearch' }
        ]
      },
      {
        id: 'database-integration',
        title: 'Database Management',
        level: 'Intermediate',
        description: 'Work with databases, design schemas, and implement data persistence in your applications.',
        prerequisites: ['Server & API Fundamentals'],
        concepts: [
          'Database types (SQL vs NoSQL)',
          'MongoDB and Mongoose',
          'PostgreSQL and SQL queries',
          'Database design and modeling',
          'CRUD operations',
          'Database indexing and optimization',
          'Data validation and sanitization'
        ],
        resources: [
          'MongoDB University',
          'PostgreSQL Documentation',
          'Database Design Principles',
          'SQL Tutorial and Practice'
        ],
        projects: [
          { name: 'User Management System', path: 'public/University_managment_system' },
          { name: 'Blog API with Database', path: 'public/Ruchii-Tiffin' },
          { name: 'Inventory Management', path: 'public/Library_Book_Manager' }
        ]
      },
      {
        id: 'authentication-security',
        title: 'Authentication & Security',
        level: 'Intermediate',
        description: 'Implement secure authentication systems and learn backend security best practices.',
        prerequisites: ['Database Management'],
        concepts: [
          'JWT tokens and sessions',
          'Password hashing and encryption',
          'OAuth and social login',
          'Role-based access control',
          'API security best practices',
          'CORS and CSRF protection',
          'Input validation and sanitization'
        ],
        resources: [
          'JWT.io Documentation',
          'OWASP Security Guidelines',
          'Authentication Best Practices',
          'Node.js Security Checklist'
        ],
        projects: [
          { name: 'Secure Login System', path: 'public/University_managment_system' },
          { name: 'Multi-role Application', path: 'public/Ruchii-Tiffin' },
          { name: 'API with Authentication', path: 'public/TATA-1mg-Clone' }
        ]
      },
      {
        id: 'deployment-scaling',
        title: 'Deployment & Scaling',
        level: 'Advanced',
        description: 'Deploy applications to production and learn scaling strategies for high-traffic applications.',
        prerequisites: ['Authentication & Security'],
        concepts: [
          'Cloud platforms (AWS, Heroku, DigitalOcean)',
          'Containerization with Docker',
          'Environment configuration',
          'Load balancing and caching',
          'Monitoring and logging',
          'CI/CD pipelines',
          'Performance optimization'
        ],
        resources: [
          'AWS Documentation',
          'Docker Getting Started',
          'Deployment Best Practices',
          'Performance Monitoring Tools'
        ],
        projects: [
          { name: 'Production-Ready API', path: 'public/TATA-1mg-Clone' },
          { name: 'Scalable Web Service', path: 'public/Library_Book_Manager' },
          { name: 'Microservices Architecture', path: 'public/University_managment_system' }
        ]
      }
    ]
  },

  'mobile': {
    title: 'Mobile Development',
    level: 'Intermediate',
    duration: '5-8 months',
    projects: '12+ projects',
    description: 'Create mobile applications for iOS and Android using modern frameworks and native development approaches.',
    icon: 'fas fa-mobile-alt',
    stages: [
      {
        id: 'mobile-fundamentals',
        title: 'Mobile Development Basics',
        level: 'Beginner',
        description: 'Learn mobile development concepts, platform differences, and choose your development path.',
        prerequisites: ['JavaScript or Swift/Kotlin knowledge'],
        concepts: [
          'Mobile app architecture patterns',
          'iOS vs Android development',
          'Native vs cross-platform development',
          'Mobile UI/UX principles',
          'App lifecycle and state management',
          'Device capabilities and APIs',
          'Mobile app distribution'
        ],
        resources: [
          'Mobile Development Guide',
          'iOS Human Interface Guidelines',
          'Android Design Guidelines',
          'Cross-Platform Comparison'
        ],
        projects: [
          { name: 'Simple Mobile Calculator', path: 'public/Day-50_BMI_Calculator_Tanu' },
          { name: 'Todo Mobile App', path: 'public/Day-36_Notes_App' },
          { name: 'Weather Mobile App', path: 'public/World_Clock' }
        ]
      },
      {
        id: 'react-native',
        title: 'React Native Development',
        level: 'Intermediate',
        description: 'Build cross-platform mobile apps using React Native framework.',
        prerequisites: ['Mobile Development Basics', 'React knowledge'],
        concepts: [
          'React Native setup and CLI',
          'Components and navigation',
          'State management in mobile apps',
          'Native device APIs',
          'Styling and responsive design',
          'Performance optimization',
          'App store deployment'
        ],
        resources: [
          'React Native Documentation',
          'Expo Development Platform',
          'React Navigation Guide',
          'React Native Performance'
        ],
        projects: [
          { name: 'Social Media App', path: 'public/Day-99' },
          { name: 'E-commerce Mobile App', path: 'public/TATA-1mg-Clone' },
          { name: 'Fitness Tracking App', path: 'public/Stopwatch' }
        ]
      },
      {
        id: 'native-development',
        title: 'Native iOS/Android',
        level: 'Advanced',
        description: 'Develop native mobile applications using Swift for iOS and Kotlin for Android.',
        prerequisites: ['React Native Development'],
        concepts: [
          'Swift programming for iOS',
          'Kotlin programming for Android',
          'Platform-specific UI frameworks',
          'Native performance optimization',
          'Platform-specific features',
          'App store guidelines',
          'Native testing frameworks'
        ],
        resources: [
          'Swift Documentation',
          'Kotlin for Android',
          'iOS Development Guide',
          'Android Developer Documentation'
        ],
        projects: [
          { name: 'iOS Game Application', path: 'public/Snake-and-Ladder-Game' },
          { name: 'Android Utility App', path: 'public/Day-95' },
          { name: 'Cross-Platform Feature App', path: 'public/Mood_Music_Suggester' }
        ]
      }
    ]
  },

  'devops': {
    title: 'DevOps & Cloud',
    level: 'Advanced',
    duration: '6-10 months',
    projects: '10+ projects',
    description: 'Learn deployment, automation, cloud services, and infrastructure management for modern software development.',
    icon: 'fas fa-cogs',
    stages: [
      {
        id: 'devops-fundamentals',
        title: 'DevOps Principles & Tools',
        level: 'Intermediate',
        description: 'Understand DevOps culture, practices, and essential tools for automation and collaboration.',
        prerequisites: ['Backend Development experience'],
        concepts: [
          'DevOps culture and practices',
          'Version control with Git',
          'Continuous Integration/Continuous Deployment',
          'Infrastructure as Code',
          'Monitoring and logging',
          'Collaboration tools',
          'Agile and DevOps integration'
        ],
        resources: [
          'DevOps Handbook',
          'Git Documentation',
          'CI/CD Best Practices',
          'Infrastructure as Code Guide'
        ],
        projects: [
          { name: 'Automated Deployment Pipeline', path: 'public/University_managment_system' },
          { name: 'Monitoring Dashboard', path: 'public/Day-99' },
          { name: 'Infrastructure Automation', path: 'public/Library_Book_Manager' }
        ]
      },
      {
        id: 'containerization',
        title: 'Containerization & Orchestration',
        level: 'Advanced',
        description: 'Master Docker containers and Kubernetes orchestration for scalable application deployment.',
        prerequisites: ['DevOps Principles & Tools'],
        concepts: [
          'Docker fundamentals and best practices',
          'Container orchestration with Kubernetes',
          'Microservices architecture',
          'Service mesh and networking',
          'Container security',
          'Helm charts and package management',
          'Container monitoring and logging'
        ],
        resources: [
          'Docker Documentation',
          'Kubernetes Official Tutorials',
          'Container Best Practices',
          'Microservices Patterns'
        ],
        projects: [
          { name: 'Dockerized Application', path: 'public/TATA-1mg-Clone' },
          { name: 'Kubernetes Deployment', path: 'public/Library_Book_Manager' },
          { name: 'Microservices Platform', path: 'public/University_managment_system' }
        ]
      },
      {
        id: 'cloud-platforms',
        title: 'Cloud Services & Management',
        level: 'Advanced',
        description: 'Deploy and manage applications on major cloud platforms with auto-scaling and high availability.',
        prerequisites: ['Containerization & Orchestration'],
        concepts: [
          'AWS/Azure/GCP services',
          'Cloud architecture patterns',
          'Auto-scaling and load balancing',
          'Cloud security and compliance',
          'Serverless computing',
          'Cloud cost optimization',
          'Disaster recovery and backup'
        ],
        resources: [
          'AWS Documentation',
          'Azure Learning Path',
          'Google Cloud Training',
          'Cloud Architecture Patterns'
        ],
        projects: [
          { name: 'Cloud-Native Application', path: 'public/TATA-1mg-Clone' },
          { name: 'Serverless Backend', path: 'public/Day-27_CineSearch' },
          { name: 'Multi-Cloud Deployment', path: 'public/Library_Book_Manager' }
        ]
      }
    ]
  }
};

// Roadmap functionality
class RoadmapManager {
  constructor() {
    this.currentRoadmap = null;
    this.modal = document.getElementById('roadmap-modal');
    this.init();
  }

  init() {
    this.bindEvents();
    this.handleThemeToggle();
  }

  bindEvents() {
    // Roadmap card clicks
    document.querySelectorAll('.roadmap-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const roadmapId = btn.getAttribute('data-roadmap');
        this.showRoadmap(roadmapId);
      });
    });

    // Footer roadmap links
    document.querySelectorAll('.roadmap-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const roadmapId = link.getAttribute('data-roadmap');
        this.showRoadmap(roadmapId);
      });
    });

    // Modal close events
    if (this.modal) {
      const closeBtn = this.modal.querySelector('.modal-close');
      const backdrop = this.modal.querySelector('.modal-backdrop');
      
      closeBtn?.addEventListener('click', () => this.closeModal());
      backdrop?.addEventListener('click', () => this.closeModal());
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal.classList.contains('active')) {
          this.closeModal();
        }
      });
    }

    // Scroll to top button
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          scrollTopBtn.style.display = 'flex';
        } else {
          scrollTopBtn.style.display = 'none';
        }
      });
    }

    // Progress bar
    this.updateProgressBar();
    window.addEventListener('scroll', () => this.updateProgressBar());
  }

  showRoadmap(roadmapId) {
    const roadmapData = roadmapsData[roadmapId];
    if (!roadmapData) return;

    this.currentRoadmap = roadmapData;
    this.populateModal(roadmapData);
    this.openModal();
  }

  populateModal(roadmapData) {
    // Update modal header
    document.getElementById('modal-title').textContent = roadmapData.title;
    document.getElementById('modal-level').textContent = roadmapData.level;
    document.getElementById('modal-duration').textContent = roadmapData.duration;
    document.getElementById('modal-projects').textContent = roadmapData.projects;
    document.getElementById('modal-description').textContent = roadmapData.description;

    // Populate stages
    const stagesContainer = document.getElementById('roadmap-stages');
    stagesContainer.innerHTML = '';

    roadmapData.stages.forEach((stage, index) => {
      const stageElement = this.createStageElement(stage, index + 1);
      stagesContainer.appendChild(stageElement);
    });
  }

  createStageElement(stage, stageNumber) {
    const stageDiv = document.createElement('div');
    stageDiv.className = 'stage';
    stageDiv.setAttribute('data-stage-id', stage.id);
    
    const roadmapId = Object.keys(roadmapsData).find(key => 
      roadmapsData[key].title === this.currentRoadmap.title
    );
    
    const isCompleted = window.progressTracker && roadmapId ? 
      window.progressTracker.isStageComplete(roadmapId, stage.id) : 
      false;
    
    stageDiv.innerHTML = `
      <div class="stage-header">
        <div>
          <h3 class="stage-title">${stageNumber}. ${stage.title}</h3>
          <p class="stage-description">${stage.description}</p>
        </div>
        <span class="stage-level">${stage.level}</span>
      </div>
      <div class="stage-content">
        <div class="stage-section">
          <h4><i class="fas fa-list-check"></i> Prerequisites</h4>
          <ul>
            ${stage.prerequisites.map(prereq => `<li>${prereq}</li>`).join('')}
          </ul>
        </div>
        <div class="stage-section">
          <h4><i class="fas fa-lightbulb"></i> Key Concepts</h4>
          <ul>
            ${stage.concepts.map(concept => `<li>${concept}</li>`).join('')}
          </ul>
        </div>
        <div class="stage-section">
          <h4><i class="fas fa-book"></i> Learning Resources</h4>
          <ul>
            ${stage.resources.map(resource => `<li>${resource}</li>`).join('')}
          </ul>
        </div>
        <div class="stage-section">
          <h4><i class="fas fa-code"></i> Practice Projects</h4>
          <ul>
            ${stage.projects.map(project => 
              `<li><a href="${project.path}/index.html" class="project-link" target="_blank">${project.name}</a></li>`
            ).join('')}
          </ul>
        </div>
      </div>
      <div class="stage-completion">
        <div class="stage-checkbox ${isCompleted ? 'checked' : ''}" data-stage-id="${stage.id}"></div>
        <label class="completion-label" for="stage-${stage.id}">
          ${isCompleted ? 'Stage completed!' : 'Mark as completed'}
        </label>
      </div>
    `;

    // Add completion toggle functionality
    const checkbox = stageDiv.querySelector('.stage-checkbox');
    const label = stageDiv.querySelector('.completion-label');
    
    checkbox.addEventListener('click', () => {
      this.toggleStageCompletion(stage.id, checkbox, label);
    });
    
    label.addEventListener('click', () => {
      this.toggleStageCompletion(stage.id, checkbox, label);
    });

    return stageDiv;
  }

  toggleStageCompletion(stageId, checkbox, label) {
    if (!this.currentRoadmap || !window.progressTracker) return;
    
    // Find the roadmap ID from the roadmapsData keys
    const roadmapId = Object.keys(roadmapsData).find(key => 
      roadmapsData[key].title === this.currentRoadmap.title
    );
    
    const isCurrentlyCompleted = window.progressTracker.isStageComplete(roadmapId, stageId);
    
    if (isCurrentlyCompleted) {
      // Remove completion
      delete window.progressTracker.progress[roadmapId][stageId];
      checkbox.classList.remove('checked');
      label.textContent = 'Mark as completed';
    } else {
      // Mark as completed
      window.progressTracker.markStageComplete(roadmapId, stageId);
      checkbox.classList.add('checked');
      label.textContent = 'Stage completed!';
    }
    
    // Update progress bars
    window.progressTracker.updateUI();
  }

  openModal() {
    if (this.modal) {
      this.modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  updateProgressBar() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;

    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    progressBar.style.width = scrollPercent + '%';
  }

  handleThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      });

      // Load saved theme
      const savedTheme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    if (mobileMenuBtn && mobileNav) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
      });
    }
  }
}

// Progress tracking functionality
class ProgressTracker {
  constructor() {
    this.storageKey = 'roadmap-progress';
    this.progress = this.loadProgress();
  }

  loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || {};
    } catch {
      return {};
    }
  }

  saveProgress() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
  }

  markStageComplete(roadmapId, stageId) {
    if (!this.progress[roadmapId]) {
      this.progress[roadmapId] = {};
    }
    this.progress[roadmapId][stageId] = {
      completed: true,
      completedAt: new Date().toISOString()
    };
    this.saveProgress();
    this.updateUI();
  }

  isStageComplete(roadmapId, stageId) {
    return this.progress[roadmapId]?.[stageId]?.completed || false;
  }

  getCompletionPercentage(roadmapId) {
    const roadmap = roadmapsData[roadmapId];
    if (!roadmap) return 0;

    const totalStages = roadmap.stages.length;
    const completedStages = roadmap.stages.filter(stage => 
      this.isStageComplete(roadmapId, stage.id)
    ).length;

    return Math.round((completedStages / totalStages) * 100);
  }

  updateUI() {
    // Update progress indicators in the UI
    document.querySelectorAll('.roadmap-card').forEach(card => {
      const roadmapId = card.getAttribute('data-roadmap');
      const percentage = this.getCompletionPercentage(roadmapId);
      
      let progressBar = card.querySelector('.progress-bar');
      if (!progressBar && percentage > 0) {
        progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `
          <div class="progress-fill" style="width: ${percentage}%"></div>
          <span class="progress-text">${percentage}% Complete</span>
        `;
        card.appendChild(progressBar);
      } else if (progressBar) {
        const fill = progressBar.querySelector('.progress-fill');
        const text = progressBar.querySelector('.progress-text');
        fill.style.width = percentage + '%';
        text.textContent = `${percentage}% Complete`;
      }
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const roadmapManager = new RoadmapManager();
  const progressTracker = new ProgressTracker();
  
  // Make progress tracker available globally for stage completion
  window.progressTracker = progressTracker;
  
  // Update UI with saved progress
  progressTracker.updateUI();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { roadmapsData, RoadmapManager, ProgressTracker };
}
