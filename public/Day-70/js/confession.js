class ConfessionSimulator {
    constructor() {
        this.currentStory = null;
        this.storyIndex = 0;
        this.isAnimating = false;
        
        this.stories = {
            park: {
                character: "Rohit",
                title: "Park Bench Confession",
                story: [
                    {
                        text: "You've been friends with Rohit for years, and tonight feels like the perfect moment to share your feelings. The moonlight creates a romantic atmosphere as you both sit on the park bench. What do you say?",
                        choices: [
                            { text: "\"Rohit, I've been thinking about us a lot lately...\"", next: "gentle_approach" },
                            { text: "\"There's something I need to tell you.\"", next: "direct_approach" },
                            { text: "\"Look at how beautiful the moon is tonight.\"", next: "romantic_approach" }
                        ]
                    }
                ],
                paths: {
                    gentle_approach: [
                        {
                            text: "Rohit turns to you with a curious smile. \"Oh? What kind of thoughts?\" Their eyes sparkle with interest, and you notice they've moved slightly closer to you.",
                            choices: [
                                { text: "\"I think we could be more than friends.\"", next: "gentle_confession" },
                                { text: "\"I've realized how much you mean to me.\"", next: "meaningful_confession" },
                                { text: "\"Maybe we should get some ice cream instead.\"", next: "chickened_out" }
                            ]
                        }
                    ],
                    direct_approach: [
                        {
                            text: "Rohit's expression becomes more serious, giving you their full attention. \"You seem nervous. Is everything okay?\" They reach out and gently touch your hand.",
                            choices: [
                                { text: "\"I'm in love with you, Rohit.\"", next: "bold_confession" },
                                { text: "\"You're the most important person in my life.\"", next: "heartfelt_confession" },
                                { text: "\"Never mind, it's not that important.\"", next: "avoided_confession" }
                            ]
                        }
                    ],
                    romantic_approach: [
                        {
                            text: "Rohit looks up at the moon and sighs contentedly. \"It really is. Almost as beautiful as this moment.\" They look back at you with a soft smile.",
                            choices: [
                                { text: "\"The only thing more beautiful is you.\"", next: "romantic_confession" },
                                { text: "\"I wish moments like this could last forever.\"", next: "wistful_confession" },
                                { text: "\"We should probably head home soon.\"", next: "missed_opportunity" }
                            ]
                        }
                    ],
                    gentle_confession: [
                        {
                            text: "Rohit's cheeks turn pink, and they look down shyly before meeting your eyes again. \"I was hoping you'd say that. I've been feeling the Ankite way but didn't know how to tell you.\"",
                            choices: [
                                { text: "\"Really? I was so nervous you might not feel the Ankite.\"", next: "mutual_happy_ending" },
                                { text: "\"Can I kiss you?\"", next: "romantic_happy_ending" },
                                { text: "\"So what happens now?\"", next: "future_planning" }
                            ]
                        }
                    ],
                    bold_confession: [
                        {
                            text: "Rohit's eyes widen in surprise, then fill with warmth. \"Wow, I... I love you too. I have for so long but was scared to ruin our friendship.\"",
                            choices: [
                                { text: "\"Our friendship made this even more special.\"", next: "perfect_ending" },
                                { text: "\"I could never regret telling you how I feel.\"", next: "brave_ending" },
                                { text: "\"I'm so happy right now.\"", next: "joyful_ending" }
                            ]
                        }
                    ],
                    chickened_out: [
                        {
                            text: "Rohit laughs and stands up. \"Ice cream sounds perfect! But you know, I was kind of hoping you were going to say something else...\" They extend their hand to help you up.",
                            choices: [
                                { text: "\"What were you hoping I'd say?\"", next: "second_chance" },
                                { text: "\"Let's get that ice cream first.\"", next: "delayed_confession" },
                                { text: "Take their hand silently", next: "nonverbal_connection" }
                            ]
                        }
                    ]
                },
                endings: {
                    mutual_happy_ending: "You both laugh nervously and spend the rest of the evening talking about your feelings and planning your first official date. The friendship you built became the perfect foundation for love. ❤️",
                    perfect_ending: "Rohit takes your hand and you share your first kiss under the moonlight. Sometimes the best relationships start with the best friendships. Your love story has officially begun! 💕",
                    brave_ending: "Your courage to speak your truth paid off beautifully. Rohit admires your honesty and you both feel closer than ever. Love conquered fear! 💪❤️",
                    second_chance: "Rohit blushes and admits they were hoping you'd confess your feelings. You get your second chance and this time, you don't hesitate to share your heart. Sometimes timing is everything! 🌟"
                }
            },
            
            coffee: {
                character: "Ankit",
                title: "Coffee Shop Moment",
                story: [
                    {
                        text: "You're sitting across from Ankit in your favorite coffee shop, the Ankite place where you first met six months ago. They're laughing at something you said, and you realize this is the perfect moment. How do you begin?",
                        choices: [
                            { text: "\"Ankit, do you remember when we first met here?\"", next: "nostalgic_start" },
                            { text: "\"I have something important to ask you.\"", next: "serious_start" },
                            { text: "\"You have the most amazing laugh.\"", next: "compliment_start" }
                        ]
                    }
                ]
            }
        };
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        const restartBtn = document.getElementById('restartStory');
        const playModeBtn = document.getElementById('playMode');
        const createModeBtn = document.getElementById('createMode');
        const previewStoryBtn = document.getElementById('previewStory');
        const cancelCreatorBtn = document.getElementById('cancelCreator');

        restartBtn.addEventListener('click', () => {
            this.startNewStory();
        });

        playModeBtn.addEventListener('click', () => {
            this.switchToPlayMode();
        });

        createModeBtn.addEventListener('click', () => {
            this.switchToCreateMode();
        });

        previewStoryBtn.addEventListener('click', () => {
            this.previewCustomStory();
        });

        cancelCreatorBtn.addEventListener('click', () => {
            this.cancelStoryCreation();
        });
    }

    init() {
        this.startNewStory();
    }

    startNewStory() {
        const storyKeys = Object.keys(this.stories);
        const randomStory = storyKeys[Math.floor(Math.random() * storyKeys.length)];
        
        this.currentStory = this.stories[randomStory];
        this.storyIndex = 0;
        
        document.getElementById('characterName').textContent = this.currentStory.character;
        
        this.displayStoryPart(this.currentStory.story[0]);
        
        document.getElementById('restartStory').style.display = 'none';
    }

    displayStoryPart(storyPart) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const storyText = document.getElementById('storyText');
        const choicesContainer = document.getElementById('choicesContainer');
        
        storyText.style.opacity = '0';
        choicesContainer.style.opacity = '0';
        
        setTimeout(() => {
            
            this.typewriterEffect(storyText, storyPart.text);
            
            choicesContainer.innerHTML = '';
            
            if (storyPart.choices) {
                storyPart.choices.forEach((choice, index) => {
                    const choiceBtn = document.createElement('button');
                    choiceBtn.className = 'choice-btn';
                    choiceBtn.textContent = choice.text;
                    
                    choiceBtn.addEventListener('click', () => {
                        this.handleChoice(choice);
                    });
                    
                    choiceBtn.style.opacity = '0';
                    choiceBtn.style.transform = 'translateX(-20px)';
                    choicesContainer.appendChild(choiceBtn);
                    
                    const estimatedTypingTime = storyPart.text.length * 80 + 1000;
                    const choiceDelay = estimatedTypingTime + (index * 300) + 500;
                    
                    setTimeout(() => {
                        choiceBtn.style.transition = 'all 0.3s ease';
                        choiceBtn.style.opacity = '1';
                        choiceBtn.style.transform = 'translateX(0)';
                    }, choiceDelay);
                });
            }
            
            choicesContainer.style.opacity = '1';
            this.isAnimating = false;
        }, 300);
    }

    typewriterEffect(element, text) {
        element.innerHTML = '';
        element.style.opacity = '1';
        
        const typingIndicator = document.createElement('span');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        element.appendChild(typingIndicator);
        
        setTimeout(() => {
            element.removeChild(typingIndicator);
            this.simulateTyping(element, text);
        }, 800 + Math.random() * 600); 
    }

    simulateTyping(element, text) {
        element.textContent = '';
        element.classList.add('typing-cursor');
        
        let i = 0;
        const words = text.split(' ');
        let currentWord = 0;
        let currentChar = 0;
        
        const typeNextChar = () => {
            if (currentWord >= words.length) {
                element.classList.remove('typing-cursor');
                return;
            }
            
            const word = words[currentWord];
            
            if (currentChar < word.length) {
                if (Math.random() < 0.03 && word.length > 3) {
                    this.simulateTypo(element, word, currentChar, () => {
                       
                        element.textContent += word.charAt(currentChar);
                        currentChar++;
                        
                        let speed = this.getTypingSpeed(word.charAt(currentChar - 1));
                        setTimeout(typeNextChar, speed);
                    });
                    return;
                }
                
                
                element.textContent += word.charAt(currentChar);
                currentChar++;
                
                if (Math.random() < 0.1 && window.audioManager) {
                    window.audioManager.playSound('click');
                }
                
                let speed = this.getTypingSpeed(word.charAt(currentChar - 1));
                
                if (Math.random() < 0.05) {
                    speed += Math.random() * 300 + 200; 
                }
                
                setTimeout(typeNextChar, speed);
            } else {
                
                if (currentWord < words.length - 1) {
                    element.textContent += ' ';
                }
                currentWord++;
                currentChar = 0;
                
                
                const lastChar = word[word.length - 1];
                const wordPause = /[.!?]/.test(lastChar) ? 
                    Math.random() * 300 + 200 : 
                    Math.random() * 100 + 50;  
                    
                setTimeout(typeNextChar, wordPause);
            }
        };
        
        typeNextChar();
    }

    simulateTypo(element, word, charIndex, callback) {
        
        const wrongChars = 'qwertyuiopasdfghjklzxcvbnm';
        const wrongChar = wrongChars[Math.floor(Math.random() * wrongChars.length)];
        element.textContent += wrongChar;
        
        setTimeout(() => {
            element.textContent = element.textContent.slice(0, -1);
            setTimeout(callback, 150 + Math.random() * 100);
        }, 200 + Math.random() * 300);
    }

    getTypingSpeed(char) {
        const baseSpeed = 80; 
        
        if (char === ' ') return baseSpeed * 0.5;
        if (/[.!?]/.test(char)) return baseSpeed * 2;
        if (/[,;:]/.test(char)) return baseSpeed * 1.5;
        if (/[aeiou]/.test(char.toLowerCase())) return baseSpeed * 0.8; 
        if (/[qwertasdfgzxcv]/.test(char.toLowerCase())) return baseSpeed * 0.9; 
        
        return baseSpeed + Math.random() * 40 - 20;
    }

    handleChoice(choice) {
        
        if (window.audioManager) {
            window.audioManager.playSound('click');
        }
        
        this.showThinking(() => {
            if (choice.next) {
               
                if (this.currentStory.paths[choice.next]) {
                    this.displayStoryPart(this.currentStory.paths[choice.next][0]);
                } else if (this.currentStory.endings[choice.next]) {
                    this.displayEnding(choice.next);
                } else {
                   
                    this.displayEnding('default');
                }
            }
        });
    }

    showThinking(callback) {
        const storyText = document.getElementById('storyText');
        const choicesContainer = document.getElementById('choicesContainer');
        
        choicesContainer.style.opacity = '0';
        
        setTimeout(() => {
            choicesContainer.innerHTML = '';
            const thinkingIndicator = document.createElement('div');
            thinkingIndicator.className = 'thinking-indicator';
            thinkingIndicator.innerHTML = `
                <span class="character-name">${this.currentStory.character}</span> is thinking...
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            `;
            
            storyText.parentNode.insertBefore(thinkingIndicator, choicesContainer);
            const thinkingTime = Math.random() * 2000 + 1000;
            setTimeout(() => {
                thinkingIndicator.remove();
                callback();
            }, thinkingTime);
        }, 300);
    }

    displayEnding(endingKey) {
        const storyText = document.getElementById('storyText');
        const choicesContainer = document.getElementById('choicesContainer');
        const restartBtn = document.getElementById('restartStory');
        
        let endingText = this.currentStory.endings[endingKey];
        
        if (!endingText) {
            endingText = "Your story ends here, but every ending is a new beginning. Sometimes the courage to speak your heart is victory enough. 💝";
        }
        
        choicesContainer.style.opacity = '0';
        
        setTimeout(() => {
            choicesContainer.innerHTML = '';
            
            this.typewriterEffect(storyText, endingText);
            
            setTimeout(() => {
                restartBtn.style.display = 'block';
                restartBtn.style.animation = 'fadeInUp 0.5s ease';
                
                if (endingText.includes('❤️') || endingText.includes('💕') || endingText.includes('💝')) {
                    this.createCelebrationHearts();
                }
            }, endingText.length * 30 + 500);
        }, 300);
        
        this.saveStoryCompletion(endingKey);
    }

    createCelebrationHearts() {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = ['💖', '💕', '💗', '💓', '❤️'][Math.floor(Math.random() * 5)];
                heart.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * window.innerWidth}px;
                    top: ${window.innerHeight}px;
                    font-size: ${Math.random() * 15 + 20}px;
                    z-index: 1000;
                    pointer-events: none;
                    animation: float 4s ease-out forwards;
                `;
                
                document.body.appendChild(heart);
                
                setTimeout(() => heart.remove(), 4000);
            }, i * 100);
        }
    }

    saveStoryCompletion(endingKey) {
        const stats = JSON.parse(localStorage.getItem('confession-stats') || '{}');
        
        if (!stats.completions) stats.completions = {};
        if (!stats.completions[endingKey]) stats.completions[endingKey] = 0;
        
        stats.completions[endingKey]++;
        stats.totalPlays = (stats.totalPlays || 0) + 1;
        stats.lastPlayed = new Date().toISOString();
        
        localStorage.setItem('confession-stats', JSON.stringify(stats));
    }

    getStats() {
        return JSON.parse(localStorage.getItem('confession-stats') || '{}');
    }

    addCustomStory(storyKey, storyData) {
        this.stories[storyKey] = storyData;
    }

    getAvailableStories() {
        return Object.keys(this.stories).map(key => ({
            key,
            title: this.stories[key].title,
            character: this.stories[key].character
        }));
    }

    switchToPlayMode() {
        const playModeBtn = document.getElementById('playMode');
        const createModeBtn = document.getElementById('createMode');
        const storyDisplay = document.getElementById('storyDisplay');
        const storyCreator = document.getElementById('storyCreator');

        playModeBtn.classList.add('active');
        createModeBtn.classList.remove('active');
        storyDisplay.style.display = 'block';
        storyCreator.style.display = 'none';

        if (!this.currentStory) {
            this.startNewStory();
        }

        if (window.audioManager) {
            window.audioManager.playSound('click');
        }
    }

    switchToCreateMode() {
        const playModeBtn = document.getElementById('playMode');
        const createModeBtn = document.getElementById('createMode');
        const storyDisplay = document.getElementById('storyDisplay');
        const storyCreator = document.getElementById('storyCreator');
        playModeBtn.classList.remove('active');
        createModeBtn.classList.add('active');
        storyDisplay.style.display = 'none';
        storyCreator.style.display = 'block';

        this.clearCreatorForm();

        if (window.audioManager) {
            window.audioManager.playSound('click');
        }
    }

    clearCreatorForm() {
        document.getElementById('customCharacterName').value = '';
        document.getElementById('customScenario').value = '';
        document.getElementById('customOpening').value = '';
        
        const choiceInputs = document.querySelectorAll('.choice-input');
        const responseInputs = document.querySelectorAll('.response-input');
        
        choiceInputs.forEach(input => input.value = '');
        responseInputs.forEach(input => input.value = '');
    }

    previewCustomStory() {
        const characterName = document.getElementById('customCharacterName').value.trim();
        const scenario = document.getElementById('customScenario').value.trim();
        const opening = document.getElementById('customOpening').value.trim();
        
        const choiceInputs = document.querySelectorAll('.choice-input');
        const responseInputs = document.querySelectorAll('.response-input');
        
        const choices = Array.from(choiceInputs).map(input => input.value.trim()).filter(val => val);
        const responses = Array.from(responseInputs).map(input => input.value.trim()).filter(val => val);

        if (!characterName || !opening || choices.length < 2) {
            alert('Please fill in at least the character name, opening story, and 2 choice options.');
            return;
        }

        const customStory = this.createCustomStoryObject(characterName, scenario, opening, choices, responses);
        
        this.switchToPlayMode();
        this.currentStory = customStory;
        this.displayStoryPart(customStory.start[0]);

        if (window.audioManager) {
            window.audioManager.playSound('success');
        }
    }

    createCustomStoryObject(characterName, scenario, opening, choices, responses) {
       
        const fullStoryText = scenario ? `${scenario}\n\n${opening}` : opening;
        const choiceObjects = choices.map((choice, index) => ({
            text: choice,
            next: `custom_ending_${index}`
        }));

        const endings = {};
        choices.forEach((choice, index) => {
            const response = responses[index] || "Thank you for sharing your feelings with me.";
            endings[`custom_ending_${index}`] = {
                text: response,
                mood: 'neutral'
            };
        });

        return {
            id: 'custom',
            character: characterName,
            title: 'Your Custom Story',
            start: [{
                text: fullStoryText,
                choices: choiceObjects
            }],
            paths: {},
            endings: endings
        };
    }

    cancelStoryCreation() {
        this.switchToPlayMode();

        if (window.audioManager) {
            window.audioManager.playSound('click');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.confessionSimulator = new ConfessionSimulator();
});