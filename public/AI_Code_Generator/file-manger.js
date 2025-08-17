// File Manager for handling file operations
class FileManager {
    constructor() {
        this.supportedFormats = {
            'text/html': '.html',
            'text/css': '.css',
            'text/javascript': '.js',
            'application/json': '.json',
            'text/plain': '.txt',
            'application/zip': '.zip',
            'text/csv': '.csv',
            'application/pdf': '.pdf',
            'image/png': '.png',
            'image/jpeg': '.jpg',
            'image/svg+xml': '.svg'
        };
        
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.initEventListeners();
    }

    initEventListeners() {
        // File input change handlers would go here
        // This is a basic implementation focused on download functionality
    }

    // Download file with content
    downloadFile(content, filename, mimeType = 'text/plain') {
        try {
            // Validate inputs
            if (!content) {
                throw new Error('No content provided for download');
            }
            
            if (!filename) {
                throw new Error('No filename provided');
            }

            // Create blob with content
            const blob = new Blob([content], { type: mimeType });
            
            // Create download link
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            
            // Trigger download
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showToast(`File "${filename}" downloaded successfully`, 'success');
            
        } catch (error) {
            console.error('Error downloading file:', error);
            showToast('Error downloading file: ' + error.message, 'error');
        }
    }

    // Download multiple files as ZIP
    async downloadAsZip(files, zipFilename = 'website-files.zip') {
        try {
            // This would require a ZIP library like JSZip
            // For now, we'll show a message about the requirement
            showToast('ZIP download requires additional library. Downloading files individually.', 'info');
            
            // Download files individually
            files.forEach((file, index) => {
                setTimeout(() => {
                    this.downloadFile(file.content, file.filename, file.mimeType);
                }, index * 100); // Stagger downloads
            });
            
        } catch (error) {
            console.error('Error creating ZIP file:', error);
            showToast('Error creating ZIP file: ' + error.message, 'error');
        }
    }

    // Export website as complete project
    exportWebsiteProject(htmlContent, projectName = 'my-website') {
        try {
            // Parse HTML to extract CSS and JS
            const { html, css, js } = this.parseHtmlContent(htmlContent);
            
            const files = [
                {
                    filename: 'index.html',
                    content: html,
                    mimeType: 'text/html'
                }
            ];
            
            // Add CSS file if exists
            if (css) {
                files.push({
                    filename: 'styles.css',
                    content: css,
                    mimeType: 'text/css'
                });
            }
            
            // Add JS file if exists
            if (js) {
                files.push({
                    filename: 'script.js',
                    content: js,
                    mimeType: 'text/javascript'
                });
            }
            
            // Add README file
            files.push({
                filename: 'README.md',
                content: this.generateReadme(projectName),
                mimeType: 'text/markdown'
            });
            
            // Download as ZIP or individually
            this.downloadAsZip(files, `${projectName}.zip`);
            
        } catch (error) {
            console.error('Error exporting website project:', error);
            showToast('Error exporting project: ' + error.message, 'error');
        }
    }

    // Parse HTML content to extract CSS and JS
    parseHtmlContent(htmlContent) {
        let html = htmlContent;
        let css = '';
        let js = '';
        
        // Extract CSS from <style> tags
        const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
        let styleMatch;
        while ((styleMatch = styleRegex.exec(htmlContent)) !== null) {
            css += styleMatch[1] + '\n';
        }
        
        // Extract JS from <script> tags (inline only)
        const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
        let scriptMatch;
        while ((scriptMatch = scriptRegex.exec(htmlContent)) !== null) {
            // Only extract inline scripts (not external)
            if (!scriptMatch[0].includes('src=')) {
                js += scriptMatch[1] + '\n';
            }
        }
        
        // Clean up HTML if we extracted CSS/JS
        if (css) {
            html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
            // Add link to external CSS
            html = html.replace(/<\/head>/i, '    <link rel="stylesheet" href="styles.css">\n</head>');
        }
        
        if (js) {
            html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
            // Add link to external JS
            html = html.replace(/<\/body>/i, '    <script src="script.js"></script>\n</body>');
        }
        
        return { html: html.trim(), css: css.trim(), js: js.trim() };
    }

    // Generate README.md content
    generateReadme(projectName) {
        const timestamp = new Date().toISOString().split('T')[0];
        
        return `# ${projectName}

A website generated with AI Website Builder on ${timestamp}.

## Files

- \`index.html\` - Main HTML file
- \`styles.css\` - Stylesheet (if extracted)
- \`script.js\` - JavaScript file (if extracted)

## How to Use

1. Open \`index.html\` in a web browser
2. Or serve the files using a local web server for better performance

## Generated with

This website was created using AI Website Builder - an intelligent tool for creating modern, responsive websites.

## Browser Support

This website uses modern web technologies and is compatible with:
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).
`;
    }

    // Export conversation history
    exportConversationHistory(conversations) {
        try {
            const exportData = {
                conversations: conversations,
                exportedAt: new Date().toISOString(),
                totalConversations: conversations.length,
                generator: 'AI Website Builder'
            };
            
            const content = JSON.stringify(exportData, null, 2);
            this.downloadFile(content, 'conversation-history.json', 'application/json');
            
        } catch (error) {
            console.error('Error exporting conversation history:', error);
            showToast('Error exporting conversation history: ' + error.message, 'error');
        }
    }

    // Export deployment history
    exportDeploymentHistory(deployments) {
        try {
            const exportData = {
                deployments: deployments,
                exportedAt: new Date().toISOString(),
                totalDeployments: deployments.length,
                generator: 'AI Website Builder'
            };
            
            const content = JSON.stringify(exportData, null, 2);
            this.downloadFile(content, 'deployment-history.json', 'application/json');
            
        } catch (error) {
            console.error('Error exporting deployment history:', error);
            showToast('Error exporting deployment history: ' + error.message, 'error');
        }
    }

    // Export application settings
    exportSettings() {
        try {
            const settings = {
                theme: localStorage.getItem('ai-website-theme'),
                voiceSettings: window.voiceService?.getSettings(),
                exportedAt: new Date().toISOString(),
                generator: 'AI Website Builder'
            };
            
            const content = JSON.stringify(settings, null, 2);
            this.downloadFile(content, 'app-settings.json', 'application/json');
            
        } catch (error) {
            console.error('Error exporting settings:', error);
            showToast('Error exporting settings: ' + error.message, 'error');
        }
    }

    // Import settings
    async importSettings(file) {
        if (!file) {
            showToast('No file selected', 'error');
            return;
        }

        try {
            const content = await this.readFileAsText(file);
            const settings = JSON.parse(content);
            
            // Apply theme
            if (settings.theme) {
                localStorage.setItem('ai-website-theme', settings.theme);
                if (typeof applyTheme === 'function') {
                    applyTheme(settings.theme);
                }
            }
            
            // Apply voice settings
            if (settings.voiceSettings && window.voiceService) {
                window.voiceService.updateSettings(settings.voiceSettings);
            }
            
            showToast('Settings imported successfully', 'success');
            
        } catch (error) {
            console.error('Error importing settings:', error);
            showToast('Error importing settings: ' + error.message, 'error');
        }
    }

    // Read file as text
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsText(file);
        });
    }

    // Validate file
    validateFile(file) {
        if (!file) {
            return { valid: false, error: 'No file selected' };
        }
        
        if (file.size > this.maxFileSize) {
            return { valid: false, error: `File size exceeds ${this.maxFileSize / 1024 / 1024}MB limit` };
        }
        
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        const supportedExtensions = Object.values(this.supportedFormats);
        
        if (!supportedExtensions.includes(extension)) {
            return { valid: false, error: `File type ${extension} not supported` };
        }
        
        return { valid: true };
    }

    // Get file info
    getFileInfo(file) {
        if (!file) return null;
        
        return {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            extension: '.' + file.name.split('.').pop().toLowerCase(),
            sizeFormatted: this.formatFileSize(file.size)
        };
    }

    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Generate file stats
    generateFileStats(content, filename) {
        const stats = {
            filename: filename,
            size: content.length,
            sizeFormatted: this.formatFileSize(content.length),
            lines: content.split('\n').length,
            words: content.split(/\s+/).filter(word => word.length > 0).length,
            characters: content.length,
            charactersNoSpaces: content.replace(/\s/g, '').length,
            generatedAt: new Date().toISOString()
        };
        
        // HTML specific stats
        if (filename.endsWith('.html')) {
            stats.htmlElements = (content.match(/<[^>]+>/g) || []).length;
            stats.hasCSS = content.includes('<style') || content.includes('stylesheet');
            stats.hasJS = content.includes('<script');
        }
        
        // CSS specific stats
        if (filename.endsWith('.css')) {
            stats.cssRules = (content.match(/[^{}]+\{[^}]*\}/g) || []).length;
            stats.selectors = (content.match(/[^{}]+(?=\{)/g) || []).length;
        }
        
        // JS specific stats
        if (filename.endsWith('.js')) {
            stats.functions = (content.match(/function\s+\w+|=>\s*{|\w+\s*:\s*function/g) || []).length;
            stats.variables = (content.match(/(?:var|let|const)\s+\w+/g) || []).length;
        }
        
        return stats;
    }

    // Backup all data
    async backupAllData() {
        try {
            const backupData = {
                conversations: JSON.parse(localStorage.getItem('ai_website_conversations') || '[]'),
                deployments: JSON.parse(localStorage.getItem('ai_website_deployments') || '[]'),
                explanations: JSON.parse(localStorage.getItem('ai_website_explanations') || '[]'),
                settings: {
                    theme: localStorage.getItem('ai-website-theme')
                },
                backupDate: new Date().toISOString(),
                version: '1.0.0'
            };
            
            const content = JSON.stringify(backupData, null, 2);
            this.downloadFile(content, `ai-website-builder-backup-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
            
        } catch (error) {
            console.error('Error creating backup:', error);
            showToast('Error creating backup: ' + error.message, 'error');
        }
    }

    // Restore from backup
    async restoreFromBackup(file) {
        if (!file) {
            showToast('No backup file selected', 'error');
            return;
        }

        try {
            const content = await this.readFileAsText(file);
            const backupData = JSON.parse(content);
            
            // Validate backup structure
            if (!backupData.version || !backupData.backupDate) {
                throw new Error('Invalid backup file format');
            }
            
            // Restore data
            if (backupData.conversations) {
                localStorage.setItem('ai_website_conversations', JSON.stringify(backupData.conversations));
            }
            
            if (backupData.deployments) {
                localStorage.setItem('ai_website_deployments', JSON.stringify(backupData.deployments));
            }
            
            if (backupData.explanations) {
                localStorage.setItem('ai_website_explanations', JSON.stringify(backupData.explanations));
            }
            
            if (backupData.settings?.theme) {
                localStorage.setItem('ai-website-theme', backupData.settings.theme);
            }
            
            showToast('Backup restored successfully. Please refresh the page.', 'success');
            
        } catch (error) {
            console.error('Error restoring backup:', error);
            showToast('Error restoring backup: ' + error.message, 'error');
        }
    }

    // Clear all data
    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            try {
                localStorage.removeItem('ai_website_conversations');
                localStorage.removeItem('ai_website_deployments');
                localStorage.removeItem('ai_website_explanations');
                localStorage.removeItem('ai-website-theme');
                
                showToast('All data cleared successfully', 'success');
                
                // Refresh page after delay
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
                
            } catch (error) {
                console.error('Error clearing data:', error);
                showToast('Error clearing data: ' + error.message, 'error');
            }
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FileManager;
}
