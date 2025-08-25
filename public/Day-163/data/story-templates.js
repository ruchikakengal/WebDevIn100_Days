
const STORY_TEMPLATES = {
    fantasy: {
        openings: [
            "In the mystical realm of Eldoria, {characterName} the {characterTrait} begins their quest to {storyGoal}. The ancient prophecy speaks of one who would come forth when darkness threatens the land. As {characterName} stands at the edge of the {location}, the weight of destiny settles upon their shoulders.",
            "The {characterTrait} {characterName} awakens in a world where magic flows like rivers and mythical creatures roam free. With {customElement} by their side, they must embark on a perilous journey to {storyGoal}. The morning mist parts to reveal a path leading into the unknown.",
            "{characterName}, known throughout the kingdom for being {characterTrait}, receives a mysterious summons from the Council of Mages. Their mission: to {storyGoal} before the next full moon. Armed with ancient wisdom and unwavering determination, they step into the {location} where legends are born."
        ],
        middle: [
            "As {characterName} ventures deeper into the {location}, they encounter a {ally} who offers cryptic advice about the path ahead. 'Beware the {enemy},' the {ally} warns, 'for they guard the secrets you seek with {item}.'",
            "The {characterTrait} nature of {characterName} proves invaluable when they discover a hidden {item} within the {location}. This mystical artifact pulses with ancient power, perhaps the key to achieving their goal to {storyGoal}.",
            "A fierce {enemy} blocks {characterName}'s path, wielding dark magic that makes the very air crackle with malevolent energy. The {characterTrait} hero must use all their wit and courage to overcome this challenge.",
            "In the heart of the {location}, {characterName} finds an ancient temple where the {ally} reveals the true nature of their quest. 'To {storyGoal},' they explain, 'you must first master the power of the {item}.'"
        ],
        conflicts: [
            "The {enemy} emerges from the shadows, eyes glowing with malevolent power. '{characterName},' they hiss, 'your {characterTrait} nature will not save you here. Surrender now, or face the consequences of defying the darkness.'",
            "As {characterName} attempts to claim the {item}, the very ground begins to shake. The ancient magic protecting this place has awakened, and only one who is truly {characterTrait} can hope to survive its test.",
            "A terrible choice confronts {characterName}: save the {ally} from the {enemy}'s curse, or continue the quest to {storyGoal}. Time is running out, and the fate of the realm hangs in the balance."
        ],
        discoveries: [
            "Hidden within the {location}, {characterName} discovers an ancient scroll that reveals the true history of the {item}. The knowledge gained here will prove crucial in the quest to {storyGoal}.",
            "The {ally} shares a long-kept secret with {characterName}: 'The power to {storyGoal} has always been within you. Your {characterTrait} spirit is the key to unlocking the ancient magic of the {item}.'",
            "In a moment of clarity, {characterName} realizes that their {customElement} is not merely a companion, but a fragment of the ancient power needed to {storyGoal}. The pieces of the puzzle begin to fall into place."
        ],
        endings: [
            "With the {item} in hand and the {ally} at their side, {characterName} finally confronts the source of all darkness. Their {characterTrait} nature shines like a beacon, dispelling the shadows and achieving their goal to {storyGoal}. The realm is saved, and {characterName}'s legend will be told for generations to come.",
            "The quest to {storyGoal} reaches its climax as {characterName} makes the ultimate sacrifice. Using their {characterTrait} spirit and the power of the {item}, they restore balance to the world. Though the victory comes at great cost, the {ally} ensures that {characterName}'s heroism will never be forgotten.",
            "In the end, {characterName} discovers that the true treasure was not the goal to {storyGoal}, but the wisdom gained and friendships forged along the way. The {ally} smiles as they watch the {characterTrait} hero return home, forever changed by their epic adventure."
        ],
        choices: [
            {
                text: "Draw your {item} and face the challenge head-on",
                consequence: "brave",
                mood: "confident"
            },
            {
                text: "Seek the wisdom of the {ally} before proceeding",
                consequence: "careful",
                mood: "cautious"
            },
            {
                text: "Use magic to overcome the obstacle",
                consequence: "gainItem",
                mood: "mystical"
            },
            {
                text: "Try to negotiate with the {enemy}",
                consequence: "peaceful",
                mood: "diplomatic"
            }
        ]
    },
    'sci-fi': {
        openings: [
            "In the year 2387, {characterName} the {characterTrait} awakens aboard the starship Destiny as alarms blare throughout the vessel. Their mission to {storyGoal} has taken an unexpected turn when the ship's AI detected an anomaly in the {location}. With {customElement} as their only ally, they must navigate the dangers of deep space.",
            "The {characterTrait} space explorer {characterName} receives an urgent transmission from the Galactic Council. A crisis threatens the very fabric of space-time, and only someone with their unique skills can hope to {storyGoal}. As they board their sleek starfighter, the vast expanse of the {location} stretches before them.",
            "On the remote outpost of Titan-7, {characterName} discovers that their {characterTrait} nature has caught the attention of a powerful alien entity. The being offers them a chance to {storyGoal}, but the price may be higher than they're willing to pay. The {customElement} pulses with unknown energy, perhaps holding the key to their survival."
        ],
        middle: [
            "As {characterName} navigates through the {location}, their ship's sensors detect an approaching {enemy} vessel. The {ally} contacts them through subspace: 'Commander, our scans show they're armed with {item} technology. Proceed with extreme caution.'",
            "The {characterTrait} nature of {characterName} proves essential when they discover an abandoned {item} floating in the debris field of the {location}. This advanced technology could be the breakthrough needed to {storyGoal}.",
            "A hostile {enemy} intercepts {characterName}'s transmission, their voice crackling through the comm system: 'Your interference in our plans ends here. Surrender the {item} or face the consequences.'",
            "In the depths of the {location}, {characterName} encounters a friendly {ally} who reveals crucial information about the enemy's plans. 'To {storyGoal},' they explain, 'you'll need to infiltrate their base and retrieve the {item}.'"
        ],
        conflicts: [
            "The {enemy} materializes on the bridge through an advanced teleportation device. 'Your {characterTrait} reputation precedes you, {characterName}, but it will not save you from our superior technology.'",
            "As {characterName} attempts to access the {item}, the station's defense systems activate. Laser grids and security drones emerge from hidden panels, testing every aspect of their {characterTrait} abilities.",
            "A critical system failure forces {characterName} to choose: save the {ally} from the collapsing {location}, or secure the {item} needed to {storyGoal}. The countdown to catastrophic failure has begun."
        ],
        discoveries: [
            "Hidden within the ship's database, {characterName} uncovers classified files revealing the true purpose of the {item}. This technology could revolutionize their ability to {storyGoal}.",
            "The {ally} shares a startling revelation with {characterName}: 'The {customElement} you carry is actually a prototype quantum device. Its power could be the key to achieving your mission to {storyGoal}.'",
            "Through careful analysis of the energy readings, {characterName} realizes that the {location} itself is a massive {item} designed by an ancient civilization. This discovery changes everything about their quest to {storyGoal}."
        ],
        endings: [
            "With the {item} successfully integrated into their ship's systems, {characterName} executes the final phase of their mission to {storyGoal}. Their {characterTrait} determination and the {ally}'s support prove decisive as they save the galaxy from certain destruction. The stars themselves seem to shine brighter in celebration of their victory.",
            "The climactic battle to {storyGoal} pushes {characterName} to their limits. Using their {characterTrait} nature and the power of the {item}, they make the ultimate sacrifice to ensure the survival of countless worlds. The {ally} ensures their heroism will be remembered across the galaxy.",
            "In the end, {characterName} discovers that the journey to {storyGoal} has taught them something more valuable than any technology: the importance of unity among the diverse species of the galaxy. With the {ally} by their side, they return home to help build a better future for all."
        ],
        choices: [
            {
                text: "Activate the {item} and engage the enemy",
                consequence: "brave",
                mood: "determined"
            },
            {
                text: "Scan for weaknesses before attacking",
                consequence: "careful",
                mood: "analytical"
            },
            {
                text: "Attempt to hack their systems",
                consequence: "gainItem",
                mood: "clever"
            },
            {
                text: "Try to communicate with the aliens",
                consequence: "peaceful",
                mood: "diplomatic"
            }
        ]
    },
    mystery: {
        openings: [
            "The fog-shrouded streets of Victorian London provide the perfect backdrop as {characterName} the {characterTrait} detective begins investigating the case that will define their career. The mission to {storyGoal} started with a simple missing person case, but the discovery of {customElement} in the {location} suggests something far more sinister.",
            "Private investigator {characterName} receives an anonymous letter that sets them on a path to {storyGoal}. Known for their {characterTrait} approach to solving cases, they must navigate the treacherous waters of corruption and deceit. The trail begins at the {location}, where shadows hide more than just darkness.",
            "The {characterTrait} journalist {characterName} stumbles upon a conspiracy that reaches the highest levels of society. Their determination to {storyGoal} puts them in grave danger, but the {customElement} they discovered may be the key to exposing the truth. The investigation leads them to the mysterious {location}."
        ],
        middle: [
            "As {characterName} investigates the {location}, they encounter a helpful {ally} who provides a crucial clue. 'I saw the {enemy} here last night,' they whisper nervously, 'and they were carrying something that looked like {item}.'",
            "The {characterTrait} instincts of {characterName} prove invaluable when they discover a hidden {item} concealed within the {location}. This evidence could be the breakthrough needed to {storyGoal}.",
            "A menacing {enemy} confronts {characterName} in the shadows of the {location}. 'Your investigation ends here, detective. Some secrets are meant to stay buried, and those who dig too deep often find themselves six feet under.'",
            "In the study of the old mansion, {characterName} meets with a trusted {ally} who reveals disturbing information about the case. 'To {storyGoal},' they explain, 'you must first understand the significance of the {item} and its connection to the recent murders.'"
        ],
        conflicts: [
            "The {enemy} emerges from the fog, their face obscured by shadow. 'Your {characterTrait} reputation won't help you now, {characterName}. Some mysteries are better left unsolved.'",
            "As {characterName} attempts to examine the {item}, they trigger a hidden trap. The room begins to fill with gas, and only their {characterTrait} nature can help them escape this deadly situation.",
            "A moral dilemma presents itself to {characterName}: protect the {ally} from the {enemy}'s threats, or pursue the evidence needed to {storyGoal}. The wrong choice could cost innocent lives."
        ],
        discoveries: [
            "Hidden within the {location}, {characterName} finds a secret compartment containing documents that reveal the true motive behind the crimes. This evidence brings them one step closer to being able to {storyGoal}.",
            "The {ally} confides a shocking secret to {characterName}: 'The {customElement} you've been investigating is actually the key to a conspiracy that goes back decades. It's connected to your mission to {storyGoal}.'",
            "Through careful deduction, {characterName} realizes that the {item} is not just evidence, but a message left by the victim. The cryptic clues point toward the true identity of the {enemy} and their reason for wanting to prevent {characterName} from achieving their goal to {storyGoal}."
        ],
        endings: [
            "In the dramatic confrontation at the {location}, {characterName} finally exposes the truth behind the conspiracy. Their {characterTrait} determination and the evidence provided by the {ally} prove decisive in achieving their goal to {storyGoal}. Justice is served, and the city can sleep safely once again.",
            "The case to {storyGoal} reaches its climax when {characterName} makes a startling discovery about their own past. Using their {characterTrait} nature and the crucial {item}, they uncover a truth that changes everything. Though the victory is bittersweet, the {ally} helps them find peace.",
            "In the end, {characterName} learns that sometimes the greatest mystery is understanding oneself. The journey to {storyGoal} has revealed not just the truth about the case, but the true meaning of justice. With the {ally} by their side, they continue their work as a guardian of truth."
        ],
        choices: [
            {
                text: "Confront the suspect directly with the evidence",
                consequence: "brave",
                mood: "confident"
            },
            {
                text: "Gather more evidence before making accusations",
                consequence: "careful",
                mood: "methodical"
            },
            {
                text: "Search for the hidden {item}",
                consequence: "gainItem",
                mood: "thorough"
            },
            {
                text: "Question the {ally} about their involvement",
                consequence: "meetAlly",
                mood: "suspicious"
            }
        ]
    },
    horror: {
        openings: [
            "The abandoned asylum looms before {characterName} as thunder crashes overhead. Known for their {characterTrait} nature, they have come to this cursed place to {storyGoal}. The {customElement} they carry seems to grow heavier with each step toward the {location}, as if the very building is trying to repel them.",
            "In the dead of night, {characterName} the {characterTrait} receives a desperate phone call that sets them on a terrifying path to {storyGoal}. The voice on the other end speaks of unspeakable horrors lurking in the {location}. Against all rational thought, they grab the {customElement} and venture into the darkness.",
            "The {characterTrait} paranormal investigator {characterName} arrives at the {location} where reality itself seems to be unraveling. Their mission to {storyGoal} becomes secondary when they realize that something ancient and evil has awakened. The {customElement} pulses with an otherworldly energy, perhaps their only protection against the coming nightmare."
        ],
        middle: [
            "As {characterName} explores the {location}, they encounter a terrified {ally} who speaks in hushed, panicked whispers. 'It's the {enemy},' they gasp, 'they've been hunting anyone who comes near the {item}. We need to get out of here before it's too late.'",
            "The {characterTrait} courage of {characterName} is tested when they discover a cursed {item} hidden within the {location}. The artifact radiates malevolent energy, but it may be essential to their goal to {storyGoal}.",
            "A supernatural {enemy} manifests before {characterName}, its presence making the air thick with dread. 'Your {characterTrait} soul shines like a beacon in this darkness,' it whispers with a voice like grinding bones. 'But even the brightest light can be extinguished.'",
            "In the basement of the haunted house, {characterName} meets with a desperate {ally} who reveals the horrifying truth about the {location}. 'To {storyGoal},' they warn, 'you must first banish the evil that guards the {item}. But be warned - some doors should never be opened.'"
        ],
        conflicts: [
            "The {enemy} emerges from the shadows, its form shifting and writhing like living nightmare. 'Your {characterTrait} nature cannot save you here, {characterName}. This place feeds on fear, and yours smells particularly... delicious.'",
            "As {characterName} attempts to use the {item}, the very walls begin to bleed and whisper. The house itself seems alive, and only their {characterTrait} will can resist the madness that threatens to consume them.",
            "A terrible choice confronts {characterName}: save the {ally} from the {enemy}'s curse, or use the {item} to {storyGoal}. The screams echoing through the {location} suggest that time is running out for everyone."
        ],
        discoveries: [
            "Hidden within the {location}, {characterName} finds a diary that reveals the tragic history behind the haunting. The entries detail how the {item} became cursed and what must be done to {storyGoal}.",
            "The {ally} reveals a disturbing truth to {characterName}: 'The {customElement} you carry is actually a conduit for supernatural forces. It's the reason you're able to see what others cannot, and it may be the key to achieving your goal to {storyGoal}.'",
            "Through horrifying visions, {characterName} realizes that the {location} exists at the intersection of multiple dimensions. The {enemy} is using this instability to prevent anyone from being able to {storyGoal}, but the {item} might be able to seal the rift forever."
        ],
        endings: [
            "In the final confrontation at the heart of the {location}, {characterName} faces the source of all evil. Their {characterTrait} spirit and the power of the {item} create a barrier of light that banishes the darkness forever. Though scarred by the experience, they have achieved their goal to {storyGoal} and saved countless innocent lives.",
            "The battle to {storyGoal} demands the ultimate sacrifice from {characterName}. Using their {characterTrait} nature and the cursed {item}, they trap the evil within themselves, becoming a guardian between worlds. The {ally} ensures their heroic sacrifice will protect future generations.",
            "In the end, {characterName} discovers that the true horror was not the supernatural threat, but the evil that humans are capable of inflicting upon each other. Having achieved their goal to {storyGoal}, they emerge forever changed, carrying both the weight of what they've seen and the strength to face whatever darkness may come."
        ],
        choices: [
            {
                text: "Use the {item} to banish the evil",
                consequence: "brave",
                mood: "determined"
            },
            {
                text: "Try to escape with the {ally}",
                consequence: "careful",
                mood: "protective"
            },
            {
                text: "Investigate the supernatural phenomena",
                consequence: "gainItem",
                mood: "curious"
            },
            {
                text: "Attempt to communicate with the spirits",
                consequence: "peaceful",
                mood: "desperate"
            }
        ]
    }
};

window.STORY_TEMPLATES = STORY_TEMPLATES;
