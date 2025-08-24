class LostFoundApp {
    constructor() {
        this.items = [];
        this.currentFilter = {
            search: '',
            status: '',
            category: ''
        };
        
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.bindEvents();
        this.renderItems();
        this.updateStats();
        this.setDefaultDate();
    }

    // Local Storage Methods
    saveToStorage() {
        localStorage.setItem('lostFoundItems', JSON.stringify(this.items));
    }

    loadFromStorage() {
        const saved = localStorage.getItem('lostFoundItems');
        if (saved) {
            this.items = JSON.parse(saved);
        }
    }

    // Event Binding
    bindEvents() {
        // Modal events
        const addItemBtn = document.getElementById('add-item-btn');
        const modal = document.getElementById('add-item-modal');
        const closeModal = modal.querySelector('.close-modal');
        const cancelBtn = document.getElementById('cancel-btn');
        const form = document.getElementById('add-item-form');

        addItemBtn.addEventListener('click', () => this.showModal());
        closeModal.addEventListener('click', () => this.hideModal());
        cancelBtn.addEventListener('click', () => this.hideModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.hideModal();
        });

        // Form events
        form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Image upload
        const imageInput = document.getElementById('item-image');
        imageInput.addEventListener('change', (e) => this.handleImageUpload(e));

        // Search and filter events
        const searchInput = document.getElementById('search-input');
        const statusFilter = document.getElementById('status-filter');
        const categoryFilter = document.getElementById('category-filter');
        const clearFilters = document.getElementById('clear-filters');

        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        statusFilter.addEventListener('change', (e) => this.handleStatusFilter(e.target.value));
        categoryFilter.addEventListener('change', (e) => this.handleCategoryFilter(e.target.value));
        clearFilters.addEventListener('click', () => this.clearAllFilters());

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hideModal();
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                document.getElementById('search-input').focus();
            }
        });
    }

    // Modal Methods
    showModal() {
        const modal = document.getElementById('add-item-modal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        setTimeout(() => {
            document.getElementById('item-name').focus();
        }, 100);
    }

    hideModal() {
        const modal = document.getElementById('add-item-modal');
        modal.classList.remove('show');
        document.body.style.overflow = '';
        this.resetForm();
    }

    resetForm() {
        const form = document.getElementById('add-item-form');
        form.reset();
        this.clearImagePreview();
        this.setDefaultDate();
    }

    setDefaultDate() {
        const dateInput = document.getElementById('item-date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    // Form Handling
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const item = this.createItemFromForm(formData);
        
        if (this.validateItem(item)) {
            this.addItem(item);
            this.hideModal();
            this.showNotification('Item posted successfully!', 'success');
        }
    }

    createItemFromForm(formData) {
        return {
            id: Date.now() + Math.random(),
            name: formData.get('itemName').trim(),
            status: formData.get('itemStatus'),
            category: formData.get('itemCategory'),
            location: formData.get('itemLocation').trim(),
            date: formData.get('itemDate'),
            description: formData.get('itemDescription')?.trim() || '',
            contact: {
                name: formData.get('contactName').trim(),
                phone: formData.get('contactPhone')?.trim() || '',
                email: formData.get('contactEmail').trim()
            },
            image: this.getCurrentImageData(),
            dateCreated: new Date().toISOString(),
            returned: false
        };
    }

    validateItem(item) {
        const required = ['name', 'status', 'category', 'location', 'date'];
        const contactRequired = ['name', 'email'];
        
        for (const field of required) {
            if (!item[field]) {
                this.showNotification(`Please fill in the ${field} field`, 'error');
                return false;
            }
        }
        
        for (const field of contactRequired) {
            if (!item.contact[field]) {
                this.showNotification(`Please fill in the contact ${field} field`, 'error');
                return false;
            }
        }
        
        if (!this.isValidEmail(item.contact.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    addItem(item) {
        this.items.unshift(item); // Add to beginning of array
        this.saveToStorage();
        this.renderItems();
        this.updateStats();
    }

    // Image Handling
    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) {
            this.clearImagePreview();
            return;
        }
        
        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select a valid image file', 'error');
            e.target.value = '';
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.showNotification('Image size should be less than 5MB', 'error');
            e.target.value = '';
            return;
        }
        
        this.showImagePreview(file);
    }

    showImagePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('image-preview');
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px; object-fit: cover;">
                <button type="button" onclick="lostFoundApp.clearImagePreview()" style="margin-top: 0.5rem; padding: 0.25rem 0.5rem; background: var(--danger-color); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">
                    Remove Image
                </button>
            `;
        };
        reader.readAsDataURL(file);
    }

    clearImagePreview() {
        const preview = document.getElementById('image-preview');
        const input = document.getElementById('item-image');
        preview.innerHTML = '';
        input.value = '';
    }

    getCurrentImageData() {
        const preview = document.getElementById('image-preview');
        const img = preview.querySelector('img');
        return img ? img.src : null;
    }

    // Filtering and Search
    handleSearch(query) {
        this.currentFilter.search = query.toLowerCase().trim();
        this.renderItems();
    }

    handleStatusFilter(status) {
        this.currentFilter.status = status;
        this.renderItems();
    }

    handleCategoryFilter(category) {
        this.currentFilter.category = category;
        this.renderItems();
    }

    clearAllFilters() {
        this.currentFilter = { search: '', status: '', category: '' };
        document.getElementById('search-input').value = '';
        document.getElementById('status-filter').value = '';
        document.getElementById('category-filter').value = '';
        this.renderItems();
    }

    filterItems() {
        return this.items.filter(item => {
            const matchesSearch = !this.currentFilter.search || 
                item.name.toLowerCase().includes(this.currentFilter.search) ||
                item.location.toLowerCase().includes(this.currentFilter.search) ||
                item.description.toLowerCase().includes(this.currentFilter.search);
            
            const matchesStatus = !this.currentFilter.status || 
                (this.currentFilter.status === 'returned' ? item.returned : 
                 !item.returned && item.status === this.currentFilter.status);
            
            const matchesCategory = !this.currentFilter.category || 
                item.category === this.currentFilter.category;
            
            return matchesSearch && matchesStatus && matchesCategory;
        });
    }

    // Rendering
    renderItems() {
        const grid = document.getElementById('items-grid');
        const noItems = document.getElementById('no-items');
        const filteredItems = this.filterItems();
        
        if (filteredItems.length === 0) {
            grid.style.display = 'none';
            noItems.style.display = 'block';
            return;
        }
        
        grid.style.display = 'grid';
        noItems.style.display = 'none';
        
        grid.innerHTML = filteredItems.map(item => this.createItemCard(item)).join('');
    }

    createItemCard(item) {
        const statusClass = item.returned ? 'returned' : item.status;
        const statusText = item.returned ? 'Returned 🏆' : 
                          item.status === 'lost' ? 'Lost ❌' : 'Found ✅';
        
        const categoryIcons = {
            electronics: '📱',
            clothing: '👕',
            bags: '🎒',
            books: '📚',
            'id-cards': '🆔',
            others: '📦'
        };
        
        const categoryIcon = categoryIcons[item.category] || '📦';
        const imageHtml = item.image ? 
            `<img src="${item.image}" alt="${item.name}" class="item-image">` : 
            `<div class="item-image-placeholder">${categoryIcon}</div>`;
        
        const actionsHtml = item.returned ? 
            `<div class="item-actions">
                <button onclick="lostFoundApp.deleteItem('${item.id}')" class="btn btn-danger">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>` :
            `<div class="item-actions">
                <button onclick="lostFoundApp.contactOwner('${item.id}')" class="btn btn-primary">
                    <i class="fas fa-envelope"></i>
                    Contact
                </button>
                <button onclick="lostFoundApp.markAsReturned('${item.id}')" class="btn btn-success">
                    <i class="fas fa-check"></i>
                    Mark as Returned
                </button>
                <button onclick="lostFoundApp.deleteItem('${item.id}')" class="btn btn-danger">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>`;
        
        return `
            <div class="item-card ${statusClass}">
                <div class="item-header">
                    <span class="item-status status-${statusClass}">${statusText}</span>
                </div>
                ${imageHtml}
                <h3 class="item-name">${this.escapeHtml(item.name)}</h3>
                <div class="item-details">
                    <div class="item-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${this.escapeHtml(item.location)}</span>
                    </div>
                    <div class="item-detail">
                        <i class="fas fa-calendar"></i>
                        <span>${this.formatDate(item.date)}</span>
                    </div>
                    <div class="item-detail">
                        <i class="fas fa-tag"></i>
                        <span>${categoryIcon} ${this.getCategoryName(item.category)}</span>
                    </div>
                    <div class="item-detail">
                        <i class="fas fa-user"></i>
                        <span>Posted by ${this.escapeHtml(item.contact.name)}</span>
                    </div>
                </div>
                ${item.description ? `<p class="item-description">${this.escapeHtml(item.description)}</p>` : ''}
                ${actionsHtml}
            </div>
        `;
    }

    getCategoryName(category) {
        const names = {
            electronics: 'Electronics',
            clothing: 'Clothing',
            bags: 'Bags',
            books: 'Books',
            'id-cards': 'ID Cards',
            others: 'Others'
        };
        return names[category] || 'Others';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Item Actions
    contactOwner(itemId) {
        const item = this.items.find(i => i.id == itemId);
        if (!item) return;
        
        const contactInfo = [
            item.contact.email,
            item.contact.phone ? `Phone: ${item.contact.phone}` : ''
        ].filter(Boolean).join('\n');
        
        const subject = encodeURIComponent(`Regarding ${item.status} item: ${item.name}`);
        const body = encodeURIComponent(`Hi ${item.contact.name},\n\nI saw your post about the ${item.status} ${item.name} at ${item.location}.\n\nPlease let me know if this is still available.\n\nThanks!`);
        
        if (item.contact.email) {
            window.open(`mailto:${item.contact.email}?subject=${subject}&body=${body}`);
        } else {
            alert(`Contact Information:\n${contactInfo}`);
        }
    }

    markAsReturned(itemId) {
        const item = this.items.find(i => i.id == itemId);
        if (!item) return;
        
        const confirmed = confirm(`Mark "${item.name}" as returned? This action cannot be undone.`);
        if (!confirmed) return;
        
        item.returned = true;
        item.returnedDate = new Date().toISOString();
        
        this.saveToStorage();
        this.renderItems();
        this.updateStats();
        this.showSuccessAnimation();
    }

    deleteItem(itemId) {
        const item = this.items.find(i => i.id == itemId);
        if (!item) return;
        
        const confirmed = confirm(`Delete "${item.name}"? This action cannot be undone.`);
        if (!confirmed) return;
        
        this.items = this.items.filter(i => i.id != itemId);
        this.saveToStorage();
        this.renderItems();
        this.updateStats();
        this.showNotification('Item deleted successfully', 'success');
    }

    // Statistics
    updateStats() {
        const totalItems = this.items.length;
        const returnedItems = this.items.filter(item => item.returned).length;
        
        document.getElementById('stats-total').textContent = 
            `${totalItems} item${totalItems !== 1 ? 's' : ''} posted`;
        document.getElementById('stats-returned').textContent = 
            `${returnedItems} returned`;
    }

    // Theme Toggle
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const themeToggle = document.getElementById('theme-toggle');
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const icon = themeToggle.querySelector('i');
        
        if (currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    // Notifications
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--surface-color);
            color: var(--text-primary);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-heavy);
            border-left: 4px solid var(--${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'}-color);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Success Animation
    showSuccessAnimation() {
        const animation = document.getElementById('success-animation');
        animation.classList.add('show');
        
        setTimeout(() => {
            animation.classList.remove('show');
        }, 3000);
    }
}

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Initialize the application
const lostFoundApp = new LostFoundApp();

// Service Worker for offline functionality (optional enhancement)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration failed, but app still works
    });
}

// Export for testing purposes (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LostFoundApp;
}
