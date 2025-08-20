class Physics {
    constructor() {
        this.gravity = 500; // pixels per second squared (reduced for better flight)
        this.airResistance = 0.005; // reduced air resistance for longer flight
        this.wind = {
            x: 0,
            y: 0,
            strength: 0,
            angle: 0
        };
        this.generateWind();
    }

    /**
     * Generate random wind conditions
     */
    generateWind() {
        this.wind.strength = Math.random() * 3; // 0-3 wind strength (reduced)
        this.wind.angle = Math.random() * 360; // 0-360 degrees
        this.wind.x = Math.cos(this.wind.angle * Math.PI / 180) * this.wind.strength;
        this.wind.y = Math.sin(this.wind.angle * Math.PI / 180) * this.wind.strength;
    }

    /**
     * Calculate arrow trajectory point at given time
     * @param {number} time - Time in seconds
     * @param {Object} initial - Initial conditions {x, y, vx, vy}
     * @returns {Object} Position and velocity at time t
     */
    calculateTrajectory(time, initial) {
        const t = time;
        const windForceX = this.wind.x * 50; // Increased wind effect
        const windForceY = this.wind.y * 50;
        
        // Apply physics equations with wind and air resistance
        const x = initial.x + (initial.vx + windForceX) * t;
        const y = initial.y + initial.vy * t + 0.5 * this.gravity * t * t + windForceY * t;
        
        // Calculate velocities with air resistance
        const dragFactorX = 1 - this.airResistance * t;
        const dragFactorY = 1 - this.airResistance * t;
        
        const vx = (initial.vx + windForceX) * dragFactorX;
        const vy = (initial.vy + windForceY) * dragFactorY + this.gravity * t;
        
        return { x, y, vx, vy };
    }

    /**
     * Check collision between arrow and target
     * @param {Object} arrow - Arrow position {x, y}
     * @param {Object} target - Target {x, y, radius, zones}
     * @returns {Object|null} Hit information or null
     */
    checkTargetCollision(arrow, target) {
        const dx = arrow.x - target.x;
        const dy = arrow.y - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= target.radius) {
            // Determine which zone was hit
            const zones = target.zones || [
                { name: 'bullseye', radius: target.radius * 0.2, points: 100 },
                { name: 'inner', radius: target.radius * 0.5, points: 50 },
                { name: 'outer', radius: target.radius, points: 25 }
            ];
            
            for (let zone of zones) {
                if (distance <= zone.radius) {
                    return {
                        hit: true,
                        zone: zone.name,
                        points: zone.points,
                        distance: distance,
                        target: target
                    };
                }
            }
        }
        
        return null;
    }

    /**
     * Check if arrow is out of bounds
     * @param {Object} arrow - Arrow position {x, y}
     * @param {Object} bounds - Game bounds {width, height}
     * @returns {boolean} True if out of bounds
     */
    isOutOfBounds(arrow, bounds) {
        return arrow.x < 0 || arrow.x > bounds.width || 
               arrow.y < 0 || arrow.y > bounds.height;
    }

    /**
     * Calculate arrow rotation based on velocity
     * @param {number} vx - Horizontal velocity
     * @param {number} vy - Vertical velocity
     * @returns {number} Rotation angle in radians
     */
    calculateArrowRotation(vx, vy) {
        return Math.atan2(vy, vx);
    }

    /**
     * Get predicted trajectory points for aiming guide
     * @param {Object} initial - Initial conditions
     * @param {number} steps - Number of prediction steps
     * @returns {Array} Array of trajectory points
     */
    getPredictedTrajectory(initial, steps = 30) {
        const points = [];
        const timeStep = 0.05;
        let currentState = { ...initial };
        
        for (let i = 0; i < steps; i++) {
            points.push({ x: currentState.x, y: currentState.y });
            
            // Simple physics simulation for prediction
            currentState.vx += this.wind.x * timeStep * 20;
            currentState.vy += this.wind.y * timeStep * 20 + this.gravity * timeStep;
            
            // Apply air resistance
            currentState.vx *= (1 - this.airResistance * timeStep * 3);
            currentState.vy *= (1 - this.airResistance * timeStep * 2);
            
            // Update position
            currentState.x += currentState.vx * timeStep;
            currentState.y += currentState.vy * timeStep;
            
            // Stop if arrow would hit ground or go too far
            if (currentState.y > initial.y + 400 || currentState.x > initial.x + 1200) break;
        }
        
        return points;
    }

    /**
     * Apply difficulty-based wind changes
     * @param {number} level - Current difficulty level
     */
    updateWindForLevel(level) {
        const maxWind = Math.min(level * 0.5, 8);
        this.wind.strength = Math.random() * maxWind;
        this.wind.angle = Math.random() * 360;
        this.wind.x = Math.cos(this.wind.angle * Math.PI / 180) * this.wind.strength;
        this.wind.y = Math.sin(this.wind.angle * Math.PI / 180) * this.wind.strength;
    }

    /**
     * Get wind information for UI display
     * @returns {Object} Wind display data
     */
    getWindDisplay() {
        return {
            strength: Math.round(this.wind.strength * 10) / 10,
            angle: Math.round(this.wind.angle),
            direction: this.getWindDirection()
        };
    }

    /**
     * Get wind direction as compass direction
     * @returns {string} Wind direction (N, NE, E, etc.)
     */
    getWindDirection() {
        const angle = this.wind.angle;
        const directions = ['E', 'NE', 'N', 'NW', 'W', 'SW', 'S', 'SE'];
        const index = Math.round(angle / 45) % 8;
        return directions[index];
    }

    /**
     * Create explosion effect physics for target hits
     * @param {Object} target - Target that was hit
     * @param {string} zone - Zone that was hit
     * @returns {Array} Particle data for explosion effect
     */
    createHitExplosion(target, zone) {
        const particles = [];
        const particleCount = zone === 'bullseye' ? 15 : zone === 'inner' ? 10 : 5;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
            const speed = Math.random() * 100 + 50;
            
            particles.push({
                x: target.x,
                y: target.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                decay: Math.random() * 0.02 + 0.01,
                size: Math.random() * 3 + 2,
                color: zone === 'bullseye' ? '#ffff00' : 
                       zone === 'inner' ? '#ff6600' : '#00ff88'
            });
        }
        
        return particles;
    }
}
