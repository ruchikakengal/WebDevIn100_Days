/**
 * Story Generator Engine
 * Creates dynamic stories using templates, themes, and user choices
 */

class StoryGenerator {
    constructor() {
        this.templates = this.initializeTemplates();
        this.vocabulary = this.initializeVocabulary();
        this.storyStructures = this.initializeStoryStructures();
    }

    async generateInitialStory(params) {
        const context = this.createStoryContext(params);
        const template = this.selectTemplate('opening', context.theme);
        const storyText = this.processTemplate(template, context);
        const choices = this.generateChoices(context, 'opening');

        return {
            id: this.generateId(),
            text: storyText,
            choices: choices,
            context: context,
            segment: 'opening'
        };
    }

    async continueStory(currentStory, selectedChoice, storyHistory) {
        const context = { ...currentStory.context };
        this.updateContext(context, selectedChoice, storyHistory);
        
        const segmentType = this.determineNextSegment(context, storyHistory);
        const template = this.selectTemplate(segmentType, context.theme);
        const storyText = this.processTemplate(template, context);
        const choices = this.shouldEndStory(storyHistory) ? [] : this.generateChoices(context, segmentType);

        return {
            id: this.generateId(),
            text: storyText,
            choices: choices,
            context: context,
            segment: segmentType
        };
    }

    createStoryContext(params) {
        return {
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
            relationships: {},
            threatLevel: 1
        };
    }

    updateContext(context, selectedChoice, storyHistory) {
        context.chapter = storyHistory.length + 1;
        context.mood = selectedChoice.mood || context.mood;
        
        // Process choice consequences
        this.applyChoiceConsequences(context, selectedChoice);
        
        // Add to plot points
        context.plotPoints.push({
            chapter: context.chapter,
            choice: selectedChoice.text,
            consequence: selectedChoice.consequence
        });
        
        // Update threat level based on story progression
        context.threatLevel = Math.min(5, Math.floor(storyHistory.length / 2# thoughts

This is a comprehensive interactive story generator website that needs to be built with pure HTML/CSS/JavaScript. The requirements include dynamic story generation using templates, branching narratives with choice-based progression, multiple themes with unique styling, localStorage for persistence, text-to-speech narration, responsive design, and export functionality.

Looking at the existing files, I can see the basic structure is in place with HTML, CSS, and some JavaScript files. However, several key JavaScript files are missing that are referenced in the HTML but not yet implemented. I need to create the missing JavaScript files to complete the functionality:

1. `scripts/app.js` - Main application controller 
2. `scripts/story-generator.js` - Core story generation logic
3. `scripts/theme-manager.js` - Theme switching functionality
4. `scripts/audio-manager.js` - Text-to-speech and audio handling
5. `scripts/storage-manager.js` - localStorage operations
6. `scripts/export-manager.js` - Story export functionality
7. `data/story-templates.js` - Story templates and narrative data
8. `data/themes.js` - Theme configurations

The existing files show a well-structured foundation, but I need to update the directory structure to match what's actually referenced in the HTML and implement the missing functionality.

# useful_guidelines_from_blueprints

# directory_structure
```json
[
    {"path": "index.html", "status": "overwritten"},
    {"path": "styles/main.css", "status": "overwritten"},
    {"path": "styles/themes.css", "status": "overwritten"},
    {"path": "scripts/app.js", "status": "overwritten"},
    {"path": "scripts/story-generator.js", "status": "overwritten"},
    {"path": "scripts/theme-manager.js", "status": "overwritten"},
    {"path": "scripts/audio-manager.js", "status": "overwritten"},
    {"path": "scripts/storage-manager.js", "status": "overwritten"},
    {"path": "scripts/export-manager.js", "status": "overwritten"},
    {"path": "data/story-templates.js", "status": "overwritten"},
    {"path": "data/themes.js", "status": "overwritten"}
]
