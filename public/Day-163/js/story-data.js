/**
 * Story templates, vocabulary, and data for the Story Generator
 */

class StoryData {
    constructor() {
        this.templates = this.initializeTemplates();
        this.vocabulary = this.initializeVocabulary();
        this.characters = this.initializeCharacters();
        this.settings = this.initializeSettings();
        this.storyStructures = this.initializeStoryStructures();
    }

    initializeTemplates() {
        return {
            fantasy: {
                openings: [
                    "In the realm of {setting}, {character} {discovers|stumbles upon|encounters} {mystical_element}.",
                    "The ancient prophecy spoke of {character}, chosen to {quest_action} in the land of {setting}.",
                    "{character} {wakes|awakens} in {setting} with {special_item}, {feeling} a {mystical_power}.",
                    "As the {weather} {weather_action} over {setting}, {character} {begins|starts} their {quest_type}.",
                    "Long ago, in {setting}, {character} was {blessed|cursed} with {mystical_element}."
                ],
                continuations: [
                    "The {mystical_creature} {approaches|emerges|appears}, its {creature_feature} {glowing|shimmering|pulsing} with {magical_energy}.",
                    "{character} feels the {special_item} {respond|react|vibrate} to the {mystical_presence}.",
                    "A {voice|whisper|sound} echoes through {setting}: '{prophecy_text}'",
                    "The path {splits|divides} into {number} directions, each {leading|winding} toward {different_destination}.",
                    "Suddenly, {obstacle} blocks the way, {requiring|demanding} {character} to {action_required}."
                ],
                choices: [
                    "Use the {special_item} to {magical_action}",
                    "Attempt to {diplomatic_action} with the {mystical_creature}",
                    "Follow the {path_type} path",
                    "Cast a {spell_type} spell",
                    "Seek wisdom from the {wise_character}"
                ]
            },
            scifi: {
                openings: [
                    "In the year {future_year}, {character} {pilots|commands|operates} the {starship} through {space_location}.",
                    "The {AI_name} alerts {character}: '{ai_message}' as they {approach|near} {planet_name}.",
                    "{character} {awakens|emerges} from {stasis_pod} aboard the {starship}, {scanner} detecting {anomaly}.",
                    "On the mining colony of {planet_name}, {character} {discovers|uncovers} {alien_artifact}.",
                    "The {distress_signal} from {space_location} leads {character} to {mysterious_discovery}."
                ],
                continuations: [
                    "The {scanner|computer|AI} detects {anomaly} at {coordinates}, {warning|indicating} {potential_danger}.",
                    "{alien_species} {communication} reaches {character}: '{alien_message}'",
                    "The {technology} {malfunctions|fails|overloads}, forcing {character} to {technical_action}.",
                    "{character}'s {device} reveals {hidden_information} about {mystery_element}.",
                    "A {portal|rift|gateway} opens, {revealing|exposing} {alternate_reality}."
                ],
                choices: [
                    "Activate the {technology} to {tech_action}",
                    "Attempt {communication_type} with {alien_species}",
                    "Navigate to {space_location}",
                    "Analyze the {alien_artifact} using {scientific_method}",
                    "Contact {authority_figure} for {assistance_type}"
                ]
            },
            mystery: {
                openings: [
                    "Detective {character} {arrives|is called} to {crime_scene} where {victim} was found {crime_detail}.",
                    "The {weather} {weather_action} as {character} {investigates|examines} the {mysterious_location}.",
                    "{character} receives a {communication_type} from {mysterious_contact}: '{cryptic_message}'",
                    "In the {building_type} of {setting}, {character} {discovers|finds} {suspicious_evidence}.",
                    "The case of {mystery_case} leads {character} to {investigation_location}."
                ],
                continuations: [
                    "{character} {notices|observes|discovers} {clue} that {suggests|indicates|points to} {suspect_detail}.",
                    "The {witness} {approaches|contacts|reveals} to {character}: '{witness_statement}'",
                    "{suspicious_character} {behaves|acts|responds} {suspiciously|nervously|evasively} when {questioned|confronted}.",
                    "A {document|photograph|recording} reveals {hidden_truth} about {mystery_element}.",
                    "The {investigation} leads to {location}, where {character} {discovers|uncovers} {new_evidence}."
                ],
                choices: [
                    "Question {suspect} about {specific_detail}",
                    "Investigate {location} for {evidence_type}",
                    "Analyze the {evidence} using {investigation_method}",
                    "Follow {suspicious_character} to {destination}",
                    "Consult with {expert} about {specialized_knowledge}"
                ]
            },
            horror: {
                openings: [
                    "The {vehicle} {breaks_down|stops} near {ominous_location} as {weather_horror} {weather_action}.",
                    "{character} {inherits|receives|discovers} {cursed_item} from {deceased_relative}.",
                    "In {haunted_location}, {character} {hears|experiences|witnesses} {supernatural_phenomenon}.",
                    "The {ritual|ceremony|séance} in {dark_location} {awakens|summons|releases} {horror_entity}.",
                    "After {traumatic_event}, {character} {moves|travels|flees} to {isolated_location}."
                ],
                continuations: [
                    "The {horror_sound} {echoes|resonates|whispers} through {location}, causing {character} to {fear_reaction}.",
                    "{supernatural_entity} {manifests|appears|emerges}, its {horrific_feature} {terrifying|disturbing} {character}.",
                    "The {cursed_item} {reacts|responds|changes}, {supernatural_effect} {occurring|happening|manifesting}.",
                    "{character} {realizes|discovers|understands} that {horrific_truth} about {dark_secret}.",
                    "A {victim|previous_occupant} {warns|appears|communicates}: '{ominous_warning}'"
                ],
                choices: [
                    "Flee from {horror_location} immediately",
                    "Investigate the source of {supernatural_phenomenon}",
                    "Use {protective_item} against {horror_entity}",
                    "Perform {ritual|exorcism|blessing} to {banish|destroy|appease} {supernatural_threat}",
                    "Seek help from {authority_figure|expert|local}"
                ]
            }
        };
    }

    initializeVocabulary() {
        return {
            fantasy: {
                mystical_element: ["ancient rune", "glowing crystal", "magical tome", "enchanted sword", "dragon egg", "phoenix feather"],
                mystical_creature: ["dragon", "unicorn", "phoenix", "griffin", "basilisk", "fairy", "centaur", "dryad"],
                creature_feature: ["eyes", "scales", "wings", "horn", "mane", "claws", "breath", "aura"],
                magical_energy: ["silver light", "golden fire", "emerald mist", "azure lightning", "crimson magic", "violet energy"],
                special_item: ["enchanted blade", "crystal staff", "magical amulet", "rune stone", "elven bow", "dragon scale"],
                mystical_power: ["ancient magic", "divine blessing", "elemental force", "arcane energy", "mystical bond"],
                mystical_presence: ["magical aura", "divine intervention", "ancient power", "elemental force", "mystical energy"],
                spell_type: ["healing", "protection", "fire", "ice", "lightning", "teleportation", "illusion", "divination"],
                quest_type: ["sacred quest", "heroic journey", "magical mission", "divine calling", "ancient prophecy"],
                wise_character: ["ancient wizard", "forest sage", "oracle", "elder druid", "mystical hermit"],
                weather: ["crimson dawn", "silver moonlight", "golden sunset", "starlit night", "misty morning"],
                weather_action: ["breaks", "falls", "rises", "shimmers", "glows", "dances"]
            },
            scifi: {
                starship: ["USS Explorer", "Nebula Cruiser", "Star Phoenix", "Quantum Voyager", "Cosmic Wanderer"],
                space_location: ["the Andromeda Sector", "the Void Nebula", "Station Alpha-7", "the Outer Rim", "deep space"],
                planet_name: ["Kepler-442b", "Nova Prime", "Titan Station", "Zephyr Colony", "New Terra"],
                AI_name: ["ARIA", "NEXUS", "CORTEX", "VERA", "ATLAS", "NOVA"],
                ai_message: ["Anomaly detected", "Life signs found", "Hull breach imminent", "Unknown signal received", "System failure"],
                scanner: ["bio-scanner", "quantum detector", "sensor array", "neural interface", "probe data"],
                anomaly: ["quantum distortion", "energy signature", "alien technology", "temporal rift", "unknown lifeform"],
                alien_artifact: ["crystalline structure", "metal alloy", "energy core", "data storage", "weapon system"],
                alien_species: ["Zephyrians", "Void Dwellers", "Crystal Entities", "Energy Beings", "Machine Race"],
                technology: ["hyperdrive", "quantum computer", "plasma cannon", "force field", "teleporter"],
                device: ["tricorder", "neural implant", "holo-projector", "data pad", "comm device"],
                distress_signal: ["emergency beacon", "SOS transmission", "automated distress call", "mayday signal"],
                future_year: ["2387", "2445", "2501", "2634", "2789"]
            },
            mystery: {
                crime_scene: ["the old mansion", "the abandoned warehouse", "the luxury hotel", "the corporate office", "the university"],
                victim: ["the wealthy businessman", "the famous artist", "the retired professor", "the young journalist", "the museum curator"],
                crime_detail: ["under mysterious circumstances", "with no obvious cause", "in a locked room", "with strange symbols nearby"],
                mysterious_location: ["the crime scene", "the victim's home", "the suspect's office", "the witness's apartment"],
                communication_type: ["phone call", "text message", "email", "letter", "note"],
                mysterious_contact: ["unknown caller", "anonymous source", "worried neighbor", "concerned colleague"],
                cryptic_message: ["They know about the painting", "The truth is in the basement", "Meet me at midnight", "Trust no one"],
                suspicious_evidence: ["blood on the carpet", "a mysterious key", "torn photographs", "encrypted files"],
                mystery_case: ["the missing heiress", "the stolen artwork", "the corporate espionage", "the professor's disappearance"],
                investigation_location: ["the victim's study", "the company vault", "the art gallery", "the university library"],
                clue: ["a fingerprint", "a torn fabric", "a business card", "a hidden message", "a witness account"],
                witness: ["building janitor", "security guard", "neighbor", "business partner", "family member"],
                building_type: ["mansion", "office building", "apartment complex", "museum", "hotel"]
            },
            horror: {
                ominous_location: ["the abandoned asylum", "the old cemetery", "the cursed forest", "the haunted mansion"],
                cursed_item: ["an antique mirror", "a family heirloom", "an old diary", "a mysterious box", "ancient jewelry"],
                haunted_location: ["the attic", "the basement", "the old cabin", "the abandoned church", "the family# thoughts
This is a comprehensive interactive story generator website that needs to be built with pure HTML/CSS/JavaScript. The key components include:

1. Dynamic story generation using templates and user inputs
2. Branching narrative system with choice-based progression
3. Multiple themes (fantasy, sci-fi, mystery, horror) with unique styling
4. localStorage for persistence and progress saving
5. Text-to-speech narration using Web Speech API
6. Responsive design with smooth animations
7. Story export and sharing functionality
8. User contribution system with basic content filtering

I'll structure this as a single-page application with modular JavaScript components for story generation, theme management, choice handling, and UI interactions. The design will be immersive with theme-based animations and visual effects.

# useful_guidelines_from_blueprints


# directory_structure
```json
[
    {"path": "index.html", "status": "new"},
    {"path": "styles/main.css", "status": "new"},
    {"path": "styles/themes.css", "status": "new"},
    {"path": "scripts/app.js", "status": "new"},
    {"path": "scripts/story-generator.js", "status": "new"},
    {"path": "scripts/theme-manager.js", "status": "new"},
    {"path": "scripts/audio-manager.js", "status": "new"},
    {"path": "scripts/storage-manager.js", "status": "new"},
    {"path": "scripts/export-manager.js", "status": "new"},
    {"path": "data/story-templates.js", "status": "new"},
    {"path": "data/themes.js", "status": "new"}
]
