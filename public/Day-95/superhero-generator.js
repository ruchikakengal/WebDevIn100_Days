class SuperheroGenerator {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        // First letter adjectives
        this.adjectives = {
            'A': ['Amazing', 'Atomic', 'Astral', 'Armored', 'Arctic'],
            'B': ['Blazing', 'Bionic', 'Bold', 'Brilliant', 'Brutal'],
            'C': ['Cosmic', 'Crystal', 'Crimson', 'Cyber', 'Colossal'],
            'D': ['Dynamic', 'Dark', 'Divine', 'Deadly', 'Dimensional'],
            'E': ['Electric', 'Eternal', 'Emerald', 'Epic', 'Elemental'],
            'F': ['Flaming', 'Frost', 'Fearless', 'Fantastic', 'Fierce'],
            'G': ['Golden', 'Galactic', 'Guardian', 'Ghostly', 'Gigantic'],
            'H': ['Heroic', 'Hyper', 'Haunted', 'Hurricane', 'Holographic'],
            'I': ['Iron', 'Invisible', 'Inferno', 'Infinite', 'Immortal'],
            'J': ['Jade', 'Justice', 'Jet', 'Jolting', 'Jungle'],
            'K': ['Kinetic', 'Knight', 'Killer', 'Kryptonian', 'Kinetic'],
            'L': ['Lightning', 'Lunar', 'Legendary', 'Laser', 'Lethal'],
            'M': ['Mighty', 'Mystic', 'Magnetic', 'Metallic', 'Molecular'],
            'N': ['Nuclear', 'Night', 'Neon', 'Nova', 'Ninja'],
            'O': ['Omega', 'Orbital', 'Obsidian', 'Oceanic', 'Omnipotent'],
            'P': ['Plasma', 'Phoenix', 'Psychic', 'Prism', 'Phantom'],
            'Q': ['Quantum', 'Quake', 'Quasar', 'Quick', 'Quest'],
            'R': ['Radiant', 'Rocket', 'Raging', 'Rainbow', 'Robotic'],
            'S': ['Silver', 'Solar', 'Shadow', 'Stellar', 'Storm'],
            'T': ['Thunder', 'Titan', 'Turbo', 'Techno', 'Temporal'],
            'U': ['Ultra', 'Universal', 'Unstoppable', 'Umbral', 'Unbreakable'],
            'V': ['Velocity', 'Vortex', 'Venomous', 'Volcanic', 'Vector'],
            'W': ['Wonder', 'Warp', 'Wild', 'Winged', 'Warrior'],
            'X': ['X-Ray', 'Xenon', 'Xtreme', 'Xerus', 'Xiphoid'],
            'Y': ['Yellow', 'Yonder', 'Yin-Yang', 'Yeti', 'Youth'],
            'Z': ['Zero', 'Zap', 'Zenith', 'Zodiac', 'Zone']
        };

        // Last letter animals/elements
        this.animals = {
            'A': ['Archer', 'Asteroid', 'Angel', 'Anaconda', 'Albatross'],
            'B': ['Bear', 'Bolt', 'Blade', 'Blizzard', 'Beacon'],
            'C': ['Cat', 'Comet', 'Cyclone', 'Cobra', 'Core'],
            'D': ['Dragon', 'Diamond', 'Dagger', 'Destroyer', 'Defender'],
            'E': ['Eagle', 'Eclipse', 'Explosion', 'Entity', 'Edge'],
            'F': ['Falcon', 'Force', 'Fire', 'Fang', 'Flash'],
            'G': ['Guardian', 'Galaxy', 'Ghost', 'Gear', 'Gladiator'],
            'H': ['Hawk', 'Hurricane', 'Hunter', 'Hammer', 'Hero'],
            'I': ['Ion', 'Impact', 'Inferno', 'Interceptor', 'Invader'],
            'J': ['Jaguar', 'Jet', 'Juggernaut', 'Judge', 'Jackal'],
            'K': ['Knight', 'Kraken', 'Katana', 'Keeper', 'King'],
            'L': ['Lion', 'Lightning', 'Laser', 'Legend', 'Lancer'],
            'M': ['Mantis', 'Meteor', 'Machine', 'Master', 'Mage'],
            'N': ['Nova', 'Ninja', 'Nexus', 'Nightmare', 'Nemesis'],
            'O': ['Owl', 'Orb', 'Oracle', 'Omega', 'Overlord'],
            'P': ['Panther', 'Phoenix', 'Pulse', 'Phantom', 'Protector'],
            'Q': ['Quasar', 'Queen', 'Quantum', 'Quake', 'Quest'],
            'R': ['Raven', 'Ray', 'Ranger', 'Rider', 'Reaper'],
            'S': ['Shark', 'Star', 'Striker', 'Spirit', 'Sentinel'],
            'T': ['Tiger', 'Tornado', 'Titan', 'Thunder', 'Tempest'],
            'U': ['Unicorn', 'Universe', 'Unity', 'Ultra', 'Uprising'],
            'V': ['Viper', 'Vector', 'Void', 'Voyager', 'Victor'],
            'W': ['Wolf', 'Wave', 'Warrior', 'Wind', 'Wizard'],
            'X': ['Xerus', 'X-Force', 'Xenon', 'X-Ray', 'Xander'],
            'Y': ['Yak', 'Yonder', 'Yin', 'Yeti', 'Yearning'],
            'Z': ['Zebra', 'Zephyr', 'Zone', 'Zenith', 'Zero']
        };

        // Superpowers based on name characteristics
        this.powerCategories = {
            elemental: ['Fire Manipulation', 'Ice Control', 'Lightning Generation', 'Earth Bending', 'Wind Mastery', 'Water Control'],
            physical: ['Super Strength', 'Enhanced Speed', 'Flight', 'Invisibility', 'Invulnerability', 'Regeneration'],
            mental: ['Telepathy', 'Telekinesis', 'Mind Control', 'Precognition', 'Psychometry', 'Illusion Creation'],
            technological: ['Technopathy', 'Energy Projection', 'Force Fields', 'Holographic Projection', 'Cybernetic Interface', 'Digital Manipulation'],
            mystical: ['Magic Casting', 'Reality Manipulation', 'Time Control', 'Dimensional Travel', 'Soul Vision', 'Cosmic Awareness'],
            combat: ['Martial Arts Mastery', 'Weapon Proficiency', 'Tactical Genius', 'Enhanced Reflexes', 'Combat Prediction', 'Berserker Rage']
        };

        // Costume styles and colors
        this.costumeStyles = [
            'Classic Superhero Suit', 'Armored Battle Gear', 'Mystical Robes', 'Stealth Ninja Outfit',
            'Cosmic Space Suit', 'Elemental Garb', 'Tech-Enhanced Uniform', 'Ceremonial Warrior Attire',
            'Modern Tactical Gear', 'Vintage Hero Costume', 'Alien-Inspired Suit', 'Magical Enchanted Wear'
        ];

        this.colorPalettes = [
            ['#FF6B6B', '#4ECDC4', '#45B7D1'], // Red, Teal, Blue
            ['#96CEB4', '#DDA0DD', '#98D8C8'], // Mint, Plum, Aqua
            ['#FFD93D', '#FF6B9D', '#6BCF7F'], // Yellow, Pink, Green
            ['#A8E6CF', '#FF8B94', '#FFD3A5'], // Light Green, Coral, Peach
            ['#FD79A8', '#FDCB6E', '#6C5CE7'], // Pink, Orange, Purple
            ['#74B9FF', '#00CEC9', '#55A3FF'], // Blue, Cyan, Light Blue
            ['#E17055', '#FDCB6E', '#A29BFE'], // Orange, Yellow, Lavender
            ['#00B894', '#FF7675', '#FD79A8'], // Green, Red, Pink
            ['#636E72', '#DDD', '#2D3436'], // Gray, Light Gray, Dark Gray
            ['#8E44AD', '#E74C3C', '#F39C12'] // Purple, Red, Orange
        ];

        // Origin story templates
        this.originTemplates = [
            "Born on a distant planet, {name} was sent to Earth as a child when their homeworld faced destruction. Growing up among humans, they discovered their extraordinary abilities and vowed to protect their adopted home.",
            "After a laboratory accident involving experimental {element} energy, {originalName} was transformed into the powerful {name}. Now they use their incredible powers to defend the innocent and fight injustice.",
            "Once a brilliant scientist, {originalName} created a revolutionary {device} that granted them amazing abilities. As {name}, they now use their scientific knowledge and superhuman powers to make the world a better place.",
            "{originalName} discovered they were descended from an ancient bloodline of mystical guardians. Embracing their destiny as {name}, they now protect the balance between the mortal and supernatural realms.",
            "During a cosmic storm, {originalName} was struck by otherworldly energy that awakened dormant abilities within their DNA. Transformed into {name}, they became Earth's defender against cosmic threats.",
            "Born with extraordinary gifts, {originalName} was trained from childhood by a secret order of heroes. Now, as {name}, they continue the ancient tradition of protecting humanity from darkness."
        ];
    }

    generateSuperhero(name) {
        const cleanName = name.trim();
        const firstLetter = cleanName.charAt(0).toUpperCase();
        const lastLetter = cleanName.charAt(cleanName.length - 1).toUpperCase();
        
        // Generate consistent results using simple hash
        const nameHash = this.simpleHash(cleanName.toLowerCase());
        
        // Generate superhero name
        const adjective = this.getRandomFromArray(this.adjectives[firstLetter] || this.adjectives['S'], nameHash);
        const animal = this.getRandomFromArray(this.animals[lastLetter] || this.animals['R'], nameHash + 1);
        const superheroName = `The ${adjective} ${animal}`;
        
        // Calculate power level (1-5 stars based on name length)
        const powerLevel = Math.min(Math.max(Math.floor(cleanName.length / 3), 1), 5);
        
        // Generate powers
        const powers = this.generatePowers(cleanName, nameHash);
        
        // Generate costume
        const costume = this.generateCostume(nameHash);
        
        // Generate origin story
        const origin = this.generateOriginStory(superheroName, cleanName, nameHash);
        
        return {
            name: superheroName,
            originalName: cleanName,
            powerLevel: powerLevel,
            powers: powers,
            costume: costume,
            origin: origin
        };
    }

    generatePowers(name, hash) {
        const powerCount = Math.min(Math.max(Math.floor(name.length / 4) + 2, 2), 6);
        const powers = [];
        const categories = Object.keys(this.powerCategories);
        
        for (let i = 0; i < powerCount; i++) {
            const category = categories[(hash + i) % categories.length];
            const categoryPowers = this.powerCategories[category];
            const power = this.getRandomFromArray(categoryPowers, hash + i + name.length);
            
            if (!powers.includes(power)) {
                powers.push(power);
            }
        }
        
        return powers.slice(0, powerCount);
    }

    generateCostume(hash) {
        const style = this.getRandomFromArray(this.costumeStyles, hash);
        const colorPalette = this.getRandomFromArray(this.colorPalettes, hash + 1);
        
        const descriptions = [
            `A sleek ${style.toLowerCase()} featuring advanced materials and perfect fit.`,
            `An elegant ${style.toLowerCase()} that enhances the wearer's natural abilities.`,
            `A powerful ${style.toLowerCase()} imbued with protective enchantments.`,
            `A high-tech ${style.toLowerCase()} equipped with cutting-edge features.`,
            `A magnificent ${style.toLowerCase()} that radiates authority and strength.`
        ];
        
        return {
            style: style,
            colors: colorPalette,
            description: this.getRandomFromArray(descriptions, hash + 2)
        };
    }

    generateOriginStory(superheroName, originalName, hash) {
        const template = this.getRandomFromArray(this.originTemplates, hash);
        
        const elements = ['quantum', 'cosmic', 'mystical', 'atomic', 'digital', 'temporal'];
        const devices = ['serum', 'artifact', 'machine', 'crystal', 'armor', 'weapon'];
        
        const element = this.getRandomFromArray(elements, hash + 3);
        const device = this.getRandomFromArray(devices, hash + 4);
        
        return template
            .replace(/{name}/g, superheroName)
            .replace(/{originalName}/g, originalName)
            .replace(/{element}/g, element)
            .replace(/{device}/g, device);
    }

    // Simple hash function for consistent randomization
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    // Get random element from array using hash seed for consistency
    getRandomFromArray(array, seed) {
        if (!array || array.length === 0) return '';
        return array[seed % array.length];
    }
}
