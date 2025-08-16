class LevelManager {
    constructor() {
        this.currentLevel = 1;
        this.levels = this.createLevels();
        
        console.log('Level Manager initialized');
    }
    
    createLevels() {
        return {
            1: this.createLevel1(),
            2: this.createLevel2(),
            3: this.createLevel3()
        };
    }
    
    getLevel(levelNumber) {
        return this.levels[levelNumber] || this.levels[1];
    }
    
    getCurrentLevel() {
        return this.getLevel(this.currentLevel);
    }
    
    createLevel1() {
        return {
            width: 3200,
            height: 400,
            platforms: [
                // Ground platforms
                { x: 0, y: 360, width: 800, height: 40, type: 'ground' },
                { x: 800, y: 360, width: 200, height: 40, type: 'ground' },
                { x: 1200, y: 360, width: 600, height: 40, type: 'ground' },
                { x: 2000, y: 360, width: 1200, height: 40, type: 'ground' },
                
                // Floating platforms
                { x: 400, y: 280, width: 96, height: 16, type: 'platform' },
                { x: 600, y: 200, width: 96, height: 16, type: 'platform' },
                { x: 1000, y: 280, width: 128, height: 16, type: 'platform' },
                { x: 1400, y: 240, width: 96, height: 16, type: 'platform' },
                { x: 1600, y: 160, width: 128, height: 16, type: 'platform' },
                { x: 2200, y: 280, width: 96, height: 16, type: 'platform' },
                { x: 2400, y: 200, width: 128, height: 16, type: 'platform' },
                
                // Steps/stairs
                { x: 2800, y: 320, width: 64, height: 80, type: 'ground' },
                { x: 2864, y: 280, width: 64, height: 120, type: 'ground' },
                { x: 2928, y: 240, width: 64, height: 160, type: 'ground' },
                { x: 2992, y: 200, width: 64, height: 200, type: 'ground' }
            ],
            enemies: [
                { x: 300, y: 320, type: 'goomba' },
                { x: 500, y: 320, type: 'goomba' },
                { x: 900, y: 320, type: 'goomba' },
                { x: 1100, y: 240, type: 'goomba' },
                { x: 1500, y: 320, type: 'goomba' },
                { x: 1800, y: 320, type: 'goomba' },
                { x: 2100, y: 320, type: 'goomba' },
                { x: 2300, y: 240, type: 'goomba' }
            ],
            collectibles: [
                // Coins
                { x: 250, y: 300, type: 'coin' },
                { x: 280, y: 300, type: 'coin' },
                { x: 310, y: 300, type: 'coin' },
                { x: 430, y: 240, type: 'coin' },
                { x: 460, y: 240, type: 'coin' },
                { x: 630, y: 160, type: 'coin' },
                { x: 660, y: 160, type: 'coin' },
                { x: 1030, y: 240, type: 'coin' },
                { x: 1430, y: 200, type: 'coin' },
                { x: 1630, y: 120, type: 'coin' },
                { x: 1660, y: 120, type: 'coin' },
                { x: 1690, y: 120, type: 'coin' },
                { x: 2230, y: 240, type: 'coin' },
                { x: 2430, y: 160, type: 'coin' },
                { x: 2460, y: 160, type: 'coin' },
                
                // Power-ups
                { x: 700, y: 320, type: 'powerup' },
                { x: 1300, y: 320, type: 'powerup' },
                { x: 2000, y: 320, type: 'powerup' }
            ],
            questionBlocks: [
                { x: 350, y: 280, contains: 'coin' },
                { x: 550, y: 240, contains: 'powerup' },
                { x: 1150, y: 200, contains: 'multiple_coins' },
                { x: 1750, y: 280, contains: 'coin' },
                { x: 2150, y: 240, contains: 'powerup' }
            ],
            flagpole: { x: 3100, y: 200 }
        };
    }
    
    createLevel2() {
        return {
            width: 4000,
            height: 400,
            platforms: [
                // More challenging platform layout
                { x: 0, y: 360, width: 300, height: 40, type: 'ground' },
                { x: 400, y: 360, width: 200, height: 40, type: 'ground' },
                { x: 700, y: 360, width: 300, height: 40, type: 'ground' },
                { x: 1100, y: 360, width: 200, height: 40, type: 'ground' },
                { x: 1400, y: 360, width: 400, height: 40, type: 'ground' },
                { x: 1900, y: 360, width: 300, height: 40, type: 'ground' },
                { x: 2300, y: 360, width: 400, height: 40, type: 'ground' },
                { x: 2800, y: 360, width: 200, height: 40, type: 'ground' },
                { x: 3100, y: 360, width: 900, height: 40, type: 'ground' },
                
                // Moving platforms (static for now)
                { x: 350, y: 280, width: 64, height: 16, type: 'platform' },
                { x: 650, y: 200, width: 64, height: 16, type: 'platform' },
                { x: 1050, y: 240, width: 64, height: 16, type: 'platform' },
                { x: 1350, y: 160, width: 96, height: 16, type: 'platform' },
                { x: 1850, y: 280, width: 64, height: 16, type: 'platform' },
                { x: 2250, y: 200, width: 64, height: 16, type: 'platform' },
                { x: 2750, y: 240, width: 64, height: 16, type: 'platform' },
                { x: 3050, y: 160, width: 64, height: 16, type: 'platform' },
                
                // Higher platforms
                { x: 800, y: 120, width: 128, height: 16, type: 'platform' },
                { x: 1500, y: 80, width: 128, height: 16, type: 'platform' },
                { x: 2400, y: 120, width: 128, height: 16, type: 'platform' }
            ],
            enemies: [
                { x: 150, y: 320, type: 'goomba' },
                { x: 250, y: 320, type: 'goomba' },
                { x: 500, y: 320, type: 'goomba' },
                { x: 800, y: 320, type: 'goomba' },
                { x: 950, y: 320, type: 'goomba' },
                { x: 1200, y: 320, type: 'goomba' },
                { x: 1600, y: 320, type: 'goomba' },
                { x: 1700, y: 320, type: 'goomba' },
                { x: 2000, y: 320, type: 'goomba' },
                { x: 2500, y: 320, type: 'goomba' },
                { x: 2900, y: 320, type: 'goomba' },
                { x: 3200, y: 320, type: 'goomba' }
            ],
            collectibles: [
                // Strategic coin placement
                { x: 100, y: 300, type: 'coin' },
                { x: 380, y: 240, type: 'coin' },
                { x: 410, y: 240, type: 'coin' },
                { x: 680, y: 160, type: 'coin' },
                { x: 830, y: 80, type: 'coin' },
                { x: 860, y: 80, type: 'coin' },
                { x: 890, y: 80, type: 'coin' },
                { x: 1080, y: 200, type: 'coin' },
                { x: 1380, y: 120, type: 'coin' },
                { x: 1530, y: 40, type: 'coin' },
                { x: 1560, y: 40, type: 'coin' },
                { x: 1590, y: 40, type: 'coin' },
                { x: 1880, y: 240, type: 'coin' },
                { x: 2280, y: 160, type: 'coin' },
                { x: 2430, y: 80, type: 'coin' },
                { x: 2460, y: 80, type: 'coin' },
                { x: 2490, y: 80, type: 'coin' },
                { x: 2780, y: 200, type: 'coin' },
                { x: 3080, y: 120, type: 'coin' },
                
                // Power-ups
                { x: 450, y: 320, type: 'powerup' },
                { x: 1250, y: 320, type: 'powerup' },
                { x: 2050, y: 320, type: 'powerup' },
                { x: 3300, y: 320, type: 'powerup' }
            ],
            questionBlocks: [
                { x: 200, y: 280, contains: 'coin' },
                { x: 600, y: 240, contains: 'powerup' },
                { x: 1000, y: 200, contains: 'multiple_coins' },
                { x: 1300, y: 120, contains: 'coin' },
                { x: 1800, y: 240, contains: 'powerup' },
                { x: 2200, y: 160, contains: 'coin' },
                { x: 2700, y: 200, contains: 'multiple_coins' },
                { x: 3000, y: 120, contains: 'powerup' }
            ],
            flagpole: { x: 3800, y: 200 }
        };
    }
    
    createLevel3() {
        return {
            width: 5000,
            height: 400,
            platforms: [
                // Expert level layout with gaps and challenges
                { x: 0, y: 360, width: 200, height: 40, type: 'ground' },
                { x: 300, y: 360, width: 150, height: 40, type: 'ground' },
                { x: 550, y: 360, width: 200, height: 40, type: 'ground' },
                { x: 850, y: 360, width: 150, height: 40, type: 'ground' },
                { x: 1100, y: 360, width: 200, height: 40, type: 'ground' },
                { x: 1400, y: 360, width: 150, height: 40, type: 'ground' },
                { x: 1650, y: 360, width: 300, height: 40, type: 'ground' },
                { x: 2050, y: 360, width: 150, height: 40, type: 'ground' },
                { x: 2300, y: 360, width: 200, height: 40, type: 'ground' },
                { x: 2600, y: 360, width: 150, height: 40, type: 'ground' },
                { x: 2850, y: 360, width: 300, height: 40, type: 'ground' },
                { x: 3250, y: 360, width: 150, height: 40, type: 'ground' },
                { x: 3500, y: 360, width: 200, height: 40, type: 'ground' },
                { x: 3800, y: 360, width: 1200, height: 40, type: 'ground' },
                
                // Complex platform arrangements
                { x: 250, y: 280, width: 48, height: 16, type: 'platform' },
                { x: 500, y: 200, width: 48, height: 16, type: 'platform' },
                { x: 800, y: 240, width: 48, height: 16, type: 'platform' },
                { x: 1050, y: 160, width: 48, height: 16, type: 'platform' },
                { x: 1350, y: 200, width: 48, height: 16, type: 'platform' },
                { x: 1600, y: 120, width: 64, height: 16, type: 'platform' },
                { x: 2000, y: 240, width: 48, height: 16, type: 'platform' },
                { x: 2250, y: 160, width: 48, height: 16, type: 'platform' },
                { x: 2550, y: 200, width: 48, height: 16, type: 'platform' },
                { x: 2800, y: 120, width: 64, height: 16, type: 'platform' },
                { x: 3200, y: 240, width: 48, height: 16, type: 'platform' },
                { x: 3450, y: 160, width: 48, height: 16, type: 'platform' },
                
                // Very high platforms for bonus areas
                { x: 400, y: 80, width: 96, height: 16, type: 'platform' },
                { x: 1200, y: 60, width: 128, height: 16, type: 'platform' },
                { x: 2100, y: 80, width: 96, height: 16, type: 'platform' },
                { x: 3600, y: 60, width: 128, height: 16, type: 'platform' }
            ],
            enemies: [
                { x: 100, y: 320, type: 'goomba' },
                { x: 180, y: 320, type: 'goomba' },
                { x: 380, y: 320, type: 'goomba' },
                { x: 430, y: 320, type: 'goomba' },
                { x: 650, y: 320, type: 'goomba' },
                { x: 720, y: 320, type: 'goomba' },
                { x: 920, y: 320, type: 'goomba' },
                { x: 980, y: 320, type: 'goomba' },
                { x: 1180, y: 320, type: 'goomba' },
                { x: 1260, y: 320, type: 'goomba' },
                { x: 1480, y: 320, type: 'goomba' },
                { x: 1530, y: 320, type: 'goomba' },
                { x: 1750, y: 320, type: 'goomba' },
                { x: 1850, y: 320, type: 'goomba' },
                { x: 1920, y: 320, type: 'goomba' },
                { x: 2130, y: 320, type: 'goomba' },
                { x: 2180, y: 320, type: 'goomba' },
                { x: 2380, y: 320, type: 'goomba' },
                { x: 2450, y: 320, type: 'goomba' },
                { x: 2680, y: 320, type: 'goomba' },
                { x: 2730, y: 320, type: 'goomba' },
                { x: 2950, y: 320, type: 'goomba' },
                { x: 3050, y: 320, type: 'goomba' },
                { x: 3120, y: 320, type: 'goomba' },
                { x: 3330, y: 320, type: 'goomba' },
                { x: 3380, y: 320, type: 'goomba' },
                { x: 3580, y: 320, type: 'goomba' },
                { x: 3650, y: 320, type: 'goomba' },
                { x: 3900, y: 320, type: 'goomba' },
                { x: 4100, y: 320, type: 'goomba' },
                { x: 4300, y: 320, type: 'goomba' },
                { x: 4500, y: 320, type: 'goomba' },
                { x: 4700, y: 320, type: 'goomba' }
            ],
            collectibles: [
                // Reward skilled platforming
                { x: 280, y: 240, type: 'coin' },
                { x: 430, y: 40, type: 'coin' },
                { x: 460, y: 40, type: 'coin' },
                { x: 490, y: 40, type: 'coin' },
                { x: 530, y: 160, type: 'coin' },
                { x: 830, y: 200, type: 'coin' },
                { x: 1080, y: 120, type: 'coin' },
                { x: 1230, y: 20, type: 'coin' },
                { x: 1260, y: 20, type: 'coin' },
                { x: 1290, y: 20, type: 'coin' },
                { x: 1320, y: 20, type: 'coin' },
                { x: 1380, y: 160, type: 'coin' },
                { x: 1630, y: 80, type: 'coin' },
                { x: 1660, y: 80, type: 'coin' },
                { x: 2030, y: 200, type: 'coin' },
                { x: 2130, y: 40, type: 'coin' },
                { x: 2160, y: 40, type: 'coin' },
                { x: 2190, y: 40, type: 'coin' },
                { x: 2280, y: 120, type: 'coin' },
                { x: 2580, y: 160, type: 'coin' },
                { x: 2830, y: 80, type: 'coin' },
                { x: 2860, y: 80, type: 'coin' },
                { x: 3230, y: 200, type: 'coin' },
                { x: 3480, y: 120, type: 'coin' },
                { x: 3630, y: 20, type: 'coin' },
                { x: 3660, y: 20, type: 'coin' },
                { x: 3690, y: 20, type: 'coin' },
                { x: 3720, y: 20, type: 'coin' },
                { x: 4000, y: 300, type: 'coin' },
                { x: 4200, y: 300, type: 'coin' },
                { x: 4400, y: 300, type: 'coin' },
                { x: 4600, y: 300, type: 'coin' },
                { x: 4800, y: 300, type: 'coin' },
                
                // Power-ups
                { x: 350, y: 320, type: 'powerup' },
                { x: 1150, y: 320, type: 'powerup' },
                { x: 2350, y: 320, type: 'powerup' },
                { x: 3550, y: 320, type: 'powerup' },
                { x: 4750, y: 320, type: 'powerup' }
            ],
            questionBlocks: [
                { x: 150, y: 280, contains: 'multiple_coins' },
                { x: 450, y: 120, contains: 'powerup' },
                { x: 750, y: 200, contains: 'coin' },
                { x: 1000, y: 120, contains: 'multiple_coins' },
                { x: 1300, y: 160, contains: 'powerup' },
                { x: 1950, y: 200, contains: 'coin' },
                { x: 2200, y: 120, contains: 'multiple_coins' },
                { x: 2500, y: 160, contains: 'powerup' },
                { x: 3150, y: 200, contains: 'coin' },
                { x: 3400, y: 120, contains: 'multiple_coins' },
                { x: 4050, y: 280, contains: 'powerup' },
                { x: 4450, y: 280, contains: 'multiple_coins' }
            ],
            flagpole: { x: 4900, y: 200 }
        };
    }
}
