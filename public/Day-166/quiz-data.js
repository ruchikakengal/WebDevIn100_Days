// Quiz Questions and Options Data
const quizData = [
    {
        question: "Choose an ancient symbol that resonates with your soul",
        type: "symbols",
        options: [
            {
                id: "ankh",
                icon: "☥",
                text: "Ankh - Key of Life",
                value: "egypt"
            },
            {
                id: "yin_yang",
                icon: "☯",
                text: "Yin Yang - Balance",
                value: "china"
            },
            {
                id: "trinity",
                icon: "⚛",
                text: "Trinity - Sacred Three",
                value: "celtic"
            },
            {
                id: "lotus",
                icon: "🪷",
                text: "Lotus - Enlightenment",
                value: "india"
            }
        ]
    },
    {
        question: "Which elemental force calls to your inner being?",
        type: "elements",
        options: [
            {
                id: "fire",
                icon: "🔥",
                text: "Fire - Passion & Power",
                value: "warrior"
            },
            {
                id: "water",
                icon: "🌊",
                text: "Water - Flow & Wisdom",
                value: "healer"
            },
            {
                id: "earth",
                icon: "🌍",
                text: "Earth - Stability & Growth",
                value: "builder"
            },
            {
                id: "air",
                icon: "🌬️",
                text: "Air - Freedom & Knowledge",
                value: "scholar"
            }
        ]
    },
    {
        question: "In your dreams, which path do you find yourself walking?",
        type: "paths",
        options: [
            {
                id: "forest",
                icon: "🌲",
                text: "Mystical Forest",
                value: "mystic",
                background: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect fill=\"%23064e3b\" width=\"100\" height=\"100\"/><circle fill=\"%23065f46\" cx=\"20\" cy=\"30\" r=\"15\"/><circle fill=\"%23047857\" cx=\"70\" cy=\"20\" r=\"12\"/><circle fill=\"%23059669\" cx=\"50\" cy=\"60\" r=\"20\"/></svg>')"
            },
            {
                id: "ocean",
                icon: "🌊",
                text: "Endless Ocean",
                value: "explorer",
                background: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect fill=\"%23075985\" width=\"100\" height=\"100\"/><path fill=\"%230284c7\" d=\"M0,60 Q25,45 50,60 T100,60 V100 H0 Z\"/><path fill=\"%230ea5e9\" d=\"M0,70 Q25,55 50,70 T100,70 V100 H0 Z\"/></svg>')"
            },
            {
                id: "mountain",
                icon: "⛰️",
                text: "Sacred Mountain",
                value: "guardian",
                background: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect fill=\"%23374151\" width=\"100\" height=\"100\"/><polygon fill=\"%234b5563\" points=\"0,100 30,20 60,100\"/><polygon fill=\"%236b7280\" points=\"40,100 70,10 100,100\"/></svg>')"
            },
            {
                id: "desert",
                icon: "🏜️",
                text: "Golden Desert",
                value: "nomad",
                background: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect fill=\"%23d97706\" width=\"100\" height=\"100\"/><ellipse fill=\"%23f59e0b\" cx=\"30\" cy=\"70\" rx=\"25\" ry=\"15\"/><ellipse fill=\"%23fbbf24\" cx=\"70\" cy=\"60\" rx=\"20\" ry=\"10\"/></svg>')"
            }
        ]
    },
    {
        question: "What draws you most in the realm of knowledge?",
        type: "knowledge",
        options: [
            {
                id: "stars",
                icon: "⭐",
                text: "Celestial Mysteries",
                value: "astronomer"
            },
            {
                id: "herbs",
                icon: "🌿",
                text: "Nature's Secrets",
                value: "herbalist"
            },
            {
                id: "scrolls",
                icon: "📜",
                text: "Ancient Wisdom",
                value: "scribe"
            },
            {
                id: "crystals",
                icon: "💎",
                text: "Sacred Geometry",
                value: "alchemist"
            }
        ]
    },
    {
        question: "In your soul's calling, you feel most drawn to...",
        type: "calling",
        options: [
            {
                id: "protect",
                icon: "🛡️",
                text: "Protecting Others",
                value: "protector"
            },
            {
                id: "heal",
                icon: "🕊️",
                text: "Healing & Nurturing",
                value: "healer"
            },
            {
                id: "create",
                icon: "🎨",
                text: "Creating Beauty",
                value: "artist"
            },
            {
                id: "lead",
                icon: "👑",
                text: "Leading & Inspiring",
                value: "ruler"
            }
        ]
    }
];

// Export for use in main script
window.quizData = quizData;
