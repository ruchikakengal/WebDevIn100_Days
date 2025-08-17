// Preview Manager for responsive website previews
class PreviewManager {
    constructor() {
        this.currentCode = null;
        this.currentSize = 'desktop';
        this.previewFrame = null;
        this.isPreviewOpen = false;
        this.initEventListeners();
    }

    initEventListeners() {
        // Preview size buttons
        const previewSizeBtns = document.querySelectorAll('.preview-size-btn');
        previewSizeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const size = e.target.dataset.size;
                this.changePreviewSize(size);
                
                // Update active button
                previewSizeBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Preview actions
        const refreshBtn = document.querySelector('[onclick="previewManager.refreshPreview()"]');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshPreview());
        }

        const openNewTabBtn = document.querySelector('[onclick="previewManager.openInNewTab()"]');
        if (openNewTabBtn) {
            openNewTabBtn.addEventListener('click', () => this.openInNewTab());
        }

        // Close modal when clicking outside
        const previewModal = document.getElementById('preview-modal');
        if (previewModal) {
            previewModal.addEventListener('click', (e) => {
                if (e.target === previewModal) {
                    closePreview();
                }
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.isPreviewOpen) {
                switch(e.key) {
                    case '1':
                        if (e.ctrlKey || e.metaKey) {
                            e.preventDefault();
                            this.changePreviewSize('desktop');
                        }
                        break;
                    case '2':
                        if (e.ctrlKey || e.metaKey) {
                            e.preventDefault();
                            this.changePreviewSize('tablet');
                        }
                        break;
                    case '3':
                        if (e.ctrlKey || e.metaKey) {
                            e.preventDefault();
                            this.changePreviewSize('mobile');
                        }
                        break;
                    case 'r':
                        if (e.ctrlKey || e.metaKey) {
                            e.preventDefault();
                            this.refreshPreview();
                        }
                        break;
                }
            }
        });
    }

    openPreview(code) {
        if (!code) {
            showToast('No code available to preview', 'warning');
            return;
        }

        this.currentCode = code;
        this.isPreviewOpen = true;
        
        // Open modal
        openPreview();
        
        // Load the preview
        this.loadPreview();
        
        // Set initial size
        this.changePreviewSize(this.currentSize);
    }

    loadPreview() {
        const previewFrame = document.getElementById('preview-frame');
        if (!previewFrame || !this.currentCode) return;

        this.previewFrame = previewFrame;
        
        // Show loading state
        this.showPreviewLoading(true);
        
        try {
            // Create blob URL for the HTML content
            const blob = new Blob([this.currentCode], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            // Set up iframe load event
            previewFrame.onload = () => {
                this.showPreviewLoading(false);
                showToast('Preview loaded successfully', 'success');
                
                // Clean up the blob URL after loading
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 1000);
            };
            
            previewFrame.onerror = () => {
                this.showPreviewLoading(false);
                this.showPreviewError('Failed to load preview');
            };
            
            // Load the content
            previewFrame.src = url;
            
        } catch (error) {
            console.error('Error loading preview:', error);
            this.showPreviewLoading(false);
            this.showPreviewError('Error loading preview: ' + error.message);
        }
    }

    changePreviewSize(size) {
        const previewFrame = document.getElementById('preview-frame');
        if (!previewFrame) return;

        this.currentSize = size;
        
        // Remove existing size classes
        previewFrame.classList.remove('desktop-frame', 'tablet-frame', 'mobile-frame');
        
        // Add new size class
        previewFrame.classList.add(`${size}-frame`);
        
        // Update button states
        const previewSizeBtns = document.querySelectorAll('.preview-size-btn');
        previewSizeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === size);
        });
        
        // Show toast with device info
        const deviceInfo = this.getDeviceInfo(size);
        showToast(`Preview: ${deviceInfo.name} (${deviceInfo.width}×${deviceInfo.height})`, 'info');
    }

    getDeviceInfo(size) {
        const deviceSpecs = {
            desktop: { name: 'Desktop', width: 1200, height: 800 },
            tablet: { name: 'Tablet', width: 768, height: 1024 },
            mobile: { name: 'Mobile', width: 375, height: 667 }
        };
        
        return deviceSpecs[size] || deviceSpecs.desktop;
    }

    refreshPreview() {
        if (!this.currentCode) {
            showToast('No code to refresh', 'warning');
            return;
        }

        showToast('Refreshing preview...', 'info');
        this.loadPreview();
    }

    openInNewTab() {
        if (!this.currentCode) {
            showToast('No code to open', 'warning');
            return;
        }

        try {
            // Create blob URL
            const blob = new Blob([this.currentCode], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            // Open in new tab
            const newTab = window.open(url, '_blank');
            
            if (newTab) {
                showToast('Preview opened in new tab', 'success');
                
                // Clean up the blob URL after a delay
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 5000);
            } else {
                // showToast('Failed to open new tab. Please check popup blocker.', 'error');
            }
            
        } catch (error) {
            console.error('Error opening in new tab:', error);
            showToast('Error opening in new tab: ' + error.message, 'error');
        }
    }

    showPreviewLoading(show) {
        const previewContainer = document.getElementById('preview-container');
        if (!previewContainer) return;

        const existingLoader = previewContainer.querySelector('.preview-loading');
        
        if (show) {
            if (!existingLoader) {
                const loader = document.createElement('div');
                loader.className = 'preview-loading';
                loader.innerHTML = `
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: var(--text-secondary);">
                        <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                        <p>Loading preview...</p>
                    </div>
                `;
                loader.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: var(--bg-secondary);
                    border-radius: var(--radius-lg);
                    z-index: 10;
                `;
                previewContainer.appendChild(loader);
            }
        } else {
            if (existingLoader) {
                existingLoader.remove();
            }
        }
    }

    showPreviewError(message) {
        const previewContainer = document.getElementById('preview-container');
        if (!previewContainer) return;

        const errorDiv = document.createElement('div');
        errorDiv.className = 'preview-error';
        errorDiv.innerHTML = `
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: var(--error-color);">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>${escapeHtml(message)}</p>
                <button class="btn-primary" onclick="previewManager.refreshPreview()" style="margin-top: 1rem;">
                    <i class="fas fa-redo"></i>
                    Try Again
                </button>
            </div>
        `;
        errorDiv.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--bg-secondary);
            border-radius: var(--radius-lg);
            z-index: 10;
        `;
        
        previewContainer.appendChild(errorDiv);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    closePreview() {
        this.isPreviewOpen = false;
        
        // Clean up iframe
        const previewFrame = document.getElementById('preview-frame');
        if (previewFrame) {
            previewFrame.src = 'about:blank';
        }
        
        // Reset size to desktop
        this.currentSize = 'desktop';
        
        closePreview();
    }

    // Take screenshot of preview (if supported)
    async takeScreenshot() {
        if (!this.previewFrame) {
            showToast('No preview available for screenshot', 'warning');
            return;
        }

        try {
            // This is a simplified approach - in reality, you'd need additional libraries
            // or server-side support for proper screenshot functionality
            showToast('Screenshot feature would require additional setup', 'info');
        } catch (error) {
            console.error('Error taking screenshot:', error);
            showToast('Error taking screenshot: ' + error.message, 'error');
        }
    }

    // Export preview as PDF (if supported)
    async exportToPDF() {
        if (!this.currentCode) {
            showToast('No code to export', 'warning');
            return;
        }

        try {
            // This would require additional libraries like jsPDF or server-side support
            showToast('PDF export feature would require additional setup', 'info');
        } catch (error) {
            console.error('Error exporting to PDF:', error);
            showToast('Error exporting to PDF: ' + error.message, 'error');
        }
    }

    // Get preview metrics
    getPreviewMetrics() {
        const previewFrame = document.getElementById('preview-frame');
        if (!previewFrame) return null;

        const deviceInfo = this.getDeviceInfo(this.currentSize);
        
        return {
            currentSize: this.currentSize,
            deviceName: deviceInfo.name,
            dimensions: {
                width: deviceInfo.width,
                height: deviceInfo.height
            },
            codeSize: this.currentCode ? this.currentCode.length : 0,
            isLoaded: previewFrame.src !== 'about:blank',
            loadTime: Date.now() // This would need proper tracking
        };
    }

    // Validate HTML code before preview
    validateCode(code) {
        if (!code || typeof code !== 'string') {
            return { valid: false, error: 'No code provided' };
        }

        // Basic HTML validation
        const htmlRegex = /<html[^>]*>[\s\S]*<\/html>/i;
        if (!htmlRegex.test(code)) {
            return { valid: false, error: 'Invalid HTML structure' };
        }

        // Check for basic required elements
        const hasHead = /<head[^>]*>[\s\S]*<\/head>/i.test(code);
        const hasBody = /<body[^>]*>[\s\S]*<\/body>/i.test(code);
        
        if (!hasHead || !hasBody) {
            return { valid: false, error: 'Missing required HTML elements (head or body)' };
        }

        return { valid: true };
    }

    // Auto-refresh preview when code changes
    enableAutoRefresh(interval = 2000) {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }

        this.autoRefreshInterval = setInterval(() => {
            if (this.isPreviewOpen && this.currentCode) {
                this.refreshPreview();
            }
        }, interval);
    }

    disableAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshInterval = null;
        }
    }

    // Cleanup method
    cleanup() {
        this.disableAutoRefresh();
        this.closePreview();
        this.currentCode = null;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PreviewManager;
}
