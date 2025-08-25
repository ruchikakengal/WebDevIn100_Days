// Tattoo Library Manager for loading and organizing tattoo designs
class TattooLibrary {
    constructor() {
        this.categories = {
            tribal: [
                'https://pixabay.com/get/g7324409ddea22cd5f7751d17dd99f6b752c2d0bd4d3a02aad75ba859ead323fb151c692171d3a769f0a422ebd162b6f1788216d72e610810e51f62318c7af5de_1280.jpg',
                'https://pixabay.com/get/g168143e8e7df77c47017f92796f2966fe99f0d16350f43f0bfbb1686d0893ae8737c31f2f4daa400319ee5de65e91169ae8c488fa83fc5433714e8558d1530e1_1280.jpg',
                'https://pixabay.com/get/g28bd2e689b248b5488cf4e04327a7f2e2f7b90ec91b43da212b9e7fc0b2e561cd96994cb7c711035ac71c11b26d4db76c14eb4adac177c149edf6c02ebfcfe54_1280.jpg',
                'https://pixabay.com/get/ga423e91edde9fc646d78879988e7e785c37dda7389af2b5ac8c5a064653e4b72a902d52a037f08616ac7e5ce5c2718d9db5ce6baa0e90dcdcea2d06bab811747_1280.jpg',
                'https://pixabay.com/get/g6ca32cbd5651ec8c8ee9472d1673e6c8f5651c51009d90fc17a9a71c1eb6398905fce4ed30a5fa5709c6ebc8b38dc952355bcb2607b34dc7c9f2ca872beac23c_1280.jpg',
                'https://pixabay.com/get/g366406dc7d40e8f91eb722f7e3a2af53306ff182d6cfef737cdaa29aa23892cfbf02f3e49ef7833ba91d60513d26c1544fcd66d032ea33c229b1b45f25fc73ee_1280.jpg'
            ],
            minimalist: [
                'https://pixabay.com/get/gfff041b91eee276eaaa022a737b5da9c95fefa1f1e28c2bfb5e94fdd5b859d9e1239feb67565c56f626cbe38f3345becc594a7ff0c8e0d3039f7bfb5c4a7faf3_1280.jpg',
                'https://pixabay.com/get/gf43f94176b782ea7b73bf3a762faed0d92ebb5b8d5e00f18a1f4768b26d64f97d8a0d88e0651112f3b42df516e67ab926d0fce73f9f00eca9b34ddb22a62ddfd_1280.jpg',
                'https://pixabay.com/get/g4f53d2edac1986e30c61595464fdec61cf45f96ca08e7d0d504a1c6013d6aa0ed56f58758148b26d6150dfae652b77012476aad1b5765395c1c65d784b9ad466_1280.jpg',
                'https://pixabay.com/get/g23a0a750f0e7ab7bde96e462bcc462a202ed9b66884158c2f63ac039777bff172586ce6791c111777053f86adc0cfc1987c67838a7dbd17bae3cc86f0d3c04e4_1280.jpg',
                'https://pixabay.com/get/ga582641ec9f83cb824ddb3ed53ce2d6dbdb254366c186ea5b1ae27c59720fa05441593677e76e714a4e34da214fc9c950098c73b6fc302145985feb06274d401_1280.jpg',
                'https://pixabay.com/get/g82aa77925ffcb83a49ff8fa888cb0457e6963596609a34e527dae5a5a9d8f8702a3e08d2c70ba633097937aa1ab01c682fe86c4f866b850df4bfce4f5ee918a3_1280.jpg'
            ],
            geometric: [
                'https://pixabay.com/get/g1c5e4632c0d09ce0a9ff8c46d87d64ecf4c550965dd0c0f31e81f3101a4570253d0585184e7a7b90eb392713a90c5fc3d46aca03e326ea188ffc142cd91c5e00_1280.jpg',
                'https://pixabay.com/get/g2e810d46c5d8c1607a3a42bfecdc5a5eeb03e57fd5726172e9611637f3c720c93c49121ed72f53340551a676d15d402b49ae29e4463bbcf80da1d51191e55975_1280.jpg',
                'https://pixabay.com/get/ga4f35d0c61874d2aec24a90efa0cd3c54bff30a8460a5174231e8dd9d5b6a3595de87ffdc3d8e689f634688565e6d997104922b159d0ba121331a23949b6e2be_1280.jpg',
                'https://pixabay.com/get/gb293069aed8428d05ad3b5915d032ac9da7a5b7b09889c728eba4ddf911ef4ee2cbb9c1b9e5e2f2248b7ac340124ff9ef99a2453171f405775f95dc084fb4592_1280.jpg',
                'https://pixabay.com/get/ga19fb7a5cbcd75bfe6b7eeaa261a9599eba9c958ca5df3a40d99792962255d65ac7f50159a21e848d0dd84546ebee4997e6912b2b8dba4a36f6cc448e535092b_1280.jpg',
                'https://pixabay.com/get/g19839bcdcfa8acba7cd1da36c6cb443fa8e1b72fac8125553ee505415cd900982a5f4fc2332cb45eae8b65b1bf823626acc06470324b822e51dd42759311e2f0_1280.jpg'
            ]
        };
        
        this.loadedImages = new Map();
        this.currentCategory = 'tribal';
        this.galleryContainer = null;
        this.categoryTabs = null;
        
        this.init();
    }
    
    init() {
        this.galleryContainer = document.getElementById('tattoo-gallery');
        this.categoryTabs = document.getElementById('category-tabs');
        
        if (this.categoryTabs) {
            this.bindCategoryEvents();
        }
        
        this.loadCategory(this.currentCategory);
    }
    
    bindCategoryEvents() {
        this.categoryTabs.addEventListener('click', (event) => {
            if (event.target.classList.contains('tab-btn')) {
                const category = event.target.dataset.category;
                this.switchCategory(category);
            }
        });
    }
    
    switchCategory(category) {
        if (!this.categories[category]) return;
        
        // Update tab appearance
        this.categoryTabs.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        this.categoryTabs.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        this.currentCategory = category;
        this.loadCategory(category);
    }
    
    async loadCategory(category) {
        if (!this.galleryContainer) return;
        
        // Show loading state
        this.showLoading();
        
        try {
            const images = this.categories[category];
            await this.preloadImages(images);
            this.renderGallery(images, category);
        } catch (error) {
            console.error('Failed to load category:', category, error);
            this.showError('Failed to load tattoo designs');
        }
    }
    
    async preloadImages(imageUrls) {
        const loadPromises = imageUrls.map(async (url) => {
            if (this.loadedImages.has(url)) {
                return this.loadedImages.get(url);
            }
            
            try {
                const img = await Utils.loadImage(url);
                this.loadedImages.set(url, img);
                return img;
            } catch (error) {
                console.error('Failed to load image:', url, error);
                return null;
            }
        });
        
        const results = await Promise.allSettled(loadPromises);
        return results.map(result => result.status === 'fulfilled' ? result.value : null);
    }
    
    renderGallery(imageUrls, category) {
        if (!this.galleryContainer) return;
        
        this.galleryContainer.innerHTML = '';
        
        imageUrls.forEach((url, index) => {
            const tattooItem = this.createTattooItem(url, category, index);
            this.galleryContainer.appendChild(tattooItem);
        });
        
        // Add drag and drop functionality
        this.setupDragAndDrop();
    }
    
    createTattooItem(imageUrl, category, index) {
        const item = document.createElement('div');
        item.className = 'tattoo-item';
        item.draggable = true;
        item.dataset.imageUrl = imageUrl;
        item.dataset.category = category;
        item.dataset.index = index;
        
        // Set background image
        if (this.loadedImages.has(imageUrl)) {
            item.style.backgroundImage = `url(${imageUrl})`;
        } else {
            item.classList.add('loading');
            this.loadImageForItem(item, imageUrl);
        }
        
        // Add click handler
        item.addEventListener('click', () => {
            this.addTattooToCanvas(imageUrl, category);
        });
        
        return item;
    }
    
    async loadImageForItem(item, imageUrl) {
        try {
            const img = await Utils.loadImage(imageUrl);
            this.loadedImages.set(imageUrl, img);
            
            item.classList.remove('loading');
            item.style.backgroundImage = `url(${imageUrl})`;
        } catch (error) {
            console.error('Failed to load image for item:', imageUrl, error);
            item.classList.remove('loading');
            item.classList.add('error');
            item.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        }
    }
    
    setupDragAndDrop() {
        const items = this.galleryContainer.querySelectorAll('.tattoo-item');
        
        items.forEach(item => {
            // Drag start
            item.addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text/plain', JSON.stringify({
                    type: 'tattoo',
                    imageUrl: item.dataset.imageUrl,
                    category: item.dataset.category
                }));
                
                item.classList.add('dragging');
            });
            
            // Drag end
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });
        });
    }
    
    async addTattooToCanvas(imageUrl, category) {
        try {
            const img = await this.getOrLoadImage(imageUrl);
            if (!img) {
                Utils.showNotification('Failed to load tattoo image', 'error');
                return;
            }
            
            // Calculate appropriate size
            const maxSize = 200;
            let width = img.width;
            let height = img.height;
            
            if (width > maxSize || height > maxSize) {
                const ratio = Math.min(maxSize / width, maxSize / height);
                width *= ratio;
                height *= ratio;
            }
            
            // Create tattoo element
            const element = {
                type: 'image',
                image: img,
                x: 400, // Center of canvas
                y: 300,
                width: width,
                height: height,
                scale: 1,
                rotation: 0,
                opacity: 1,
                flipX: false,
                flipY: false,
                category: category,
                imageUrl: imageUrl
            };
            
            // Add to canvas
            if (window.canvasManager) {
                window.canvasManager.addElement(element);
                Utils.showNotification('Tattoo added to canvas!');
            }
            
        } catch (error) {
            console.error('Failed to add tattoo to canvas:', error);
            Utils.showNotification('Failed to add tattoo to canvas', 'error');
        }
    }
    
    async getOrLoadImage(imageUrl) {
        if (this.loadedImages.has(imageUrl)) {
            return this.loadedImages.get(imageUrl);
        }
        
        try {
            const img = await Utils.loadImage(imageUrl);
            this.loadedImages.set(imageUrl, img);
            return img;
        } catch (error) {
            console.error('Failed to load image:', imageUrl, error);
            return null;
        }
    }
    
    showLoading() {
        if (!this.galleryContainer) return;
        
        this.galleryContainer.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading tattoo designs...</p>
            </div>
        `;
    }
    
    showError(message) {
        if (!this.galleryContainer) return;
        
        this.galleryContainer.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn btn-secondary">
                    <i class="fas fa-refresh"></i>
                    Retry
                </button>
            </div>
        `;
    }
    
    // Search functionality
    searchTattoos(query) {
        if (!query.trim()) {
            this.loadCategory(this.currentCategory);
            return;
        }
        
        const allImages = Object.values(this.categories).flat();
        const filteredImages = allImages.filter((url, index) => {
            // Simple search by category or index
            return url.toLowerCase().includes(query.toLowerCase());
        });
        
        this.renderSearchResults(filteredImages, query);
    }
    
    renderSearchResults(images, query) {
        if (!this.galleryContainer) return;
        
        if (images.length === 0) {
            this.galleryContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No tattoos found for "${query}"</p>
                </div>
            `;
            return;
        }
        
        this.renderGallery(images, 'search');
    }
    
    // Get random tattoos for inspiration
    getRandomTattoos(count = 6) {
        const allImages = Object.values(this.categories).flat();
        const shuffled = allImages.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    
    // Get popular/trending tattoos (mock implementation)
    getTrendingTattoos() {
        // In a real app, this would be based on usage data
        const trending = [
            ...this.categories.minimalist.slice(0, 2),
            ...this.categories.geometric.slice(0, 2),
            ...this.categories.tribal.slice(0, 2)
        ];
        
        return trending;
    }
    
    // Add custom tattoo from user upload
    async addCustomTattoo(file) {
        try {
            const imageUrl = await this.fileToImageUrl(file);
            const img = await Utils.loadImage(imageUrl);
            
            // Add to custom category if it exists
            if (!this.categories.custom) {
                this.categories.custom = [];
            }
            
            this.categories.custom.push(imageUrl);
            this.loadedImages.set(imageUrl, img);
            
            // If we're viewing custom category, refresh it
            if (this.currentCategory === 'custom') {
                this.loadCategory('custom');
            }
            
            Utils.showNotification('Custom tattoo added!');
            return imageUrl;
            
        } catch (error) {
            console.error('Failed to add custom tattoo:', error);
            Utils.showNotification('Failed to add custom tattoo', 'error');
            return null;
        }
    }
    
    fileToImageUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }
    
    // Get tattoo metadata
    getTattooInfo(imageUrl) {
        // Extract category
        let category = 'unknown';
        for (const [cat, images] of Object.entries(this.categories)) {
            if (images.includes(imageUrl)) {
                category = cat;
                break;
            }
        }
        
        const img = this.loadedImages.get(imageUrl);
        
        return {
            category,
            dimensions: img ? { width: img.width, height: img.height } : null,
            url: imageUrl,
            loaded: this.loadedImages.has(imageUrl)
        };
    }
    
    // Preload all images for better performance
    async preloadAllImages() {
        const allImages = Object.values(this.categories).flat();
        const batchSize = 5; // Load 5 images at a time
        
        for (let i = 0; i < allImages.length; i += batchSize) {
            const batch = allImages.slice(i, i + batchSize);
            await this.preloadImages(batch);
            
            // Add small delay between batches to avoid overwhelming the browser
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    // Clean up resources
    dispose() {
        this.loadedImages.clear();
        this.galleryContainer = null;
        this.categoryTabs = null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TattooLibrary;
} else {
    window.TattooLibrary = TattooLibrary;
}
