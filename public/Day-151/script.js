/**
 * Travel Bucket List Application
 * A comprehensive travel planning application with drag-and-drop functionality,
 * local storage persistence, and interactive animations.
 */

class TravelBucketList {
    constructor() {
        this.destinations = [];
        this.currentEditId = null;
        this.currentFilter = 'all';
        this.currentView = 'cards';
        this.isDragging = false;
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.loadFromStorage();
        this.bindEvents();
        this.updateStats();
        this.renderDestinations();
        this.initTheme();
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Modal events
        document.getElementById('addDestinationBtn').addEventListener('click', () => this.openAddModal());
        document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeModal();
        });

        // Form events
        document.getElementById('destinationForm').addEventListener('submit', (e) => this.handleSubmit(e));

        // Search and filter events
        document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e.target.value));
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e.target.dataset.filter));
        });

        // View toggle events
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleViewChange(e.target.dataset.view));
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Confirmation modal events
        document.getElementById('confirmCancel').addEventListener('click', () => this.closeConfirmationModal());
        document.getElementById('confirmDelete').addEventListener('click', () => this.confirmDelete());

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeConfirmationModal();
            }
        });

        // Add button in empty state
        window.openAddModal = () => this.openAddModal();
    }

    /**
     * Load data from localStorage
     */
    loadFromStorage() {
        const stored = localStorage.getItem('travelBucketList');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                this.destinations = data.destinations || [];
                this.currentFilter = data.currentFilter || 'all';
                this.currentView = data.currentView || 'cards';
            } catch (e) {
                console.error('Error loading from storage:', e);
                this.destinations = [];
            }
        }
    }

    /**
     * Save data to localStorage
     */
    saveToStorage() {
        const data = {
            destinations: this.destinations,
            currentFilter: this.currentFilter,
            currentView: this.currentView
        };
        localStorage.setItem('travelBucketList', JSON.stringify(data));
    }

    /**
     * Initialize theme from localStorage
     */
    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        if (savedTheme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }

    /**
     * Toggle between light and dark theme
     */
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        if (newTheme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }

    /**
     * Generate unique ID for destinations
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Open add destination modal
     */
    openAddModal() {
        this.currentEditId = null;
        document.getElementById('modalTitle').textContent = 'Add Destination';
        document.getElementById('saveBtn').textContent = 'Save Destination';
        this.clearForm();
        this.showModal();
    }

    /**
     * Open edit destination modal
     */
    openEditModal(id) {
        const destination = this.destinations.find(d => d.id === id);
        if (!destination) return;

        this.currentEditId = id;
        document.getElementById('modalTitle').textContent = 'Edit Destination';
        document.getElementById('saveBtn').textContent = 'Update Destination';
        
        // Populate form with destination data
        document.getElementById('destinationName').value = destination.name;
        document.getElementById('destinationCountry').value = destination.country || '';
        document.getElementById('destinationCity').value = destination.city || '';
        document.getElementById('destinationPriority').value = destination.priority || 'medium';
        document.getElementById('destinationYear').value = destination.targetYear || '';
        document.getElementById('destinationNotes').value = destination.notes || '';
        document.getElementById('destinationVisited').checked = destination.visited;
        
        this.showModal();
    }

    /**
     * Show modal with animation
     */
    showModal() {
        const modal = document.getElementById('modalOverlay');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        setTimeout(() => {
            document.getElementById('destinationName').focus();
        }, 300);
    }

    /**
     * Close modal
     */
    closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
        document.body.style.overflow = '';
        this.currentEditId = null;
    }

    /**
     * Clear form inputs
     */
    clearForm() {
        document.getElementById('destinationForm').reset();
        document.getElementById('destinationPriority').value = 'medium';
    }

    /**
     * Handle form submission
     */
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const destination = {
            id: this.currentEditId || this.generateId(),
            name: formData.get('destinationName') || document.getElementById('destinationName').value,
            country: document.getElementById('destinationCountry').value,
            city: document.getElementById('destinationCity').value,
            priority: document.getElementById('destinationPriority').value,
            targetYear: document.getElementById('destinationYear').value,
            notes: document.getElementById('destinationNotes').value,
            visited: document.getElementById('destinationVisited').checked,
            createdAt: this.currentEditId ? 
                this.destinations.find(d => d.id === this.currentEditId).createdAt : 
                new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (this.currentEditId) {
            // Update existing destination
            const index = this.destinations.findIndex(d => d.id === this.currentEditId);
            if (index !== -1) {
                this.destinations[index] = destination;
            }
        } else {
            // Add new destination
            this.destinations.unshift(destination);
        }

        this.saveToStorage();
        this.updateStats();
        this.renderDestinations();
        this.closeModal();

        // Check for completion celebration
        this.checkForCompletion();
        
        // Show success message
        this.showToast(this.currentEditId ? 'Destination updated!' : 'Destination added!');
    }

    /**
     * Delete destination with confirmation
     */
    deleteDestination(id) {
        const destination = this.destinations.find(d => d.id === id);
        if (!destination) return;

        this.pendingDeleteId = id;
        document.getElementById('confirmationMessage').textContent = 
            `Are you sure you want to delete "${destination.name}"?`;
        
        document.getElementById('confirmationModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close confirmation modal
     */
    closeConfirmationModal() {
        document.getElementById('confirmationModal').classList.remove('active');
        document.body.style.overflow = '';
        this.pendingDeleteId = null;
    }

    /**
     * Confirm deletion
     */
    confirmDelete() {
        if (this.pendingDeleteId) {
            this.destinations = this.destinations.filter(d => d.id !== this.pendingDeleteId);
            this.saveToStorage();
            this.updateStats();
            this.renderDestinations();
            this.showToast('Destination deleted!');
        }
        this.closeConfirmationModal();
    }

    /**
     * Toggle visited status
     */
    toggleVisited(id) {
        const destination = this.destinations.find(d => d.id === id);
        if (destination) {
            destination.visited = !destination.visited;
            destination.updatedAt = new Date().toISOString();
            
            this.saveToStorage();
            this.updateStats();
            this.renderDestinations();
            this.checkForCompletion();
            
            const status = destination.visited ? 'visited' : 'added to your list';
            this.showToast(`${destination.name} marked as ${status}!`);
        }
    }

    /**
     * Handle search functionality
     */
    handleSearch(query) {
        this.searchQuery = query.toLowerCase();
        this.renderDestinations();
    }

    /**
     * Handle filter changes
     */
    handleFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.saveToStorage();
        this.renderDestinations();
    }

    /**
     * Handle view changes
     */
    handleViewChange(view) {
        this.currentView = view;
        
        // Update active view button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        this.saveToStorage();
        this.renderDestinations();
    }

    /**
     * Filter destinations based on current filter and search
     */
    getFilteredDestinations() {
        let filtered = [...this.destinations];
        
        // Apply filter
        if (this.currentFilter === 'visited') {
            filtered = filtered.filter(d => d.visited);
        } else if (this.currentFilter === 'not-visited') {
            filtered = filtered.filter(d => !d.visited);
        }
        
        // Apply search
        if (this.searchQuery) {
            filtered = filtered.filter(d => 
                d.name.toLowerCase().includes(this.searchQuery) ||
                (d.country && d.country.toLowerCase().includes(this.searchQuery)) ||
                (d.city && d.city.toLowerCase().includes(this.searchQuery)) ||
                (d.notes && d.notes.toLowerCase().includes(this.searchQuery))
            );
        }
        
        return filtered;
    }

    /**
     * Update statistics
     */
    updateStats() {
        const total = this.destinations.length;
        const visited = this.destinations.filter(d => d.visited).length;
        const percentage = total > 0 ? Math.round((visited / total) * 100) : 0;

        document.getElementById('totalDestinations').textContent = total;
        document.getElementById('visitedDestinations').textContent = visited;
        document.getElementById('progressPercentage').textContent = `${percentage}%`;
        document.getElementById('progressFill').style.width = `${percentage}%`;
    }

    /**
     * Render destinations based on current view
     */
    renderDestinations() {
        const filtered = this.getFilteredDestinations();
        
        if (this.currentView === 'cards') {
            this.renderCardsView(filtered);
        } else {
            this.renderTimelineView(filtered);
        }
    }

    /**
     * Render cards view
     */
    renderCardsView(destinations) {
        const grid = document.getElementById('destinationsGrid');
        const timeline = document.getElementById('timelineView');
        const emptyState = document.getElementById('emptyState');
        
        grid.classList.remove('hidden');
        timeline.classList.add('hidden');
        
        if (destinations.length === 0) {
            grid.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
        }
        
        emptyState.classList.add('hidden');
        
        grid.innerHTML = destinations.map(destination => this.createDestinationCard(destination)).join('');
        
        // Add event listeners to cards
        this.bindCardEvents();
    }

    /**
     * Render timeline view
     */
    renderTimelineView(destinations) {
        const grid = document.getElementById('destinationsGrid');
        const timeline = document.getElementById('timelineView');
        const emptyState = document.getElementById('emptyState');
        
        grid.classList.add('hidden');
        timeline.classList.remove('hidden');
        
        if (destinations.length === 0) {
            timeline.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
        }
        
        emptyState.classList.add('hidden');
        
        // Group destinations by target year
        const groupedByYear = destinations.reduce((groups, destination) => {
            const year = destination.targetYear || 'No Date Set';
            if (!groups[year]) groups[year] = [];
            groups[year].push(destination);
            return groups;
        }, {});
        
        // Sort years
        const sortedYears = Object.keys(groupedByYear).sort((a, b) => {
            if (a === 'No Date Set') return 1;
            if (b === 'No Date Set') return -1;
            return parseInt(a) - parseInt(b);
        });
        
        timeline.innerHTML = sortedYears.map(year => `
            <div class="timeline-year">
                <h3><i class="fas fa-calendar-alt"></i> ${year}</h3>
                <div class="timeline-destinations">
                    ${groupedByYear[year].map(destination => this.createTimelineItem(destination)).join('')}
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        this.bindTimelineEvents();
    }

    /**
     * Create destination card HTML
     */
    createDestinationCard(destination) {
        const statusClass = destination.visited ? 'visited' : 'not-visited';
        const statusText = destination.visited ? 'Visited' : 'To Visit';
        const statusIcon = destination.visited ? 'fa-check' : 'fa-clock';
        const locationParts = [destination.city, destination.country].filter(Boolean);
        const locationText = locationParts.length > 0 ? locationParts.join(', ') : '';
        
        return `
            <div class="destination-card ${statusClass} fade-in" 
                 draggable="true" 
                 data-id="${destination.id}">
                <div class="card-header">
                    <div class="card-priority priority-${destination.priority}">
                        ${destination.priority}
                    </div>
                    <div class="card-title">
                        <i class="fas fa-map-marker-alt"></i>
                        ${this.escapeHtml(destination.name)}
                    </div>
                    ${locationText ? `<div class="card-location">${this.escapeHtml(locationText)}</div>` : ''}
                    ${destination.targetYear ? `
                        <div class="card-year">
                            <i class="fas fa-calendar"></i>
                            Target: ${destination.targetYear}
                        </div>
                    ` : ''}
                </div>
                ${destination.notes ? `
                    <div class="card-notes">
                        ${this.escapeHtml(destination.notes)}
                    </div>
                ` : ''}
                <div class="card-actions">
                    <div class="card-status status-${statusClass}" 
                         onclick="bucketList.toggleVisited('${destination.id}')">
                        <i class="fas ${statusIcon}"></i>
                        ${statusText}
                    </div>
                    <div class="card-controls">
                        <button class="card-btn" 
                                onclick="bucketList.openEditModal('${destination.id}')"
                                title="Edit destination">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="card-btn delete" 
                                onclick="bucketList.deleteDestination('${destination.id}')"
                                title="Delete destination">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create timeline item HTML
     */
    createTimelineItem(destination) {
        const statusClass = destination.visited ? 'visited' : 'not-visited';
        const statusText = destination.visited ? 'Visited' : 'To Visit';
        const statusIcon = destination.visited ? 'fa-check' : 'fa-clock';
        const locationParts = [destination.city, destination.country].filter(Boolean);
        const locationText = locationParts.length > 0 ? locationParts.join(', ') : '';
        
        return `
            <div class="timeline-item ${statusClass}">
                <div class="card-title">
                    <i class="fas fa-map-marker-alt"></i>
                    ${this.escapeHtml(destination.name)}
                </div>
                ${locationText ? `<div class="card-location">${this.escapeHtml(locationText)}</div>` : ''}
                <div class="card-status status-${statusClass}" 
                     onclick="bucketList.toggleVisited('${destination.id}')">
                    <i class="fas ${statusIcon}"></i>
                    ${statusText}
                </div>
                ${destination.notes ? `
                    <div class="card-notes" style="margin-top: 1rem;">
                        ${this.escapeHtml(destination.notes)}
                    </div>
                ` : ''}
                <div class="card-controls" style="margin-top: 1rem;">
                    <button class="card-btn" 
                            onclick="bucketList.openEditModal('${destination.id}')"
                            title="Edit destination">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="card-btn delete" 
                            onclick="bucketList.deleteDestination('${destination.id}')"
                            title="Delete destination">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Bind events to destination cards
     */
    bindCardEvents() {
        const cards = document.querySelectorAll('.destination-card');
        
        cards.forEach(card => {
            // Drag and drop events
            card.addEventListener('dragstart', (e) => this.handleDragStart(e));
            card.addEventListener('dragend', (e) => this.handleDragEnd(e));
            card.addEventListener('dragover', (e) => this.handleDragOver(e));
            card.addEventListener('drop', (e) => this.handleDrop(e));
            card.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            card.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        });
    }

    /**
     * Bind events to timeline items
     */
    bindTimelineEvents() {
        // Timeline items don't need drag and drop, just click events which are inline
    }

    /**
     * Handle drag start
     */
    handleDragStart(e) {
        this.isDragging = true;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
    }

    /**
     * Handle drag end
     */
    handleDragEnd(e) {
        this.isDragging = false;
        e.target.classList.remove('dragging');
        document.querySelectorAll('.destination-card').forEach(card => {
            card.classList.remove('drag-over');
        });
    }

    /**
     * Handle drag over
     */
    handleDragOver(e) {
        if (this.isDragging) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        }
    }

    /**
     * Handle drag enter
     */
    handleDragEnter(e) {
        if (this.isDragging && e.target.classList.contains('destination-card')) {
            e.target.classList.add('drag-over');
        }
    }

    /**
     * Handle drag leave
     */
    handleDragLeave(e) {
        if (e.target.classList.contains('destination-card')) {
            e.target.classList.remove('drag-over');
        }
    }

    /**
     * Handle drop
     */
    handleDrop(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        e.target.classList.remove('drag-over');
        
        const draggedId = e.dataTransfer.getData('text/plain');
        const droppedOnCard = e.target.closest('.destination-card');
        
        if (droppedOnCard && draggedId !== droppedOnCard.dataset.id) {
            const droppedOnId = droppedOnCard.dataset.id;
            
            // Find the indices of the items
            const draggedIndex = this.destinations.findIndex(d => d.id === draggedId);
            const droppedOnIndex = this.destinations.findIndex(d => d.id === droppedOnId);
            
            if (draggedIndex !== -1 && droppedOnIndex !== -1) {
                // Remove the dragged item and insert it at the new position
                const draggedItem = this.destinations.splice(draggedIndex, 1)[0];
                this.destinations.splice(droppedOnIndex, 0, draggedItem);
                
                this.saveToStorage();
                this.renderDestinations();
                this.showToast('Destinations reordered!');
            }
        }
    }

    /**
     * Check if all destinations are visited and show celebration
     */
    checkForCompletion() {
        if (this.destinations.length > 0 && 
            this.destinations.every(d => d.visited) && 
            !this.celebrationShown) {
            
            this.celebrationShown = true;
            this.showCelebration();
            
            // Reset flag after a delay
            setTimeout(() => {
                this.celebrationShown = false;
            }, 5000);
        }
    }

    /**
     * Show celebration animation
     */
    showCelebration() {
        this.createConfetti();
        this.showToast('🎉 Congratulations! You\'ve visited all your destinations! 🎉', 5000);
    }

    /**
     * Create confetti animation
     */
    createConfetti() {
        const canvas = document.getElementById('confettiCanvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const confettiColors = ['#87CEEB', '#32CD32', '#FF8C00', '#FF69B4', '#9370DB'];
        const confettiPieces = [];
        
        // Create confetti pieces
        for (let i = 0; i < 100; i++) {
            confettiPieces.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 10 - 5,
                velocity: {
                    x: Math.random() * 6 - 3,
                    y: Math.random() * 3 + 2
                },
                color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                size: Math.random() * 8 + 4
            });
        }
        
        // Animation function
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            confettiPieces.forEach((piece, index) => {
                // Update position
                piece.x += piece.velocity.x;
                piece.y += piece.velocity.y;
                piece.rotation += piece.rotationSpeed;
                
                // Apply gravity
                piece.velocity.y += 0.1;
                
                // Draw confetti piece
                ctx.save();
                ctx.translate(piece.x, piece.y);
                ctx.rotate(piece.rotation * Math.PI / 180);
                ctx.fillStyle = piece.color;
                ctx.fillRect(-piece.size/2, -piece.size/2, piece.size, piece.size);
                ctx.restore();
                
                // Remove pieces that are off screen
                if (piece.y > canvas.height + 10) {
                    confettiPieces.splice(index, 1);
                }
            });
            
            if (confettiPieces.length > 0) {
                requestAnimationFrame(animate);
            } else {
                canvas.style.display = 'none';
            }
        }
        
        canvas.style.display = 'block';
        animate();
        
        // Hide canvas after animation
        setTimeout(() => {
            canvas.style.display = 'none';
        }, 5000);
    }

    /**
     * Show toast notification
     */
    showToast(message, duration = 3000) {
        // Remove existing toasts
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = 'toast bounce-in';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-hover);
            z-index: 10000;
            font-weight: 600;
            max-width: 300px;
            word-wrap: break-word;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
        
        // Add fadeOut animation
        if (!document.querySelector('#toastStyles')) {
            const style = document.createElement('style');
            style.id = 'toastStyles';
            style.textContent = `
                @keyframes fadeOut {
                    from { opacity: 1; transform: translateX(0); }
                    to { opacity: 0; transform: translateX(100%); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bucketList = new TravelBucketList();
});

// Handle window resize for confetti canvas
window.addEventListener('resize', () => {
    const canvas = document.getElementById('confettiCanvas');
    if (canvas.style.display !== 'none') {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Note: Service worker file would need to be created separately
        // This is just the registration code
        /*
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
        */
    });
}
