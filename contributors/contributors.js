// GitHub repository configuration
const GITHUB_CONFIG = {
    owner: 'ruchikakengal',  // Main project repository owner
    repo: 'WebDevIn100_Days', // Repository name
    apiUrl: 'https://api.github.com'
};

// Cache configuration
const CACHE_KEY = 'github_contributors_cache';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

class ContributorsManager {
    constructor() {
        this.contributors = [];
        this.repoData = null;
        this.charts = {};
        this.init();
    }

    async init() {
        try {
            await this.loadContributors();
            this.renderContributors();
            this.updateStats();
            this.renderCharts();
        } catch (error) {
            this.showError(error);
        }
    }

    async loadContributors() {
        const loadingElement = document.getElementById('loadingMessage');
        
        // Check cache first
        const cachedData = this.getCachedData();
        if (cachedData) {
            this.contributors = cachedData.contributors;
            this.repoData = cachedData.repoData;
            loadingElement.style.display = 'none';
            return;
        }

        try {
            // Fetch repository data
            const repoResponse = await fetch(`${GITHUB_CONFIG.apiUrl}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}`);
            if (!repoResponse.ok) throw new Error(`Repository API error: ${repoResponse.status}`);
            this.repoData = await repoResponse.json();

            // Fetch contributors
            const contributorsResponse = await fetch(`${GITHUB_CONFIG.apiUrl}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contributors?per_page=100`);
            if (!contributorsResponse.ok) throw new Error(`Contributors API error: ${contributorsResponse.status}`);
            const contributorsData = await contributorsResponse.json();

            // Fetch detailed user info for each contributor
            const contributorsWithDetails = await Promise.all(
                contributorsData.map(async (contributor) => {
                    try {
                        const userResponse = await fetch(contributor.url);
                        if (userResponse.ok) {
                            const userData = await userResponse.json();
                            return {
                                ...contributor,
                                name: userData.name || contributor.login,
                                bio: userData.bio,
                                location: userData.location,
                                blog: userData.blog,
                                company: userData.company,
                                public_repos: userData.public_repos,
                                followers: userData.followers,
                                following: userData.following,
                                created_at: userData.created_at
                            };
                        }
                        return contributor;
                    } catch (error) {
                        console.warn(`Failed to fetch details for ${contributor.login}:`, error);
                        return contributor;
                    }
                })
            );

            this.contributors = contributorsWithDetails;
            
            // Cache the data
            this.setCachedData({
                contributors: this.contributors,
                repoData: this.repoData,
                timestamp: Date.now()
            });

            loadingElement.style.display = 'none';
        } catch (error) {
            loadingElement.style.display = 'none';
            throw error;
        }
    }

    renderCharts() {
        this.renderContributionsChart();
        this.renderTopContributorsChart();
    }

    renderContributionsChart() {
        const ctx = document.getElementById('contributionsChart').getContext('2d');
        
        // Categorize contributors by contribution levels
        const categories = {
            'Major (50+)': 0,
            'Regular (10-49)': 0,
            'Occasional (5-9)': 0,
            'Minor (1-4)': 0
        };

        this.contributors.forEach(contributor => {
            const contributions = contributor.contributions || 0;
            if (contributions >= 50) categories['Major (50+)']++;
            else if (contributions >= 10) categories['Regular (10-49)']++;
            else if (contributions >= 5) categories['Occasional (5-9)']++;
            else categories['Minor (1-4)']++;
        });

        this.charts.contributionsChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categories),
                datasets: [{
                    data: Object.values(categories),
                    backgroundColor: [
                        '#1abc9c',
                        '#3498db',
                        '#9b59b6',
                        '#f39c12'
                    ],
                    borderWidth: 3,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} contributors (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    renderTopContributorsChart() {
        const ctx = document.getElementById('topContributorsChart').getContext('2d');
        
        // Get top 10 contributors
        const topContributors = this.contributors
            .slice(0, 10)
            .map(contributor => ({
                name: contributor.name || contributor.login,
                contributions: contributor.contributions || 0
            }));

        this.charts.topContributorsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topContributors.map(c => c.name.length > 12 ? c.name.substring(0, 12) + '...' : c.name),
                datasets: [{
                    label: 'Contributions',
                    data: topContributors.map(c => c.contributions),
                    backgroundColor: topContributors.map((_, index) => {
                        const colors = ['#1abc9c', '#3498db', '#9b59b6', '#f39c12', '#e74c3c'];
                        return colors[index % colors.length];
                    }),
                    borderColor: topContributors.map((_, index) => {
                        const colors = ['#16a085', '#2980b9', '#8e44ad', '#e67e22', '#c0392b'];
                        return colors[index % colors.length];
                    }),
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                const fullName = topContributors[context[0].dataIndex].name;
                                return fullName;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 10
                            },
                            maxRotation: 45
                        }
                    }
                }
            }
        });
    }

    renderContributors() {
        const grid = document.getElementById('contributorsGrid');
        grid.innerHTML = '';

        this.contributors.forEach((contributor, index) => {
            const card = this.createContributorCard(contributor, index);
            grid.appendChild(card);
        });
    }

    createContributorCard(contributor, index) {
        const card = document.createElement('div');
        card.className = 'contributor-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const blogLink = contributor.blog && contributor.blog.startsWith('http') ? contributor.blog : 
                        contributor.blog ? `https://${contributor.blog}` : null;

        const joinDate = contributor.created_at ? 
            new Date(contributor.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short' 
            }) : '';

        card.innerHTML = `
            <img src="${contributor.avatar_url}" alt="${contributor.name || contributor.login}" class="contributor-avatar">
            <div class="contributor-name">${contributor.name || contributor.login}</div>
            <div class="contributor-username">@${contributor.login}</div>
            ${contributor.bio ? `<div class="contributor-bio">${contributor.bio}</div>` : ''}
            ${contributor.location ? `<div class="contributor-location"><i class="fas fa-map-marker-alt"></i> ${contributor.location}</div>` : ''}
            ${contributor.company ? `<div class="contributor-location"><i class="fas fa-building"></i> ${contributor.company}</div>` : ''}
            ${joinDate ? `<div class="contributor-location"><i class="fas fa-calendar-alt"></i> Joined ${joinDate}</div>` : ''}
            
            <div class="contributor-stats">
                <div class="contributor-stat">
                    <span class="contributor-stat-number">${contributor.contributions}</span>
                    <div class="contributor-stat-label">Contributions</div>
                </div>
                ${contributor.public_repos !== undefined ? `
                <div class="contributor-stat">
                    <span class="contributor-stat-number">${contributor.public_repos || 0}</span>
                    <div class="contributor-stat-label">Repositories</div>
                </div>` : ''}
                ${contributor.followers !== undefined ? `
                <div class="contributor-stat">
                    <span class="contributor-stat-number">${this.formatNumber(contributor.followers || 0)}</span>
                    <div class="contributor-stat-label">Followers</div>
                </div>` : ''}
            </div>
            
            <div class="contributor-links">
                <a href="${contributor.html_url}" target="_blank" class="contributor-link" title="GitHub Profile">
                    <i class="fab fa-github"></i>
                </a>
                ${blogLink ? `<a href="${blogLink}" target="_blank" class="contributor-link" title="Website"><i class="fas fa-globe"></i></a>` : ''}
            </div>
        `;

        return card;
    }

    updateStats() {
        if (!this.repoData || !this.contributors.length) return;

        // Animate numbers counting up
        this.animateNumber('totalContributors', this.contributors.length);
        this.animateNumber('totalStars', this.repoData.stargazers_count || 0);
        this.animateNumber('totalForks', this.repoData.forks_count || 0);
        
        // Calculate total commits
        const totalCommits = this.contributors.reduce((sum, contributor) => sum + (contributor.contributions || 0), 0);
        this.animateNumber('totalCommits', totalCommits);
    }

    animateNumber(elementId, targetNumber) {
        const element = document.getElementById(elementId);
        const startNumber = 0;
        const duration = 2000; // 2 seconds
        const startTime = Date.now();

        const updateNumber = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentNumber = Math.floor(startNumber + (targetNumber - startNumber) * easeOutCubic);
            
            element.textContent = this.formatNumber(currentNumber);
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = this.formatNumber(targetNumber);
            }
        };

        updateNumber();
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    getCachedData() {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const data = JSON.parse(cached);
                const now = Date.now();
                if (now - data.timestamp < CACHE_DURATION) {
                    return data;
                }
                // Cache expired
                localStorage.removeItem(CACHE_KEY);
            }
        } catch (error) {
            console.warn('Failed to read cache:', error);
            localStorage.removeItem(CACHE_KEY);
        }
        return null;
    }

    setCachedData(data) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to cache data:', error);
        }
    }

    showError(error) {
        console.error('Error loading contributors:', error);
        
        const loadingElement = document.getElementById('loadingMessage');
        const errorElement = document.getElementById('errorMessage');
        
        loadingElement.style.display = 'none';
        errorElement.style.display = 'block';
        
        // Update error message based on error type
        if (error.message.includes('API error: 403')) {
            errorElement.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <p>GitHub API rate limit exceeded. Please try again later.</p>
                <p>The page will automatically retry in 60 seconds...</p>
            `;
            setTimeout(() => window.location.reload(), 60000);
        } else if (error.message.includes('API error: 404')) {
            errorElement.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <p>Repository not found. Please check the repository configuration.</p>
            `;
        } else {
            errorElement.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load contributors: ${error.message}</p>
                <p>Please check your internet connection and try again.</p>
                <button onclick="window.location.reload()" style="background: #1abc9c; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin-top: 10px; cursor: pointer;">
                    <i class="fas fa-redo"></i> Retry
                </button>
            `;
        }
    }

    // Cleanup method for charts
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContributorsManager();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.contributorsManager) {
        window.contributorsManager.destroy();
    }
});
