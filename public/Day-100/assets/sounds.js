// Sound Definitions for EduPlay Educational Games
const soundDefinitions = {
    // Correct answer sound - pleasant ascending chord
    correct: {
        type: 'chord',
        frequencies: [523.25, 659.25, 783.99], // C5, E5, G5 (C major chord)
        duration: 0.4,
        volume: 0.6,
        waveType: 'sine',
        stagger: 50 // Slight delay between notes for pleasant effect
    },

    // Incorrect answer sound - gentle descending tone
    incorrect: {
        type: 'sequence',
        waveType: 'sine',
        volume: 0.4,
        notes: [
            { frequency: 392.00, duration: 0.15, delay: 0 },    // G4
            { frequency: 349.23, duration: 0.15, delay: 100 },  // F4
            { frequency: 293.66, duration: 0.2, delay: 200 }    // D4
        ]
    },

    // Game start sound - cheerful ascending sequence
    gameStart: {
        type: 'sequence',
        waveType: 'triangle',
        volume: 0.5,
        notes: [
            { frequency: 261.63, duration: 0.1, delay: 0 },    // C4
            { frequency: 329.63, duration: 0.1, delay: 80 },   // E4
            { frequency: 392.00, duration: 0.1, delay: 160 },  // G4
            { frequency: 523.25, duration: 0.3, delay: 240 }   // C5
        ]
    },

    // Game completion sound - triumphant melody
    gameComplete: {
        type: 'sequence',
        waveType: 'triangle',
        volume: 0.7,
        notes: [
            { frequency: 523.25, duration: 0.2, delay: 0 },    // C5
            { frequency: 587.33, duration: 0.2, delay: 150 },  // D5
            { frequency: 659.25, duration: 0.2, delay: 300 },  // E5
            { frequency: 698.46, duration: 0.2, delay: 450 },  // F5
            { frequency: 783.99, duration: 0.4, delay: 600 }   // G5
        ]
    },

    // Button click sound - short pleasant tone
    click: {
        type: 'tone',
        frequency: 800,
        duration: 0.1,
        volume: 0.3,
        waveType: 'sine'
    },

    // Hover sound - very subtle tone
    hover: {
        type: 'tone',
        frequency: 1200,
        duration: 0.05,
        volume: 0.1,
        waveType: 'sine'
    },

    // Hint sound - mysterious but helpful
    hint: {
        type: 'sequence',
        waveType: 'sine',
        volume: 0.4,
        notes: [
            { frequency: 440.00, duration: 0.1, delay: 0 },    // A4
            { frequency: 554.37, duration: 0.1, delay: 100 },  // C#5
            { frequency: 659.25, duration: 0.2, delay: 200 }   // E5
        ]
    },

    // Level up sound - exciting ascending pattern
    levelUp: {
        type: 'sequence',
        waveType: 'sawtooth',
        volume: 0.6,
        notes: [
            { frequency: 261.63, duration: 0.08, delay: 0 },
            { frequency: 293.66, duration: 0.08, delay: 60 },
            { frequency: 329.63, duration: 0.08, delay: 120 },
            { frequency: 392.00, duration: 0.08, delay: 180 },
            { frequency: 440.00, duration: 0.08, delay: 240 },
            { frequency: 493.88, duration: 0.08, delay: 300 },
            { frequency: 523.25, duration: 0.3, delay: 360 }
        ]
    },

    // Achievement unlocked - special celebration sound
    achievement: {
        type: 'sequence',
        waveType: 'triangle',
        volume: 0.8,
        notes: [
            { frequency: 659.25, duration: 0.15, delay: 0 },   // E5
            { frequency: 783.99, duration: 0.15, delay: 100 }, // G5
            { frequency: 987.77, duration: 0.15, delay: 200 }, // B5
            { frequency: 1318.51, duration: 0.4, delay: 300 }  // E6
        ]
    },

    // Timer warning - gentle alert
    timerWarning: {
        type: 'tone',
        frequency: 880,
        duration: 0.3,
        volume: 0.5,
        waveType: 'square'
    },

    // Error sound - gentle but noticeable
    error: {
        type: 'tone',
        frequency: 220,
        duration: 0.4,
        volume: 0.4,
        waveType: 'sawtooth'
    },

    // Success fanfare - short celebratory sound
    success: {
        type: 'chord',
        frequencies: [523.25, 659.25, 783.99, 1046.50], // C major chord with octave
        duration: 0.6,
        volume: 0.7,
        waveType: 'triangle',
        stagger: 40
    },

    // Page transition - smooth sound
    pageTransition: {
        type: 'sequence',
        waveType: 'sine',
        volume: 0.3,
        notes: [
            { frequency: 440.00, duration: 0.1, delay: 0 },
            { frequency: 523.25, duration: 0.15, delay: 80 }
        ]
    },

    // Coin/point collection sound
    coin: {
        type: 'sequence',
        waveType: 'square',
        volume: 0.5,
        notes: [
            { frequency: 988, duration: 0.1, delay: 0 },
            { frequency: 1319, duration: 0.2, delay: 100 }
        ]
    },

    // Power-up sound
    powerUp: {
        type: 'sequence',
        waveType: 'sawtooth',
        volume: 0.6,
        notes: [
            { frequency: 392.00, duration: 0.1, delay: 0 },
            { frequency: 523.25, duration: 0.1, delay: 80 },
            { frequency: 659.25, duration: 0.1, delay: 160 },
            { frequency: 783.99, duration: 0.2, delay: 240 }
        ]
    },

    // Countdown sound
    countdown: {
        type: 'tone',
        frequency: 800,
        duration: 0.2,
        volume: 0.5,
        waveType: 'sine'
    },

    // Final countdown (different pitch)
    countdownFinal: {
        type: 'tone',
        frequency: 1200,
        duration: 0.3,
        volume: 0.6,
        waveType: 'sine'
    },

    // Whoosh sound for animations
    whoosh: {
        type: 'noise',
        duration: 0.3,
        volume: 0.2,
        filterType: 'highpass',
        filterFrequency: 2000
    },

    // Pop sound for UI interactions
    pop: {
        type: 'tone',
        frequency: 1000,
        duration: 0.08,
        volume: 0.3,
        waveType: 'sine'
    },

    // Notification sound
    notification: {
        type: 'sequence',
        waveType: 'sine',
        volume: 0.4,
        notes: [
            { frequency: 800, duration: 0.1, delay: 0 },
            { frequency: 1000, duration: 0.15, delay: 120 }
        ]
    },

    // Bonus sound - special reward
    bonus: {
        type: 'sequence',
        waveType: 'triangle',
        volume: 0.6,
        notes: [
            { frequency: 523.25, duration: 0.1, delay: 0 },
            { frequency: 659.25, duration: 0.1, delay: 80 },
            { frequency: 783.99, duration: 0.1, delay: 160 },
            { frequency: 1046.50, duration: 0.1, delay: 240 },
            { frequency: 1318.51, duration: 0.2, delay: 320 }
        ]
    }
};

// Musical note helper functions
const Notes = {
    // Convert note name to frequency
    toFreq: (note, octave = 4) => {
        const noteMap = {
            'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
            'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
            'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
        };
        
        const baseFreq = noteMap[note.toUpperCase()];
        return baseFreq ? baseFreq * Math.pow(2, octave - 4) : 440;
    },

    // Common chord progressions
    chords: {
        major: (root, octave = 4) => [
            Notes.toFreq(root, octave),
            Notes.toFreq(root, octave) * 1.25,    // Major third
            Notes.toFreq(root, octave) * 1.5      // Perfect fifth
        ],
        
        minor: (root, octave = 4) => [
            Notes.toFreq(root, octave),
            Notes.toFreq(root, octave) * 1.2,     // Minor third
            Notes.toFreq(root, octave) * 1.5      // Perfect fifth
        ]
    }
};

// Predefined sound themes for different subjects
const SoundThemes = {
    math: {
        correct: 'correct',
        incorrect: 'incorrect',
        gameStart: 'gameStart',
        gameComplete: 'success'
    },
    
    english: {
        correct: 'achievement',
        incorrect: 'error',
        gameStart: 'powerUp',
        gameComplete: 'bonus'
    },
    
    science: {
        correct: 'levelUp',
        incorrect: 'incorrect',
        gameStart: 'notification',
        gameComplete: 'gameComplete'
    }
};

// Export for global use
if (typeof window !== 'undefined') {
    window.soundDefinitions = soundDefinitions;
    window.Notes = Notes;
    window.SoundThemes = SoundThemes;
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        soundDefinitions,
        Notes,
        SoundThemes
    };
}
