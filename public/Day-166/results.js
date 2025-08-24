// Past Life Results Generator
const pastLifeData = {
    // Location-based results
    locations: {
        egypt: {
            name: "Ancient Egypt",
            period: "3100-30 BCE",
            symbols: ["☥", "𓂀", "𓇳"],
            roles: {
                healer: "Temple Healer of Isis",
                warrior: "Guardian of the Pharaoh",
                scholar: "Scribe of the Sacred Texts",
                builder: "Master Architect of Pyramids",
                mystic: "High Priest of Thoth",
                explorer: "Navigator of the Nile",
                guardian: "Keeper of Ancient Wisdom",
                nomad: "Desert Oracle",
                astronomer: "Star Reader of Memphis",
                herbalist: "Sacred Garden Keeper",
                scribe: "Royal Chronicler",
                alchemist: "Master of Sacred Chemistry",
                protector: "Sphinx Guardian",
                artist: "Royal Tomb Painter",
                ruler: "Beloved Pharaoh"
            }
        },
        china: {
            name: "Ancient China",
            period: "2070 BCE-220 CE",
            symbols: ["☯", "龍", "鳳"],
            roles: {
                healer: "Qi Master and Healer",
                warrior: "Dragon Warrior",
                scholar: "Confucian Philosopher",
                builder: "Great Wall Architect",
                mystic: "Taoist Sage",
                explorer: "Silk Road Merchant",
                guardian: "Temple Guardian",
                nomad: "Wandering Monk",
                astronomer: "Imperial Court Astronomer",
                herbalist: "Master of Traditional Medicine",
                scribe: "Mandarin Scholar",
                alchemist: "Elixir of Life Seeker",
                protector: "Imperial Bodyguard",
                artist: "Master Calligrapher",
                ruler: "Wise Emperor"
            }
        },
        celtic: {
            name: "Celtic Lands",
            period: "800 BCE-400 CE",
            symbols: ["☘", "🔱", "🌙"],
            roles: {
                healer: "Druidic Healer",
                warrior: "Celtic Clan Warrior",
                scholar: "Bard of Ancient Lore",
                builder: "Stone Circle Creator",
                mystic: "Forest Druid",
                explorer: "Celtic Sea Voyager",
                guardian: "Sacred Grove Protector",
                nomad: "Traveling Storyteller",
                astronomer: "Keeper of Seasonal Rites",
                herbalist: "Woodland Herbalist",
                scribe: "Keeper of Oral Traditions",
                alchemist: "Celtic Spell Weaver",
                protector: "Clan Defender",
                artist: "Celtic Metalsmith",
                ruler: "High King of the Celts"
            }
        },
        india: {
            name: "Ancient India",
            period: "3300-550 CE",
            symbols: ["🕉", "🪷", "⚛"],
            roles: {
                healer: "Ayurvedic Physician",
                warrior: "Rajput Warrior",
                scholar: "Vedic Philosopher",
                builder: "Temple Architect",
                mystic: "Himalayan Yogi",
                explorer: "Spice Route Trader",
                guardian: "Temple Guardian",
                nomad: "Wandering Sadhu",
                astronomer: "Vedic Astronomer",
                herbalist: "Ayurvedic Herbalist",
                scribe: "Sanskrit Scholar",
                alchemist: "Tantric Master",
                protector: "Palace Guard",
                artist: "Classical Dancer",
                ruler: "Enlightened Maharaja"
            }
        }
    },

    // Story templates for different roles
    stories: {
        healer: [
            "You possessed the divine gift of healing, using ancient knowledge to mend both body and spirit. Your touch could ease the deepest pain, and your wisdom guided many through their darkest hours.",
            "With herbs and sacred rituals, you served as a bridge between the physical and spiritual realms. People traveled great distances to seek your healing powers and spiritual guidance.",
            "You were known throughout the land for your miraculous healing abilities. Your sanctuary was a place of hope where the sick found renewed life through your compassionate care."
        ],
        warrior: [
            "Your blade sang with honor as you defended your people against all threats. Courage flowed through your veins like liquid fire, and your name struck fear into the hearts of enemies.",
            "You stood as an unbreakable shield between evil and innocence. Your tactical brilliance and unwavering bravery made you a legend whispered around fires for generations.",
            "In the heat of battle, you were poetry in motion - deadly, graceful, and absolutely fearless. Your warrior's code guided every decision, and your loyalty was absolute."
        ],
        scholar: [
            "Your mind was a vast library of ancient wisdom. You spent countless hours deciphering mysteries and preserving knowledge that would guide future generations.",
            "You were the keeper of sacred texts and hidden truths. Your intellectual pursuits unlocked secrets of the universe that others could barely comprehend.",
            "Through dedication to learning and teaching, you illuminated minds and preserved the wisdom of ages. Your scrolls and teachings became treasures of civilization."
        ],
        mystic: [
            "You walked between worlds, communing with spirits and channeling divine energy. Your visions guided rulers and your prophecies shaped the destiny of nations.",
            "The veil between dimensions was thin for you. You possessed the rare gift of seeing beyond the physical realm and interpreting the language of the cosmos.",
            "Your connection to the divine was profound and unshakeable. Through meditation and ritual, you accessed wisdom from higher planes of existence."
        ],
        ruler: [
            "You wore the crown with wisdom and compassion, ruling not through fear but through love and justice. Your reign was remembered as a golden age of prosperity and peace.",
            "Your leadership united tribes and brought harmony to warring factions. You built a legacy of justice that lasted for centuries after your passing.",
            "Born to rule, you transformed a simple kingdom into a thriving civilization. Your laws were just, your people prosperous, and your name became legend."
        ]
    }
};

// Function to generate past life result
function generatePastLife(answers) {
    // Determine location based on symbol choice
    let location = 'egypt'; // default
    if (answers[0]) {
        location = answers[0];
    }

    // Determine primary role based on element and calling
    let primaryRole = 'mystic'; // default
    const elementRole = answers[1] || 'mystic';
    const pathRole = answers[2] || 'mystic';
    const knowledgeRole = answers[3] || 'mystic';
    const callingRole = answers[4] || 'mystic';

    // Priority system for role determination
    const roleWeights = {};
    [elementRole, pathRole, knowledgeRole, callingRole].forEach(role => {
        roleWeights[role] = (roleWeights[role] || 0) + 1;
    });

    // Find the most common role
    primaryRole = Object.keys(roleWeights).reduce((a, b) => 
        roleWeights[a] > roleWeights[b] ? a : b
    );

    const locationData = pastLifeData.locations[location];
    const roleName = locationData.roles[primaryRole];
    
    // Generate story
    const storyTemplates = pastLifeData.stories[primaryRole] || pastLifeData.stories.mystic;
    const randomStory = storyTemplates[Math.floor(Math.random() * storyTemplates.length)];
    
    // Add location-specific details
    const locationDetails = `In the mystical land of ${locationData.name} during the era of ${locationData.period}, `;
    const fullStory = locationDetails + randomStory.toLowerCase();

    return {
        title: roleName,
        era: `${locationData.name} (${locationData.period})`,
        story: fullStory,
        symbol: locationData.symbols[Math.floor(Math.random() * locationData.symbols.length)],
        location: location,
        role: primaryRole
    };
}

// Export for use in main script
window.generatePastLife = generatePastLife;
