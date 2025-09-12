// DOM Elements
        const textInput = document.getElementById('textInput');
        const generateBtn = document.getElementById('generateBtn');
        const copyBtn = document.getElementById('copyBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const asciiOutput = document.getElementById('asciiOutput');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');

        // ASCII Art Patterns
        const asciiPatterns = {
            detailed: [
                "▓███████▓ ▄▄▄▄▄ ▓███████▓",
                "▒█▓▒░░▒▓█▒█▀█▀█▒█▓▒░░▒▓█▒",
                "░█▒░░░▒█▒█▒█▒█▒█▒░░░▒█░",
                "▒█▓▒░░▒▓█▒█▒░▒█▒█▓▒░░▒▓█▒",
                "▓███████▓ ▀▒█▒▀ ▓███████▓"
            ],
            simple: [
                "┏━━━━━━━━┓",
                "┃ Hello ┃",
                "┗━━━━━━━━┛"
            ],
            block: [
                "▄▄▄▄▄▄▄▄▄▄▄▄▄",
                "█ Hello World █",
                "▀▀▀▀▀▀▀▀▀▀▀▀▀"
            ],
            artistic: [
                "╔═══════════════╗",
                "║  ╔═╗┌─┐┌─┐┬┌─  ║",
                "║  ║ ╦│ ││ │├┴┐  ║",
                "║  ╚═╝└─┘└─┘┴ ┴  ║",
                "╚═══════════════╝"
            ]
        };

        // Event Listeners
        generateBtn.addEventListener('click', generateAsciiArt);
        copyBtn.addEventListener('click', copyAsciiArt);
        downloadBtn.addEventListener('click', downloadAsciiArt);
        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') generateAsciiArt();
        });

        // Generate ASCII Art
        function generateAsciiArt() {
            const text = textInput.value.trim();
            if (!text) {
                showToast('Please enter some text first!', true);
                return;
            }

            // Show loading state
            loadingSpinner.style.display = 'flex';
            asciiOutput.style.opacity = '0.3';
            generateBtn.disabled = true;

            // Get selected style
            const style = document.querySelector('input[name="style"]:checked').value;

            // Simulate AI processing with a delay
            setTimeout(() => {
                // Generate ASCII art based on style
                let art;
                switch(style) {
                    case 'simple':
                        art = generateSimpleAscii(text);
                        break;
                    case 'block':
                        art = generateBlockAscii(text);
                        break;
                    case 'artistic':
                        art = generateArtisticAscii(text);
                        break;
                    default:
                        art = generateDetailedAscii(text);
                }

                // Display the ASCII art
                asciiOutput.textContent = art;
                
                // Enable copy and download buttons
                copyBtn.disabled = false;
                downloadBtn.disabled = false;
                
                // Hide loading state
                loadingSpinner.style.display = 'none';
                asciiOutput.style.opacity = '1';
                generateBtn.disabled = false;
                
                showToast('ASCII art generated successfully!');
            }, 1500);
        }

        // Generate Detailed ASCII Art
        function generateDetailedAscii(text) {
            const lines = [];
            const width = text.length + 6;
            
            lines.push("╔" + "═".repeat(width) + "╗");
            lines.push("║  " + text + "  ║");
            lines.push("╚" + "═".repeat(width) + "╝");
            
            return lines.join('\n');
        }

        // Generate Simple ASCII Art
        function generateSimpleAscii(text) {
            const lines = [];
            const width = text.length + 4;
            
            lines.push("┏" + "━".repeat(width) + "┓");
            lines.push("┃  " + text + "  ┃");
            lines.push("┗" + "━".repeat(width) + "┛");
            
            return lines.join('\n');
        }

        // Generate Block ASCII Art
        function generateBlockAscii(text) {
            const lines = [];
            const width = text.length + 4;
            
            lines.push("▄" + "▄".repeat(width) + "▄");
            lines.push("█  " + text + "  █");
            lines.push("▀" + "▀".repeat(width) + "▀");
            
            return lines.join('\n');
        }

        // Generate Artistic ASCII Art
        function generateArtisticAscii(text) {
            const lines = [];
            const width = text.length + 6;
            
            lines.push("✦•·················•✦");
            lines.push("    " + text + "    ");
            lines.push("✦•·················•✦");
            
            return lines.join('\n');
        }

        // Copy ASCII Art to Clipboard
        function copyAsciiArt() {
            const textToCopy = asciiOutput.textContent;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast('ASCII art copied to clipboard!');
            }).catch(err => {
                showToast('Failed to copy text!', true);
                console.error('Failed to copy: ', err);
            });
        }

        // Download ASCII Art as Text File
        function downloadAsciiArt() {
            const textToDownload = asciiOutput.textContent;
            const blob = new Blob([textToDownload], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ascii-art.txt';
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast('ASCII art downloaded!');
            }, 100);
        }

        // Show Toast Notification
        function showToast(message, isError = false) {
            toastMessage.textContent = message;
            
            if (isError) {
                toast.classList.add('error');
            } else {
                toast.classList.remove('error');
            }
            
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }