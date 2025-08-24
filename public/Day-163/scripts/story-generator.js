
class StoryGenerator {
    constructor() {
        this.templates = window.STORY_TEMPLATES || {};
        this.themes = window.THEMES || {};
    }

    async generateStory(params) {
        // Simulate processing delay
        await this.delay(1000);
        
        // Get theme-specific templates
        const themeTemplates = this.templates[params.theme] || this.templates.fantasy;
        
        // Create story context
        const storyContext = {
            characterName: params.characterName,
            characterTrait: params.characterTrait,
            storyGoal: params.storyGoal,
            customElement: params.customElement,
            theme: params.theme,
            chapter: 1,
            mood: 'neutral',
            plotPoints: [],
            visitedLocations: [],
            acquiredItems: [],
            relationships: {}
        };

        // Generate opening story
        const openingTemplate = this.selectRandomTemplate(themeTemplates.openings);
        const storyText = this.processTemplate(openingTemplate, storyContext);
        
        // Generate initial choices
        const choices = this.generateChoices(storyContext, themeTemplates);

        return {
            id: this.generateId(),
            text: storyText,
            choices: choices,
            context: storyContext,
            ...params
        };
    }

    async continueStory(currentStory, selectedChoice, storyHistory) {
        // Simulate processing delay
        await this.delay(800);
        
        const context = { ...currentStory.context };
        
        // Update context based on choice
        this.updateContext(context, selectedChoice, storyHistory);
        
        // Get theme templates
        const themeTemplates = this.templates[context.theme] || this.templates.fantasy;
        
        // Determine story segment type
        const segmentType = this.determineSegmentType(context, storyHistory);
        
        // Generate story text
        const template = this.selectContextualTemplate(themeTemplates, segmentType, context);
        const storyText = this.processTemplate(template, context);
        
        // Generate new choices or end story
        const choices = this.shouldEndStory(context, storyHistory) 
            ? [] 
            : this.generateChoices(context, themeTemplates);

        return {
            id: this.generateId(),
            text: storyText,
            choices: choices,
            context: context,
            characterName: context.characterName
        };
    }

    selectRandomTemplate(templates) {
        if (!templates || templates.length === 0) {
            return "The story continues in an unexpected way...";
        }
        return templates[Math.floor(Math.random() * templates.length)];
    }

    selectContextualTemplate(themeTemplates, segmentType, context) {
        let templates;
        
        switch (segmentType) {
            case 'conflict':
                templates = themeTemplates.conflicts || themeTemplates.middle;
                break;
            case 'discovery':
                templates = themeTemplates.discoveries || themeTemplates.middle;
                break;
            case 'resolution':
                templates = themeTemplates.endings || themeTemplates.middle;
                break;
            case 'twist':
                templates = themeTemplates.twists || themeTemplates.middle;
                break;
            default:
                templates = themeTemplates.middle;
        }

        return this.selectRandomTemplate(templates);
    }

    processTemplate(template, context) {
        let text = template;
        
        // Replace standard placeholders
        text = text.replace(/{characterName}/g, context.characterName || 'Hero');
        text = text.replace(/{characterTrait}/g, context.characterTrait || 'brave');
        text = text.replace(/{storyGoal}/g, this.getGoalDescription(context.storyGoal));
        text = text.replace(/{customElement}/g, context.customElement || 'a mysterious object');
        
        // Replace dynamic placeholders
        text = text.replace(/{location}/g, this.getRandomLocation(context));
        text = text.replace(/{item}/g, this.getRandomItem(context));
        text = text.replace(/{ally}/g, this.getRandomAlly(context));
        text = text.replace(/{enemy}/g, this.getRandomEnemy(context));
        text = text.replace(/{emotion}/g, this.getContextualEmotion(context));
        
        // Clean up extra spaces
        text = text.replace(/\s+/g, ' ').trim();
        
        return text;
    }

    generateChoices(context, themeTemplates) {
        const choicePool = themeTemplates.choices || [];
        const numChoices = Math.min(3, Math.max(2, choicePool.length));
        
        // Select random choices
        const selectedChoices = this.shuffleArray([...choicePool])
            .slice(0, numChoices)
            .map(choice => ({
                id: this.generateId(),
                text: this.processTemplate(choice.text, context),
                consequence: choice.consequence,
                mood: choice.mood || 'neutral',
                requirement: choice.requirement
            }));

        // Filter choices based on requirements
        const validChoices = selectedChoices.filter(choice => {
            return this.meetsRequirement(choice.requirement, context);
        });

        // Ensure we have at least 2 choices
        if (validChoices.length < 2) {
            validChoices.push(...this.getDefaultChoices(context));
        }

        return validChoices.slice(0, 3);
    }

    meetsRequirement(requirement, context) {
        if (!requirement) return true;
        
        switch (requirement) {
            case 'hasItems':
                return context.acquiredItems.length > 0;
            case 'hasAllies':
                return Object.keys(context.relationships).length > 0;
            case 'earlyStory':
                return context.chapter <= 2;
            case 'lateStory':
                return context.chapter > 3;
            default:
                return true;
        }
    }

    getDefaultChoices(context) {
        return [
            {
                id: this.generateId(),
                text: "Continue forward cautiously",
                consequence: "careful",
                mood: "tense"
            },
            {
                id: this.generateId(),
                text: "Take a moment to rest and think",
                consequence: "rest",
                mood: "peaceful"
            }
        ];
    }

    updateContext(context, selectedChoice, storyHistory) {
        // Update chapter
        context.chapter = storyHistory.length + 1;
        
        // Update mood
        context.mood = selectedChoice.mood || context.mood;
        
        // Process choice consequences
        this.processConsequence(context, selectedChoice.consequence);
        
        // Add plot point
        context.plotPoints.push({
            chapter: context.chapter,
            choice: selectedChoice.text,
            consequence: selectedChoice.consequence
        });
    }

    processConsequence(context, consequence) {
        switch (consequence) {
            case 'gainItem':
                const newItem = this.generateRandomItem(context.theme);
                context.acquiredItems.push(newItem);
                break;
            case 'meetAlly':
                const ally = this.generateRandomAlly(context.theme);
                context.relationships[ally] = 'ally';
                break;
            case 'makeEnemy':
                const enemy = this.generateRandomEnemy(context.theme);
                context.relationships[enemy] = 'enemy';
                break;
            case 'visitLocation':
                const location = this.generateRandomLocation(context.theme);
                if (!context.visitedLocations.includes(location)) {
                    context.visitedLocations.push(location);
                }
                break;
            case 'brave':
                context.mood = 'confident';
                break;
            case 'careful':
                context.mood = 'cautious';
                break;
            case 'rest':
                context.mood = 'peaceful';
                break;
        }
    }

    determineSegmentType(context, storyHistory) {
        const chapter = context.chapter;
        const random = Math.random();
        
        if (chapter <= 2) {
            return random < 0.6 ? 'discovery' : 'conflict';
        } else if (chapter <= 5) {
            return random < 0.4 ? 'discovery' : random < 0.8 ? 'conflict' : 'twist';
        } else {
            return random < 0.7 ? 'resolution' : 'conflict';
        }
    }

    shouldEndStory(context, storyHistory) {
        // End story based on length and context
        if (storyHistory.length >= 8) {
            return Math.random() < 0.6;
        }
        if (storyHistory.length >= 10) {
            return true;
        }
        return false;
    }

    getGoalDescription(goal) {
        const goalDescriptions = {
            treasure: 'find the legendary treasure',
            rescue: 'rescue someone precious',
            mystery: 'solve an ancient mystery',
            power: 'gain ultimate power',
            survival: 'survive against all odds'
        };
        return goalDescriptions[goal] || goal;
    }

    getRandomLocation(context) {
        const themeElements = this.getThemeElements(context.theme, 'locations');
        return this.selectRandomFromArray(themeElements);
    }

    getRandomItem(context) {
        if (context.acquiredItems.length > 0) {
            return this.selectRandomFromArray(context.acquiredItems);
        }
        return this.generateRandomItem(context.theme);
    }

    generateRandomItem(theme) {
        const themeItems = this.getThemeElements(theme, 'items');
        return this.selectRandomFromArray(themeItems);
    }

    getRandomAlly(context) {
        const allies = Object.keys(context.relationships).filter(
            name => context.relationships[name] === 'ally'
        );
        if (allies.length > 0) {
            return this.selectRandomFromArray(allies);
        }
        return this.generateRandomAlly(context.theme);
    }

    generateRandomAlly(theme) {
        const themeAllies = this.getThemeElements(theme, 'allies');
        return this.selectRandomFromArray(themeAllies);
    }

    getRandomEnemy(context) {
        const themeEnemies = this.getThemeElements(context.theme, 'enemies');
        return this.selectRandomFromArray(themeEnemies);
    }

    generateRandomEnemy(theme) {
        const themeEnemies = this.getThemeElements(theme, 'enemies');
        return this.selectRandomFromArray(themeEnemies);
    }

    generateRandomLocation(theme) {
        const themeLocations = this.getThemeElements(theme, 'locations');
        return this.selectRandomFromArray(themeLocations);
    }

    getThemeElements(theme, type) {
        // Use elements from THEMES if available
        if (this.themes[theme] && this.themes[theme].elements) {
            return this.themes[theme].elements[type] || [];
        }

        // Fallback elements
        const elements = {
            fantasy: {
                locations: ['enchanted forest', 'crystal cave', 'ancient ruins', 'mystical tower', 'dragon\'s lair'],
                items: ['magic sword', 'healing potion', 'ancient scroll', 'glowing gem', 'enchanted cloak'],
                allies: ['wise wizard', 'brave knight', 'forest sprite', 'talking animal', 'village elder'],
                enemies: ['dark sorcerer', 'fierce dragon', 'shadow creature', 'evil lord', 'cursed beast']
            },
            'sci-fi': {
                locations: ['space station', 'alien planet', 'cybernetic city', 'quantum lab', 'starship bridge'],
                items: ['plasma rifle', 'energy shield', 'data crystal', 'nano-enhancer', 'holographic map'],
                allies: ['AI companion', 'alien scientist', 'rebel fighter', 'space marine', 'tech specialist'],
                enemies: ['rogue AI', 'alien invader', 'corporate agent', 'space pirate', 'cyborg assassin']
            },
            mystery: {
                locations: ['old mansion', 'foggy cemetery', 'abandoned library', 'secret passage', 'detective\'s office'],
                items: ['cryptic letter', 'old photograph', 'mysterious key', 'torn diary page', 'vintage magnifying glass'],
                allies: ['helpful librarian', 'retired detective', 'local historian', 'curious journalist', 'loyal assistant'],
                enemies: ['shadowy figure', 'corrupt official', 'mysterious stranger', 'crime boss', 'vengeful ghost']
            },
            horror: {
                locations: ['haunted house', 'dark basement', 'creepy attic', 'fog-covered graveyard', 'abandoned asylum'],
                items: ['blessed cross', 'silver dagger', 'protective charm', 'ancient tome', 'holy water'],
                allies: ['brave priest', 'paranormal investigator', 'local medium', 'skeptical scientist', 'protective spirit'],
                enemies: ['malevolent ghost', 'demonic entity', 'cursed doll', 'zombie horde', 'evil cultist']
            }
        };
        
        return elements[theme]?.[type] || elements.fantasy[type];
    }

    getContextualEmotion(context) {
        const emotions = {
            confident: ['determined', 'bold', 'fearless', 'assured'],
            cautious: ['wary', 'careful', 'hesitant', 'watchful'],
            peaceful: ['calm', 'serene', 'content', 'relaxed'],
            tense: ['anxious', 'nervous', 'on edge', 'worried'],
            neutral: ['focused', 'alert', 'ready', 'observant']
        };
        
        const moodEmotions = emotions[context.mood] || emotions.neutral;
        return this.selectRandomFromArray(moodEmotions);
    }

    selectRandomFromArray(array) {
        if (!array || array.length === 0) return '';
        return array[Math.floor(Math.random() * array.length)];
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

window.StoryGenerator = StoryGenerator;
