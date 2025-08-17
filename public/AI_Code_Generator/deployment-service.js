// Modified Deployment Service with Token Integration
class DeploymentService {
    constructor() {
        this.currentCode = null;
        this.selectedService = null;
        this.deploymentInProgress = false;
        
        // 🔑 YAHAN APNE TOKENS ADD KARO
        this.apiKeys = {
    api:"your_api_key"     // Yahan Vercel token paste karo
        };
        
        this.initEventListeners();
        this.initTokenSetup(); // New method for token setup
    }

    // 🔧 TOKEN SETUP MODAL
    initTokenSetup() {
        // Create token setup button in your HTML
        const setupBtn = document.createElement('button');
        setupBtn.innerHTML = '⚙️ Setup API Keys';
        setupBtn.className = 'setup-tokens-btn';
        setupBtn.onclick = () => this.showTokenSetupModal();
        
        // Add to your deployment modal or wherever you want
        const deploymentModal = document.getElementById('deployment-modal');
        if (deploymentModal) {
            deploymentModal.appendChild(setupBtn);
        }
    }

    // 📝 TOKEN SETUP MODAL
    showTokenSetupModal() {
        const modal = document.createElement('div');
        modal.className = 'token-setup-modal';
        modal.innerHTML = `
            <div class="token-setup-content">
                <h3>🔑 API Keys Setup</h3>
                <div class="token-inputs">
                    <div class="token-field">
                        <label>GitHub Token:</label>
                        <input type="password" id="github-token" placeholder="ghp_xxxxxxxxxxxx">
                        <a href="https://github.com/settings/tokens" target="_blank">Get GitHub Token</a>
                    </div>
                    
                    <div class="token-field">
                        <label>Netlify Token:</label>
                        <input type="password" id="netlify-token" placeholder="your_netlify_token">
                        <a href="https://app.netlify.com/user/applications#personal-access-tokens" target="_blank">Get Netlify Token</a>
                    </div>
                    
                    <div class="token-field">
                        <label>Vercel Token:</label>
                        <input type="password" id="vercel-token" placeholder="your_vercel_token">
                        <a href="https://vercel.com/account/tokens" target="_blank">Get Vercel Token</a>
                    </div>
                </div>
                
                <div class="token-actions">
                    <button onclick="deploymentService.saveTokens()" class="btn-primary">💾 Save Tokens</button>
                    <button onclick="deploymentService.closeTokenModal()" class="btn-secondary">❌ Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // 💾 SAVE TOKENS
    saveTokens() {
        const githubToken = document.getElementById('github-token').value.trim();
        const netlifyToken = document.getElementById('netlify-token').value.trim();
        const vercelToken = document.getElementById('vercel-token').value.trim();

        // Save to class variables
        if (githubToken) this.apiKeys.github = githubToken;
        if (netlifyToken) this.apiKeys.netlify = netlifyToken;
        if (vercelToken) this.apiKeys.vercel = vercelToken;

        // Save to localStorage for persistence (optional)
        localStorage.setItem('deployment_tokens', JSON.stringify(this.apiKeys));
        
        this.closeTokenModal();
        showToast('✅ API Keys saved successfully!', 'success');
    }

    // 📂 LOAD SAVED TOKENS
    loadSavedTokens() {
        try {
            const saved = localStorage.getItem('deployment_tokens');
            if (saved) {
                this.apiKeys = { ...this.apiKeys, ...JSON.parse(saved) };
                console.log('✅ Tokens loaded from storage');
            }
        } catch (error) {
            console.error('❌ Error loading tokens:', error);
        }
    }

    // ❌ CLOSE TOKEN MODAL
    closeTokenModal() {
        const modal = document.querySelector('.token-setup-modal');
        if (modal) {
            modal.remove();
        }
    }

    // ✅ CHECK IF TOKEN EXISTS
    hasApiKey(service) {
        return this.apiKeys[service] && this.apiKeys[service].length > 0;
    }

    // 🚀 MODIFIED DEPLOYMENT METHODS

    // GitHub Real Deployment
async deployToGitHub(projectName, description) {
    // Validate token first
    if (!this.hasApiKey('github')) {
        showToast('❌ GitHub token required! Please setup API keys first.', 'error');
        this.showTokenSetupModal();
        return;
    }

    try {
        this.updateProgressStep(1, 'Validating GitHub token...');
        
        // 1. Validate token and get user info
        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${this.apiKeys.github}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Your-App-Name' // GitHub requires user agent
            }
        });

        if (!userResponse.ok) {
            const errorData = await userResponse.json().catch(() => ({}));
            if (userResponse.status === 401) {
                throw new Error('Invalid GitHub token. Please check your token.');
            }
            throw new Error(errorData.message || 'Failed to authenticate with GitHub');
        }

        const userData = await userResponse.json();
        const username = userData.login;

        this.updateProgressStep(2, 'Creating repository...');
        
        // 2. Create repository
        const repoResponse = await fetch('https://api.github.com/user/repos', {
            method: 'POST',
            headers: {
                'Authorization': `token ${this.apiKeys.github}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Your-App-Name'
            },
            body: JSON.stringify({
                name: projectName,
                description: description || 'Website created with AI Website Builder',
                private: false,
                auto_init: false
            })
        });

        if (!repoResponse.ok) {
            const errorData = await repoResponse.json().catch(() => ({}));
            if (repoResponse.status === 422) {
                throw new Error(`Repository "${projectName}" already exists. Please choose a different name.`);
            }
            throw new Error(errorData.message || 'Failed to create repository');
        }

        const repoData = await repoResponse.json();
        
        this.updateProgressStep(3, 'Uploading files...');
        
        // 3. Upload index.html
        const content = btoa(unescape(encodeURIComponent(this.currentCode)));
        const uploadResponse = await fetch(
            `https://api.github.com/repos/${username}/${projectName}/contents/index.html`, 
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.apiKeys.github}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Your-App-Name'
                },
                body: JSON.stringify({
                    message: 'Initial commit',
                    content: content
                })
            }
        );

        if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to upload files');
        }

        this.updateProgressStep(4, 'Configuring GitHub Pages...');
        
        // 4. Enable GitHub Pages (may need to retry this after a delay)
        const pagesResponse = await fetch(
            `https://api.github.com/repos/${username}/${projectName}/pages`, 
            {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.apiKeys.github}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Your-App-Name'
                },
                body: JSON.stringify({
                    source: {
                        branch: "main",
                        path: "/"
                    }
                })
            }
        );

        // Even if pages setup fails, we consider it a success
        const pagesUrl = `https://${username}.github.io/${projectName}`;
        
        return {
            service: 'GitHub Pages',
            url: pagesUrl,
            repositoryUrl: repoData.html_url,
            status: pagesResponse.ok ? 'success' : 'pages_setup_pending'
        };

    } catch (error) {
        console.error('GitHub deployment failed:', error);
        throw new Error(`GitHub deployment failed: ${error.message}`);
    }
}

// Enhanced token validation method
async validateGitHubToken() {
    try {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${this.apiKeys.github}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'AI-Website-Builder'
            }
        });

        if (!response.ok) {
            return {
                valid: false,
                error: response.status === 401 ? 'Invalid token' : 'Token has insufficient permissions'
            };
        }

        const userData = await response.json();
        
        // Check token scopes
        const scopes = response.headers.get('x-oauth-scopes');
        const requiredScopes = ['repo', 'user'];
        const hasRequiredScopes = requiredScopes.every(scope => 
            scopes && scopes.includes(scope)
        );

        return {
            valid: hasRequiredScopes,
            user: userData,
            scopes: scopes,
            error: !hasRequiredScopes ? 'Token missing required scopes: repo, user' : null
        };
    } catch (error) {
        return {
            valid: false,
            error: 'Failed to validate token'
        };
    }
}

// Add this to your token setup modal
showTokenSetupModal() {
    const modal = document.createElement('div');
    modal.className = 'token-setup-modal';
    modal.innerHTML = `
        <div class="token-setup-content">
            <h3>🔑 API Keys Setup</h3>
            <div class="token-inputs">
                <div class="token-field">
                    <label>GitHub Token:</label>
                    <input type="password" id="github-token" placeholder="ghp_xxxxxxxxxxxx">
                    <div class="token-help">
                        <a href="https://github.com/settings/tokens" target="_blank">🔗 Get GitHub Token</a>
                        <p style="color: #666; font-size: 0.9rem; margin: 0.5rem 0;">
                            ⚠️ Required scopes: <strong>repo</strong> and <strong>user</strong>
                        </p>
                    </div>
                </div>
                
                <div class="token-field">
                    <label>Netlify Token:</label>
                    <input type="password" id="netlify-token" placeholder="your_netlify_token">
                    <a href="https://app.netlify.com/user/applications#personal-access-tokens" target="_blank">🔗 Get Netlify Token</a>
                </div>
                
                <div class="token-field">
                    <label>Vercel Token:</label>
                    <input type="password" id="vercel-token" placeholder="your_vercel_token">
                    <a href="https://vercel.com/account/tokens" target="_blank">🔗 Get Vercel Token</a>
                </div>
            </div>
            
            <div class="token-actions">
                <button onclick="deploymentService.saveAndValidateTokens()" class="btn-primary">💾 Save & Validate</button>
                <button onclick="deploymentService.closeTokenModal()" class="btn-secondary">❌ Cancel</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Enhanced save method with validation
async saveAndValidateTokens() {
    const githubToken = document.getElementById('github-token').value.trim();
    const netlifyToken = document.getElementById('netlify-token').value.trim();
    const vercelToken = document.getElementById('vercel-token').value.trim();

    // Save tokens first
    if (githubToken) this.apiKeys.github = githubToken;
    if (netlifyToken) this.apiKeys.netlify = netlifyToken;
    if (vercelToken) this.apiKeys.vercel = vercelToken;

    // Validate GitHub token if provided
    if (githubToken) {
        showToast('🔄 Validating GitHub token...', 'info');
        const validation = await this.validateGitHubToken();
        
        if (!validation.valid) {
            showToast(`❌ GitHub token validation failed: ${validation.error}`, 'error');
            return;
        } else {
            showToast(`✅ GitHub token valid for user: ${validation.user.login}`, 'success');
        }
    }

    // Save to localStorage
    localStorage.setItem('deployment_tokens', JSON.stringify(this.apiKeys));
    
    this.closeTokenModal();
    showToast('✅ API Keys saved successfully!', 'success');
}

    // Netlify Real Deployment
    async deployToNetlify(projectName, description) {
        if (!this.hasApiKey('netlify')) {
            showToast('❌ Netlify token required! Please setup API keys first.', 'error');
            this.showTokenSetupModal();
            return;
        }

        this.updateProgressStep(1, 'Creating Netlify site...');

        try {
            // Create site
            const siteResponse = await fetch('https://api.netlify.com/api/v1/sites', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKeys.netlify}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')
                })
            });

            if (!siteResponse.ok) {
                const error = await siteResponse.text();
                throw new Error(`Netlify API Error: ${error}`);
            }

            const siteData = await siteResponse.json();
            
            this.updateProgressStep(2, 'Uploading files...');
            
            // Simple file upload (without ZIP for now)
            const deployResponse = await fetch(`https://api.netlify.com/api/v1/sites/${siteData.id}/deploys`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKeys.netlify}`,
                    'Content-Type': 'text/html'
                },
                body: this.currentCode
            });

            if (!deployResponse.ok) {
                throw new Error('Failed to deploy to Netlify');
            }

            this.updateProgressStep(3, 'Publishing...');
            await this.delay(2000);
            
            this.updateProgressStep(4, 'Deployment complete!');

            return {
                service: 'Netlify',
                name: projectName,
                description: description,
                url: siteData.url,
                status: 'success',
                createdAt: new Date(),
                siteId: siteData.id
            };

        } catch (error) {
            console.error('Netlify deployment failed:', error);
            throw new Error(`Netlify deployment failed: ${error.message}`);
        }
    }

    // Vercel Real Deployment  
    async deployToVercel(projectName, description) {
        if (!this.hasApiKey('vercel')) {
            showToast('❌ Vercel token required! Please setup API keys first.', 'error');
            this.showTokenSetupModal();
            return;
        }

        this.updateProgressStep(1, 'Creating Vercel deployment...');

        try {
            const deployResponse = await fetch('https://api.vercel.com/v13/deployments', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKeys.vercel}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: projectName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                    files: [
                        {
                            file: 'index.html',
                            data: this.currentCode
                        }
                    ],
                    projectSettings: {
                        framework: null
                    }
                })
            });

            if (!deployResponse.ok) {
                const error = await deployResponse.text();
                throw new Error(`Vercel API Error: ${error}`);
            }

            const deployData = await deployResponse.json();
            
            this.updateProgressStep(2, 'Building...');
            this.updateProgressStep(3, 'Deploying...');
            
            // Wait a bit for deployment
            await this.delay(3000);
            
            this.updateProgressStep(4, 'Deployment complete!');

            return {
                service: 'Vercel',
                name: projectName,
                description: description,
                url: `https://${deployData.url}`,
                status: 'success',
                createdAt: new Date(),
                deploymentId: deployData.id
            };

        } catch (error) {
            console.error('Vercel deployment failed:', error);
            throw new Error(`Vercel deployment failed: ${error.message}`);
        }
    }

    // 🔧 INITIALIZATION - LOAD TOKENS ON START
    initEventListeners() {
        // Load saved tokens
        this.loadSavedTokens();
        
        // Original event listeners...
        const deploymentOptions = document.querySelectorAll('.deployment-option');
        deploymentOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectDeploymentService(option.dataset.service);
            });
        });

        const deployForm = document.getElementById('deployment-form');
        if (deployForm) {
            deployForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.startDeployment();
            });
        }

        const deploymentModal = document.getElementById('deployment-modal');
        if (deploymentModal) {
            deploymentModal.addEventListener('click', (e) => {
                if (e.target === deploymentModal) {
                    closeDeployment();
                }
            });
        }
    }

    // Rest of your original methods...
    openDeployment(code) {
        if (!code) {
            showToast('No code available to deploy', 'warning');
            return;
        }

        this.currentCode = code;
        this.resetDeploymentModal();
        openDeployment();
    }

    selectDeploymentService(service) {
        this.selectedService = service;
        
        document.querySelectorAll('.deployment-option').forEach(option => {
            option.classList.toggle('selected', option.dataset.service === service);
        });

        const deploymentForm = document.getElementById('deployment-form');
        if (deploymentForm) {
            deploymentForm.style.display = 'block';
            
            const projectNameInput = document.getElementById('project-name');
            if (projectNameInput && !projectNameInput.value) {
                projectNameInput.value = `my-${service}-website`;
            }
        }

        // Check if token exists for selected service
        if (!this.hasApiKey(service) && service !== 'codepen') {
            showToast(`⚠️ ${this.getServiceName(service)} token required for deployment`, 'warning');
        } else {
            showToast(`✅ Selected ${this.getServiceName(service)} for deployment`, 'info');
        }
    }

    getServiceName(service) {
        const names = {
            github: 'GitHub Pages',
            netlify: 'Netlify',
            vercel: 'Vercel',
            codepen: 'CodePen'
        };
        return names[service] || service;
    }

    async startDeployment() {
        if (!this.selectedService || !this.currentCode || this.deploymentInProgress) {
            return;
        }

        const projectName = document.getElementById('project-name').value.trim();
        const projectDescription = document.getElementById('project-description').value.trim();

        if (!projectName) {
            showToast('Please enter a project name', 'error');
            return;
        }

        this.deploymentInProgress = true;
        this.showDeploymentProgress();

        try {
            let deploymentResult;
            
            switch (this.selectedService) {
                case 'github':
                    deploymentResult = await this.deployToGitHub(projectName, projectDescription);
                    break;
                case 'netlify':
                    deploymentResult = await this.deployToNetlify(projectName, projectDescription);
                    break;
                case 'vercel':
                    deploymentResult = await this.deployToVercel(projectName, projectDescription);
                    break;
                case 'codepen':
                    deploymentResult = await this.deployToCodePen(projectName, projectDescription);
                    break;
                default:
                    throw new Error('Invalid deployment service selected');
            }

            if (deploymentResult) {
                this.showDeploymentSuccess(deploymentResult);
                this.saveDeploymentHistory(deploymentResult);
            }
            
        } catch (error) {
            console.error('Deployment failed:', error);
            this.showDeploymentError(error.message);
        } finally {
            this.deploymentInProgress = false;
        }
    }

    // CodePen deployment (remains same as original)
    async deployToCodePen(projectName, description) {
        this.updateProgressStep(1, 'Parsing HTML structure...');
        await this.delay(600);
        
        this.updateProgressStep(2, 'Extracting CSS styles...');
        await this.delay(800);
        
        this.updateProgressStep(3, 'Processing JavaScript...');
        await this.delay(700);
        
        this.updateProgressStep(4, 'Creating CodePen...');
        await this.delay(1000);
        
        const { html, css, js } = this.extractCodeParts(this.currentCode);
        
        const penId = this.generateCodePenId();
        const url = `https://codepen.io/ai-builder/pen/${penId}`;
        
        return {
            service: 'CodePen',
            name: projectName,
            description: description,
            url: url,
            status: 'success',
            createdAt: new Date(),
            penId: penId,
            html: html,
            css: css,
            js: js
        };
    }

    // Original helper methods...
    extractCodeParts(htmlCode) {
        const cssRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
        let css = '';
        let match;
        while ((match = cssRegex.exec(htmlCode)) !== null) {
            css += match[1] + '\n';
        }

        const jsRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
        let js = '';
        while ((match = jsRegex.exec(htmlCode)) !== null) {
            js += match[1] + '\n';
        }

        let html = htmlCode.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
            html = bodyMatch[1];
        }

        return { html: html.trim(), css: css.trim(), js: js.trim() };
    }

    showDeploymentProgress() {
        const deploymentForm = document.getElementById('deployment-form');
        const deploymentProgress = document.getElementById('deployment-progress');
        
        if (deploymentForm) deploymentForm.style.display = 'none';
        if (deploymentProgress) deploymentProgress.style.display = 'block';
        
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index === 0) {
                step.classList.add('active');
            }
        });
        
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = '25%';
        }
    }

    updateProgressStep(stepNumber, message) {
        const steps = document.querySelectorAll('.progress-step');
        const progressFill = document.querySelector('.progress-fill');
        
        steps.forEach((step, index) => {
            step.classList.remove('active');
            if (index < stepNumber - 1) {
                step.classList.add('completed');
                const icon = step.querySelector('i');
                if (icon) icon.className = 'fas fa-check';
            } else if (index === stepNumber - 1) {
                step.classList.add('active');
                const icon = step.querySelector('i');
                if (icon) icon.className = 'fas fa-spinner fa-spin';
                const span = step.querySelector('span');
                if (span) span.textContent = message;
            }
        });
        
        if (progressFill) {
            const progress = (stepNumber / 4) * 100;
            progressFill.style.width = `${progress}%`;
        }
    }

    showDeploymentSuccess(deploymentResult) {
        const deploymentProgress = document.getElementById('deployment-progress');
        const deploymentSuccess = document.getElementById('deployment-success');
        const liveUrlInput = document.getElementById('live-url');
        
        if (deploymentProgress) deploymentProgress.style.display = 'none';
        if (deploymentSuccess) deploymentSuccess.style.display = 'block';
        
        if (liveUrlInput) {
            liveUrlInput.value = deploymentResult.url;
        }
        
        showToast(`✅ Successfully deployed to ${deploymentResult.service}!`, 'success');
    }

    showDeploymentError(errorMessage) {
        const deploymentProgress = document.getElementById('deployment-progress');
        if (deploymentProgress) {
            deploymentProgress.innerHTML = `
                <div class="deployment-error" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-exclamation-triangle" style="color: var(--error-color); font-size: 3rem; margin-bottom: 20px;"></i>
                    <h3>Deployment Failed</h3>
                    <p>${escapeHtml(errorMessage)}</p>
                    <button class="btn-primary" onclick="deploymentService.resetDeploymentModal()">
                        <i class="fas fa-redo"></i>
                        Try Again
                    </button>
                </div>
            `;
        }
        
        showToast(`❌ Deployment failed: ${errorMessage}`, 'error');
    }

    saveDeploymentHistory(deploymentResult) {
        try {
            const stored = localStorage.getItem('ai_website_deployments');
            const deployments = stored ? JSON.parse(stored) : [];
            
            deployments.unshift(deploymentResult);
            
            if (deployments.length > 50) {
                deployments.splice(50);
            }
            
            localStorage.setItem('ai_website_deployments', JSON.stringify(deployments));
            
            if (window.chatManager) {
                window.chatManager.updateDeploymentHistory(deployments);
            }
        } catch (error) {
            console.error('Error saving deployment history:', error);
        }
    }

    resetDeploymentModal() {
        const deploymentForm = document.getElementById('deployment-form');
        const deploymentProgress = document.getElementById('deployment-progress');
        const deploymentSuccess = document.getElementById('deployment-success');
        
        if (deploymentForm) {
            deploymentForm.style.display = 'none';
            deploymentForm.reset();
        }
        if (deploymentProgress) deploymentProgress.style.display = 'none';
        if (deploymentSuccess) deploymentSuccess.style.display = 'none';
        
        document.querySelectorAll('.deployment-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        this.selectedService = null;
        this.deploymentInProgress = false;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateCodePenId() {
        return Math.random().toString(36).substring(2, 10);
    }
}

// Initialize deployment service
const deploymentService = new DeploymentService();

// CSS for token setup modal
const style = document.createElement('style');
style.textContent = `
.token-setup-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
}

.token-setup-content {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
}

.token-field {
    margin-bottom: 1rem;
}

.token-field label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
}

.token-field input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 0.5rem;
}

.token-field a {
    color: #007bff;
    text-decoration: none;
    font-size: 0.9rem;
}

.token-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.setup-tokens-btn {
    background: #28a745;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    margin: 1rem 0;
}
`;
document.head.appendChild(style);