// Choice System - Handles user choices and story branching
class ChoiceSystem {
    constructor() {
        this.story = null;
        this.choiceHistory = [];
        this.branchingPoints = [];
        this.eventListeners = {};
        this.maxHistoryLength = 50; // Prevent memory issues
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

    initializeStory(story) {
        this.story = story;
        this.choiceHistory = [];
        this.branchingPoints = [];
        
        // Create initial branching point
        this.createBranchingPoint();
    }

    loadStory(story) {
        this.story = story;
        this.choiceHistory = story.choiceHistory || [];
        this.reconstructBranchingPoints();
    }

    makeChoice(choice) {
        if (!this.story || !choice) return;

        // Validate choice
        if (!this.isValidChoice(choice)) {
            console.warn('Invalid choice made:', choice);
            return;
        }

        // Record the choice
        const choiceRecord = {
            sceneId: this.story.currentScene.id,
            sceneNumber: this.story.currentScene.sceneNumber,
            choiceId: choice.id,
            choiceText: choice.text,
            choiceIndex: this.getCurrentChoiceIndex(choice),
            timestamp: Date.now(),
            storyState: this.captureStoryState()
        };

        this.choiceHistory.push(choiceRecord);
        
        // Create branching point before making choice
        this.createBranchingPoint();

        // Emit choice event
        this.emit('choiceMade', choice);

        // Update story's choice history
        if (this.story.choiceHistory) {
            this.story.choiceHistory.push(choiceRecord);
        } else {
            this.story.choiceHistory = [choiceRecord];
        }

        // Clean up old history if needed
        this.cleanupHistory();
    }

    isValidChoice(choice) {
        const currentChoices = this.story.currentScene.choices || [];
        return currentChoices.some(c => c.id === choice.id);
    }

    getCurrentChoiceIndex(choice) {
        const currentChoices = this.story.currentScene.choices || [];
        return currentChoices.findIndex(c => c.id === choice.id);
    }

    captureStoryState() {
        if (!this.story) return null;

        return {
            sceneIndex: this.story.currentSceneIndex,
            variables: new Map(this.story.variables),
            achievements: [...(this.story.variables.get('achievements') || [])],
            items: [...(this.story.variables.get('items') || [])],
            mood: this.story.variables.get('mood'),
            dangerLevel: this.story.variables.get('danger_level'),
            companion: this.story.variables.get('companion')
        };
    }

    createBranchingPoint() {
        if (!this.story) return;

        const branchingPoint = {
            id: this.generateId(),
            sceneId: this.story.currentScene.id,
            sceneNumber: this.story.currentScene.sceneNumber,
            sceneIndex: this.story.currentSceneIndex,
            storyState: this.captureStoryState(),
            availableChoices: [...(this.story.currentScene.choices || [])],
            timestamp: Date.now()
        };

        this.branchingPoints.push(branchingPoint);
        
        // Limit branching points to prevent memory issues
        if (this.branchingPoints.length > 20) {
            this.branchingPoints = this.branchingPoints.slice(-20);
        }
    }

    reconstructBranchingPoints() {
        this.branchingPoints = [];
        
        // Rebuild branching points from choice history
        for (let i = 0; i < this.choiceHistory.length; i++) {
            const choice = this.choiceHistory[i];
            if (choice.storyState) {
                const branchingPoint = {
                    id: this.generateId(),
                    sceneId: choice.sceneId,
                    sceneNumber: choice.sceneNumber,
                    sceneIndex: choice.storyState.sceneIndex,
                    storyState: choice.storyState,
                    timestamp: choice.timestamp
                };
                this.branchingPoints.push(branchingPoint);
            }
        }
    }

    canGoBack() {
        return this.branchingPoints.length > 1; // Keep current scene
    }

    goBack() {
        if (!this.canGoBack()) {
            console.warn('Cannot go back - no previous branching points');
            return false;
        }

        // Remove current branching point
        this.branchingPoints.pop();
        
        // Get previous branching point
        const previousPoint = this.branchingPoints[this.branchingPoints.length - 1];
        
        if (!previousPoint) {
            console.warn('No previous branching point found');
            return false;
        }

        // Restore story state
        this.restoreStoryState(previousPoint);
        
        // Remove choices made after this point
        this.removeChoicesAfterPoint(previousPoint);
        
        // Emit back event
        this.emit('backRequested');
        
        console.log(`Went back to scene ${previousPoint.sceneNumber}`);
        return true;
    }

    restoreStoryState(branchingPoint) {
        if (!this.story || !branchingPoint.storyState) return;

        // Restore scene index
        this.story.currentSceneIndex = branchingPoint.sceneIndex;
        
        // Restore current scene
        if (this.story.scenes[branchingPoint.sceneIndex]) {
            this.story.currentScene = this.story.scenes[branchingPoint.sceneIndex];
        }
        
        // Restore variables
        if (branchingPoint.storyState.variables) {
            this.story.variables = new Map(branchingPoint.storyState.variables);
        }
        
        // Truncate scenes array to current point
        this.story.scenes = this.story.scenes.slice(0, branchingPoint.sceneIndex + 1);
        
        // Update story metadata
        this.story.updatedAt = Date.now();
    }

    removeChoicesAfterPoint(branchingPoint) {
        // Remove choice history after this point
        this.choiceHistory = this.choiceHistory.filter(choice => 
            choice.timestamp <= branchingPoint.timestamp
        );
        
        // Update story's choice history
        if (this.story.choiceHistory) {
            this.story.choiceHistory = this.choiceHistory.slice();
        }
    }

    getChoiceHistory() {
        return [...this.choiceHistory];
    }

    getBranchingPoints() {
        return [...this.branchingPoints];
    }

    getAlternativeChoices(sceneNumber) {
        // Find branching point for given scene
        const branchingPoint = this.branchingPoints.find(bp => 
            bp.sceneNumber === sceneNumber
        );
        
        if (!branchingPoint) return [];
        
        // Return choices that weren't made
        const madeChoice = this.choiceHistory.find(ch => 
            ch.sceneNumber === sceneNumber
        );
        
        if (!madeChoice) return branchingPoint.availableChoices || [];
        
        return (branchingPoint.availableChoices || []).filter(choice => 
            choice.id !== madeChoice.choiceId
        );
    }

    getStoryPath() {
        // Generate a path representation of choices made
        return this.choiceHistory.map(choice => ({
            scene: choice.sceneNumber,
            choice: choice.choiceText,
            timestamp: choice.timestamp
        }));
    }

    exportChoiceData() {
        return {
            history: this.getChoiceHistory(),
            branchingPoints: this.getBranchingPoints(),
            storyPath: this.getStoryPath(),
            metadata: {
                totalChoices: this.choiceHistory.length,
                backtrackCount: this.calculateBacktrackCount(),
                explorationScore: this.calculateExplorationScore()
            }
        };
    }

    calculateBacktrackCount() {
        // Count how many times player went back
        let backtrackCount = 0;
        for (let i = 1; i < this.choiceHistory.length; i++) {
            if (this.choiceHistory[i].sceneNumber <= this.choiceHistory[i-1].sceneNumber) {
                backtrackCount++;
            }
        }
        return backtrackCount;
    }

    calculateExplorationScore() {
        // Score based on variety of choices and paths explored
        const uniqueScenes = new Set(this.choiceHistory.map(c => c.sceneNumber));
        const totalScenes = this.story ? this.story.totalScenes : 10;
        const backtrackCount = this.calculateBacktrackCount();
        
        // Base score from progression
        let score = (uniqueScenes.size / totalScenes) * 100;
        
        // Bonus for exploration (backtracking)
        score += Math.min(backtrackCount * 5, 25);
        
        // Bonus for choice variety
        const choiceVariety = this.calculateChoiceVariety();
        score += choiceVariety * 10;
        
        return Math.round(Math.min(score, 100));
    }

    calculateChoiceVariety() {
        if (this.choiceHistory.length === 0) return 0;
        
        const choiceDistribution = {};
        this.choiceHistory.forEach(choice => {
            const key = `${choice.sceneNumber}-${choice.choiceIndex}`;
            choiceDistribution[key] = (choiceDistribution[key] || 0) + 1;
        });
        
        const uniqueChoices = Object.keys(choiceDistribution).length;
        return uniqueChoices / this.choiceHistory.length;
    }

    // Advanced choice analysis
    analyzeChoicePatterns() {
        const patterns = {
            brave: 0,
            cautious: 0,
            aggressive: 0,
            peaceful: 0,
            clever: 0
        };
        
        this.choiceHistory.forEach(choice => {
            // This would need access to the original choice data to analyze tags
            // For now, we'll use heuristics based on choice text
            const text = choice.choiceText.toLowerCase();
            
            if (text.includes('attack') || text.includes('fight') || text.includes('charge')) {
                patterns.aggressive++;
            } else if (text.includes('sneak') || text.includes('hide') || text.includes('careful')) {
                patterns.cautious++;
            } else if (text.includes('talk') || text.includes('negotiate') || text.includes('peace')) {
                patterns.peaceful++;
            } else if (text.includes('examine') || text.includes('study') || text.includes('think')) {
                patterns.clever++;
            } else {
                patterns.brave++;
            }
        });
        
        return patterns;
    }

    getChoiceRecommendations() {
        const patterns = this.analyzeChoicePatterns();
        const recommendations = [];
        
        // Find least used pattern
        const sortedPatterns = Object.entries(patterns).sort((a, b) => a[1] - b[1]);
        const leastUsed = sortedPatterns[0][0];
        
        recommendations.push({
            type: 'exploration',
            message: `Try being more ${leastUsed} in your choices to explore different story paths.`
        });
        
        // Check for backtracking opportunities
        const alternativePaths = this.findAlternativePaths();
        if (alternativePaths.length > 0) {
            recommendations.push({
                type: 'backtrack',
                message: `You have ${alternativePaths.length} unexplored choice(s) you could go back and try.`
            });
        }
        
        return recommendations;
    }

    findAlternativePaths() {
        const alternatives = [];
        
        this.branchingPoints.forEach(bp => {
            const alternativeChoices = this.getAlternativeChoices(bp.sceneNumber);
            if (alternativeChoices.length > 0) {
                alternatives.push({
                    sceneNumber: bp.sceneNumber,
                    alternativeCount: alternativeChoices.length,
                    choices: alternativeChoices
                });
            }
        });
        
        return alternatives;
    }

    cleanupHistory() {
        // Remove old history entries if we exceed the limit
        if (this.choiceHistory.length > this.maxHistoryLength) {
            const excessCount = this.choiceHistory.length - this.maxHistoryLength;
            this.choiceHistory = this.choiceHistory.slice(excessCount);
            
            // Also clean up corresponding branching points
            const oldestTimestamp = this.choiceHistory[0].timestamp;
            this.branchingPoints = this.branchingPoints.filter(bp => 
                bp.timestamp >= oldestTimestamp
            );
        }
    }

    // Utility methods
    generateId() {
        return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    // Serialization for saving/loading
    serialize() {
        return {
            choiceHistory: this.choiceHistory,
            branchingPoints: this.branchingPoints.map(bp => ({
                ...bp,
                storyState: bp.storyState ? {
                    ...bp.storyState,
                    variables: Array.from(bp.storyState.variables.entries())
                } : null
            }))
        };
    }

    deserialize(data) {
        this.choiceHistory = data.choiceHistory || [];
        this.branchingPoints = (data.branchingPoints || []).map(bp => ({
            ...bp,
            storyState: bp.storyState ? {
                ...bp.storyState,
                variables: new Map(bp.storyState.variables)
            } : null
        }));
    }

    // Debug methods
    debugPrintHistory() {
        console.log('Choice History:');
        this.choiceHistory.forEach((choice, index) => {
            console.log(`${index + 1}. Scene ${choice.sceneNumber}: ${choice.choiceText}`);
        });
    }

    debugPrintBranchingPoints() {
        console.log('Branching Points:');
        this.branchingPoints.forEach((bp, index) => {
            console.log(`${index + 1}. Scene ${bp.sceneNumber} (${bp.availableChoices?.length || 0} choices)`);
        });
    }
}
