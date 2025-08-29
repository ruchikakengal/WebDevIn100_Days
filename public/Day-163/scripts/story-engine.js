// Story Engine - Handles story generation and progression
class StoryEngine {
    constructor() {
        this.templates = window.StoryTemplates || {};
        this.themes = window.ThemeData || {};
        this.eventListeners = {};
        this.storyVariables = new Map();
    }

    // Event system
    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }

    emit(event, data) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => callback(data));
        }
    }

    createStory(config) {
        const story = {
            id: this.generateId(),
            config: config,
            theme: config.theme,
            currentSceneIndex: 0,
            totalScenes: this.calculateTotalScenes(config.length),
            scenes: [],
            choiceHistory: [],
            variables: new Map(),
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        // Initialize story variables
        this.initializeStoryVariables(story);

        // Generate opening scene
        const openingScene = this.generateOpeningScene(story);
        story.scenes.push(openingScene);
        story.currentScene = openingScene;

        this.emit('storyGenerated', openingScene);
        return story;
    }

    initializeStoryVariables(story) {
        story.variables.set('character_name', story.config.characterName);
        story.variables.set('setting', story.config.setting || this.getRandomSetting(story.theme));
        story.variables.set('mood', 'neutral');
        story.variables.set('danger_level', 1);
        story.variables.set('story_arc', this.selectStoryArc(story.theme));
        story.variables.set('companion', null);
        story.variables.set('items', []);
        story.variables.set('achievements', []);
    }

    generateOpeningScene(story) {
        const themeData = this.themes[story.theme];
        const templates = this.templates[story.theme]?.opening || [];
        
        if (templates.length === 0) {
            return this.createGenericOpeningScene(story);
        }

        const template = this.selectRandomTemplate(templates);
        const scene = {
            id: this.generateId(),
            sceneNumber: 1,
            type: 'opening',
            text: this.processTemplate(template.text, story),
            choices: this.generateChoices(template.choices, story, 'opening'),
            mood: template.mood || 'neutral',
            setting: story.variables.get('setting')
        };

        return scene;
    }

    generateNextScene(story, choice) {
        if (!story || !choice) return null;

        // Update story based on choice
        this.processChoice(story, choice);

        // Check if story should end
        if (this.shouldEndStory(story)) {
            return this.generateEndingScene(story);
        }

        // Generate next scene
        const nextScene = this.createNextScene(story, choice);
        story.scenes.push(nextScene);
        story.currentSceneIndex++;
        story.currentScene = nextScene;
        story.updatedAt = Date.now();

        // Check if story is now complete
        if (story.currentSceneIndex >= story.totalScenes - 1) {
            this.emit('storyCompleted');
        } else {
            this.emit('storyGenerated', nextScene);
        }

        return nextScene;
    }

    createNextScene(story, choice) {
        const sceneType = this.determineSceneType(story, choice);
        const templates = this.getTemplatesForScene(story.theme, sceneType, story);
        
        if (templates.length === 0) {
            return this.createGenericScene(story, choice);
        }

        const template = this.selectBestTemplate(templates, story, choice);
        const scene = {
            id: this.generateId(),
            sceneNumber: story.currentSceneIndex + 2,
            type: sceneType,
            text: this.processTemplate(template.text, story),
            choices: this.generateChoices(template.choices, story, sceneType),
            mood: this.calculateMood(story, choice),
            setting: this.updateSetting(story, choice)
        };

        // Apply story consequences
        this.applySceneConsequences(story, scene, choice);

        return scene;
    }

    processChoice(story, choice) {
        // Add to choice history
        story.choiceHistory.push({
            sceneId: story.currentScene.id,
            choiceId: choice.id,
            choiceText: choice.text,
            timestamp: Date.now()
        });

        // Apply choice consequences
        if (choice.consequences) {
            choice.consequences.forEach(consequence => {
                this.applyConsequence(story, consequence);
            });
        }

        // Update story variables based on choice
        this.updateStoryVariables(story, choice);
    }

    applyConsequence(story, consequence) {
        switch (consequence.type) {
            case 'mood':
                story.variables.set('mood', consequence.value);
                break;
            case 'danger':
                const currentDanger = story.variables.get('danger_level') || 1;
                story.variables.set('danger_level', Math.max(1, Math.min(5, currentDanger + consequence.value)));
                break;
            case 'item':
                const items = story.variables.get('items') || [];
                if (consequence.action === 'add') {
                    items.push(consequence.value);
                } else if (consequence.action === 'remove') {
                    const index = items.indexOf(consequence.value);
                    if (index > -1) items.splice(index, 1);
                }
                story.variables.set('items', items);
                break;
            case 'companion':
                story.variables.set('companion', consequence.value);
                break;
            case 'achievement':
                const achievements = story.variables.get('achievements') || [];
                achievements.push(consequence.value);
                story.variables.set('achievements', achievements);
                break;
        }
    }

    updateStoryVariables(story, choice) {
        // Update based on choice tags
        if (choice.tags) {
            choice.tags.forEach(tag => {
                switch (tag) {
                    case 'brave':
                        story.variables.set('mood', 'confident');
                        break;
                    case 'cautious':
                        story.variables.set('mood', 'careful');
                        break;
                    case 'aggressive':
                        const danger = story.variables.get('danger_level') || 1;
                        story.variables.set('danger_level', Math.min(5, danger + 1));
                        break;
                    case 'peaceful':
                        const currentDanger = story.variables.get('danger_level') || 1;
                        story.variables.set('danger_level', Math.max(1, currentDanger - 1));
                        break;
                }
            });
        }
    }

    determineSceneType(story, choice) {
        const sceneNumber = story.currentSceneIndex + 2;
        const totalScenes = story.totalScenes;
        const progress = sceneNumber / totalScenes;
        const dangerLevel = story.variables.get('danger_level') || 1;

        // Ending scenes
        if (progress > 0.9) {
            return 'climax';
        }
        
        if (progress > 0.7) {
            return 'rising_action';
        }

        // Choice-based scene types
        if (choice.leads_to) {
            return choice.leads_to;
        }

        // Danger-based scene types
        if (dangerLevel >= 4) {
            return Math.random() > 0.5 ? 'conflict' : 'danger';
        }

        // Random scene types based on progress
        const sceneTypes = this.getAvailableSceneTypes(story.theme, progress);
        return sceneTypes[Math.floor(Math.random() * sceneTypes.length)];
    }

    getAvailableSceneTypes(theme, progress) {
        const baseTypes = ['exploration', 'character', 'mystery'];
        
        if (progress > 0.3) {
            baseTypes.push('conflict', 'discovery');
        }
        
        if (progress > 0.5) {
            baseTypes.push('danger', 'revelation');
        }

        // Theme-specific scene types
        const themeTypes = {
            fantasy: ['magic', 'creature_encounter', 'quest'],
            'sci-fi': ['technology', 'alien_encounter', 'space_travel'],
            mystery: ['clue_discovery', 'interrogation', 'revelation'],
            horror: ['supernatural', 'chase', 'terror']
        };

        return [...baseTypes, ...(themeTypes[theme] || [])];
    }

    getTemplatesForScene(theme, sceneType, story) {
        const templates = this.templates[theme]?.[sceneType] || [];
        
        // Filter templates based on story state
        return templates.filter(template => {
            if (template.requirements) {
                return this.checkRequirements(template.requirements, story);
            }
            return true;
        });
    }

    checkRequirements(requirements, story) {
        for (const requirement of requirements) {
            switch (requirement.type) {
                case 'variable':
                    const value = story.variables.get(requirement.key);
                    if (!this.compareValues(value, requirement.operator, requirement.value)) {
                        return false;
                    }
                    break;
                case 'choice_history':
                    const hasChoice = story.choiceHistory.some(choice => 
                        choice.choiceId === requirement.choiceId
                    );
                    if (requirement.required !== hasChoice) {
                        return false;
                    }
                    break;
                case 'scene_count':
                    if (!this.compareValues(story.currentSceneIndex + 1, requirement.operator, requirement.value)) {
                        return false;
                    }
                    break;
            }
        }
        return true;
    }

    compareValues(a, operator, b) {
        switch (operator) {
            case '==': return a == b;
            case '!=': return a != b;
            case '>': return a > b;
            case '>=': return a >= b;
            case '<': return a < b;
            case '<=': return a <= b;
            case 'includes': return Array.isArray(a) && a.includes(b);
            case 'not_includes': return Array.isArray(a) && !a.includes(b);
            default: return true;
        }
    }

    selectBestTemplate(templates, story, choice) {
        // Weight templates based on relevance
        const weightedTemplates = templates.map(template => ({
            template,
            weight: this.calculateTemplateWeight(template, story, choice)
        }));

        // Sort by weight and select from top choices
        weightedTemplates.sort((a, b) => b.weight - a.weight);
        const topTemplates = weightedTemplates.slice(0, Math.max(1, Math.floor(templates.length / 3)));
        
        return topTemplates[Math.floor(Math.random() * topTemplates.length)].template;
    }

    calculateTemplateWeight(template, story, choice) {
        let weight = 1;

        // Prefer templates matching current mood
        const mood = story.variables.get('mood');
        if (template.mood === mood) weight += 2;

        // Prefer templates with relevant tags
        if (choice.tags && template.tags) {
            const matchingTags = choice.tags.filter(tag => template.tags.includes(tag));
            weight += matchingTags.length;
        }

        // Prefer less recently used templates
        const recentScenes = story.scenes.slice(-3);
        const wasRecentlyUsed = recentScenes.some(scene => 
            scene.templateId === template.id
        );
        if (wasRecentlyUsed) weight -= 1;

        // Add randomness
        weight += Math.random() * 0.5;

        return weight;
    }

    generateChoices(templateChoices, story, sceneType) {
        if (!templateChoices || templateChoices.length === 0) {
            return this.generateGenericChoices(story, sceneType);
        }

        const validChoices = templateChoices.filter(choice => {
            if (choice.requirements) {
                return this.checkRequirements(choice.requirements, story);
            }
            return true;
        });

        // Ensure we have at least 2 choices
        while (validChoices.length < 2 && templateChoices.length > validChoices.length) {
            const remaining = templateChoices.filter(c => !validChoices.includes(c));
            if (remaining.length > 0) {
                validChoices.push(remaining[Math.floor(Math.random() * remaining.length)]);
            } else {
                break;
            }
        }

        // Add fallback choices if needed
        if (validChoices.length < 2) {
            validChoices.push(...this.generateGenericChoices(story, sceneType).slice(0, 2 - validChoices.length));
        }

        return validChoices.map(choice => ({
            ...choice,
            id: this.generateId(),
            text: this.processTemplate(choice.text, story)
        }));
    }

    generateGenericChoices(story, sceneType) {
        const genericChoices = {
            exploration: [
                { text: "Continue exploring the area", tags: ['cautious'] },
                { text: "Look for another path", tags: ['careful'] },
                { text: "Press forward boldly", tags: ['brave'] }
            ],
            conflict: [
                { text: "Try to resolve this peacefully", tags: ['peaceful'] },
                { text: "Stand your ground", tags: ['brave'] },
                { text: "Look for an alternative solution", tags: ['clever'] }
            ],
            mystery: [
                { text: "Investigate further", tags: ['curious'] },
                { text: "Be cautious and observe", tags: ['cautious'] },
                { text: "Ask direct questions", tags: ['direct'] }
            ]
        };

        const choices = genericChoices[sceneType] || genericChoices.exploration;
        return choices.map(choice => ({
            ...choice,
            id: this.generateId(),
            text: this.processTemplate(choice.text, story)
        }));
    }

    processTemplate(template, story) {
        if (!template) return '';

        let processed = template;

        // Replace variables
        story.variables.forEach((value, key) => {
            const placeholder = new RegExp(`\\{${key}\\}`, 'g');
            processed = processed.replace(placeholder, value || '');
        });

        // Replace common placeholders
        processed = processed.replace(/\{CHARACTER\}/g, story.config.characterName);
        processed = processed.replace(/\{SETTING\}/g, story.variables.get('setting') || 'the area');

        // Replace conditional text
        processed = this.processConditionalText(processed, story);

        // Replace random selections
        processed = this.processRandomSelections(processed);

        return processed.trim();
    }

    processConditionalText(text, story) {
        // Process {if:variable:value:text} constructs
        const conditionalRegex = /\{if:([^:]+):([^:]+):([^}]+)\}/g;
        
        return text.replace(conditionalRegex, (match, variable, value, replacement) => {
            const storyValue = story.variables.get(variable);
            return storyValue === value ? replacement : '';
        });
    }

    processRandomSelections(text) {
        // Process {random:option1|option2|option3} constructs
        const randomRegex = /\{random:([^}]+)\}/g;
        
        return text.replace(randomRegex, (match, options) => {
            const optionList = options.split('|');
            return optionList[Math.floor(Math.random() * optionList.length)];
        });
    }

    generateEndingScene(story) {
        const themeData = this.themes[story.theme];
        const endingTemplates = this.templates[story.theme]?.ending || [];
        
        let template;
        if (endingTemplates.length > 0) {
            template = this.selectBestTemplate(endingTemplates, story, null);
        } else {
            template = this.createGenericEnding(story);
        }

        const scene = {
            id: this.generateId(),
            sceneNumber: story.currentSceneIndex + 2,
            type: 'ending',
            text: this.processTemplate(template.text, story),
            choices: [], // Ending scenes have no choices
            mood: this.calculateFinalMood(story),
            setting: story.variables.get('setting')
        };

        story.scenes.push(scene);
        story.currentScene = scene;
        story.isComplete = true;
        story.updatedAt = Date.now();

        this.emit('storyCompleted');
        return scene;
    }

    createGenericEnding(story) {
        const achievements = story.variables.get('achievements') || [];
        const mood = story.variables.get('mood');
        
        let ending = `{CHARACTER}'s adventure comes to an end. `;
        
        if (achievements.length > 0) {
            ending += `Throughout the journey, they accomplished many things: ${achievements.join(', ')}. `;
        }
        
        switch (mood) {
            case 'confident':
                ending += `With newfound confidence and experience, {CHARACTER} looks forward to future adventures.`;
                break;
            case 'cautious':
                ending += `Wiser and more careful than before, {CHARACTER} reflects on the lessons learned.`;
                break;
            default:
                ending += `Changed by the experience, {CHARACTER} returns home with stories to tell.`;
        }

        return { text: ending };
    }

    shouldEndStory(story) {
        return story.currentSceneIndex >= story.totalScenes - 1;
    }

    calculateTotalScenes(length) {
        const baseScenesMap = {
            short: 6,
            medium: 10,
            long: 16
        };
        
        const baseScenes = baseScenesMap[length] || 10;
        
        // Add some randomness (±2 scenes)
        return baseScenes + Math.floor(Math.random() * 5) - 2;
    }

    calculateMood(story, choice) {
        const currentMood = story.variables.get('mood') || 'neutral';
        
        if (choice.mood) {
            return choice.mood;
        }
        
        if (choice.tags) {
            if (choice.tags.includes('brave')) return 'confident';
            if (choice.tags.includes('cautious')) return 'careful';
            if (choice.tags.includes('aggressive')) return 'tense';
            if (choice.tags.includes('peaceful')) return 'calm';
        }
        
        return currentMood;
    }

    calculateFinalMood(story) {
        const dangerLevel = story.variables.get('danger_level') || 1;
        const achievements = story.variables.get('achievements') || [];
        
        if (achievements.length >= 3) return 'triumphant';
        if (dangerLevel <= 2) return 'peaceful';
        if (dangerLevel >= 4) return 'dramatic';
        
        return 'satisfied';
    }

    updateSetting(story, choice) {
        if (choice.setting) {
            return choice.setting;
        }
        
        return story.variables.get('setting');
    }

    applySceneConsequences(story, scene, choice) {
        // This method can be extended to apply additional consequences
        // based on the generated scene content
    }

    getRandomSetting(theme) {
        const settings = {
            fantasy: ['enchanted forest', 'ancient castle', 'magical academy', 'dragon\'s lair', 'mystical village'],
            'sci-fi': ['space station', 'alien planet', 'futuristic city', 'research facility', 'starship'],
            mystery: ['old mansion', 'foggy streets', 'detective office', 'crime scene', 'abandoned warehouse'],
            horror: ['haunted house', 'dark cemetery', 'isolated cabin', 'abandoned asylum', 'creepy forest']
        };
        
        const themeSettings = settings[theme] || settings.fantasy;
        return themeSettings[Math.floor(Math.random() * themeSettings.length)];
    }

    selectStoryArc(theme) {
        const arcs = {
            fantasy: ['hero_journey', 'quest', 'coming_of_age', 'good_vs_evil'],
            'sci-fi': ['exploration', 'first_contact', 'technology_mystery', 'survival'],
            mystery: ['whodunit', 'missing_person', 'conspiracy', 'cold_case'],
            horror: ['survival_horror', 'psychological', 'supernatural', 'monster']
        };
        
        const themeArcs = arcs[theme] || arcs.fantasy;
        return themeArcs[Math.floor(Math.random() * themeArcs.length)];
    }

    selectRandomTemplate(templates) {
        return templates[Math.floor(Math.random() * templates.length)];
    }

    createGenericOpeningScene(story) {
        return {
            id: this.generateId(),
            sceneNumber: 1,
            type: 'opening',
            text: `Welcome, {CHARACTER}! Your adventure begins in ${story.variables.get('setting')}. What path will you choose?`,
            choices: this.generateGenericChoices(story, 'exploration'),
            mood: 'anticipation',
            setting: story.variables.get('setting')
        };
    }

    createGenericScene(story, choice) {
        return {
            id: this.generateId(),
            sceneNumber: story.currentSceneIndex + 2,
            type: 'generic',
            text: `{CHARACTER} continues their journey. The adventure unfolds with new challenges and opportunities.`,
            choices: this.generateGenericChoices(story, 'exploration'),
            mood: this.calculateMood(story, choice),
            setting: this.updateSetting(story, choice)
        };
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }
}
