class CryptoTracker {
    constructor() {
        this.apiBaseURL = 'https://api.coingecko.com/api/v3';
        this.cryptoData = [];
        this.filteredData = [];
        this.isLoading = false;
        this.searchTerm = '';
        this.refreshInterval = null;
        
        // DOM Elements
        this.elements = {
            loadingState: document.getElementById('loadingState'),
            errorState: document.getElementById('errorState'),
            cryptoList: document.getElementById('cryptoList'),
            cryptoItems: document.getElementById('cryptoItems'),
            searchInput: document.getElementById('searchInput'),
            clearSearch: document.getElementById('clearSearch'),
            refreshBtn: document.getElementById('refreshBtn'),
            retryBtn: document.getElementById('retryBtn'),
            lastUpdated: document.getElementById('lastUpdated'),
            noResults: document.getElementById('noResults'),
            totalMarketCap: document.getElementById('totalMarketCap'),
            total24hVolume: document.getElementById('total24hVolume'),
            errorMessage: document.getElementById('errorMessage')
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadCryptoData();
        this.startAutoRefresh();
    }
    
    bindEvents() {
        // Search functionality
        this.elements.searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase().trim();
            this.toggleClearButton();
            this.filterCryptoData();
        });
        
        // Clear search
        this.elements.clearSearch.addEventListener('click', () => {
            this.elements.searchInput.value = '';
            this.searchTerm = '';
            this.toggleClearButton();
            this.filterCryptoData();
            this.elements.searchInput.focus();
        });
        
        // Refresh button
        this.elements.refreshBtn.addEventListener('click', () => {
            if (!this.isLoading) {
                this.loadCryptoData();
            }
        });
        
        // Retry button
        this.elements.retryBtn.addEventListener('click', () => {
            this.loadCryptoData();
        });
        
        // Handle keyboard navigation
        this.elements.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.elements.searchInput.blur();
            }
        });
    }
    
    toggleClearButton() {
        if (this.searchTerm.length > 0) {
            this.elements.clearSearch.classList.add('visible');
        } else {
            this.elements.clearSearch.classList.remove('visible');
        }
    }
    
    async loadCryptoData() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoadingState();
        this.elements.refreshBtn.classList.add('loading');
        
        try {
            // Fetch cryptocurrency data and global market data concurrently
            const [cryptoResponse, globalResponse] = await Promise.all([
                fetch(`${this.apiBaseURL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`),
                fetch(`${this.apiBaseURL}/global`)
            ]);
            
            if (!cryptoResponse.ok) {
                throw new Error(`HTTP error! status: ${cryptoResponse.status}`);
            }
            
            const cryptoData = await cryptoResponse.json();
            
            // Handle global data (optional, may fail)
            let globalData = null;
            if (globalResponse.ok) {
                globalData = await globalResponse.json();
            }
            
            if (!Array.isArray(cryptoData) || cryptoData.length === 0) {
                throw new Error('No cryptocurrency data received');
            }
            
            this.cryptoData = cryptoData;
            this.updateGlobalStats(globalData);
            this.filterCryptoData();
            this.updateLastUpdatedTime();
            this.showCryptoList();
            
        } catch (error) {
            console.error('Error loading crypto data:', error);
            this.showErrorState(error.message);
        } finally {
            this.isLoading = false;
            this.elements.refreshBtn.classList.remove('loading');
        }
    }
    
    updateGlobalStats(globalData) {
        if (globalData && globalData.data) {
            const marketCap = globalData.data.total_market_cap?.usd;
            const volume = globalData.data.total_volume?.usd;
            
            if (marketCap) {
                this.elements.totalMarketCap.textContent = this.formatCurrency(marketCap);
            }
            
            if (volume) {
                this.elements.total24hVolume.textContent = this.formatCurrency(volume);
            }
        } else {
            this.elements.totalMarketCap.textContent = 'N/A';
            this.elements.total24hVolume.textContent = 'N/A';
        }
    }
    
    filterCryptoData() {
        if (!this.searchTerm) {
            this.filteredData = [...this.cryptoData];
        } else {
            this.filteredData = this.cryptoData.filter(crypto => 
                crypto.name.toLowerCase().includes(this.searchTerm) ||
                crypto.symbol.toLowerCase().includes(this.searchTerm)
            );
        }
        
        this.renderCryptoList();
    }
    
    renderCryptoList() {
        if (this.filteredData.length === 0) {
            if (this.searchTerm) {
                this.showNoResults();
            } else {
                this.showErrorState('No cryptocurrency data available');
            }
            return;
        }
        
        const cryptoHTML = this.filteredData.map(crypto => this.createCryptoItemHTML(crypto)).join('');
        this.elements.cryptoItems.innerHTML = cryptoHTML;
        this.showCryptoList();
    }
    
    createCryptoItemHTML(crypto) {
        const priceChange = crypto.price_change_percentage_24h || 0;
        const changeClass = priceChange >= 0 ? 'positive' : 'negative';
        const changeIcon = priceChange >= 0 ? '▲' : '▼';
        
        return `
            <div class="crypto-item" data-id="${crypto.id}">
                <div class="crypto-rank">${crypto.market_cap_rank || 'N/A'}</div>
                <div class="crypto-name">
                    <img src="${crypto.image}" alt="${crypto.name}" class="crypto-logo" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCAxMEwxMy4wOSAxNS43NEwxMiAyMkwxMC45MSAxNS43NEw0IDEwTDEwLjkxIDguMjZMMTIgMloiIGZpbGw9IiM2NjYiLz4KPC9zdmc+Cjwvc3ZnPgo='" />
                    <div class="crypto-details">
                        <h3>${this.escapeHtml(crypto.name)}</h3>
                        <span class="crypto-symbol">${this.escapeHtml(crypto.symbol)}</span>
                    </div>
                </div>
                <div class="crypto-price">$${this.formatPrice(crypto.current_price)}</div>
                <div class="crypto-change ${changeClass}">
                    ${changeIcon} ${Math.abs(priceChange).toFixed(2)}%
                </div>
                <div class="crypto-market-cap">${this.formatCurrency(crypto.market_cap)}</div>
                <div class="crypto-volume">${this.formatCurrency(crypto.total_volume)}</div>
            </div>
        `;
    }
    
    formatPrice(price) {
        if (price === null || price === undefined) return 'N/A';
        
        if (price < 0.01) {
            return price.toFixed(6);
        } else if (price < 1) {
            return price.toFixed(4);
        } else if (price < 100) {
            return price.toFixed(2);
        } else {
            return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
        }
    }
    
    formatCurrency(amount) {
        if (amount === null || amount === undefined) return 'N/A';
        
        if (amount >= 1e12) {
            return `$${(amount / 1e12).toFixed(2)}T`;
        } else if (amount >= 1e9) {
            return `$${(amount / 1e9).toFixed(2)}B`;
        } else if (amount >= 1e6) {
            return `$${(amount / 1e6).toFixed(2)}M`;
        } else if (amount >= 1e3) {
            return `$${(amount / 1e3).toFixed(2)}K`;
        } else {
            return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
        }
    }
    
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    updateLastUpdatedTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        this.elements.lastUpdated.textContent = timeString;
    }
    
    showLoadingState() {
        this.elements.loadingState.style.display = 'flex';
        this.elements.errorState.style.display = 'none';
        this.elements.cryptoList.style.display = 'none';
        this.elements.noResults.style.display = 'none';
    }
    
    showErrorState(message) {
        this.elements.errorMessage.textContent = message || 'An unexpected error occurred. Please try again.';
        this.elements.loadingState.style.display = 'none';
        this.elements.errorState.style.display = 'flex';
        this.elements.cryptoList.style.display = 'none';
        this.elements.noResults.style.display = 'none';
    }
    
    showCryptoList() {
        this.elements.loadingState.style.display = 'none';
        this.elements.errorState.style.display = 'none';
        this.elements.cryptoList.style.display = 'block';
        this.elements.noResults.style.display = 'none';
    }
    
    showNoResults() {
        this.elements.loadingState.style.display = 'none';
        this.elements.errorState.style.display = 'none';
        this.elements.cryptoList.style.display = 'none';
        this.elements.noResults.style.display = 'flex';
    }
    
    startAutoRefresh() {
        // Clear existing interval if any
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        // Set up auto-refresh every 60 seconds
        this.refreshInterval = setInterval(() => {
            if (!this.isLoading) {
                this.loadCryptoData();
            }
        }, 60000); // 60 seconds
    }
    
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
    
    destroy() {
        this.stopAutoRefresh();
        // Remove event listeners
        this.elements.searchInput.removeEventListener('input', this.handleSearch);
        this.elements.clearSearch.removeEventListener('click', this.handleClearSearch);
        this.elements.refreshBtn.removeEventListener('click', this.handleRefresh);
        this.elements.retryBtn.removeEventListener('click', this.handleRetry);
    }
}

// Handle page visibility change to pause/resume auto-refresh
document.addEventListener('visibilitychange', () => {
    if (window.cryptoTracker) {
        if (document.hidden) {
            window.cryptoTracker.stopAutoRefresh();
        } else {
            window.cryptoTracker.startAutoRefresh();
            // Refresh data when page becomes visible again
            if (!window.cryptoTracker.isLoading) {
                window.cryptoTracker.loadCryptoData();
            }
        }
    }
});

// Handle online/offline events
window.addEventListener('online', () => {
    if (window.cryptoTracker && !window.cryptoTracker.isLoading) {
        window.cryptoTracker.loadCryptoData();
    }
});

window.addEventListener('offline', () => {
    if (window.cryptoTracker) {
        window.cryptoTracker.stopAutoRefresh();
    }
});

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.cryptoTracker = new CryptoTracker();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.cryptoTracker) {
        window.cryptoTracker.destroy();
    }
});

// Error handling for uncaught errors
window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
});

// Error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});
