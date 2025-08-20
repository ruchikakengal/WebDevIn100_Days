class AIController {
    constructor(tank, difficulty = 'normal') {
        this.tank = tank;
        this.difficulty = difficulty;
        this.state = 'patrol';
        this.target = null;
        this.lastSeen = null;
        this.patrolPoints = [];
        this.currentPatrolIndex = 0;
        this.lastStateChange = Date.now();
        this.reactionTime = this.getReactionTime();
        this.accuracy = this.getAccuracy();
        this.aggressionLevel = this.getAggressionLevel();
        this.lastShot = 0;
        this.shootCooldown = this.getShootCooldown();
        this.searchTime = 0;
        this.maxSearchTime = 300; // frames
        this.path = [];
        this.pathIndex = 0;
        this.stuckCounter = 0;
        this.lastPosition = { x: tank.x, y: tank.y };
        
        this.generatePatrolPoints();
    }

    getReactionTime() {
        switch (this.difficulty) {
            case 'easy': return 1000;
            case 'normal': return 500;
            case 'hard': return 200;
            default: return 500;
        }
    }

    getAccuracy() {
        switch (this.difficulty) {
            case 'easy': return 0.6;
            case 'normal': return 0.8;
            case 'hard': return 0.95;
            default: return 0.8;
        }
    }

    getAggressionLevel() {
        switch (this.difficulty) {
            case 'easy': return 0.3;
            case 'normal': return 0.6;
            case 'hard': return 0.9;
            default: return 0.6;
        }
    }

    getShootCooldown() {
        switch (this.difficulty) {
            case 'easy': return 800;
            case 'normal': return 600;
            case 'hard': return 400;
            default: return 600;
        }
    }

    generatePatrolPoints() {
        const numPoints = 4;
        const margin = 100;
        
        for (let i = 0; i < numPoints; i++) {
            this.patrolPoints.push({
                x: margin + Math.random() * (1200 - 2 * margin),
                y: margin + Math.random() * (800 - 2 * margin)
            });
        }
    }

    update(player, obstacles, otherTanks) {
        // Check if stuck
        this.checkIfStuck();
        
        // Update AI state based on player visibility
        this.updateState(player, obstacles);
        
        let bullets = null;
        
        // Execute current state behavior
        switch (this.state) {
            case 'patrol':
                this.patrol(obstacles);
                break;
            case 'chase':
                bullets = this.chase(player, obstacles);
                break;
            case 'attack':
                bullets = this.attack(player, obstacles);
                break;
            case 'search':
                this.search(obstacles);
                break;
            case 'flee':
                bullets = this.flee(player, obstacles);
                break;
        }
        
        // Avoid collisions with other tanks
        this.avoidCollisions(otherTanks);
        
        return bullets;
    }

    checkIfStuck() {
        const distance = Physics.getDistance(this.tank, this.lastPosition);
        if (distance < 2) {
            this.stuckCounter++;
            if (this.stuckCounter > 30) { // Stuck for 30 frames
                // Try to unstuck by moving in a random direction
                this.tank.angle += Math.random() * Math.PI / 2 - Math.PI / 4;
                this.stuckCounter = 0;
            }
        } else {
            this.stuckCounter = 0;
        }
        
        this.lastPosition = { x: this.tank.x, y: this.tank.y };
    }

    updateState(player, obstacles) {
        const now = Date.now();
        const timeSinceStateChange = now - this.lastStateChange;
        
        // Check if player is visible
        const canSeePlayer = this.canSeeTarget(player, obstacles);
        const distanceToPlayer = Physics.getDistance(this.tank, player);
        
        if (canSeePlayer && !player.isStealthed()) {
            this.lastSeen = { x: player.x, y: player.y, time: now };
            
            if (distanceToPlayer < 150 && this.tank.health > 30) {
                this.setState('attack');
            } else if (distanceToPlayer < 300 || this.tank.health > 50) {
                this.setState('chase');
            } else {
                this.setState('flee');
            }
        } else if (this.lastSeen && now - this.lastSeen.time < 5000) {
            // Recently saw player, search area
            if (this.state !== 'search') {
                this.setState('search');
            }
        } else {
            // No recent player contact, patrol
            if (this.state !== 'patrol') {
                this.setState('patrol');
            }
        }
    }

    setState(newState) {
        if (this.state !== newState) {
            this.state = newState;
            this.lastStateChange = Date.now();
            this.path = []; // Clear current path
            this.pathIndex = 0;
        }
    }

    canSeeTarget(target, obstacles) {
        const distance = Physics.getDistance(this.tank, target);
        const maxSightRange = 250;
        
        if (distance > maxSightRange) return false;
        
        // Check angle (field of view)
        const angleToTarget = Physics.getAngle(this.tank, target);
        const angleDiff = Math.abs(Physics.normalizeAngle(angleToTarget - this.tank.angle));
        
        if (angleDiff > Math.PI / 3) return false; // 60-degree field of view
        
        // Check line of sight
        return Physics.checkLineOfSight(this.tank, target, obstacles);
    }

    patrol(obstacles) {
        if (this.patrolPoints.length === 0) return;
        
        const currentPoint = this.patrolPoints[this.currentPatrolIndex];
        const distance = Physics.getDistance(this.tank, currentPoint);
        
        if (distance < 30) {
            // Reached patrol point, move to next
            this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
        } else {
            // Move towards current patrol point
            this.moveToTarget(currentPoint, obstacles);
        }
    }

    chase(player, obstacles) {
        const distance = Physics.getDistance(this.tank, player);
        
        if (distance > 100) {
            // Get closer to player
            this.moveToTarget(player, obstacles);
        } else {
            // Close enough, try to get a clear shot
            this.positionForShot(player, obstacles);
        }
        
        // Try to shoot if we have a clear shot
        return this.tryShoot(player, obstacles);
    }

    attack(player, obstacles) {        
        // Maintain distance and position
        const distance = Physics.getDistance(this.tank, player);
        if (distance < 80) {
            // Too close, back away
            this.moveAwayFrom(player, obstacles);
        } else if (distance > 180) {
            // Too far, get closer
            this.moveToTarget(player, obstacles);
        } else {
            // Good distance, strafe
            this.strafe(player, obstacles);
        }
        
        // Primary focus on shooting - return bullets
        return this.tryShoot(player, obstacles);
    }

    search(obstacles) {
        if (!this.lastSeen) {
            this.setState('patrol');
            return;
        }
        
        this.searchTime++;
        if (this.searchTime > this.maxSearchTime) {
            this.setState('patrol');
            this.searchTime = 0;
            return;
        }
        
        // Move towards last known position
        const distance = Physics.getDistance(this.tank, this.lastSeen);
        if (distance > 50) {
            this.moveToTarget(this.lastSeen, obstacles);
        } else {
            // Search in a circular pattern
            const searchAngle = (this.searchTime / 30) * Math.PI * 2;
            const searchRadius = 60;
            const searchTarget = {
                x: this.lastSeen.x + Math.cos(searchAngle) * searchRadius,
                y: this.lastSeen.y + Math.sin(searchAngle) * searchRadius
            };
            this.moveToTarget(searchTarget, obstacles);
        }
    }

    flee(player, obstacles) {
        this.moveAwayFrom(player, obstacles);
        
        // Still try to shoot while fleeing if opportunity arises
        if (Math.random() < 0.3) {
            return this.tryShoot(player, obstacles);
        }
        return null;
    }

    moveToTarget(target, obstacles) {
        // Simple pathfinding or direct movement
        if (this.path.length === 0 || this.pathIndex >= this.path.length) {
            // Try direct movement first
            if (Physics.checkLineOfSight(this.tank, target, obstacles)) {
                this.moveDirectlyTo(target);
            } else {
                // Need pathfinding
                this.path = Physics.findPath(this.tank, target, obstacles);
                this.pathIndex = 0;
            }
        }
        
        if (this.path.length > 0 && this.pathIndex < this.path.length) {
            const nextPoint = this.path[this.pathIndex];
            const distance = Physics.getDistance(this.tank, nextPoint);
            
            if (distance < 15) {
                this.pathIndex++;
            } else {
                this.moveDirectlyTo(nextPoint);
            }
        }
    }

    moveDirectlyTo(target) {
        const angleToTarget = Physics.getAngle(this.tank, target);
        const angleDiff = Physics.normalizeAngle(angleToTarget - this.tank.angle);
        
        // Rotate towards target
        if (Math.abs(angleDiff) > 0.1) {
            if (angleDiff > 0) {
                this.tank.rotateRight();
            } else {
                this.tank.rotateLeft();
            }
        }
        
        // Move forward if roughly facing target
        if (Math.abs(angleDiff) < Math.PI / 4) {
            this.tank.moveForward();
        }
    }

    moveAwayFrom(target, obstacles) {
        const angleFromTarget = Physics.getAngle(target, this.tank);
        const fleeTarget = {
            x: this.tank.x + Math.cos(angleFromTarget) * 100,
            y: this.tank.y + Math.sin(angleFromTarget) * 100
        };
        
        // Clamp to bounds
        fleeTarget.x = Math.max(50, Math.min(1150, fleeTarget.x));
        fleeTarget.y = Math.max(50, Math.min(750, fleeTarget.y));
        
        this.moveToTarget(fleeTarget, obstacles);
    }

    positionForShot(player, obstacles) {
        // Try to get perpendicular to player's movement
        const angleToPlayer = Physics.getAngle(this.tank, player);
        const perpendicularAngle1 = angleToPlayer + Math.PI / 2;
        const perpendicularAngle2 = angleToPlayer - Math.PI / 2;
        
        const distance = 120; // Preferred shooting distance
        const pos1 = {
            x: player.x + Math.cos(perpendicularAngle1) * distance,
            y: player.y + Math.sin(perpendicularAngle1) * distance
        };
        const pos2 = {
            x: player.x + Math.cos(perpendicularAngle2) * distance,
            y: player.y + Math.sin(perpendicularAngle2) * distance
        };
        
        // Choose position with clear line of sight
        const target = Physics.checkLineOfSight(this.tank, pos1, obstacles) ? pos1 : pos2;
        
        // Clamp to bounds
        target.x = Math.max(50, Math.min(1150, target.x));
        target.y = Math.max(50, Math.min(750, target.y));
        
        this.moveToTarget(target, obstacles);
    }

    strafe(player, obstacles) {
        // Move perpendicular to player position
        const angleToPlayer = Physics.getAngle(this.tank, player);
        const strafeAngle = angleToPlayer + (Math.random() > 0.5 ? Math.PI / 2 : -Math.PI / 2);
        
        const strafeTarget = {
            x: this.tank.x + Math.cos(strafeAngle) * 30,
            y: this.tank.y + Math.sin(strafeAngle) * 30
        };
        
        // Clamp to bounds
        strafeTarget.x = Math.max(50, Math.min(1150, strafeTarget.x));
        strafeTarget.y = Math.max(50, Math.min(750, strafeTarget.y));
        
        this.moveToTarget(strafeTarget, obstacles);
    }

    tryShoot(player, obstacles) {
        if (!this.tank.canShoot()) return null;
        
        const now = Date.now();
        if (now - this.lastShot < this.shootCooldown) return null;
        
        // Check if we have a clear shot
        if (!Physics.checkLineOfSight(this.tank, player, obstacles)) return null;
        
        const distance = Physics.getDistance(this.tank, player);
        const maxShootDistance = 200;
        
        if (distance > maxShootDistance) return null;
        
        // Aim at player with some inaccuracy
        const angleToPlayer = Physics.getAngle(this.tank, player);
        const inaccuracy = (1 - this.accuracy) * (Math.random() - 0.5) * Math.PI / 4;
        
        // Predict player movement
        const prediction = this.predictPlayerPosition(player, distance);
        const predictedAngle = Physics.getAngle(this.tank, prediction);
        
        this.tank.turretAngle = predictedAngle + inaccuracy;
        
        this.lastShot = now;
        return this.tank.shoot();
    }

    predictPlayerPosition(player, distance) {
        // Simple prediction based on player velocity
        const bulletSpeed = 8;
        const timeToTarget = distance / bulletSpeed;
        
        return {
            x: player.x + player.vx * timeToTarget,
            y: player.y + player.vy * timeToTarget
        };
    }

    avoidCollisions(otherTanks) {
        for (const otherTank of otherTanks) {
            if (otherTank === this.tank || !otherTank.alive) continue;
            
            const distance = Physics.getDistance(this.tank, otherTank);
            if (distance < 60) {
                // Too close, move away
                const avoidAngle = Physics.getAngle(otherTank, this.tank);
                this.tank.vx += Math.cos(avoidAngle) * 0.5;
                this.tank.vy += Math.sin(avoidAngle) * 0.5;
            }
        }
    }
}

// Different AI behavior types
class ChaserAI extends AIController {
    constructor(tank, difficulty) {
        super(tank, difficulty);
        this.aggressionLevel = Math.min(1, this.aggressionLevel + 0.3);
        this.preferredDistance = 80;
    }

    updateState(player, obstacles) {
        const canSeePlayer = this.canSeeTarget(player, obstacles);
        const distanceToPlayer = Physics.getDistance(this.tank, player);
        
        if (canSeePlayer && !player.isStealthed()) {
            this.lastSeen = { x: player.x, y: player.y, time: Date.now() };
            this.setState(distanceToPlayer < 100 ? 'attack' : 'chase');
        } else if (this.lastSeen && Date.now() - this.lastSeen.time < 8000) {
            this.setState('search');
        } else {
            this.setState('patrol');
        }
    }
}

class SniperAI extends AIController {
    constructor(tank, difficulty) {
        super(tank, difficulty);
        this.accuracy = Math.min(1, this.accuracy + 0.2);
        this.shootCooldown *= 0.7; // Faster shooting
        this.preferredDistance = 200;
        this.tank.shootCooldown *= 0.8; // Tank shoots faster too
    }

    attack(player, obstacles) {
        // Maintain distance and focus on accuracy
        const distance = Physics.getDistance(this.tank, player);
        
        if (distance < 150) {
            this.moveAwayFrom(player, obstacles);
        } else if (distance > 250) {
            this.moveToTarget(player, obstacles);
        } else {
            // Good sniping distance, just aim and shoot
            const angleToPlayer = Physics.getAngle(this.tank, player);
            this.tank.turretAngle = angleToPlayer;
        }
        
        this.tryShoot(player, obstacles);
    }
}

class PatrolAI extends AIController {
    constructor(tank, difficulty) {
        super(tank, difficulty);
        this.reactionTime *= 1.5; // Slower to react
        this.patrolRadius = 150;
        this.homePosition = { x: tank.x, y: tank.y };
    }

    updateState(player, obstacles) {
        const canSeePlayer = this.canSeeTarget(player, obstacles);
        const distanceToPlayer = Physics.getDistance(this.tank, player);
        const distanceFromHome = Physics.getDistance(this.tank, this.homePosition);
        
        if (canSeePlayer && !player.isStealthed() && distanceFromHome < this.patrolRadius) {
            this.lastSeen = { x: player.x, y: player.y, time: Date.now() };
            this.setState(distanceToPlayer < 120 ? 'attack' : 'chase');
        } else if (distanceFromHome > this.patrolRadius) {
            // Return to patrol area
            this.setState('patrol');
            this.patrolPoints = [this.homePosition];
            this.currentPatrolIndex = 0;
        } else {
            this.setState('patrol');
        }
    }
}
