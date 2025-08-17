class ControlSystem {
    constructor() {
        this.keys = {};
        this.touches = {};
        this.gamepadConnected = false;
        this.gamepad = null;
        
        // Touch control areas
        this.leftTouchArea = null;
        this.rightTouchArea = null;
        this.touchControlsEnabled = false;
        
        // Control callbacks
        this.callbacks = {
            player1Up: null,
            player1Down: null,
            player2Up: null,
            player2Down: null,
            pause: null,
            quit: null
        };
        
        // Initialize event listeners
        this.initEventListeners();
        this.initTouchControls();
        this.initGamepadSupport();
    }

    initEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Prevent default behavior for game keys
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'KeyW', 'KeyS', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
        
        // Focus management
        window.addEventListener('blur', () => this.releaseAllKeys());
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.releaseAllKeys();
            }
        });
    }

    initTouchControls() {
        this.leftTouchArea = document.getElementById('left-touch-area');
        this.rightTouchArea = document.getElementById('right-touch-area');
        
        if (this.leftTouchArea && this.rightTouchArea) {
            // Left touch area (Player 1)
            this.leftTouchArea.addEventListener('touchstart', (e) => {
                this.handleTouchStart(e, 'left');
            });
            this.leftTouchArea.addEventListener('touchmove', (e) => {
                this.handleTouchMove(e, 'left');
            });
            this.leftTouchArea.addEventListener('touchend', (e) => {
                this.handleTouchEnd(e, 'left');
            });
            
            // Right touch area (Player 2)
            this.rightTouchArea.addEventListener('touchstart', (e) => {
                this.handleTouchStart(e, 'right');
            });
            this.rightTouchArea.addEventListener('touchmove', (e) => {
                this.handleTouchMove(e, 'right');
            });
            this.rightTouchArea.addEventListener('touchend', (e) => {
                this.handleTouchEnd(e, 'right');
            });
            
            // Prevent default touch behaviors
            [this.leftTouchArea, this.rightTouchArea].forEach(area => {
                area.addEventListener('touchstart', (e) => e.preventDefault());
                area.addEventListener('touchmove', (e) => e.preventDefault());
                area.addEventListener('touchend', (e) => e.preventDefault());
            });
        }
    }

    initGamepadSupport() {
        window.addEventListener('gamepadconnected', (e) => {
            this.gamepadConnected = true;
            this.gamepad = e.gamepad;
            console.log('Gamepad connected:', e.gamepad.id);
        });
        
        window.addEventListener('gamepaddisconnected', (e) => {
            this.gamepadConnected = false;
            this.gamepad = null;
            console.log('Gamepad disconnected');
        });
    }

    handleKeyDown(e) {
        this.keys[e.code] = true;
        
        // Trigger callbacks based on key
        switch (e.code) {
            case 'KeyW':
                if (this.callbacks.player1Up) this.callbacks.player1Up(true);
                break;
            case 'KeyS':
                if (this.callbacks.player1Down) this.callbacks.player1Down(true);
                break;
            case 'ArrowUp':
                if (this.callbacks.player2Up) this.callbacks.player2Up(true);
                break;
            case 'ArrowDown':
                if (this.callbacks.player2Down) this.callbacks.player2Down(true);
                break;
            case 'Space':
                if (this.callbacks.pause) this.callbacks.pause();
                break;
            case 'Escape':
                if (this.callbacks.quit) this.callbacks.quit();
                break;
        }
    }

    handleKeyUp(e) {
        this.keys[e.code] = false;
        
        // Trigger callbacks based on key
        switch (e.code) {
            case 'KeyW':
                if (this.callbacks.player1Up) this.callbacks.player1Up(false);
                break;
            case 'KeyS':
                if (this.callbacks.player1Down) this.callbacks.player1Down(false);
                break;
            case 'ArrowUp':
                if (this.callbacks.player2Up) this.callbacks.player2Up(false);
                break;
            case 'ArrowDown':
                if (this.callbacks.player2Down) this.callbacks.player2Down(false);
                break;
        }
    }

    handleTouchStart(e, side) {
        e.preventDefault();
        
        const touch = e.touches[0];
        const rect = e.target.getBoundingClientRect();
        const relativeY = (touch.clientY - rect.top) / rect.height;
        
        this.touches[side] = {
            id: touch.identifier,
            startY: relativeY,
            currentY: relativeY,
            active: true
        };
        
        // Determine initial direction
        this.updateTouchMovement(side, relativeY);
    }

    handleTouchMove(e, side) {
        e.preventDefault();
        
        if (!this.touches[side] || !this.touches[side].active) return;
        
        const touch = Array.from(e.touches).find(t => t.identifier === this.touches[side].id);
        if (!touch) return;
        
        const rect = e.target.getBoundingClientRect();
        const relativeY = (touch.clientY - rect.top) / rect.height;
        
        this.touches[side].currentY = relativeY;
        this.updateTouchMovement(side, relativeY);
    }

    handleTouchEnd(e, side) {
        e.preventDefault();
        
        if (this.touches[side]) {
            this.touches[side].active = false;
            this.stopTouchMovement(side);
        }
    }

    updateTouchMovement(side, relativeY) {
        const centerY = 0.5;
        const deadZone = 0.1;
        const difference = relativeY - centerY;
        
        if (Math.abs(difference) < deadZone) {
            this.stopTouchMovement(side);
            return;
        }
        
        if (side === 'left') {
            // Player 1 controls
            if (difference < -deadZone) {
                if (this.callbacks.player1Up) {
                    this.callbacks.player1Up(true);
                    this.callbacks.player1Down(false);
                }
            } else if (difference > deadZone) {
                if (this.callbacks.player1Down) {
                    this.callbacks.player1Down(true);
                    this.callbacks.player1Up(false);
                }
            }
        } else if (side === 'right') {
            // Player 2 controls
            if (difference < -deadZone) {
                if (this.callbacks.player2Up) {
                    this.callbacks.player2Up(true);
                    this.callbacks.player2Down(false);
                }
            } else if (difference > deadZone) {
                if (this.callbacks.player2Down) {
                    this.callbacks.player2Down(true);
                    this.callbacks.player2Up(false);
                }
            }
        }
    }

    stopTouchMovement(side) {
        if (side === 'left') {
            if (this.callbacks.player1Up) this.callbacks.player1Up(false);
            if (this.callbacks.player1Down) this.callbacks.player1Down(false);
        } else if (side === 'right') {
            if (this.callbacks.player2Up) this.callbacks.player2Up(false);
            if (this.callbacks.player2Down) this.callbacks.player2Down(false);
        }
    }

    updateGamepad() {
        if (!this.gamepadConnected) return;
        
        const gamepads = navigator.getGamepads();
        this.gamepad = gamepads[0];
        
        if (!this.gamepad) return;
        
        const deadZone = 0.2;
        
        // Left stick or D-pad for Player 1
        const leftStickY = this.gamepad.axes[1];
        const dpadUp = this.gamepad.buttons[12].pressed;
        const dpadDown = this.gamepad.buttons[13].pressed;
        
        if (Math.abs(leftStickY) > deadZone || dpadUp || dpadDown) {
            if (leftStickY < -deadZone || dpadUp) {
                if (this.callbacks.player1Up) {
                    this.callbacks.player1Up(true);
                    this.callbacks.player1Down(false);
                }
            } else if (leftStickY > deadZone || dpadDown) {
                if (this.callbacks.player1Down) {
                    this.callbacks.player1Down(true);
                    this.callbacks.player1Up(false);
                }
            }
        } else {
            if (this.callbacks.player1Up) this.callbacks.player1Up(false);
            if (this.callbacks.player1Down) this.callbacks.player1Down(false);
        }
        
        // Right stick for Player 2 (if in two-player mode)
        const rightStickY = this.gamepad.axes[3];
        
        if (Math.abs(rightStickY) > deadZone) {
            if (rightStickY < -deadZone) {
                if (this.callbacks.player2Up) {
                    this.callbacks.player2Up(true);
                    this.callbacks.player2Down(false);
                }
            } else if (rightStickY > deadZone) {
                if (this.callbacks.player2Down) {
                    this.callbacks.player2Down(true);
                    this.callbacks.player2Up(false);
                }
            }
        } else {
            if (this.callbacks.player2Up) this.callbacks.player2Up(false);
            if (this.callbacks.player2Down) this.callbacks.player2Down(false);
        }
        
        // Pause button (Start button)
        if (this.gamepad.buttons[9].pressed) {
            if (this.callbacks.pause) this.callbacks.pause();
        }
    }

    // Set control callbacks
    setCallbacks(callbacks) {
        this.callbacks = { ...this.callbacks, ...callbacks };
    }

    // Enable/disable touch controls
    setTouchControlsEnabled(enabled) {
        this.touchControlsEnabled = enabled;
        const touchControls = document.getElementById('touch-controls');
        if (touchControls) {
            touchControls.classList.toggle('hidden', !enabled);
        }
    }

    // Check if key is currently pressed
    isKeyPressed(keyCode) {
        return !!this.keys[keyCode];
    }

    // Get current input state
    getInputState() {
        // Update gamepad state
        this.updateGamepad();
        
        return {
            player1Up: this.keys['KeyW'] || false,
            player1Down: this.keys['KeyS'] || false,
            player2Up: this.keys['ArrowUp'] || false,
            player2Down: this.keys['ArrowDown'] || false,
            pause: this.keys['Space'] || false,
            quit: this.keys['Escape'] || false,
            gamepadConnected: this.gamepadConnected
        };
    }

    // Release all keys (useful for pause/focus loss)
    releaseAllKeys() {
        Object.keys(this.keys).forEach(key => {
            this.keys[key] = false;
        });
        
        // Release all touch inputs
        Object.keys(this.touches).forEach(side => {
            if (this.touches[side]) {
                this.touches[side].active = false;
                this.stopTouchMovement(side);
            }
        });
    }

    // Mobile device detection
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Auto-enable touch controls on mobile
    autoConfigureForDevice() {
        if (this.isMobileDevice()) {
            this.setTouchControlsEnabled(true);
        }
    }

    // Clean up event listeners
    destroy() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        window.removeEventListener('blur', this.releaseAllKeys);
        document.removeEventListener('visibilitychange', this.releaseAllKeys);
        
        // Clean up touch events
        if (this.leftTouchArea) {
            this.leftTouchArea.removeEventListener('touchstart', this.handleTouchStart);
            this.leftTouchArea.removeEventListener('touchmove', this.handleTouchMove);
            this.leftTouchArea.removeEventListener('touchend', this.handleTouchEnd);
        }
        
        if (this.rightTouchArea) {
            this.rightTouchArea.removeEventListener('touchstart', this.handleTouchStart);
            this.rightTouchArea.removeEventListener('touchmove', this.handleTouchMove);
            this.rightTouchArea.removeEventListener('touchend', this.handleTouchEnd);
        }
    }
}

// Control system instance will be created in main initialization
