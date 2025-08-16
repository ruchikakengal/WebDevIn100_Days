class Input {
    constructor() {
        this.keys = {};
        this.previousKeys = {};
        this.gamepadIndex = null;
        this.gamepad = null;
        
        // Mobile touch support
        this.touch = {
            left: false,
            right: false,
            jump: false
        };
        
        console.log('Input manager initialized');
        this.setupGamepadSupport();
    }
    
    // Handle key down events
    handleKeyDown(event) {
        this.keys[event.code] = true;
        this.keys[event.key] = true; // Also store by key for easier access
        
        // Prevent default browser behavior for game keys
        const gameKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'KeyA', 'KeyW', 'KeyS', 'KeyD'];
        if (gameKeys.includes(event.code)) {
            event.preventDefault();
        }
        
        console.log('Key pressed:', event.code);
    }
    
    // Handle key up events
    handleKeyUp(event) {
        this.keys[event.code] = false;
        this.keys[event.key] = false;
        
        console.log('Key released:', event.code);
    }
    
    // Check if key is currently pressed
    isKeyPressed(key) {
        return !!this.keys[key] || this.getTouchInput(key);
    }
    
    // Check if key was just pressed this frame
    isKeyJustPressed(key) {
        return this.keys[key] && !this.previousKeys[key];
    }
    
    // Check if key was just released this frame
    isKeyJustReleased(key) {
        return !this.keys[key] && this.previousKeys[key];
    }
    
    // Get touch input state
    getTouchInput(key) {
        switch(key) {
            case 'ArrowLeft':
            case 'KeyA':
                return this.touch.left;
            case 'ArrowRight':
            case 'KeyD':
                return this.touch.right;
            case ' ':
            case 'ArrowUp':
            case 'Space':
                return this.touch.jump;
            default:
                return false;
        }
    }
    
    // Update touch state
    setTouchInput(direction, state) {
        if (this.touch.hasOwnProperty(direction)) {
            this.touch[direction] = state;
        }
    }
    
    // Setup gamepad support
    setupGamepadSupport() {
        window.addEventListener('gamepadconnected', (e) => {
            console.log('Gamepad connected:', e.gamepad.id);
            this.gamepadIndex = e.gamepad.index;
        });
        
        window.addEventListener('gamepaddisconnected', (e) => {
            console.log('Gamepad disconnected');
            if (this.gamepadIndex === e.gamepad.index) {
                this.gamepadIndex = null;
                this.gamepad = null;
            }
        });
    }
    
    // Update gamepad state
    updateGamepad() {
        if (this.gamepadIndex !== null) {
            this.gamepad = navigator.getGamepads()[this.gamepadIndex];
            
            if (this.gamepad) {
                // Map gamepad inputs to keyboard equivalents
                const deadzone = 0.3;
                
                // D-pad and left stick for movement
                const leftStickX = this.gamepad.axes[0];
                const dpadLeft = this.gamepad.buttons[14].pressed;
                const dpadRight = this.gamepad.buttons[15].pressed;
                
                this.keys['ArrowLeft'] = dpadLeft || leftStickX < -deadzone;
                this.keys['ArrowRight'] = dpadRight || leftStickX > deadzone;
                
                // Jump buttons (A, B, or shoulder buttons)
                this.keys[' '] = this.gamepad.buttons[0].pressed || // A button
                                this.gamepad.buttons[1].pressed || // B button
                                this.gamepad.buttons[4].pressed || // Left shoulder
                                this.gamepad.buttons[5].pressed;   // Right shoulder
            }
        }
    }
    
    // Update input state (call once per frame)
    update() {
        // Store previous frame's key state
        this.previousKeys = { ...this.keys };
        
        // Update gamepad
        this.updateGamepad();
    }
    
    // Get movement vector (-1 to 1 for each axis)
    getMovementVector() {
        let x = 0;
        let y = 0;
        
        if (this.isKeyPressed('ArrowLeft') || this.isKeyPressed('KeyA')) {
            x -= 1;
        }
        if (this.isKeyPressed('ArrowRight') || this.isKeyPressed('KeyD')) {
            x += 1;
        }
        if (this.isKeyPressed('ArrowUp') || this.isKeyPressed('KeyW')) {
            y -= 1;
        }
        if (this.isKeyPressed('ArrowDown') || this.isKeyPressed('KeyS')) {
            y += 1;
        }
        
        return { x, y };
    }
    
    // Check for any input
    hasAnyInput() {
        return Object.values(this.keys).some(pressed => pressed) ||
               Object.values(this.touch).some(pressed => pressed);
    }
    
    // Reset all input states
    reset() {
        this.keys = {};
        this.previousKeys = {};
        this.touch = {
            left: false,
            right: false,
            jump: false
        };
    }
    
    // Get input display text for UI
    getInputDisplayText() {
        const pressedKeys = Object.keys(this.keys).filter(key => this.keys[key]);
        return pressedKeys.length > 0 ? pressedKeys.join(', ') : 'None';
    }
}
