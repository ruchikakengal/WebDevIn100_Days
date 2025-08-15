class Physics {
    constructor() {
        this.gravity = 800; // pixels per second squared
        this.terminalVelocity = 500;
        
        console.log('Physics system initialized');
    }
    
    // AABB Collision Detection
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    // Collision Response
    resolveCollision(entity, platform) {
        // Calculate overlap
        const overlapX = Math.min(
            (entity.x + entity.width) - platform.x,
            (platform.x + platform.width) - entity.x
        );
        
        const overlapY = Math.min(
            (entity.y + entity.height) - platform.y,
            (platform.y + platform.height) - entity.y
        );
        
        // Resolve collision based on smallest overlap
        if (overlapX < overlapY) {
            // Horizontal collision
            if (entity.x < platform.x) {
                entity.x = platform.x - entity.width;
            } else {
                entity.x = platform.x + platform.width;
            }
            
            if (entity.velocityX !== undefined) {
                entity.velocityX = 0;
            }
        } else {
            // Vertical collision
            if (entity.y < platform.y) {
                // Landing on top of platform
                entity.y = platform.y - entity.height;
                if (entity.velocityY !== undefined && entity.velocityY > 0) {
                    entity.velocityY = 0;
                    entity.onGround = true;
                }
            } else {
                // Hitting platform from below
                entity.y = platform.y + platform.height;
                if (entity.velocityY !== undefined && entity.velocityY < 0) {
                    entity.velocityY = 0;
                }
            }
        }
    }
    
    // Apply physics to an entity
    applyPhysics(entity, deltaTime) {
        if (!entity.velocityY === undefined) return;
        
        // Apply gravity
        entity.velocityY += this.gravity * deltaTime;
        
        // Limit to terminal velocity
        entity.velocityY = Math.min(entity.velocityY, this.terminalVelocity);
        
        // Update position
        entity.x += (entity.velocityX || 0) * deltaTime;
        entity.y += entity.velocityY * deltaTime;
    }
    
    // Check if point is inside rectangle
    pointInRect(pointX, pointY, rect) {
        return pointX >= rect.x && 
               pointX <= rect.x + rect.width &&
               pointY >= rect.y && 
               pointY <= rect.y + rect.height;
    }
    
    // Calculate distance between two points
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // Check if entity is on ground (touching any platform from above)
    isOnGround(entity, platforms) {
        // Check a small area below the entity
        const checkRect = {
            x: entity.x + 2,
            y: entity.y + entity.height,
            width: entity.width - 4,
            height: 5
        };
        
        return platforms.some(platform => {
            return this.checkCollision(checkRect, platform) &&
                   entity.velocityY >= 0;
        });
    }
    
    // Get the platform an entity is standing on
    getGroundPlatform(entity, platforms) {
        const checkRect = {
            x: entity.x + 2,
            y: entity.y + entity.height,
            width: entity.width - 4,
            height: 5
        };
        
        return platforms.find(platform => {
            return this.checkCollision(checkRect, platform) &&
                   entity.velocityY >= 0;
        });
    }
    
    // Check if entity will collide with platforms in next frame
    willCollide(entity, platforms, deltaTime) {
        const futureX = entity.x + (entity.velocityX || 0) * deltaTime;
        const futureY = entity.y + (entity.velocityY || 0) * deltaTime;
        
        const futureRect = {
            x: futureX,
            y: futureY,
            width: entity.width,
            height: entity.height
        };
        
        return platforms.find(platform => 
            this.checkCollision(futureRect, platform)
        );
    }
    
    // Clamp value between min and max
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    // Linear interpolation
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
}
