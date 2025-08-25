/**
 * Terminal Component
 * Handles command input, output, and terminal interactions
 */

class Terminal {
    constructor(filesystem, minigames, audio, effects, app) {
        this.filesystem = filesystem;
        this.minigames = minigames;
        this.audio = audio;
        this.effects = effects;
        this.app = app;
        
        this.output = document.getElementById('terminalOutput');
        this.input = document.getElementById('terminalInput');
        this.cursor = document.getElementById('cursor');
        this.prompt = document.getElementById('currentPrompt');
        this.suggestions = document.getElementById('suggestions');
        
        this.currentDirectory = '/home/hacker';
        this.commandHistory = [];
        this.historyIndex = -1;
        this.isProcessing = false;
        this.typingSpeed = 50;
        
        this.initializeCommands();
        this.bindEvents();
    }

    /**
     * Initialize terminal
     */
    async init() {
        this.input.focus();
        this.updatePrompt();
        this.startCursorBlink();
    }

    /**
     * Initialize available commands
     */
    initializeCommands() {
        this.commands = {
            help: {
                description: 'Show available commands',
                usage: 'help [command]',
                execute: (args) => this.showHelp(args)
            },
            ls: {
                description: 'List directory contents',
                usage: 'ls [directory]',
                execute: (args) => this.listDirectory(args)
            },
            cd: {
                description: 'Change directory',
                usage: 'cd <directory>',
                execute: (args) => this.changeDirectory(args)
            },
            cat: {
                description: 'Display file contents',
                usage: 'cat <filename>',
                execute: (args) => this.displayFile(args)
            },
            pwd: {
                description: 'Show current directory',
                usage: 'pwd',
                execute: () => this.showCurrentDirectory()
            },
            clear: {
                description: 'Clear terminal screen',
                usage: 'clear',
                execute: () => this.clear()
            },
            hack: {
                description: 'Initiate hacking sequence',
                usage: 'hack <target>',
                execute: (args) => this.initiateHack(args)
            },
            scan: {
                description: 'Scan for network vulnerabilities',
                usage: 'scan [target]',
                execute: (args) => this.scanNetwork(args)
            },
            crack: {
                description: 'Crack password or encryption',
                usage: 'crack <target>',
                execute: (args) => this.crackTarget(args)
            },
            exploit: {
                description: 'Exploit discovered vulnerabilities',
                usage: 'exploit <vulnerability>',
                execute: (args) => this.exploitVulnerability(args)
            },
            inject: {
                description: 'Inject code into target system',
                usage: 'inject <payload> <target>',
                execute: (args) => this.injectCode(args)
            },
            extract: {
                description: 'Extract data from compromised system',
                usage: 'extract <data_type>',
                execute: (args) => this.extractData(args)
            },
            stealth: {
                description: 'Enable stealth mode',
                usage: 'stealth [on|off]',
                execute: (args) => this.toggleStealth(args)
            },
            status: {
                description: 'Show system status and progress',
                usage: 'status',
                execute: () => this.showStatus()
            },
            history: {
                description: 'Show command history',
                usage: 'history',
                execute: () => this.showHistory()
            },
            whoami: {
                description: 'Display current user',
                usage: 'whoami',
                execute: () => this.showUser()
            },
            date: {
                description: 'Display current date and time',
                usage: 'date',
                execute: () => this.showDate()
            },
            echo: {
                description: 'Display text',
                usage: 'echo <text>',
                execute: (args) => this.echo(args)
            },
            find: {
                description: 'Search for files',
                usage: 'find <pattern>',
                execute: (args) => this.findFiles(args)
            },
            grep: {
                description: 'Search text in files',
                usage: 'grep <pattern> <file>',
                execute: (args) => this.grepFile(args)
            },
            netstat: {
                description: 'Display network connections',
                usage: 'netstat',
                execute: () => this.showNetworkStatus()
            },
            ps: {
                description: 'Display running processes',
                usage: 'ps',
                execute: () => this.showProcesses()
            },
            kill: {
                description: 'Terminate process',
                usage: 'kill <pid>',
                execute: (args) => this.killProcess(args)
            },
            // Easter egg commands
            matrix: {
                description: 'Enter the Matrix',
                usage: 'matrix',
                execute: () => this.enterMatrix(),
                hidden: true
            },
            konami: {
                description: 'Konami code easter egg',
                usage: 'konami',
                execute: () => this.konamiCode(),
                hidden: true
            },
            '42': {
                description: 'The answer to everything',
                usage: '42',
                execute: () => this.theAnswer(),
                hidden: true
            }
        };
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.input.addEventListener('input', (e) => this.handleInput(e));
        this.input.addEventListener('blur', () => {
            // Refocus input when clicked elsewhere
            setTimeout(() => this.input.focus(), 100);
        });

        // Click anywhere to focus input
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.minigame-overlay') && 
                !e.target.closest('.file-viewer') &&
                !e.target.closest('.settings-panel')) {
                this.input.focus();
            }
        });
    }

    /**
     * Handle keyboard input
     */
    handleKeydown(e) {
        if (this.isProcessing) {
            e.preventDefault();
            return;
        }

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                this.executeCommand();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.navigateHistory(-1);
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                this.navigateHistory(1);
                break;
                
            case 'Tab':
                e.preventDefault();
                this.autoComplete();
                break;
                
            case 'Escape':
                e.preventDefault();
                this.hideSuggestions();
                break;
        }
    }

    /**
     * Handle input changes
     */
    handleInput(e) {
        const value = e.target.value;
        
        if (value.length > 0) {
            this.showSuggestions(value);
        } else {
            this.hideSuggestions();
        }

        if (this.audio.soundEnabled) {
            this.audio.playSound('type');
        }
    }

    /**
     * Execute entered command
     */
    async executeCommand() {
        const command = this.input.value.trim();
        
        if (!command) return;

        // Add to history
        this.commandHistory.push(command);
        this.historyIndex = -1;

        // Display command
        this.addLine('command', `${this.prompt.textContent}${command}`);
        
        // Clear input
        this.input.value = '';
        this.hideSuggestions();

        // Parse and execute command
        this.isProcessing = true;
        await this.processCommand(command);
        this.isProcessing = false;

        // Scroll to bottom
        this.scrollToBottom();
        
        // Save command history
        this.app.gameState.commandHistory = this.commandHistory.slice(-50); // Keep last 50 commands
        this.app.saveGameState();
    }

    /**
     * Process and execute command
     */
    async processCommand(command) {
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        // Check if command exists
        if (this.commands[cmd]) {
            try {
                await this.commands[cmd].execute(args);
            } catch (error) {
                this.addLine('error', `Command failed: ${error.message}`);
            }
        } else {
            this.addLine('error', `Command not found: ${cmd}`);
            this.addLine('system', 'Type "help" for available commands.');
            
            if (this.audio.soundEnabled) {
                this.audio.playSound('error');
            }
        }
    }

    /**
     * Navigate command history
     */
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;

        if (direction === -1) {
            // Up arrow - go to previous command
            if (this.historyIndex === -1) {
                this.historyIndex = this.commandHistory.length - 1;
            } else if (this.historyIndex > 0) {
                this.historyIndex--;
            }
        } else {
            // Down arrow - go to next command
            if (this.historyIndex === -1) return;
            
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
            } else {
                this.historyIndex = -1;
                this.input.value = '';
                return;
            }
        }

        this.input.value = this.commandHistory[this.historyIndex];
    }

    /**
     * Auto-complete command
     */
    autoComplete() {
        const input = this.input.value.toLowerCase();
        const commands = Object.keys(this.commands).filter(cmd => 
            cmd.startsWith(input) && !this.commands[cmd].hidden
        );

        if (commands.length === 1) {
            this.input.value = commands[0] + ' ';
        } else if (commands.length > 1) {
            this.showSuggestions(input);
        }
    }

    /**
     * Show command suggestions
     */
    showSuggestions(input) {
        const suggestions = Object.keys(this.commands)
            .filter(cmd => cmd.startsWith(input.toLowerCase()) && !this.commands[cmd].hidden)
            .slice(0, 5);

        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        this.suggestions.innerHTML = '';
        suggestions.forEach(cmd => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.innerHTML = `
                <span class="suggestion-command">${cmd}</span>
                <span class="suggestion-description">${this.commands[cmd].description}</span>
            `;
            
            item.addEventListener('click', () => {
                this.input.value = cmd + ' ';
                this.hideSuggestions();
                this.input.focus();
            });
            
            this.suggestions.appendChild(item);
        });

        this.suggestions.classList.remove('hidden');
    }

    /**
     * Hide suggestions
     */
    hideSuggestions() {
        this.suggestions.classList.add('hidden');
    }

    /**
     * Add line to terminal output
     */
    addLine(type = '', content = '', animate = true) {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        
        if (animate && content) {
            this.typewriterEffect(line, content);
        } else {
            line.textContent = content;
        }
        
        this.output.appendChild(line);
        this.scrollToBottom();
        
        return line;
    }

    /**
     * Typewriter effect for text
     */
    async typewriterEffect(element, text) {
        element.textContent = '';
        this.output.appendChild(element);
        
        const speed = Math.max(10, 110 - this.typingSpeed);
        
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            
            if (this.audio.soundEnabled && Math.random() > 0.7) {
                this.audio.playSound('type');
            }
            
            await this.delay(speed);
        }
    }

    /**
     * Update terminal prompt
     */
    updatePrompt() {
        const user = this.app.currentUser;
        const hostname = 'cyberhack';
        const dir = this.currentDirectory === '/home/hacker' ? '~' : this.currentDirectory;
        this.prompt.textContent = `${user}@${hostname}:${dir}$ `;
    }

    /**
     * Start cursor blinking animation
     */
    startCursorBlink() {
        setInterval(() => {
            if (this.input === document.activeElement) {
                this.cursor.style.opacity = this.cursor.style.opacity === '0' ? '1' : '0';
            } else {
                this.cursor.style.opacity = '0.5';
            }
        }, 500);
    }

    /**
     * Scroll terminal to bottom
     */
    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }

    /**
     * Clear terminal
     */
    clear() {
        this.output.innerHTML = '';
        
        if (this.audio.soundEnabled) {
            this.audio.playSound('clear');
        }
    }

    /**
     * Utility delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Command implementations
    showHelp(args) {
        if (args.length > 0) {
            const cmd = args[0].toLowerCase();
            if (this.commands[cmd]) {
                this.addLine('system', `${cmd} - ${this.commands[cmd].description}`);
                this.addLine('system', `Usage: ${this.commands[cmd].usage}`);
            } else {
                this.addLine('error', `No help available for command: ${cmd}`);
            }
        } else {
            this.addLine('system', 'Available commands:');
            this.addLine('', '');
            
            Object.entries(this.commands).forEach(([cmd, info]) => {
                if (!info.hidden) {
                    this.addLine('output', `  ${cmd.padEnd(12)} - ${info.description}`);
                }
            });
            
            this.addLine('', '');
            this.addLine('system', 'Type "help <command>" for detailed usage information.');
        }
    }

    listDirectory(args) {
        const targetDir = args.length > 0 ? args[0] : this.currentDirectory;
        const result = this.filesystem.listDirectory(targetDir);
        
        if (result.error) {
            this.addLine('error', result.error);
            return;
        }

        if (result.items.length === 0) {
            this.addLine('output', 'Directory is empty');
            return;
        }

        result.items.forEach(item => {
            const type = item.type === 'directory' ? 'd' : '-';
            const perms = item.permissions || 'rwxr-xr-x';
            const size = item.type === 'file' ? (item.size || '1024').toString().padStart(8) : '     DIR';
            const name = item.type === 'directory' ? `${item.name}/` : item.name;
            
            this.addLine('output', `${type}${perms} ${size} ${name}`);
        });
    }

    changeDirectory(args) {
        if (args.length === 0) {
            this.currentDirectory = '/home/hacker';
            this.updatePrompt();
            return;
        }

        const result = this.filesystem.changeDirectory(this.currentDirectory, args[0]);
        
        if (result.error) {
            this.addLine('error', result.error);
        } else {
            this.currentDirectory = result.path;
            this.updatePrompt();
        }
    }

    displayFile(args) {
        if (args.length === 0) {
            this.addLine('error', 'Usage: cat <filename>');
            return;
        }

        const result = this.filesystem.readFile(this.currentDirectory, args[0]);
        
        if (result.error) {
            this.addLine('error', result.error);
        } else {
            // Check if file triggers a minigame
            if (result.minigame) {
                this.minigames.startGame(result.minigame, result.file);
            } else {
                // Display file content with syntax highlighting
                this.displayFileContent(result.content, result.type);
                
                // Mark file as discovered
                this.app.updateProgress('file_discovered', { path: result.file.path });
            }
        }
    }

    displayFileContent(content, type) {
        const lines = content.split('\n');
        
        lines.forEach(line => {
            if (type === 'code') {
                this.addLine('output', this.applySyntaxHighlighting(line));
            } else {
                this.addLine('output', line);
            }
        });
    }

    applySyntaxHighlighting(line) {
        // Simple syntax highlighting
        return line
            .replace(/\b(function|var|let|const|if|else|for|while|return)\b/g, '<span class="syntax-keyword">$1</span>')
            .replace(/"([^"]*)"/g, '<span class="syntax-string">"$1"</span>')
            .replace(/\/\/.*$/g, '<span class="syntax-comment">$&</span>')
            .replace(/\b\d+\b/g, '<span class="syntax-number">$&</span>');
    }

    showCurrentDirectory() {
        this.addLine('output', this.currentDirectory);
    }

    showUser() {
        this.addLine('output', this.app.currentUser);
    }

    showDate() {
        this.addLine('output', new Date().toString());
    }

    echo(args) {
        this.addLine('output', args.join(' '));
    }

    showHistory() {
        this.commandHistory.forEach((cmd, index) => {
            this.addLine('output', `${(index + 1).toString().padStart(4)}: ${cmd}`);
        });
    }

    showStatus() {
        this.addLine('system', 'System Status:');
        this.addLine('output', `User: ${this.app.currentUser}`);
        this.addLine('output', `Directory: ${this.currentDirectory}`);
        this.addLine('output', `System Level: ${this.app.systemLevel}`);
        this.addLine('output', `Challenges Completed: ${this.app.gameState.completedChallenges.length}`);
        this.addLine('output', `Files Discovered: ${this.app.gameState.discoveredFiles.length}`);
        this.addLine('output', `Score: ${this.app.gameState.score}`);
        this.addLine('output', `Unlocked Systems: ${this.app.unlockedSystems.join(', ')}`);
    }

    // Hacking commands
    async initiateHack(args) {
        if (args.length === 0) {
            this.addLine('error', 'Usage: hack <target>');
            return;
        }

        const target = args[0];
        this.addLine('system', `Initiating hack sequence on target: ${target}`);
        
        await this.delay(1000);
        this.addLine('system', 'Scanning target for vulnerabilities...');
        
        await this.delay(2000);
        
        // Simulate discovering vulnerabilities
        const vulnerabilities = ['SQL injection', 'Buffer overflow', 'Weak encryption'];
        const found = vulnerabilities[Math.floor(Math.random() * vulnerabilities.length)];
        
        this.addLine('success', `Vulnerability found: ${found}`);
        this.addLine('system', `Use "exploit ${found}" to proceed.`);
        
        if (this.audio.soundEnabled) {
            this.audio.playSound('success');
        }
    }

    async scanNetwork(args) {
        this.addLine('system', 'Scanning network for active hosts...');
        
        await this.delay(1500);
        
        const hosts = [
            '192.168.1.1   - Router (Vulnerable)',
            '192.168.1.50  - Database Server (Secured)',
            '192.168.1.100 - Web Server (Vulnerable)',
            '192.168.1.150 - File Server (Unknown)'
        ];
        
        for (const host of hosts) {
            await this.delay(500);
            this.addLine('output', host);
        }
        
        this.addLine('system', 'Network scan complete. Use "hack <ip>" to target specific hosts.');
    }

    async crackTarget(args) {
        if (args.length === 0) {
            this.addLine('error', 'Usage: crack <target>');
            return;
        }

        const target = args[0];
        
        if (target.includes('password')) {
            this.minigames.startGame('password', { target });
        } else {
            this.addLine('error', `Cannot crack target: ${target}`);
        }
    }

    // Easter egg commands
    enterMatrix() {
        this.addLine('success', 'Welcome to the Matrix, Neo...');
        this.effects.startMatrixRain();
        
        setTimeout(() => {
            this.addLine('system', 'You have been unplugged from the Matrix.');
        }, 5000);
    }

    konamiCode() {
        this.addLine('success', '↑ ↑ ↓ ↓ ← → ← → B A');
        this.addLine('system', 'Konami code activated! 30 extra lives granted.');
        this.app.gameState.score += 1000;
    }

    theAnswer() {
        this.addLine('success', 'The Answer to the Ultimate Question of Life, the Universe, and Everything is 42.');
        this.addLine('system', 'But what is the question?');
    }

    // Additional command implementations would go here...
    findFiles(args) {
        if (args.length === 0) {
            this.addLine('error', 'Usage: find <pattern>');
            return;
        }

        const pattern = args[0];
        const results = this.filesystem.findFiles(pattern);
        
        if (results.length === 0) {
            this.addLine('output', 'No files found matching pattern.');
        } else {
            results.forEach(file => {
                this.addLine('output', file);
            });
        }
    }

    showNetworkStatus() {
        this.addLine('system', 'Active network connections:');
        this.addLine('output', 'Proto  Local Address          Foreign Address        State');
        this.addLine('output', 'TCP    127.0.0.1:8080        0.0.0.0:*             LISTEN');
        this.addLine('output', 'TCP    192.168.1.100:443     74.125.224.72:443     ESTABLISHED');
        this.addLine('output', 'UDP    0.0.0.0:53            0.0.0.0:*             LISTEN');
    }

    showProcesses() {
        this.addLine('system', 'Running processes:');
        this.addLine('output', 'PID   COMMAND');
        this.addLine('output', '1     systemd');
        this.addLine('output', '1337  hack_daemon');
        this.addLine('output', '2001  cyber_scanner');
        this.addLine('output', '3141  neural_net');
    }

    killProcess(args) {
        if (args.length === 0) {
            this.addLine('error', 'Usage: kill <pid>');
            return;
        }

        const pid = args[0];
        this.addLine('system', `Terminating process ${pid}...`);
        
        if (pid === '1337') {
            this.addLine('error', 'Cannot kill hack_daemon: Permission denied');
        } else {
            this.addLine('success', `Process ${pid} terminated.`);
        }
    }
}
