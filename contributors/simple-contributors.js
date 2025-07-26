// Simple Contributors Page - GitHub API Integration
class ContributorsManager {
    constructor() {
        this.repoOwner = 'ruchikakengal';
        this.repoName = 'WebDevIn100_Days';
        this.apiBaseUrl = 'https://api.github.com';
        this.cacheKey = 'contributors_cache';
        this.cacheExpiry = 10 * 60 * 1000; // 10 minutes
    }

    // Get data from cache if available and not expired
    getCachedData() {
        const cached = localStorage.getItem(this.cacheKey);
        if (cached) {
            const data = JSON.parse(cached);
            if (Date.now() - data.timestamp < this.cacheExpiry) {
                return data.contributors;
            }
        }
        return null;
    }

    // Save data to cache
    setCachedData(contributors) {
        const cacheData = {
            contributors: contributors,
            timestamp: Date.now()
        };
        localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
    }

    // Fetch contributors from GitHub API
    async fetchContributors() {
        try {
            // Check cache first
            const cachedData = this.getCachedData();
            if (cachedData) {
                console.log('Using cached data');
                return cachedData;
            }

            const response = await fetch(`${this.apiBaseUrl}/repos/${this.repoOwner}/${this.repoName}/contributors`);
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const contributors = await response.json();
            
            // Cache the data
            this.setCachedData(contributors);
            
            return contributors;
        } catch (error) {
            console.error('Error fetching contributors:', error);
            throw error;
        }
    }

    // Display contributors in the grid (sorted by contributions - highest to lowest)
    displayContributors(contributors) {
        const grid = document.getElementById('contributorsGrid');
        
        if (!contributors || contributors.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: #666;">No contributors found.</p>';
            return;
        }

        // Sort contributors by contribution count (highest to lowest)
        const sortedContributors = contributors.sort((a, b) => b.contributions - a.contributions);

        const contributorsHTML = sortedContributors.map((contributor, index) => {
            // Add ranking badge for top contributors
            let rankBadge = '';
            if (index === 0) {
                rankBadge = '<div class="rank-badge gold">🥇 #1</div>';
            } else if (index === 1) {
                rankBadge = '<div class="rank-badge silver">🥈 #2</div>';
            } else if (index === 2) {
                rankBadge = '<div class="rank-badge bronze">🥉 #3</div>';
            } else {
                rankBadge = `<div class="rank-badge">#${index + 1}</div>`;
            }

            return `
                <div class="contributor-card" data-rank="${index + 1}">
                    ${rankBadge}
                    <div class="contributor-info">
                        <img src="${contributor.avatar_url}" alt="${contributor.login}" class="contributor-avatar" loading="lazy">
                        <div class="contributor-name">${contributor.login}</div>
                        <div class="contributor-contributions">${contributor.contributions} contributions</div>
                    </div>
                    <a href="${contributor.html_url}" target="_blank" class="contributor-link">
                        <i class="fab fa-github"></i> View Profile
                    </a>
                </div>
            `;
        }).join('');

        grid.innerHTML = contributorsHTML;
    }

    // Update statistics
    updateStats(contributors) {
        const totalContributors = contributors.length;
        const totalContributions = contributors.reduce((sum, c) => sum + c.contributions, 0);

        document.getElementById('totalContributors').textContent = totalContributors;
        document.getElementById('totalContributions').textContent = totalContributions;
    }

    // Show error message
    showError(message) {
        const grid = document.getElementById('contributorsGrid');
        grid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                <button onclick="location.reload()" style="background: #1abc9c; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px;">
                    Try Again
                </button>
            </div>
        `;
    }

    // Initialize the contributors page
    async init() {
        try {
            const contributors = await this.fetchContributors();
            this.displayContributors(contributors);
            this.updateStats(contributors);
        } catch (error) {
            this.showError('Failed to load contributors. Please check your internet connection and try again.');
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    const manager = new ContributorsManager();
    manager.init();
});
