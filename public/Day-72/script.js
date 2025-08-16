class AdvancedMechAssemblyGame {
    constructor() {
        this.parts = ['head', 'torso', 'left-arm', 'right-arm', 'left-leg', 'right-leg'];
        this.placedParts = new Set();
        this.draggedElement = null;
        this.touchStartPos = { x: 0, y: 0 };
        this.touchOffset = { x: 0, y: 0 };
        this.gameStats = {
            score: 0,
            streak: 0,
            bestStreak: 0,
            assemblyTime: 0,
            totalAssemblies: 0,
            perfectAssemblies: 0,
            efficiency: 100,
            energyLevel: 100,
            combatRating: 0,
            techLevel: 1,
            creditsEarned: 0,
            experiencePoints: 0,
            playerLevel: 1,
            playtime: 0
        };

        this.componentDatabase = {
            'head': {
                name: 'Neural Core MK-VII',
                type: 'Core Processing Unit',
                rarity: 'legendary',
                stats: { intelligence: 95, power: 85, compatibility: 98 },
                description: 'Advanced AI processing unit with quantum computing capabilities',
                powerConsumption: 45,
                weight: 25,
                armorRating: 75,
                techLevel: 7,
                manufacturer: 'CyberTech Industries',
                serialNumber: 'NC-7-' + Math.random().toString(36).substr(2, 6).toUpperCase()
            },
            'torso': {
                name: 'Fusion Core X1',
                type: 'Power Generation System',
                rarity: 'epic',
                stats: { power: 100, defense: 75, efficiency: 90 },
                description: 'Self-sustaining fusion reactor with emergency backup systems',
                powerOutput: 150,
                weight: 85,
                armorRating: 95,
                techLevel: 6,
                manufacturer: 'Quantum Dynamics',
                serialNumber: 'FC-X1-' + Math.random().toString(36).substr(2, 6).toUpperCase()
            },
            'left-arm': {
                name: 'Plasma Cannon L',
                type: 'Weapon System',
                rarity: 'rare',
                stats: { attack: 88, speed: 72, accuracy: 85 },
                description: 'High-energy plasma projectile system with targeting assist',
                powerConsumption: 35,
                weight: 45,
                range: 800,
                techLevel: 5,
                manufacturer: 'ArmaTech Solutions',
                serialNumber: 'PC-L-' + Math.random().toString(36).substr(2, 6).toUpperCase()
            },
            'right-arm': {
                name: 'Laser Cannon R',
                type: 'Weapon System',
                rarity: 'rare',
                stats: { attack: 92, accuracy: 95, penetration: 80 },
                description: 'Precision laser system with adaptive targeting matrix',
                powerConsumption: 40,
                weight: 48,
                range: 1200,
                techLevel: 5,
                manufacturer: 'ArmaTech Solutions',
                serialNumber: 'LC-R-' + Math.random().toString(36).substr(2, 6).toUpperCase()
            },
            'left-leg': {
                name: 'Stabilizer L-9',
                type: 'Mobility System',
                rarity: 'uncommon',
                stats: { mobility: 78, balance: 90, stability: 85 },
                description: 'Advanced gyroscopic stabilization with shock absorption',
                powerConsumption: 15,
                weight: 35,
                maxSpeed: 45,
                techLevel: 4,
                manufacturer: 'MobileTech Corp',
                serialNumber: 'SL-9-' + Math.random().toString(36).substr(2, 6).toUpperCase()
            },
            'right-leg': {
                name: 'Booster R-9',
                type: 'Mobility System',
                rarity: 'uncommon',
                stats: { speed: 85, agility: 82, acceleration: 88 },
                description: 'Jet-assisted mobility unit with enhanced maneuverability',
                powerConsumption: 20,
                weight: 38,
                maxSpeed: 55,
                techLevel: 4,
                manufacturer: 'MobileTech Corp',
                serialNumber: 'BR-9-' + Math.random().toString(36).substr(2, 6).toUpperCase()
            }
        };

        this.achievements = [
            { id: 'first_assembly', name: 'First Steps', description: 'Complete your first mech assembly', unlocked: false },
            { id: 'speed_demon', name: 'Speed Demon', description: 'Complete assembly in under 30 seconds', unlocked: false },
            { id: 'perfectionist', name: 'Perfectionist', description: 'Complete 5 perfect assemblies in a row', unlocked: false },
            { id: 'tech_master', name: 'Tech Master', description: 'Reach Tech Level 10', unlocked: false },
            { id: 'combat_ready', name: 'Combat Ready', description: 'Achieve Combat Rating of 1000+', unlocked: false },
            { id: 'efficiency_expert', name: 'Efficiency Expert', description: 'Maintain 95%+ efficiency for 10 assemblies', unlocked: false },
            { id: 'legendary_collector', name: 'Legendary Collector', description: 'Use all legendary components', unlocked: false }
        ];

        this.settings = {
            difficulty: 'hard',
            soundEnabled: true,
            sfxVolume: 75,
            animationSpeed: 100,
            autoSave: true,
            hintsEnabled: true,
            scannerEnabled: true,
            particleEffects: true,
            advancedStats: true,
            competitiveMode: false
        };
        this.timers = {
            assemblyStart: null,
            sessionStart: Date.now(),
            lastAction: Date.now(),
            afkTimer: null,
            autosaveTimer: null
        };
        this.particles = [];
        this.animations = new Map();
        this.soundEffects = new Map();
        this.features = {
            scanning: false,
            hints: false,
            inspector: false,
            leaderboard: false,
            settings: false,
            analysisMode: false,
            combatSimulation: false,
            blueprintMode: false
        };

        this.filters = {
            rarity: 'all',
            category: 'all',
            searchTerm: ''
        };

        this.currentMission = {
            objective: 'Assemble Combat Mech Unit',
            progress: 0,
            rewards: { credits: 500, xp: 100 },
            timeLimit: null,
            bonus: null
        };

        this.init();
    }

    init() {
        this.loadGameData();
        this.setupDragAndDrop();
        this.setupTouchEvents();
        this.addEventListeners();
        this.setupAdvancedSystems();
        this.initializeUI();
        this.startGameTimers();
        this.setupParticleSystem();
        this.initializeSoundSystem();
        this.setupKeyboardShortcuts();
        this.updateAllDisplays();
        this.checkAchievements();
    }

    setupAdvancedSystems() {
        this.setupComponentFilters();
        this.setupSettingsPanel();
        this.setupScanningSystems();
        this.setupHintSystem();
        this.setupComponentInspector();
        this.setupLeaderboard();
        this.setupMissionSystem();
        this.setupCombatSimulation();
    }

    initializeUI() {
        this.updateInventoryStats();
        this.updateMissionProgress();
        this.updateStatusBar();
        this.setupControlPanel();
    }

    startGameTimers() {
       
        setInterval(() => {
            this.gameStats.playtime += 1;
            this.updateStatusBar();
        }, 1000);

        if (this.settings.autoSave) {
            this.timers.autosaveTimer = setInterval(() => {
                this.saveGameData();
            }, 30000);
        }

        this.timers.afkTimer = setTimeout(() => {
            this.handleAFK();
        }, 300000);
    }

    setupParticleSystem() {
        const particleContainer = document.getElementById('particle-container');
        if (particleContainer) {
            setInterval(() => {
                this.updateParticles();
            }, 16); 
        }
    }

    initializeSoundSystem() {
        this.soundEffects.set('place', document.getElementById('place-sound'));
        this.soundEffects.set('error', document.getElementById('error-sound'));
        this.soundEffects.set('success', document.getElementById('success-sound'));
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 's':
                        e.preventDefault();
                        this.toggleScanning();
                        break;
                    case 'h':
                        e.preventDefault();
                        this.toggleHints();
                        break;
                    case 'i':
                        e.preventDefault();
                        this.toggleInspector();
                        break;
                    case 'l':
                        e.preventDefault();
                        this.toggleLeaderboard();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.reset();
                        break;
                }
            }

            switch (e.key) {
                case 'Escape':
                    this.closeAllPanels();
                    break;
                case 'F1':
                    e.preventDefault();
                    this.showHelp();
                    break;
                case 'F11':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
            }
        });
    }

    setupComponentFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.applyFilter(btn.dataset.filter);
                this.updateFilterUI();
            });
        });
    }

    setupSettingsPanel() {
        const settingsBtn = document.querySelector('[data-action="settings"]');
        const settingsPanel = document.getElementById('settings-panel');
        const closeBtn = settingsPanel?.querySelector('.close-settings');

        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.toggleSettings());
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.toggleSettings());
        }

        const difficultySelect = document.getElementById('difficulty-select');
        const sfxVolume = document.getElementById('sfx-volume');
        const animSpeed = document.getElementById('anim-speed');
        const autoSave = document.getElementById('auto-save');

        if (difficultySelect) {
            difficultySelect.addEventListener('change', (e) => {
                this.settings.difficulty = e.target.value;
                this.applyDifficultySettings();
            });
        }

        if (sfxVolume) {
            sfxVolume.addEventListener('input', (e) => {
                this.settings.sfxVolume = parseInt(e.target.value);
                this.updateSoundVolume();
            });
        }

        if (animSpeed) {
            animSpeed.addEventListener('input', (e) => {
                this.settings.animationSpeed = parseInt(e.target.value);
                this.updateAnimationSpeed();
            });
        }

        if (autoSave) {
            autoSave.addEventListener('change', (e) => {
                this.settings.autoSave = e.target.checked;
                this.updateAutoSave();
            });
        }
    }

    setupScanningSystems() {
        const scanBtn = document.querySelector('[data-action="scan"]');
        if (scanBtn) {
            scanBtn.addEventListener('click', () => this.toggleScanning());
        }
    }

    setupHintSystem() {
        const hintBtn = document.querySelector('[data-action="hints"]');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.toggleHints());
        }
    }

    setupComponentInspector() {
        const inspectorBtn = document.querySelector('[data-action="inspect"]');
        if (inspectorBtn) {
            inspectorBtn.addEventListener('click', () => this.toggleInspector());
        }

        document.querySelectorAll('.robot-part').forEach(part => {
            part.addEventListener('mouseenter', (e) => {
                if (this.features.inspector) {
                    this.inspectComponent(e.target.dataset.part);
                }
            });
        });
    }

    setupLeaderboard() {
        const leaderboardBtn = document.querySelector('[data-action="leaderboard"]');
        if (leaderboardBtn) {
            leaderboardBtn.addEventListener('click', () => this.toggleLeaderboard());
        }
    }

    setupMissionSystem() {
        this.updateMissionProgress();
    }

    setupCombatSimulation() {
        this.combatModifiers = {
            environment: 'standard',
            enemyType: 'standard',
            weatherConditions: 'clear',
            terrainType: 'flat'
        };
    }

    setupControlPanel() {
        const controlBtns = document.querySelectorAll('.control-btn');
        controlBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleControlAction(action, btn);
            });
        });
    }

    setupDragAndDrop() {
        const robotParts = document.querySelectorAll('.robot-part');
        robotParts.forEach(part => {
            part.addEventListener('dragstart', this.handleDragStart.bind(this));
            part.addEventListener('dragend', this.handleDragEnd.bind(this));
        });

        const dropZones = document.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', this.handleDragOver.bind(this));
            zone.addEventListener('dragenter', this.handleDragEnter.bind(this));
            zone.addEventListener('dragleave', this.handleDragLeave.bind(this));
            zone.addEventListener('drop', this.handleDrop.bind(this));
        });
    }

    setupTouchEvents() {
        const robotParts = document.querySelectorAll('.robot-part');
        robotParts.forEach(part => {
            part.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
            part.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
            part.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        });
    }

    addEventListeners() {
        document.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });
    }

    handleDragStart(e) {
        this.draggedElement = e.currentTarget;
        e.currentTarget.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.currentTarget.dataset.part);
        e.dataTransfer.effectAllowed = 'move';
    }

    handleDragEnd(e) {
        e.currentTarget.classList.remove('dragging');
        this.draggedElement = null;

        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('drag-over', 'invalid-drag');
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDragEnter(e) {
        e.preventDefault();
        const dropZone = e.currentTarget;
        const draggedPartType = this.draggedElement?.dataset.part;
        const acceptedType = dropZone.dataset.accepts;

        if (draggedPartType === acceptedType && !dropZone.classList.contains('filled')) {
            dropZone.classList.add('drag-over');
            dropZone.classList.remove('invalid-drag');
        } else {
            dropZone.classList.add('invalid-drag');
            dropZone.classList.remove('drag-over');
        }
    }

    handleDragLeave(e) {
        const dropZone = e.currentTarget;

        if (!dropZone.contains(e.relatedTarget)) {
            dropZone.classList.remove('drag-over', 'invalid-drag');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        const dropZone = e.currentTarget;
        const draggedPartType = e.dataTransfer.getData('text/plain');
        const acceptedType = dropZone.dataset.accepts;

        dropZone.classList.remove('drag-over', 'invalid-drag');

        if (draggedPartType === acceptedType && !dropZone.classList.contains('filled')) {
            this.placePart(this.draggedElement, dropZone);
        } else {
            this.showFeedback('Incompatible component! Check assembly manual.', 'error');
            this.animateRejection(dropZone);
        }
    }

    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const part = e.currentTarget;
        this.draggedElement = part;
        part.classList.add('dragging');
        this.touchStartPos = { x: touch.clientX, y: touch.clientY };
        const rect = part.getBoundingClientRect();
        this.touchOffset = {
            x: touch.clientX - rect.left - rect.width / 2,
            y: touch.clientY - rect.top - rect.height / 2
        };
    }

    handleTouchMove(e) {
        e.preventDefault();
        if (!this.draggedElement) return;

        const touch = e.touches[0];
        const part = this.draggedElement;
        part.style.position = 'fixed';
        part.style.left = (touch.clientX - this.touchOffset.x) + 'px';
        part.style.top = (touch.clientY - this.touchOffset.y) + 'px';
        part.style.zIndex = '1000';
        part.style.pointerEvents = 'none';
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropZone = elementBelow?.closest('.drop-zone');
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('drag-over', 'invalid-drag');
        });

        if (dropZone) {
            const draggedPartType = this.draggedElement.dataset.part;
            const acceptedType = dropZone.dataset.accepts;

            if (draggedPartType === acceptedType && !dropZone.classList.contains('filled')) {
                dropZone.classList.add('drag-over');
            } else {
                dropZone.classList.add('invalid-drag');
            }
        }
    }

    handleTouchEnd(e) {
        e.preventDefault();
        if (!this.draggedElement) return;

        const touch = e.changedTouches[0];
        const part = this.draggedElement;
        part.style.position = '';
        part.style.left = '';
        part.style.top = '';
        part.style.zIndex = '';
        part.style.pointerEvents = '';
        part.classList.remove('dragging');

        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropZone = elementBelow?.closest('.drop-zone');

        if (dropZone) {
            const draggedPartType = this.draggedElement.dataset.part;
            const acceptedType = dropZone.dataset.accepts;

            if (draggedPartType === acceptedType && !dropZone.classList.contains('filled')) {
                this.placePart(this.draggedElement, dropZone);
            } else {
                this.showFeedback('Incompatible component! Check assembly manual.', 'error');
                this.animateRejection(dropZone);
            }
        }

        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('drag-over', 'invalid-drag');
        });

        this.draggedElement = null;
    }

    placePart(partElement, dropZone) {
        const partType = partElement.dataset.part;
        const startTime = this.timers.assemblyStart || Date.now();

        if (!this.timers.assemblyStart) {
            this.timers.assemblyStart = Date.now();
        }

        const partSVG = partElement.querySelector('svg').cloneNode(true);
        dropZone.innerHTML = '';
        dropZone.appendChild(partSVG);
        dropZone.classList.add('filled');
        partElement.classList.add('placed');
        this.placedParts.add(partType);
        const placementScore = this.calculatePlacementScore(partType, Date.now() - startTime);
        this.gameStats.score += placementScore;
        this.gameStats.streak++;
        this.updateProgress();
        this.updateInventoryStats();
        this.updateStatusBar();
        this.updateMissionProgress();
        const component = this.componentDatabase[partType];
        this.showFeedback(`${component.name} installed! +${placementScore} points`, 'success');
        this.playSound('place');
        this.createPlacementParticles(dropZone);
        this.animatePlacement(dropZone);
        this.analyzeComponentCompatibility();
        this.updateCombatRating();
        this.checkAchievements();

        if (this.placedParts.size === this.parts.length) {
            setTimeout(() => {
                this.completeAssembly();
            }, 500);
        }
    }

    calculatePlacementScore(partType, timeTaken) {
        const component = this.componentDatabase[partType];
        let baseScore = 100;

        const rarityBonus = {
            'common': 1.0,
            'uncommon': 1.2,
            'rare': 1.5,
            'epic': 2.0,
            'legendary': 3.0
        };

        baseScore *= rarityBonus[component.rarity] || 1.0;

        if (timeTaken < 5000) baseScore *= 1.5;
        else if (timeTaken < 10000) baseScore *= 1.2;

        const difficultyMultiplier = {
            'easy': 0.8,
            'normal': 1.0,
            'hard': 1.3,
            'nightmare': 1.7
        };

        baseScore *= difficultyMultiplier[this.settings.difficulty] || 1.0;

        if (this.gameStats.streak > 5) baseScore *= 1.1;
        if (this.gameStats.streak > 10) baseScore *= 1.2;

        return Math.round(baseScore);
    }

    analyzeComponentCompatibility() {
        let compatibility = 100;
        const placedComponents = Array.from(this.placedParts).map(part => this.componentDatabase[part]);
        const totalPowerConsumption = placedComponents.reduce((sum, comp) => sum + (comp.powerConsumption || 0), 0);
        const powerOutput = placedComponents.find(comp => comp.powerOutput)?.powerOutput || 0;

        if (totalPowerConsumption > powerOutput) {
            compatibility -= 20;
        }

        const totalWeight = placedComponents.reduce((sum, comp) => sum + (comp.weight || 0), 0);
        if (totalWeight > 200) compatibility -= 10;

        const techLevels = placedComponents.map(comp => comp.techLevel || 1);
        const maxTechLevel = Math.max(...techLevels);
        const minTechLevel = Math.min(...techLevels);

        if (maxTechLevel - minTechLevel > 3) {
            compatibility -= 15;
        }

        const compatElement = document.getElementById('compatibility');
        if (compatElement) {
            compatElement.textContent = compatibility + '%';
            compatElement.style.color = compatibility > 80 ? '#00FF88' : compatibility > 60 ? '#FFD700' : '#FF4444';
        }

        return compatibility;
    }

    updateCombatRating() {
        const placedComponents = Array.from(this.placedParts).map(part => this.componentDatabase[part]);
        let rating = 0;

        placedComponents.forEach(comp => {
            Object.values(comp.stats).forEach(stat => rating += stat);

            const rarityBonus = {
                'common': 50,
                'uncommon': 100,
                'rare': 200,
                'epic': 400,
                'legendary': 800
            };
            rating += rarityBonus[comp.rarity] || 0;

            rating += (comp.techLevel || 1) * 50;
        });
        if (this.hasWeaponSynergy()) rating *= 1.2;
        if (this.hasMobilitySynergy()) rating *= 1.15;
        if (this.hasPowerSynergy()) rating *= 1.1;

        this.gameStats.combatRating = Math.round(rating);
    }

    hasWeaponSynergy() {
        const weapons = ['left-arm', 'right-arm'].filter(part => this.placedParts.has(part));
        if (weapons.length === 2) {
            const leftWeapon = this.componentDatabase['left-arm'];
            const rightWeapon = this.componentDatabase['right-arm'];
            return leftWeapon.manufacturer === rightWeapon.manufacturer;
        }
        return false;
    }

    hasMobilitySynergy() {
        const mobility = ['left-leg', 'right-leg'].filter(part => this.placedParts.has(part));
        if (mobility.length === 2) {
            const leftLeg = this.componentDatabase['left-leg'];
            const rightLeg = this.componentDatabase['right-leg'];
            return leftLeg.manufacturer === rightLeg.manufacturer;
        }
        return false;
    }

    hasPowerSynergy() {
        return this.placedParts.has('head') && this.placedParts.has('torso');
    }

    createPlacementParticles(dropZone) {
        if (!this.settings.particleEffects) return;

        const rect = dropZone.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 15; i++) {
            this.createParticle(centerX, centerY, 'energy');
        }
    }

    createParticle(x, y, type = 'default') {
        const particle = document.createElement('div');
        particle.className = `particle ${type}`;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';

        const container = document.getElementById('particle-container');
        if (container) {
            container.appendChild(particle);
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 100 + 50;
            const lifetime = Math.random() * 1000 + 500;

            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                {
                    transform: `translate(${Math.cos(angle) * speed}px, ${Math.sin(angle) * speed}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: lifetime,
                easing: 'ease-out'
            }).addEventListener('finish', () => {
                particle.remove();
            });
        }
    }

    updateParticles() {
        if (this.features.scanning) {
            this.createScanParticles();
        }

        if (this.gameStats.energyLevel > 80) {
            this.createEnergyParticles();
        }
    }

    createScanParticles() {
        const scanOverlay = document.getElementById('scan-overlay');
        if (scanOverlay && scanOverlay.classList.contains('active')) {
            const rect = scanOverlay.getBoundingClientRect();
            const x = Math.random() * rect.width;
            const y = Math.random() * rect.height;
            this.createParticle(x, y, 'spark');
        }
    }

    createEnergyParticles() {
        const powerCore = document.querySelector('[data-accepts="torso"]');
        if (powerCore && powerCore.classList.contains('filled')) {
            const rect = powerCore.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            this.createParticle(x, y, 'energy');
        }
    }

    playSound(soundName) {
        if (!this.settings.soundEnabled) return;

        const sound = this.soundEffects.get(soundName);
        if (sound) {
            sound.volume = this.settings.sfxVolume / 100;
            sound.currentTime = 0;
            sound.play().catch(e => console.log('Sound play failed:', e));
        }
    }

    toggleScanning() {
        this.features.scanning = !this.features.scanning;
        const scanOverlay = document.getElementById('scan-overlay');
        const scanBtn = document.querySelector('[data-action="scan"]');

        if (this.features.scanning) {
            scanOverlay?.classList.add('active');
            scanBtn?.classList.add('active');
            this.showFeedback('Component scanning activated', 'success');
            setTimeout(() => {
                this.features.scanning = false;
                scanOverlay?.classList.remove('active');
                scanBtn?.classList.remove('active');
            }, 5000);
        } else {
            scanOverlay?.classList.remove('active');
            scanBtn?.classList.remove('active');
        }
    }

    toggleHints() {
        this.features.hints = !this.features.hints;
        const hintBtn = document.querySelector('[data-action="hints"]');

        if (this.features.hints) {
            hintBtn?.classList.add('active');
            this.showNextHint();
            this.showFeedback('Assembly hints enabled', 'success');
        } else {
            hintBtn?.classList.remove('active');
            this.hideHints();
            this.showFeedback('Assembly hints disabled', 'success');
        }
    }

    showNextHint() {
        if (!this.features.hints) return;

        const unplacedParts = this.parts.filter(part => !this.placedParts.has(part));
        if (unplacedParts.length === 0) return;

        const nextPart = unplacedParts[0];
        const dropZone = document.querySelector(`[data-accepts="${nextPart}"]`);
        const hintOverlay = document.getElementById('hint-overlay');
        const hintText = document.querySelector('.hint-text');

        if (dropZone && hintOverlay && hintText) {
            const rect = dropZone.getBoundingClientRect();
            hintOverlay.style.left = rect.left + rect.width / 2 - 100 + 'px';
            hintOverlay.style.top = rect.top - 60 + 'px';

            const component = this.componentDatabase[nextPart];
            hintText.textContent = `Place ${component.name} here`;
            hintOverlay.classList.add('active');

            setTimeout(() => {
                hintOverlay.classList.remove('active');
            }, 3000);
        }
    }

    hideHints() {
        const hintOverlay = document.getElementById('hint-overlay');
        hintOverlay?.classList.remove('active');
    }

    updateProgress() {
        const progressPercent = Math.round((this.placedParts.size / this.parts.length) * 100);
        const progressElement = document.getElementById('progress-percent');
        if (progressElement) {
            progressElement.textContent = progressPercent + '%';
        }
    }

    animatePlacement(dropZone) {
        dropZone.style.animation = 'none';
        dropZone.offsetHeight; 
        dropZone.style.animation = 'bounceIn 0.6s ease';

        setTimeout(() => {
            dropZone.style.animation = '';
        }, 600);
    }

    animateRejection(dropZone) {
        dropZone.style.animation = 'none';
        dropZone.offsetHeight; 
        dropZone.style.animation = 'shake 0.5s ease-in-out';

        setTimeout(() => {
            dropZone.style.animation = '';
        }, 500);
    }

    showFeedback(message, type) {
        const feedbackElement = document.getElementById('feedback-message');
        feedbackElement.textContent = message;
        feedbackElement.className = `feedback-message ${type} show`;

        setTimeout(() => {
            feedbackElement.classList.remove('show');
        }, 2000);
    }

    showSuccessMessage() {
        const successMessage = document.getElementById('success-message');
        successMessage.classList.add('show');
        this.createConfetti();
    }

    createConfetti() {
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
        const confettiContainer = document.body;

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = '50%';
            confettiContainer.appendChild(confetti);
            const fallDuration = Math.random() * 3 + 2;
            const rotation = Math.random() * 360;

            confetti.animate([
                {
                    transform: `translateY(0px) rotate(0deg)`,
                    opacity: 1
                },
                {
                    transform: `translateY(${window.innerHeight + 20}px) rotate(${rotation}deg)`,
                    opacity: 0
                }
            ], {
                duration: fallDuration * 1000,
                easing: 'linear'
            }).addEventListener('finish', () => {
                confetti.remove();
            });
        }
    }

    reset() {
        this.placedParts.clear();
        this.updateProgress();

        document.querySelectorAll('.robot-part').forEach(part => {
            part.classList.remove('placed');
        });

        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('filled', 'drag-over', 'invalid-drag');
            const acceptedType = zone.dataset.accepts;
            const placeholder = this.createZonePlaceholder(acceptedType);
            zone.innerHTML = '';
            zone.appendChild(placeholder);
        });

        document.getElementById('success-message').classList.remove('show');
    }

    createZonePlaceholder(partType) {
        const placeholder = document.createElement('div');
        placeholder.className = 'zone-placeholder';
        const icon = document.createElement('i');
        const span = document.createElement('span');

        switch (partType) {
            case 'head':
                icon.className = 'fas fa-microchip';
                span.textContent = 'Neural Core';
                break;
            case 'torso':
                icon.className = 'fas fa-battery-full';
                span.textContent = 'Power Core';
                break;
            case 'left-arm':
            case 'right-arm':
                icon.className = 'fas fa-rocket';
                span.textContent = partType === 'left-arm' ? 'Left Weapon Arm' : 'Right Weapon Arm';
                break;
            case 'left-leg':
            case 'right-leg':
                icon.className = 'fas fa-shield-alt';
                span.textContent = partType === 'left-leg' ? 'Left Support Unit' : 'Right Support Unit';
                break;
        }

        placeholder.appendChild(icon);
        placeholder.appendChild(span);

        return placeholder;
    }

    toggleInspector() {
        this.features.inspector = !this.features.inspector;
        const inspector = document.getElementById('component-inspector');
        const inspectorBtn = document.querySelector('[data-action="inspect"]');

        if (this.features.inspector) {
            inspector?.classList.add('active');
            inspectorBtn?.classList.add('active');
            this.showFeedback('Component inspector activated', 'success');
        } else {
            inspector?.classList.remove('active');
            inspectorBtn?.classList.remove('active');
        }
    }

    inspectComponent(partType) {
        if (!this.features.inspector) return;

        const component = this.componentDatabase[partType];
        const inspector = document.getElementById('component-inspector');

        if (component && inspector) {
            document.getElementById('inspect-type').textContent = component.type;
            document.getElementById('inspect-rarity').textContent = component.rarity;
            document.getElementById('inspect-compat').textContent = this.analyzeComponentCompatibility() + '%';

            const view3D = inspector.querySelector('.component-3d-view');
            view3D.innerHTML = `
                <div style="text-align: center; color: #00D4FF;">
                    <div style="font-weight: bold; margin-bottom: 10px;">${component.name}</div>
                    <div style="font-size: 0.8rem; opacity: 0.7;">${component.manufacturer}</div>
                    <div style="font-size: 0.7rem; margin-top: 5px;">S/N: ${component.serialNumber}</div>
                </div>
            `;
        }
    }

    toggleLeaderboard() {
        this.features.leaderboard = !this.features.leaderboard;
        const leaderboard = document.getElementById('leaderboard');
        const leaderboardBtn = document.querySelector('[data-action="leaderboard"]');

        if (this.features.leaderboard) {
            leaderboard?.classList.add('active');
            leaderboardBtn?.classList.add('active');
            this.updateLeaderboard();
        } else {
            leaderboard?.classList.remove('active');
            leaderboardBtn?.classList.remove('active');
        }
    }

    updateLeaderboard() {
        const playerScoreEl = document.getElementById('player-score');
        if (playerScoreEl) {
            playerScoreEl.textContent = this.gameStats.score.toLocaleString();
        }
    }

    toggleSettings() {
        this.features.settings = !this.features.settings;
        const settings = document.getElementById('settings-panel');

        if (this.features.settings) {
            settings?.classList.add('active');
        } else {
            settings?.classList.remove('active');
        }
    }

    handleControlAction(action, button) {
        button.classList.add('active');
        setTimeout(() => button.classList.remove('active'), 200);

        switch (action) {
            case 'scan':
                this.toggleScanning();
                break;
            case 'hints':
                this.toggleHints();
                break;
            case 'inspect':
                this.toggleInspector();
                break;
            case 'leaderboard':
                this.toggleLeaderboard();
                break;
            case 'settings':
                this.toggleSettings();
                break;
            case 'combat':
                this.runCombatSimulation();
                break;
            case 'blueprint':
                this.toggleBlueprintMode();
                break;
            case 'analyze':
                this.runFullAnalysis();
                break;
        }
    }

    runCombatSimulation() {
        if (this.placedParts.size === 0) {
            this.showFeedback('No components to simulate', 'error');
            return;
        }

        const simulation = this.calculateCombatEffectiveness();
        this.showFeedback(`Combat Simulation: ${simulation.rating}/10 - ${simulation.assessment}`, 'success');
        this.updateCombatRating();
    }

    calculateCombatEffectiveness() {
        const placedComponents = Array.from(this.placedParts).map(part => this.componentDatabase[part]);
        let effectiveness = 0;
        const weapons = placedComponents.filter(comp => comp.type === 'Weapon System');
        const weaponPower = weapons.reduce((sum, weapon) => sum + (weapon.stats.attack || 0), 0);
        effectiveness += weaponPower * 0.3;
        const armorRating = placedComponents.reduce((sum, comp) => sum + (comp.armorRating || 0), 0);
        effectiveness += armorRating * 0.2;
        const mobility = placedComponents.filter(comp => comp.type === 'Mobility System');
        const mobilityScore = mobility.reduce((sum, mob) => sum + (mob.stats.speed || 0), 0);
        effectiveness += mobilityScore * 0.25;

        const powerEfficiency = this.calculatePowerEfficiency();
        effectiveness += powerEfficiency * 0.25;

        const rating = Math.min(10, Math.round(effectiveness / 100));
        const assessments = ['Critical', 'Poor', 'Weak', 'Below Average', 'Average', 'Good', 'Strong', 'Excellent', 'Superior', 'Elite', 'Legendary'];

        return {
            rating,
            assessment: assessments[rating],
            effectiveness: Math.round(effectiveness)
        };
    }

    calculatePowerEfficiency() {
        const placedComponents = Array.from(this.placedParts).map(part => this.componentDatabase[part]);
        const totalConsumption = placedComponents.reduce((sum, comp) => sum + (comp.powerConsumption || 0), 0);
        const totalOutput = placedComponents.reduce((sum, comp) => sum + (comp.powerOutput || 0), 0);

        if (totalConsumption === 0) return 100;
        return Math.max(0, Math.min(100, (totalOutput / totalConsumption) * 100));
    }

    toggleBlueprintMode() {
        this.features.blueprintMode = !this.features.blueprintMode;
        const blueprintBtn = document.querySelector('[data-action="blueprint"]');

        if (this.features.blueprintMode) {
            blueprintBtn?.classList.add('active');
            this.showBlueprintOverlay();
            this.showFeedback('Blueprint mode activated', 'success');
        } else {
            blueprintBtn?.classList.remove('active');
            this.hideBlueprintOverlay();
        }
    }

    showBlueprintOverlay() {
        const assemblyArea = document.querySelector('.assembly-area');
        if (assemblyArea) {
            assemblyArea.style.background = 'linear-gradient(45deg, #001122 25%, transparent 25%), linear-gradient(-45deg, #001122 25%, transparent 25%)';
            assemblyArea.style.backgroundSize = '20px 20px';
            assemblyArea.style.filter = 'brightness(0.8) contrast(1.2)';
        }
    }

    hideBlueprintOverlay() {
        const assemblyArea = document.querySelector('.assembly-area');
        if (assemblyArea) {
            assemblyArea.style.background = '';
            assemblyArea.style.backgroundSize = '';
            assemblyArea.style.filter = '';
        }
    }

    runFullAnalysis() {
        const analysis = {
            compatibility: this.analyzeComponentCompatibility(),
            combat: this.calculateCombatEffectiveness(),
            efficiency: this.calculatePowerEfficiency(),
            synergies: this.analyzeSynergies(),
            recommendations: this.generateRecommendations()
        };

        this.displayAnalysisResults(analysis);
    }

    analyzeSynergies() {
        const synergies = [];

        if (this.hasWeaponSynergy()) {
            synergies.push('Weapon Synergy: +20% combat effectiveness');
        }

        if (this.hasMobilitySynergy()) {
            synergies.push('Mobility Synergy: +15% speed bonus');
        }

        if (this.hasPowerSynergy()) {
            synergies.push('Power Synergy: +10% efficiency');
        }

        return synergies;
    }

    generateRecommendations() {
        const recommendations = [];
        const placedComponents = Array.from(this.placedParts).map(part => this.componentDatabase[part]);
        const totalConsumption = placedComponents.reduce((sum, comp) => sum + (comp.powerConsumption || 0), 0);
        const totalOutput = placedComponents.reduce((sum, comp) => sum + (comp.powerOutput || 0), 0);

        if (totalConsumption > totalOutput) {
            recommendations.push('Consider upgrading power core for better efficiency');
        }

        const totalWeight = placedComponents.reduce((sum, comp) => sum + (comp.weight || 0), 0);
        if (totalWeight > 200) {
            recommendations.push('Reduce weight for improved mobility');
        }

        const techLevels = placedComponents.map(comp => comp.techLevel || 1);
        const avgTechLevel = techLevels.reduce((sum, level) => sum + level, 0) / techLevels.length;

        if (avgTechLevel < 5) {
            recommendations.push('Upgrade to higher tech level components');
        }

        return recommendations;
    }

    displayAnalysisResults(analysis) {
        const results = `
Combat Rating: ${analysis.combat.rating}/10 (${analysis.combat.assessment})
Compatibility: ${analysis.compatibility}%
Power Efficiency: ${Math.round(analysis.efficiency)}%
Synergies: ${analysis.synergies.length || 'None detected'}
        `.trim();

        this.showFeedback(results, 'success');
    }

    updateAllDisplays() {
        this.updateProgress();
        this.updateInventoryStats();
        this.updateStatusBar();
        this.updateMissionProgress();
        this.updateCombatRating();
    }

    updateInventoryStats() {
        const availableParts = this.parts.length - this.placedParts.size;
        const usedParts = this.placedParts.size;

        const availableEl = document.getElementById('available-parts');
        const usedEl = document.getElementById('used-parts');

        if (availableEl) availableEl.textContent = availableParts;
        if (usedEl) usedEl.textContent = usedParts;
    }

    updateStatusBar() {
        const timeEl = document.querySelector('.time-display');
        if (timeEl) {
            const minutes = Math.floor(this.gameStats.playtime / 60);
            const seconds = this.gameStats.playtime % 60;
            timeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        const scoreEl = document.querySelector('.score-display');
        if (scoreEl) {
            scoreEl.textContent = this.gameStats.score.toLocaleString();
        }

        const streakEl = document.querySelector('.streak-counter');
        if (streakEl) {
            streakEl.textContent = this.gameStats.streak;
        }

        const energyEl = document.querySelector('.energy-level');
        if (energyEl) {
            energyEl.textContent = this.gameStats.energyLevel + '%';
        }
    }

    updateMissionProgress() {
        const progress = (this.placedParts.size / this.parts.length) * 100;
        this.currentMission.progress = progress;

        const progressFill = document.getElementById('mission-progress');
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
    }

    completeAssembly() {
        const assemblyTime = Date.now() - this.timers.assemblyStart;
        this.gameStats.assemblyTime = assemblyTime;
        this.gameStats.totalAssemblies++;
        const timeBonus = assemblyTime < 30000 ? 1000 : assemblyTime < 60000 ? 500 : 200;
        const compatibilityBonus = this.analyzeComponentCompatibility() * 10;
        const finalBonus = timeBonus + compatibilityBonus;
        this.gameStats.score += finalBonus;
        this.gameStats.creditsEarned += this.currentMission.rewards.credits;
        this.gameStats.experiencePoints += this.currentMission.rewards.xp;
        if (this.analyzeComponentCompatibility() >= 95 && assemblyTime < 45000) {
            this.gameStats.perfectAssemblies++;
        }

        this.checkLevelUp();
        this.showSuccessMessage();
        this.timers.assemblyStart = null;
        this.checkAchievements();
    }

    checkLevelUp() {
        const requiredXP = this.gameStats.playerLevel * 1000;
        if (this.gameStats.experiencePoints >= requiredXP) {
            this.gameStats.playerLevel++;
            this.gameStats.experiencePoints -= requiredXP;
            this.showAchievement('Level Up!', `Reached Level ${this.gameStats.playerLevel}`);
        }
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!achievement.unlocked) {
                let shouldUnlock = false;

                switch (achievement.id) {
                    case 'first_assembly':
                        shouldUnlock = this.gameStats.totalAssemblies >= 1;
                        break;
                    case 'speed_demon':
                        shouldUnlock = this.gameStats.assemblyTime < 30000 && this.placedParts.size === this.parts.length;
                        break;
                    case 'perfectionist':
                        shouldUnlock = this.gameStats.perfectAssemblies >= 5;
                        break;
                    case 'tech_master':
                        shouldUnlock = this.gameStats.techLevel >= 10;
                        break;
                    case 'combat_ready':
                        shouldUnlock = this.gameStats.combatRating >= 1000;
                        break;
                    case 'efficiency_expert':
                        shouldUnlock = this.gameStats.efficiency >= 95;
                        break;
                }

                if (shouldUnlock) {
                    achievement.unlocked = true;
                    this.showAchievement(achievement.name, achievement.description);
                }
            }
        });
    }

    showAchievement(title, description) {
        const popup = document.getElementById('achievement-popup');
        const titleEl = popup?.querySelector('.achievement-title');
        const descEl = popup?.querySelector('.achievement-desc');

        if (popup && titleEl && descEl) {
            titleEl.textContent = title;
            descEl.textContent = description;
            popup.classList.add('show');

            setTimeout(() => {
                popup.classList.remove('show');
            }, 4000);
        }
    }

    applyFilter(filterType) {
        const parts = document.querySelectorAll('.robot-part');

        parts.forEach(part => {
            let shouldShow = true;

            if (filterType !== 'all') {
                const partRarity = part.dataset.rarity;
                const partCategory = part.dataset.category;

                if (filterType === 'core' && partCategory !== 'core') shouldShow = false;
                if (filterType === 'weapon' && partCategory !== 'weapon') shouldShow = false;
                if (filterType === 'support' && partCategory !== 'support') shouldShow = false;
                if (filterType === 'rare' && !['rare', 'epic', 'legendary'].includes(partRarity)) shouldShow = false;
            }

            part.style.display = shouldShow ? 'block' : 'none';
        });

        this.filters.rarity = filterType;
    }

    updateFilterUI() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === this.filters.rarity);
        });
    }

    applyDifficultySettings() {
        const multipliers = {
            'easy': { timeLimit: 1.5, hintFrequency: 0.5 },
            'normal': { timeLimit: 1.0, hintFrequency: 1.0 },
            'hard': { timeLimit: 0.8, hintFrequency: 2.0 },
            'nightmare': { timeLimit: 0.5, hintFrequency: 0 }
        };

        const settings = multipliers[this.settings.difficulty];
        this.currentMission.timeLimit = settings.timeLimit * 120000;
    }

    updateSoundVolume() {
        this.soundEffects.forEach(sound => {
            if (sound) sound.volume = this.settings.sfxVolume / 100;
        });
    }

    updateAnimationSpeed() {
        const speed = this.settings.animationSpeed / 100;
        document.documentElement.style.setProperty('--animation-speed', speed);
    }

    updateAutoSave() {
        if (this.timers.autosaveTimer) {
            clearInterval(this.timers.autosaveTimer);
        }

        if (this.settings.autoSave) {
            this.timers.autosaveTimer = setInterval(() => {
                this.saveGameData();
            }, 30000);
        }
    }

    closeAllPanels() {
        this.features.settings = false;
        this.features.inspector = false;
        this.features.leaderboard = false;

        document.getElementById('settings-panel')?.classList.remove('active');
        document.getElementById('component-inspector')?.classList.remove('active');
        document.getElementById('leaderboard')?.classList.remove('active');

        document.querySelectorAll('.control-btn.active').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    showHelp() {
        const helpText = `
Advanced Robo Builder - Controls:
Ctrl+S: Toggle Scanner
Ctrl+H: Toggle Hints
Ctrl+I: Toggle Inspector
Ctrl+L: Toggle Leaderboard
Ctrl+R: Reset Assembly
F1: Show Help
F11: Toggle Fullscreen
ESC: Close Panels
        `;

        this.showFeedback(helpText, 'success');
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    handleAFK() {
        this.showFeedback('Welcome back! Game paused during inactivity.', 'success');
        this.gameStats.energyLevel = Math.max(50, this.gameStats.energyLevel - 10);
    }

    saveGameData() {
        const gameData = {
            gameStats: this.gameStats,
            achievements: this.achievements,
            settings: this.settings,
            placedParts: Array.from(this.placedParts)
        };

        localStorage.setItem('mechAssemblyGameData', JSON.stringify(gameData));
    }

    loadGameData() {
        const savedData = localStorage.getItem('mechAssemblyGameData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                this.gameStats = { ...this.gameStats, ...data.gameStats };
                this.achievements = data.achievements || this.achievements;
                this.settings = { ...this.settings, ...data.settings };
            } catch (e) {
                console.log('Failed to load save data:', e);
            }
        }
    }
}

function resetGame() {
    if (window.mechGame) {
        window.mechGame.reset();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.mechGame = new AdvancedMechAssemblyGame();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        
        console.log('Game paused');
    } else {
        console.log('Game resumed');
    }
});

setInterval(() => {
    const memUsage = performance.memory ? performance.memory.usedJSHeapSize : 0;
    if (memUsage > 100000000) { 
        console.warn('High memory usage detected');
    }
}, 30000);

window.addEventListener('error', (e) => {
    console.error('Game error:', e.error);
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        console.log('Service worker support detected');
    });
}
  ;

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        console.log('Window resized, adjusting game layout if needed');
    }, 250);
});

window.addEventListener('error', (e) => {
    console.error('Game error:', e.error);
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        console.log('Service worker support detected');
    });
}
