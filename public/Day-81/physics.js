class Physics {
    static checkCircleCollision(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (obj1.radius + obj2.radius);
    }

    static checkRectCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    static checkPointInRect(point, rect) {
        return point.x >= rect.x &&
               point.x <= rect.x + rect.width &&
               point.y >= rect.y &&
               point.y <= rect.y + rect.height;
    }

    static getDistance(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static getAngle(obj1, obj2) {
        return Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
    }

    static normalizeAngle(angle) {
        while (angle > Math.PI) angle -= 2 * Math.PI;
        while (angle < -Math.PI) angle += 2 * Math.PI;
        return angle;
    }

    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // Line-of-sight check between two points
    static checkLineOfSight(start, end, obstacles) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.floor(distance / 5); // Check every 5 pixels
        
        if (steps === 0) return true;
        
        const stepX = dx / steps;
        const stepY = dy / steps;
        
        for (let i = 0; i <= steps; i++) {
            const x = start.x + stepX * i;
            const y = start.y + stepY * i;
            
            for (const obstacle of obstacles) {
                if (obstacle.type === 'wall' && Physics.checkPointInRect({x, y}, obstacle)) {
                    return false;
                }
            }
        }
        
        return true;
    }

    // Handle bullet bouncing off walls
    static handleBulletBounce(bullet, wall) {
        // Calculate which side of the wall the bullet hit
        const bulletPrevX = bullet.x - bullet.vx;
        const bulletPrevY = bullet.y - bullet.vy;
        
        // Check which face was hit
        const leftEdge = wall.x;
        const rightEdge = wall.x + wall.width;
        const topEdge = wall.y;
        const bottomEdge = wall.y + wall.height;
        
        const hitLeft = bulletPrevX > rightEdge && bullet.x <= rightEdge;
        const hitRight = bulletPrevX < leftEdge && bullet.x >= leftEdge;
        const hitTop = bulletPrevY > bottomEdge && bullet.y <= bottomEdge;
        const hitBottom = bulletPrevY < topEdge && bullet.y >= topEdge;
        
        if (hitLeft || hitRight) {
            bullet.vx = -bullet.vx;
            bullet.x = hitLeft ? rightEdge + bullet.radius : leftEdge - bullet.radius;
        }
        
        if (hitTop || hitBottom) {
            bullet.vy = -bullet.vy;
            bullet.y = hitTop ? bottomEdge + bullet.radius : topEdge - bullet.radius;
        }
        
        bullet.bounces--;
    }

    // Pathfinding for AI (simple A* implementation)
    static findPath(start, end, obstacles, gridSize = 20) {
        const grid = this.createGrid(obstacles, gridSize);
        const startNode = this.getGridNode(start, gridSize);
        const endNode = this.getGridNode(end, gridSize);
        
        if (!grid[startNode.y] || !grid[startNode.y][startNode.x] ||
            !grid[endNode.y] || !grid[endNode.y][endNode.x]) {
            return []; // Invalid start or end position
        }
        
        const openSet = [startNode];
        const closedSet = new Set();
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();
        
        gScore.set(this.nodeKey(startNode), 0);
        fScore.set(this.nodeKey(startNode), this.heuristic(startNode, endNode));
        
        while (openSet.length > 0) {
            // Find node with lowest fScore
            let current = openSet[0];
            let currentIndex = 0;
            
            for (let i = 1; i < openSet.length; i++) {
                if (fScore.get(this.nodeKey(openSet[i])) < fScore.get(this.nodeKey(current))) {
                    current = openSet[i];
                    currentIndex = i;
                }
            }
            
            openSet.splice(currentIndex, 1);
            closedSet.add(this.nodeKey(current));
            
            if (current.x === endNode.x && current.y === endNode.y) {
                return this.reconstructPath(cameFrom, current, gridSize);
            }
            
            const neighbors = this.getNeighbors(current, grid);
            
            for (const neighbor of neighbors) {
                const neighborKey = this.nodeKey(neighbor);
                
                if (closedSet.has(neighborKey)) continue;
                
                const tentativeGScore = gScore.get(this.nodeKey(current)) + 1;
                
                if (!openSet.find(n => n.x === neighbor.x && n.y === neighbor.y)) {
                    openSet.push(neighbor);
                } else if (tentativeGScore >= gScore.get(neighborKey)) {
                    continue;
                }
                
                cameFrom.set(neighborKey, current);
                gScore.set(neighborKey, tentativeGScore);
                fScore.set(neighborKey, tentativeGScore + this.heuristic(neighbor, endNode));
            }
        }
        
        return []; // No path found
    }

    static createGrid(obstacles, gridSize) {
        const grid = [];
        const maxX = Math.ceil(1200 / gridSize);
        const maxY = Math.ceil(800 / gridSize);
        
        for (let y = 0; y < maxY; y++) {
            grid[y] = [];
            for (let x = 0; x < maxX; x++) {
                grid[y][x] = true; // Walkable by default
            }
        }
        
        // Mark obstacle areas as non-walkable
        for (const obstacle of obstacles) {
            if (obstacle.type === 'wall') {
                const startX = Math.floor(obstacle.x / gridSize);
                const endX = Math.ceil((obstacle.x + obstacle.width) / gridSize);
                const startY = Math.floor(obstacle.y / gridSize);
                const endY = Math.ceil((obstacle.y + obstacle.height) / gridSize);
                
                for (let y = startY; y < endY && y < maxY; y++) {
                    for (let x = startX; x < endX && x < maxX; x++) {
                        if (grid[y] && grid[y][x] !== undefined) {
                            grid[y][x] = false;
                        }
                    }
                }
            }
        }
        
        return grid;
    }

    static getGridNode(pos, gridSize) {
        return {
            x: Math.floor(pos.x / gridSize),
            y: Math.floor(pos.y / gridSize)
        };
    }

    static nodeKey(node) {
        return `${node.x},${node.y}`;
    }

    static heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    static getNeighbors(node, grid) {
        const neighbors = [];
        const directions = [
            {x: 0, y: -1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}
        ];
        
        for (const dir of directions) {
            const newX = node.x + dir.x;
            const newY = node.y + dir.y;
            
            if (newY >= 0 && newY < grid.length &&
                newX >= 0 && newX < grid[newY].length &&
                grid[newY][newX]) {
                neighbors.push({x: newX, y: newY});
            }
        }
        
        return neighbors;
    }

    static reconstructPath(cameFrom, current, gridSize) {
        const path = [];
        
        while (cameFrom.has(this.nodeKey(current))) {
            current = cameFrom.get(this.nodeKey(current));
            path.unshift({
                x: current.x * gridSize + gridSize / 2,
                y: current.y * gridSize + gridSize / 2
            });
        }
        
        return path;
    }
}
