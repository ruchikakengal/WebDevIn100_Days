// Export Manager - Handles story export and sharing functionality
class ExportManager {
    constructor() {
        this.supportedFormats = ['txt', 'html', 'json', 'pdf'];
        this.maxFileSize = 5 * 1024 * 1024; // 5MB limit
    }

    // Main export method
    async exportStory(story, format = 'txt', options = {}) {
        if (!story) {
            throw new Error('No story provided for export');
        }

        const exportData = this.prepareStoryData(story);
        
        switch (format.toLowerCase()) {
            case 'txt':
                return this.exportAsText(exportData, options);
            case 'html':
                return this.exportAsHTML(exportData, options);
            case 'json':
                return this.exportAsJSON(exportData, options);
            case 'pdf':
                return this.exportAsPDF(exportData, options);
            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
    }

    prepareStoryData(story) {
        return {
            title: this.generateStoryTitle(story),
            characterName: story.config.characterName,
            theme: story.config.theme,
            setting: story.variables ? story.variables.get('setting') : 'Unknown',
            createdAt: story.createdAt,
            completedAt: story.updatedAt,
            scenes: story.scenes || [],
            choiceHistory: story.choiceHistory || [],
            totalScenes: story.scenes ? story.scenes.length : 0,
            achievements: story.variables ? story.variables.get('achievements') || [] : [],
            stats: this.calculateStoryStats(story)
        };
    }

    generateStoryTitle(story) {
        const character = story.config.characterName;
        const theme = story.config.theme;
        const themeNames = {
            fantasy: 'Fantasy Adventure',
            'sci-fi': 'Science Fiction Journey',
            mystery: 'Mystery Investigation',
            horror: 'Horror Experience'
        };
        
        return `${character}'s ${themeNames[theme] || 'Adventure'}`;
    }

    calculateStoryStats(story) {
        const scenes = story.scenes || [];
        const choices = story.choiceHistory || [];
        
        let totalWords = 0;
        scenes.forEach(scene => {
            if (scene.text) {
                totalWords += scene.text.split(/\s+/).length;
            }
        });

        return {
            totalWords,
            totalScenes: scenes.length,
            totalChoices: choices.length,
            estimatedReadingTime: Math.ceil(totalWords / 200), // Assuming 200 WPM
            completionDate: new Date(story.updatedAt).toLocaleDateString()
        };
    }

    // Text Export
    exportAsText(exportData, options = {}) {
        const {
            includeStats = true,
            includeChoices = true,
            separator = '\n\n---\n\n'
        } = options;

        let content = '';
        
        // Header
        content += `${exportData.title}\n`;
        content += `${'='.repeat(exportData.title.length)}\n\n`;
        
        // Metadata
        content += `Character: ${exportData.characterName}\n`;
        content += `Theme: ${exportData.theme}\n`;
        content += `Setting: ${exportData.setting}\n`;
        content += `Created: ${new Date(exportData.createdAt).toLocaleString()}\n`;
        
        if (exportData.completedAt !== exportData.createdAt) {
            content += `Completed: ${new Date(exportData.completedAt).toLocaleString()}\n`;
        }
        
        content += '\n';

        // Story content
        exportData.scenes.forEach((scene, index) => {
            content += `Scene ${scene.sceneNumber || index + 1}\n`;
            content += `${'-'.repeat(20)}\n\n`;
            content += this.cleanTextForExport(scene.text) + '\n';
            
            if (includeChoices && scene.choices && scene.choices.length > 0) {
                content += '\nChoices made:\n';
                const sceneChoice = exportData.choiceHistory.find(ch => ch.sceneId === scene.id);
                if (sceneChoice) {
                    content += `→ ${sceneChoice.choiceText}\n`;
                }
            }
            
            content += separator;
        });

        // Stats
        if (includeStats) {
            content += 'Story Statistics\n';
            content += '================\n\n';
            content += `Total Words: ${exportData.stats.totalWords}\n`;
            content += `Total Scenes: ${exportData.stats.totalScenes}\n`;
            content += `Total Choices: ${exportData.stats.totalChoices}\n`;
            content += `Estimated Reading Time: ${exportData.stats.estimatedReadingTime} minutes\n`;
            
            if (exportData.achievements.length > 0) {
                content += `\nAchievements:\n`;
                exportData.achievements.forEach(achievement => {
                    content += `• ${achievement}\n`;
                });
            }
        }

        return this.downloadFile(content, `${this.sanitizeFilename(exportData.title)}.txt`, 'text/plain');
    }

    // HTML Export
    exportAsHTML(exportData, options = {}) {
        const {
            includeStyles = true,
            theme = exportData.theme,
            responsive = true
        } = options;

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHTML(exportData.title)}</title>
    ${includeStyles ? this.generateHTMLStyles(theme, responsive) : ''}
</head>
<body class="theme-${theme}">
    <div class="story-container">
        <header class="story-header">
            <h1>${this.escapeHTML(exportData.title)}</h1>
            <div class="story-meta">
                <p><strong>Character:</strong> ${this.escapeHTML(exportData.characterName)}</p>
                <p><strong>Theme:</strong> ${this.escapeHTML(exportData.theme)}</p>
                <p><strong>Setting:</strong> ${this.escapeHTML(exportData.setting)}</p>
                <p><strong>Created:</strong> ${new Date(exportData.createdAt).toLocaleString()}</p>
            </div>
        </header>

        <main class="story-content">
            ${this.generateHTMLScenes(exportData.scenes, exportData.choiceHistory)}
        </main>

        <footer class="story-footer">
            <div class="story-stats">
                <h3>Story Statistics</h3>
                <ul>
                    <li>Total Words: ${exportData.stats.totalWords}</li>
                    <li>Total Scenes: ${exportData.stats.totalScenes}</li>
                    <li>Total Choices: ${exportData.stats.totalChoices}</li>
                    <li>Reading Time: ~${exportData.stats.estimatedReadingTime} minutes</li>
                </ul>
                ${exportData.achievements.length > 0 ? `
                <h4>Achievements</h4>
                <ul class="achievements">
                    ${exportData.achievements.map(achievement => 
                        `<li>${this.escapeHTML(achievement)}</li>`
                    ).join('')}
                </ul>
                ` : ''}
            </div>
            <p class="generated-by">Generated by Story Generator</p>
        </footer>
    </div>
</body>
</html>`;

        return this.downloadFile(html, `${this.sanitizeFilename(exportData.title)}.html`, 'text/html');
    }

    generateHTMLStyles(theme, responsive) {
        return `<style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Georgia', serif;
                line-height: 1.6;
                color: #333;
                background: #f8f9fa;
                ${responsive ? 'max-width: 800px; margin: 0 auto; padding: 20px;' : ''}
            }
            
            .story-container {
                background: white;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
                border-radius: 8px;
                overflow: hidden;
            }
            
            .story-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 2rem;
                text-align: center;
            }
            
            .story-header h1 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
            }
            
            .story-meta p {
                margin: 0.5rem 0;
                opacity: 0.9;
            }
            
            .story-content {
                padding: 2rem;
            }
            
            .scene {
                margin-bottom: 2rem;
                padding-bottom: 2rem;
                border-bottom: 1px solid #eee;
            }
            
            .scene:last-child {
                border-bottom: none;
            }
            
            .scene-header {
                color: #666;
                font-size: 0.9rem;
                margin-bottom: 1rem;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .scene-text {
                font-size: 1.1rem;
                margin-bottom: 1rem;
            }
            
            .scene-choice {
                background: #f8f9fa;
                padding: 0.5rem 1rem;
                border-left: 4px solid #667eea;
                margin: 1rem 0;
                font-style: italic;
            }
            
            .story-footer {
                background: #f8f9fa;
                padding: 2rem;
                border-top: 1px solid #eee;
            }
            
            .story-stats ul {
                list-style: none;
                margin: 1rem 0;
            }
            
            .story-stats li {
                padding: 0.25rem 0;
            }
            
            .achievements {
                margin-top: 1rem;
            }
            
            .achievements li {
                background: #e3f2fd;
                padding: 0.5rem;
                margin: 0.25rem 0;
                border-radius: 4px;
            }
            
            .generated-by {
                text-align: center;
                color: #666;
                margin-top: 2rem;
                font-size: 0.9rem;
            }
            
            /* Theme-specific colors */
            .theme-fantasy .story-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            
            .theme-sci-fi .story-header {
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            }
            
            .theme-mystery .story-header {
                background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
            }
            
            .theme-horror .story-header {
                background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
            }
            
            ${responsive ? `
            @media (max-width: 768px) {
                body {
                    padding: 10px;
                }
                
                .story-header {
                    padding: 1.5rem;
                }
                
                .story-header h1 {
                    font-size: 2rem;
                }
                
                .story-content {
                    padding: 1.5rem;
                }
                
                .scene-text {
                    font-size: 1rem;
                }
            }
            ` : ''}
        </style>`;
    }

    generateHTMLScenes(scenes, choiceHistory) {
        return scenes.map((scene, index) => {
            const sceneChoice = choiceHistory.find(ch => ch.sceneId === scene.id);
            
            return `
                <div class="scene">
                    <div class="scene-header">Scene ${scene.sceneNumber || index + 1}</div>
                    <div class="scene-text">${this.formatTextForHTML(scene.text)}</div>
                    ${sceneChoice ? `
                        <div class="scene-choice">
                            Choice made: ${this.escapeHTML(sceneChoice.choiceText)}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    // JSON Export
    exportAsJSON(exportData, options = {}) {
        const {
            includeRawData = false,
            prettyPrint = true
        } = options;

        const jsonData = {
            metadata: {
                title: exportData.title,
                characterName: exportData.characterName,
                theme: exportData.theme,
                setting: exportData.setting,
                createdAt: exportData.createdAt,
                completedAt: exportData.completedAt,
                exportedAt: Date.now(),
                version: '1.0'
            },
            story: {
                scenes: exportData.scenes.map(scene => ({
                    sceneNumber: scene.sceneNumber,
                    text: scene.text,
                    type: scene.type,
                    mood: scene.mood,
                    setting: scene.setting
                })),
                choiceHistory: exportData.choiceHistory,
                achievements: exportData.achievements
            },
            statistics: exportData.stats
        };

        if (includeRawData) {
            jsonData.rawData = exportData;
        }

        const jsonString = prettyPrint 
            ? JSON.stringify(jsonData, null, 2)
            : JSON.stringify(jsonData);

        return this.downloadFile(
            jsonString, 
            `${this.sanitizeFilename(exportData.title)}.json`, 
            'application/json'
        );
    }

    // PDF Export (simplified - in a real app, you'd use a library like jsPDF)
    async exportAsPDF(exportData, options = {}) {
        // This is a simplified implementation
        // In a real application, you would use a library like jsPDF or Puppeteer
        
        const htmlContent = await this.exportAsHTML(exportData, { 
            ...options, 
            includeStyles: true 
        });
        
        // Create a blob URL for the HTML content
        const blob = new Blob([htmlContent.content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Open in new window for user to print to PDF
        const printWindow = window.open(url, '_blank');
        
        setTimeout(() => {
            if (printWindow) {
                printWindow.print();
                URL.revokeObjectURL(url);
            }
        }, 1000);
        
        return {
            success: true,
            message: 'PDF generation initiated. Please use your browser\'s print dialog to save as PDF.',
            filename: `${this.sanitizeFilename(exportData.title)}.pdf`
        };
    }

    // Sharing functionality
    generateShareableLink(story) {
        const shareData = {
            title: this.generateStoryTitle(story),
            config: story.config,
            choiceHistory: story.choiceHistory || [],
            completedAt: story.updatedAt
        };

        // Encode the data
        const encodedData = btoa(JSON.stringify(shareData));
        
        // Generate shareable URL
        const baseUrl = window.location.origin + window.location.pathname;
        return `${baseUrl}?share=${encodedData}`;
    }

    async shareToSocialMedia(story, platform) {
        const title = this.generateStoryTitle(story);
        const url = this.generateShareableLink(story);
        const description = `Check out this interactive story I created: "${title}"`;

        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(description)}&url=${encodeURIComponent(url)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(description)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
            return true;
        }

        return false;
    }

    // Email sharing
    shareViaEmail(story) {
        const title = this.generateStoryTitle(story);
        const url = this.generateShareableLink(story);
        const subject = `Check out my interactive story: ${title}`;
        const body = `Hi!

I just created an interactive story called "${title}" and thought you might enjoy it.

You can read and experience the story here: ${url}

The story is about ${story.config.characterName}'s adventure in a ${story.config.theme} setting.

Created with Story Generator.`;

        const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
    }

    // Utility methods
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        
        // Check file size
        if (blob.size > this.maxFileSize) {
            throw new Error(`File size (${this.formatFileSize(blob.size)}) exceeds maximum allowed size (${this.formatFileSize(this.maxFileSize)})`);
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        return {
            success: true,
            filename: filename,
            size: blob.size,
            content: content
        };
    }

    sanitizeFilename(filename) {
        return filename
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '_') // Replace spaces with underscores
            .substring(0, 100); // Limit length
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    cleanTextForExport(text) {
        return text
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
    }

    formatTextForHTML(text) {
        return text
            .split('\n\n') // Split paragraphs
            .map(paragraph => `<p>${this.escapeHTML(paragraph.trim())}</p>`)
            .join('');
    }

    formatFileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }

    // Batch export
    async exportMultipleStories(stories, format = 'json') {
        const exports = await Promise.all(
            stories.map(async (story, index) => {
                try {
                    const result = await this.exportStory(story, format, { 
                        filename: `story_${index + 1}_${this.sanitizeFilename(story.config.characterName)}` 
                    });
                    return { success: true, story: story.id, result };
                } catch (error) {
                    return { success: false, story: story.id, error: error.message };
                }
            })
        );

        return {
            total: stories.length,
            successful: exports.filter(e => e.success).length,
            failed: exports.filter(e => !e.success).length,
            results: exports
        };
    }

    // Import functionality
    async importStory(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const content = event.target.result;
                    let storyData;
                    
                    if (file.type === 'application/json') {
                        storyData = JSON.parse(content);
                    } else {
                        // Try to parse as text
                        storyData = this.parseTextImport(content);
                    }
                    
                    resolve(storyData);
                } catch (error) {
                    reject(new Error(`Failed to import story: ${error.message}`));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsText(file);
        });
    }

    parseTextImport(content) {
        // Basic text import parser
        const lines = content.split('\n');
        const story = {
            title: lines[0] || 'Imported Story',
            scenes: [],
            metadata: {}
        };
        
        // This would need more sophisticated parsing
        // For now, just create a simple story structure
        const scenes = content.split(/Scene \d+/i).slice(1);
        
        story.scenes = scenes.map((scene, index) => ({
            sceneNumber: index + 1,
            text: scene.trim(),
            type: 'imported'
        }));
        
        return story;
    }
}
