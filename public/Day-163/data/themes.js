const THEMES = {
    fantasy: {
        name: 'Fantasy',
        icon: 'fa-dragon',
        primaryColor: '#d4af37',
        secondaryColor: '#b8860b',
        backgroundColor: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        textColor: '#e8e3d3',
        elements: {
            locations: ['enchanted forest', 'crystal cave', 'ancient ruins', 'mystical tower', 'dragon\'s lair'],
            items: ['magic sword', 'healing potion', 'ancient scroll', 'glowing gem', 'enchanted cloak'],
            allies: ['wise wizard', 'brave knight', 'forest sprite', 'talking animal', 'village elder'],
            enemies: ['dark sorcerer', 'fierce dragon', 'shadow creature', 'evil lord', 'cursed beast']
        }
    },
    'sci-fi': {
        name: 'Science Fiction',
        icon: 'fa-rocket',
        primaryColor: '#00ffff',
        secondaryColor: '#0080ff',
        backgroundColor: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #2d2d2d 100%)',
        textColor: '#00ffff',
        elements: {
            locations: ['space station', 'alien planet', 'cybernetic city', 'quantum lab', 'starship bridge'],
            items: ['plasma rifle', 'energy shield', 'data crystal', 'nano-enhancer', 'holographic map'],
            allies: ['AI companion', 'alien scientist', 'rebel fighter', 'space marine', 'tech specialist'],
            enemies: ['rogue AI', 'alien invader', 'corporate agent', 'space pirate', 'cyborg assassin']
        }
    },
    mystery: {
        name: 'Mystery',
        icon: 'fa-search',
        primaryColor: '#cd853f',
        secondaryColor: '#a0522d',
        backgroundColor: 'linear-gradient(135deg, #2c1810 0%, #4a2c2a 50%, #3d2914 100%)',
        textColor: '#f4f1e8',
        elements: {
            locations: ['old mansion', 'foggy cemetery', 'abandoned library', 'secret passage', 'detective\'s office'],
            items: ['cryptic letter', 'old photograph', 'mysterious key', 'torn diary page', 'vintage magnifying glass'],
            allies: ['helpful librarian', 'retired detective', 'local historian', 'curious journalist', 'loyal assistant'],
            enemies: ['shadowy figure', 'corrupt official', 'mysterious stranger', 'crime boss', 'vengeful ghost']
        }
    },
    horror: {
        name: 'Horror',
        icon: 'fa-ghost',
        primaryColor: '#dc143c',
        secondaryColor: '#8b0000',
        backgroundColor: 'linear-gradient(135deg, #0f0f0f 0%, #1a0a0a 50%, #2a1010 100%)',
        textColor: '#f8f8f8',
        elements: {
            locations: ['haunted house', 'dark basement', 'creepy attic', 'fog-covered graveyard', 'abandoned asylum'],
            items: ['blessed cross', 'silver dagger', 'protective charm', 'ancient tome', 'holy water'],
            allies: ['brave priest', 'paranormal investigator', 'local medium', 'skeptical scientist', 'protective spirit'],
            enemies: ['malevolent ghost', 'demonic entity', 'cursed doll', 'zombie horde', 'evil cultist']
        }
    }
};

window.THEMES = THEMES;