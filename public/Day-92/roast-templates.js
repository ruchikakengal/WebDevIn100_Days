const ROAST_TEMPLATES = {
    light: {
        general: [
            "Hey {name}, at {age} years old, you're still spending your time {hobby}? I guess we all need our participation trophies! 😄",
            "{name}, working at {job} and loving {food}? Living the dream... or at least someone's dream! 🙂",
            "So {name}, your biggest dream is {dream}? With your hobby of {hobby}, you're definitely taking the scenic route! 😊",
            "Oh {name}, {age} years of wisdom and your worst habit is {habit}? At least you're consistent! ☕",
            "Let me get this straight, {name}. You're {age}, work at {job}, and dream of {dream}? Someone's an optimist! 😌"
        ],
        hobby: [
            "{name}, {hobby} at {age}? I admire your... dedication to staying indoors! 😅",
            "So {hobby} is your passion, {name}? Well, someone has to keep the couch industry thriving! 🛋️",
            "{name}, between {job} and {hobby}, when do you find time for actual productivity? Oh wait... 😉"
        ],
        job: [
            "{name}, {job} must be rewarding! I bet your {food} addiction helps with the stress! 🍔",
            "Working at {job}, {name}? Living the dream one {food} at a time! 💼",
            "{name}, from {job} to dreaming about {dream}? That's quite the career pivot plan! 📈"
        ],
        dream: [
            "{name}, dreaming of {dream} at {age}? Better late than never, right? 🌟",
            "So {dream} is the goal, {name}? With your {hobby} skills, you're practically already there! ⭐",
            "{name}, {dream} while working at {job}? That's what I call strategic planning! 🎯"
        ]
    },
    medium: [
        "Listen {name}, at {age} you're still {hobby} and dreaming of {dream}? Reality called, but I guess you're too busy eating {food} to answer! 🔥",
        "{name}, working at {job} and calling {habit} your 'worst' habit? Honey, that's just the tip of the iceberg we can see! 😈",
        "Oh {name}, {age} years on this planet and {hobby} is your contribution to society? Your parents must be so proud! 🎭",
        "{name}, between your job at {job} and your {food} obsession, when exactly do you plan to achieve {dream}? Asking for a friend... 🤔",
        "So {name}, you're {age}, love {food}, and your worst habit is {habit}? I'm starting to see a pattern here, and it's not pretty! 🧐",
        "{name}, dreaming of {dream} while {hobby} and working at {job}? That's like trying to swim upstream in concrete shoes! 🏊‍♂️",
        "Hey {name}, at {age} with your {habit} and {hobby} combo, you're basically the poster child for 'lost potential'! 📉",
        "{name}, your life choices are like a recipe: mix {job}, {hobby}, and {food}, and you get a disaster casserole! 🍲",
        "Oh {name}, {dream} is your goal? With your current lifestyle of {hobby} and {habit}, that's adorably delusional! 🦄",
        "So {name}, you're {age}, work at {job}, and think {dream} is achievable? That's cute... really, really cute! 🧸"
    ],
    nuclear: [
        "{name}, let me paint you a picture: {age} years old, wasting away with {hobby}, stuck at {job}, stuffing your face with {food}, and somehow thinking {dream} is gonna happen? The audacity! Your {habit} is honestly the least of your problems! ☢️",
        "Oh sweet {name}, bless your delusional heart! At {age}, you've mastered the art of {hobby}, conquered the prestigious world of {job}, and maintained the impressive habit of {habit}. And yet you dream of {dream}? That's not optimism, that's a complete disconnect from reality! 💣",
        "{name}, {name}, {name}... where do I even begin? You're {age} years into this existence, and your greatest achievements are {hobby} and working at {job}. Your {food} addiction is probably your most successful relationship, and {dream}? That ship didn't just sail, it got torpedoed by your own life choices! 🚢💥",
        "Listen up, {name}! At {age}, most people have their life somewhat together, but you? You're out here {hobby}, working at {job}, and calling {habit} your 'worst' habit like it's not competing with your entire personality for that title! {dream} is about as likely as me believing you'll change! 🎪",
        "Dear {name}, congratulations! At {age}, you've achieved the impossible - making {hobby} look like a waste of time, turning {job} into a comedy show, and somehow making {habit} seem normal in comparison! Your dream of {dream} is so far-fetched, even your {food} has given up on you! 🤡",
        "Oh {name}, you magnificent disaster! {age} years of experience have taught you to excel at {hobby}, thrive at {job}, and perfect your {habit}. Meanwhile, {dream} sits in the corner crying because it knows it picked the wrong person! Even {food} is embarrassed to be associated with you! 🗑️",
        "{name}, honey, let's be real here. At {age}, you're still {hobby}, grinding away at {job}, and thinking {habit} is your biggest problem? Your entire existence is a masterclass in missed opportunities! {dream}? More like a fever dream induced by too much {food}! 🤯",
        "Sweet, naive {name}! You're {age}, passionate about {hobby}, dedicated to {job}, and committed to {habit}. If commitment to mediocrity was an Olympic sport, you'd have more gold than Fort Knox! Your dream of {dream} is so unrealistic, it makes unicorns seem plausible! 🦄💀",
        "{name}, at {age}, you've turned {hobby} into an art form, made {job} your kingdom, and elevated {habit} to a lifestyle choice. But {dream}? That's not a goal, that's a cry for help! Even {food} is judging your life decisions at this point! 🆘",
        "Oh {name}, beautiful, clueless {name}! You're {age} years old, a master of {hobby}, a legend at {job}, and a champion of {habit}. Your dream of {dream} is so detached from your reality, it probably needs its own zip code! At this point, {food} is your most realistic relationship goal! 💔"
    ]
};

// Reaction images mapped to stock photos
const REACTION_IMAGES = [
    'https://pixabay.com/get/g58c5176aa2266787eb7f399220ef411e48306b2018d3248e7e0224ea4fb2e624128f584eae21746739c8d1c006651eb69a14a123721089bca62449db319b1832_1280.jpg',
    'https://pixabay.com/get/gc1a9bc8dfd7cc42141a35f3d9c2d1792fc1001ed383bd9b09293bc6f7a373b78b67ca9e845f044d21f46bca4dc93e5f599639de9d1b6995c8fcc77d6e7fbc36b_1280.jpg',
    'https://pixabay.com/get/g17ed01d632ebf0c5b009bb4f98fef6f072f366dabc32d2621c9a9d0f99efbffc1033eb93007e39d9a4f8446691a2532ab3e6c17add6c3d384b731a496dc6d5e9_1280.jpg',
    'https://pixabay.com/get/gd71fe95410eaa5d7f4b1ed3501538bad8094022dc3f0b9fef24f02351ff008c1238519b7ac6854dcee83bb7391b270bcc2f730c8b85d1881db834c6afee018da_1280.jpg',
    'https://pixabay.com/get/g2cd341176c656a105a7a0f366742d6bd77903b516f6d126aaaab36d3996adf067c5ae325f60732a1cfa85e956c18e48926098c982ffcc5f1dd194567adf8f77a_1280.jpg',
    'https://pixabay.com/get/gff41a1be5e859d597a72fc234fb641460ab4a6c364dc2d855cb567af23375bcaaffedb89ccc57132bd43ef5717fd746773432453eb1dd359c353c22397ccbe02_1280.jpg',
    'https://pixabay.com/get/gf4e53c9eecdf866a5b5fd62f3adb6aac8cedcce78e530d3ad8b34d282fa3cd3ed5009945e598f6a0d583167b9f89a3b3542eff23ba32d32883e80f8d315756b5_1280.jpg',
    'https://pixabay.com/get/g325d840ce57a37fedd9415acc48679e54363f326304bbcf545ba71aa9ef13cfa1ed12d723807258590d62978801476dcb31404a79bd9a0cd3f7806ebecc2314c_1280.jpg',
    'https://pixabay.com/get/gf22f157e9b70424ea563bfd61e8583badd46046297a4465bc98a3f9f973ae7e2c96f9f5fc544d1f429e3cd43265cb359f6e5a39cb4c8f08d6d8771f45a8b2ce5_1280.jpg',
    'https://pixabay.com/get/g5f1a3dc4efe1f305991274970bfaada4d27dd6aebf1fae8fd1480b983e2ac2b36cb3aa60d961b4ee08addbf9ce60f9ac32271418566f5c0d42be20e54fcb7ccf_1280.jpg'
];

// Fire background images for extra visual flair
const FIRE_BACKGROUNDS = [
    'https://pixabay.com/get/gbace99b8fb06eaafab66b638d73b411a9dc2cfd27c9a202d371c12e90d035507f314d4f4525584924f35fde88a1b7c3023e575befd8af7420718afc11a7c904e_1280.jpg',
    'https://pixabay.com/get/g348f70920da1be5dc017c26d66b0cad814481f2d578699cc603f02cf8efc087b6fbf04c14d5231ada676e7e8395deca931e95726883d6f84a1b81d2b236133c5_1280.jpg',
    'https://pixabay.com/get/g79f99732bd32d1dbf0e47089b6378dfb4a6357c8ccb1bd59f07e058cce1c9f86b72090a5292c1e12d58bdf8b42b831d4_1280.jpg',
    'https://pixabay.com/get/g5e1fccfc0fb931b3162dd500e08ec8611479007688b25939da5efcf7b82b5ba0eaab33f9902669c6653958a5fa578bfd33c804002d2a5a2447ebaa36a1b25abb_1280.jpg'
];

// Extra roast elements for variety
const ROAST_INTENSIFIERS = {
    light: [
        "But hey, at least you're consistent! 😊",
        "We all have our... unique paths! 🌟",
        "Keep dreaming, champ! ⭐",
        "You do you, I guess! 🤷‍♀️",
        "That's certainly... a choice! 😄"
    ],
    medium: [
        "But who am I to judge? 🤨",
        "At least you're entertaining! 🎭",
        "Never change... actually, please do! 😏",
        "Bless your optimistic heart! 💕",
        "That's what I call... ambitious! 🎯"
    ],
    nuclear: [
        "But don't let reality stop you! 💀",
        "The delusion is strong with this one! 🤯",
        "Physics called - they want their laws back! ⚰️",
        "Even your dreams are having second thoughts! 💭",
        "Congratulations on achieving peak impossibility! 🏆"
    ]
};

// Function to get random roast template
function getRandomRoast(level, userData) {
    let templates;
    
    if (level === 'light') {
        // For light roasts, we have categorized templates
        const categories = Object.keys(ROAST_TEMPLATES.light);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        templates = ROAST_TEMPLATES.light[randomCategory];
    } else {
        templates = ROAST_TEMPLATES[level];
    }
    
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    // Replace placeholders with user data
    return randomTemplate.replace(/\{(\w+)\}/g, (match, key) => {
        return userData[key] || match;
    });
}

// Function to get random reaction image
function getRandomReactionImage() {
    return REACTION_IMAGES[Math.floor(Math.random() * REACTION_IMAGES.length)];
}

// Function to get random fire background
function getRandomFireBackground() {
    return FIRE_BACKGROUNDS[Math.floor(Math.random() * FIRE_BACKGROUNDS.length)];
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ROAST_TEMPLATES,
        REACTION_IMAGES,
        FIRE_BACKGROUNDS,
        ROAST_INTENSIFIERS,
        getRandomRoast,
        getRandomReactionImage,
        getRandomFireBackground
    };
}
