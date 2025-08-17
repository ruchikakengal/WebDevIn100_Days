// Enhanced Gemini AI Service for Website Generation and Code Explanation
class GeminiService {
    constructor() {
        // Get API key from environment variables with fallback
        this.apiKey = this.getApiKey();
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
        this.websiteModel = 'gemini-2.0-flash';
        this.explanationModel = 'gemini-2.0-flash';
    }

    getApiKey() {
        // Use integrated API key
        return 'AIzaSyAOex7o7qN1zAM2ueLGHeO9lO79nIW-BM0';
    }

    async generateWebsiteCode(userRequest) {
        try {
            console.log('Generating website for request:', userRequest);
            
            const systemPrompt = `You are an expert web developer who creates complete, functional websites. 
            Based on the user's request, generate complete HTML, CSS, and JavaScript code for a modern, responsive website.
            
            IMPORTANT: Always provide ONLY the complete HTML code with embedded CSS and JavaScript.
            
            Requirements:
            1. Complete HTML structure with proper DOCTYPE and meta tags
            2. Embedded CSS with modern styling (flexbox, grid, animations, glassmorphism)
            3. JavaScript functionality as needed
            4. Fully responsive design that works on all devices
            5. Modern UI/UX with smooth animations and micro-interactions
            6. Clean, semantic, and accessible code
            7. SEO optimized structure with proper meta tags
            8. Use modern design trends like glassmorphism, gradients, and smooth animations
            9. Include proper error handling in JavaScript
            10. Use CSS custom properties for theming
            11. Implement proper loading states and user feedback
            12. Ensure cross-browser compatibility
            
            Design Guidelines:
            - Use modern color schemes and typography
            - Implement smooth hover effects and transitions
            - Add subtle shadows and depth
            - Use proper spacing and visual hierarchy
            - Include interactive elements with feedback
            - Implement proper form validation if forms are present
            - Add smooth scrolling and navigation
            - Use modern CSS features like flexbox, grid, and custom properties
            
            Format your response as a complete HTML file with embedded CSS and JS.
            Make sure the code is production-ready and follows best practices.
            
            User Request: ${userRequest}`;

            const requestBody = {
                contents: [
                    {
                        parts: [
                            {
                                text: systemPrompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 8192,
                }
            };

            const response = await fetch(`${this.baseUrl}/${this.websiteModel}:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('API Response received, processing...');
            
            if (data.candidates && data.candidates.length > 0) {
                const generatedText = data.candidates[0].content.parts[0].text;
                console.log('Generated text length:', generatedText.length);
                return this.cleanCodeResponse(generatedText);
            } else {
                throw new Error('No response generated from Gemini API');
            }

        } catch (error) {
            console.error('Error generating website code:', error);
            
            // Provide helpful error messages based on error type
            if (error.message.includes('API_KEY_INVALID')) {
                throw new Error('Invalid API key. Please check your Gemini API key configuration.');
            } else if (error.message.includes('QUOTA_EXCEEDED')) {
                throw new Error('API quota exceeded. Please try again later or check your billing.');
            } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
                throw new Error('Network error. Please check your internet connection and try again.');
            } else {
                throw new Error(`Failed to generate website: ${error.message}`);
            }
        }
    }

    async generateCodeExplanation(code, explanationType = 'overview') {
        try {
            console.log('Generating code explanation for type:', explanationType);
            
            let systemPrompt = '';
            
            switch (explanationType) {
                case 'overview':
                    systemPrompt = `You are a code explanation expert. Analyze the provided HTML/CSS/JavaScript code and provide a comprehensive overview.

                    Please provide:
                    1. What this code does (main purpose and functionality)
                    2. Key technologies and techniques used
                    3. Overall structure and architecture
                    4. Main features and components
                    5. User experience highlights
                    
                    Format your response in clear, beginner-friendly language with proper headings and bullet points.
                    Make it educational and easy to understand.
                    
                    Code to analyze:
                    ${code}`;
                    break;
                    
                case 'breakdown':
                    systemPrompt = `You are a code explanation expert. Provide a detailed line-by-line breakdown of the provided code.

                    Please analyze and explain:
                    1. HTML Structure - What each section does
                    2. CSS Styling - How the visual design is achieved
                    3. JavaScript Functionality - How interactive features work
                    4. Key code blocks and their purposes
                    5. Important functions and their roles
                    
                    Format as sections with clear explanations for each part.
                    Use technical terms but explain them clearly.
                    
                    Code to analyze:
                    ${code}`;
                    break;
                    
                case 'concepts':
                    systemPrompt = `You are a web development educator. Identify and explain the key programming concepts used in this code.

                    Please identify and explain:
                    1. HTML Concepts (semantic elements, accessibility, SEO)
                    2. CSS Concepts (flexbox, grid, animations, responsive design)
                    3. JavaScript Concepts (DOM manipulation, event handling, etc.)
                    4. Design Patterns and Best Practices
                    5. Modern Web Development Techniques
                    
                    For each concept, provide:
                    - What it is
                    - Why it's used here
                    - Benefits and advantages
                    - Learning resources or related concepts
                    
                    Code to analyze:
                    ${code}`;
                    break;
                    
                case 'practices':
                    systemPrompt = `You are a senior web developer reviewing code quality. Analyze the best practices followed in this code.

                    Please evaluate and explain:
                    1. Code Organization and Structure
                    2. Performance Optimizations
                    3. Accessibility Implementation
                    4. SEO Best Practices
                    5. Security Considerations
                    6. Browser Compatibility
                    7. Maintainability and Scalability
                    
                    For each practice, explain:
                    - What was done well
                    - Why it's important
                    - Impact on user experience
                    - Potential improvements
                    
                    Code to analyze:
                    ${code}`;
                    break;
                    
                default:
                    systemPrompt = `Provide a comprehensive explanation of this code: ${code}`;
            }

            const requestBody = {
                contents: [
                    {
                        parts: [
                            {
                                text: systemPrompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.3,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 4096,
                }
            };

            const response = await fetch(`${this.baseUrl}/${this.explanationModel}:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Explanation API Error:', errorText);
                throw new Error(`Explanation API Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates.length > 0) {
                const explanation = data.candidates[0].content.parts[0].text;
                return this.formatExplanation(explanation);
            } else {
                throw new Error('No explanation generated from Gemini API');
            }

        } catch (error) {
            console.error('Error generating code explanation:', error);
            throw new Error(`Failed to generate explanation: ${error.message}`);
        }
    }

    cleanCodeResponse(response) {
        console.log('Cleaning response, original length:', response.length);
        
        // Remove markdown code blocks if present
        let cleanedResponse = response.replace(/```html\s*/g, '').replace(/```\s*$/g, '');
        
        // Remove any extra markdown formatting
        cleanedResponse = cleanedResponse.replace(/```/g, '');
        
        // Remove any leading/trailing whitespace
        cleanedResponse = cleanedResponse.trim();
        
        // Ensure the response starts with DOCTYPE if it's HTML
        if (!cleanedResponse.toLowerCase().startsWith('<!doctype')) {
            if (cleanedResponse.toLowerCase().includes('<html')) {
                cleanedResponse = '<!DOCTYPE html>\n' + cleanedResponse;
            }
        }
        
        console.log('Cleaned response length:', cleanedResponse.length);
        return cleanedResponse;
    }

    formatExplanation(explanation) {
        // Convert markdown-like formatting to HTML for better display
        let formatted = explanation;
        
        // Convert headers
        formatted = formatted.replace(/^# (.*$)/gm, '<h3>$1</h3>');
        formatted = formatted.replace(/^## (.*$)/gm, '<h4>$1</h4>');
        formatted = formatted.replace(/^### (.*$)/gm, '<h5>$1</h5>');
        
        // Convert bullet points
        formatted = formatted.replace(/^\* (.*$)/gm, '<li>$1</li>');
        formatted = formatted.replace(/^- (.*$)/gm, '<li>$1</li>');
        
        // Wrap consecutive list items in ul tags
        formatted = formatted.replace(/(<li>.*<\/li>\s*)+/gs, '<ul>$&</ul>');
        
        // Convert numbered lists
        formatted = formatted.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
        
        // Convert bold text
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Convert italic text
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Convert code blocks
        formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Convert paragraphs
        formatted = formatted.replace(/\n\n/g, '</p><p>');
        formatted = '<p>' + formatted + '</p>';
        
        // Clean up empty paragraphs
        formatted = formatted.replace(/<p><\/p>/g, '');
        formatted = formatted.replace(/<p>\s*<\/p>/g, '');
        
        return formatted;
    }

    // Method to validate API key
    async validateApiKey() {
        try {
            const response = await fetch(`${this.baseUrl}/${this.websiteModel}:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: 'Test connection'
                        }]
                    }],
                    generationConfig: {
                        maxOutputTokens: 1
                    }
                })
            });

            return response.ok;
        } catch (error) {
            console.error('API key validation failed:', error);
            return false;
        }
    }

    // Method to get API usage statistics
    async getApiUsage() {
        // This would require additional API endpoints from Google
        // For now, return mock data
        return {
            requestsUsed: 0,
            requestsLimit: 1000,
            tokensUsed: 0,
            tokensLimit: 1000000
        };
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeminiService;
}
