class ChatbotWidget {
    constructor() {
        // DOM elements
        this.chatIcon = document.getElementById('chat-icon');
        this.chatWindow = document.getElementById('chat-window');
        this.closeButton = document.getElementById('close-chat');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        this.messagesContainer = document.getElementById('chat-messages');

        // State
        this.isOpen = false;
        this.isTyping = false;

        // Initialize the chatbot
        this.init();
    }

    // Projects database
    projectsData = [
        {
            originalDay: 1,
            name: "Todo List",
            description: "A simple and elegant todo list application with local storage support.",
            demoLink: "./public/Day-1_TodoList/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Add/Remove Tasks", "Mark Complete", "Local Storage"]
        },
        {
            originalDay: 2,
            name: "Digital Clock",
            description: "A beautiful digital clock with customizable themes and formats.",
            demoLink: "./public/Day-2_digital_clock/digitalclock.html",
            category: "basic",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Real-time Updates", "Multiple Formats", "Theme Options"]
        },
        {
            originalDay: 3,
            name: "ASCII Art Generator",
            description: "Convert text into ASCII art with various font styles and customization options.",
            demoLink: "./public/Day-3_AsciiArtGenerator/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Multiple Fonts", "Customizable Output", "Copy to Clipboard"]
        },
        {
            originalDay: 4,
            name: "Password Visualizer",
            description: "Visualize password strength and complexity with interactive graphics.",
            demoLink: "./public/Day-4_password_visualizer/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Strength Analysis", "Visual Feedback", "Security Tips"]
        },
        {
            originalDay: 5,
            name: "Physics Simulation",
            description: "Interactive physics simulation with bouncing balls and gravity effects.",
            demoLink: "./public/Day-5_physics_simulation/index.html",
            category: "advanced",
            technologies: ["HTML", "CSS", "JavaScript", "Canvas"],
            features: ["Physics Engine", "Interactive Controls", "Real-time Animation"]
        },
        {
            originalDay: 6,
            name: "Quote Generator",
            description: "Generate inspirational quotes with beautiful backgrounds and sharing options.",
            demoLink: "./public/Day-6_QuoteGenerator/index.html",
            category: "basic",
            technologies: ["HTML", "CSS", "JavaScript", "API"],
            features: ["Random Quotes", "Category Filter", "Social Sharing"]
        },
        {
            originalDay: 7,
            name: "Character Word Counter",
            description: "Count characters, words, and paragraphs in real-time with detailed statistics.",
            demoLink: "./public/Day-7_CharacterWordCounter/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Real-time Counting", "Statistics", "Word Analysis"]
        },
        {
            originalDay: 8,
            name: "Dice Roll Simulator",
            description: "Simulate dice rolls with realistic 3D animations and multiple dice options.",
            demoLink: "./public/Day-8_DiceRollSimulator/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["3D Animation", "Multiple Dice", "Statistics Tracking"]
        },
        {
            originalDay: 9,
            name: "Guess My Number",
            description: "A fun number guessing game with hints and score tracking.",
            demoLink: "./public/Day-9_Guess_My_Number/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Hint System", "Score Tracking", "Difficulty Levels"]
        },
        {
            originalDay: 10,
            name: "Neon Brick Breaker",
            description: "A modern twist on the classic brick breaker game with neon graphics.",
            demoLink: "./public/Day-10_Neon_Brick_Breaker/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript", "Canvas"],
            features: ["Neon Graphics", "Power-ups", "Score System"]
        },
        {
            originalDay: 11,
            name: "Weather App",
            description: "Get real-time weather information for any city with a beautiful interface.",
            demoLink: "./public/Day-11_WeatherApp/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript", "API"],
            features: ["Real-time Data", "City Search", "Weather Icons"]
        },
        {
            originalDay: 12,
            name: "Coin Flip",
            description: "A realistic coin flipping animation with statistics tracking.",
            demoLink: "./public/Day-13_Coin_Flip/index.html",
            category: "basic",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Realistic Animation", "Statistics", "Sound Effects"]
        },
        {
            originalDay: 13,
            name: "E-Waste Management Hub",
            description: "Educational platform for e-waste management with location finder.",
            demoLink: "./public/Day-14_E-WasteManagementHub/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Location Finder", "Educational Content", "Environmental Impact"]
        },
        {
            originalDay: 14,
            name: "Currency Converter",
            description: "Convert between different currencies with real-time exchange rates.",
            demoLink: "./public/Day-15_Currency_Converter/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript", "API"],
            features: ["Real-time Rates", "Multiple Currencies", "History"]
        },
        {
            originalDay: 15,
            name: "Random User Generator",
            description: "Generate random user profiles with photos and detailed information.",
            demoLink: "./public/Day-16_Random_User_Generator/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript", "API"],
            features: ["Random Profiles", "Photo Gallery", "Export Data"]
        },
        {
            originalDay: 16,
            name: "Image Search App",
            description: "Search and browse high-quality images with advanced filtering options.",
            demoLink: "./public/Day-17_Image_Search_App/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript", "API"],
            features: ["Image Search", "High Quality", "Download Options"]
        },
        {
            originalDay: 17,
            name: "Tic Tac Toe",
            description: "Classic tic-tac-toe game with AI opponent and score tracking.",
            demoLink: "./public/Day-20_tictactoe/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["AI Opponent", "Score Tracking", "Responsive Design"]
        },
        {
            originalDay: 18,
            name: "Candy Crush",
            description: "Match-3 puzzle game inspired by the popular Candy Crush saga.",
            demoLink: "./public/Day-21_candycrush/candy_crush.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Match-3 Gameplay", "Score System", "Power-ups"]
        },
        {
            originalDay: 19,
            name: "Palette Generator",
            description: "Generate beautiful color palettes for your design projects.",
            demoLink: "./public/Day-22_Palette_generator/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Random Generation", "Export Options", "Color Codes"]
        },
        {
            originalDay: 20,
            name: "QR Code Generator",
            description: "Generate QR codes for text, URLs, and other data types.",
            demoLink: "./public/Day-23_QRCodeGenerator/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Multiple Data Types", "Customizable Size", "Download Option"]
        },
        {
            originalDay: 21,
            name: "Rock Paper Scissors",
            description: "Classic rock paper scissors game with computer opponent.",
            demoLink: "./public/Day-23_RockPaperScissor/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Computer AI", "Score Tracking", "Animated Results"]
        },
        {
            originalDay: 22,
            name: "Drawing App",
            description: "Digital drawing canvas with multiple brush tools and colors.",
            demoLink: "./public/Day-26_Drawing/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript", "Canvas"],
            features: ["Multiple Brushes", "Color Picker", "Save Drawing"]
        },
        {
            originalDay: 23,
            name: "Target Reflex Test",
            description: "Test your reflexes by clicking on moving targets as fast as possible.",
            demoLink: "./public/Day-28_Target_Reflex_Test/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Reflex Testing", "High Scores", "Difficulty Levels"]
        },
        {
            originalDay: 24,
            name: "Memory Game",
            description: "Classic memory card matching game with multiple difficulty levels.",
            demoLink: "./public/Day-31/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Memory Training", "Multiple Levels", "Timer Challenge"]
        },
        {
            originalDay: 25,
            name: "Color Picker",
            description: "Advanced color picker with multiple format outputs and palette saving.",
            demoLink: "./public/Day-34-Colour_picker/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Multiple Formats", "Palette Saving", "Color History"]
        },
        {
            originalDay: 26,
            name: "Advanced Drawing",
            description: "Professional drawing application with layers and advanced tools.",
            demoLink: "./public/Day-35-Drawing/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript", "Canvas"],
            features: ["Layer Support", "Advanced Tools", "Export Options"]
        },
        {
            originalDay: 27,
            name: "Notes App",
            description: "Feature-rich notes application with search and organization tools.",
            demoLink: "./public/Day-36_Notes_App/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Rich Text Editor", "Search Function", "Tag Organization"]
        },
        {
            originalDay: 28,
            name: "Note Taker",
            description: "Simple and efficient note-taking app with markdown support.",
            demoLink: "./public/Day-42_NoteTaker/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Markdown Support", "Auto-save", "Export Notes"]
        },
        {
            originalDay: 29,
            name: "Audio Visualizer",
            description: "Interactive audio visualizer with particle effects and real-time frequency analysis.",
            demoLink: "./public/Day-45/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript", "Web Audio API"],
            features: ["Audio Analysis", "Particle Effects", "Real-time Visualization", "Multiple Themes"]
        },
        {
            originalDay: 30,
            name: "Pomodoro Timer",
            description: "Productivity timer with task management, customizable themes, and session tracking.",
            demoLink: "./public/Day-47_Pomodoro-app/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Timer Sessions", "Task Management", "Dark Mode", "Custom Themes", "Statistics"]
        },
        {
            originalDay: 31,
            name: "Chess Game",
            description: "Interactive chess game with move validation, piece animations, and game state tracking.",
            demoLink: "./public/Day-51/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript", "SVG"],
            features: ["Move Validation", "Piece Animation", "Game Logic", "Interactive Board"]
        },
        {
            originalDay: 32,
            name: "Rock Paper Scissors",
            description: "Interactive rock paper scissors game with user vs computer gameplay.",
            demoLink: "./public/Day-54_RockPaperSessior/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Move Validation", "Piece Animation", "Game Logic", "Interactive Board"]
        },

        {
            originalDay: 33,
            name: "Portfolio Website",
            description: "Modern portfolio website template with responsive design and animations.",
            demoLink: "./public/Day-72_Portfolio/index.html",
            category: "advanced",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Responsive Design", "Smooth Animations", "Contact Form"]
        },
        {
            originalDay: 34,
            name: "Etch-a-Sketch",
            description: "Digital Etch-a-Sketch with customizable grid and drawing modes.",
            demoLink: "./public/Etch-a-Sketch/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Customizable Grid", "Multiple Drawing Modes", "Clear Function"]
        },
        {
            originalDay: 35,
            name: "GiggleBits",
            description: "Fun collection of interactive mini-games and entertainment.",
            demoLink: "./public/GiggleBits/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Mini Games", "Entertainment Hub", "High Scores"]
        },
        {
            originalDay: 36,
            name: "Gradient Generator",
            description: "Create beautiful CSS gradients with live preview and export functionality.",
            demoLink: "./public/Gradient_Generator/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Live Preview", "CSS Export", "Color Picker", "Multiple Gradient Types"]
        },
        {
            originalDay: 37,
            name: "Snake and Ladder",
            description: "Classic board game with multiplayer support and animated gameplay.",
            demoLink: "./public/Snake-and-Ladder-Game/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Multiplayer Support", "Animated Gameplay", "Classic Rules"]
        },
        {
            originalDay: 38,
            name: "Space Jumper Game",
            description: "Exciting space-themed jumping game with physics engine and score system.",
            demoLink: "./public/Space-Jumper-Game/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript", "Canvas"],
            features: ["Physics Engine", "Score System", "Responsive Controls", "Space Theme"]
        },
        {
            originalDay: 39,
            name: "Space War Game",
            description: "Intense space battle game with enemy AI and power-ups.",
            demoLink: "./public/Space-War-Game/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript", "Canvas"],
            features: ["Enemy AI", "Power-ups", "Multiple Levels", "High Scores"]
        },
        {
            originalDay: 40,
            name: "Stopwatch",
            description: "Precision stopwatch with lap timing and split functionality.",
            demoLink: "./public/Stopwatch/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Precision Timing", "Lap Records", "Split Timing", "Export Results"]
        },
        {
            originalDay: 41,
            name: "World Clock",
            description: "Display multiple world time zones with real-time updates and customization.",
            demoLink: "./public/World_Clock/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Multiple Time Zones", "Real-time Updates", "Custom Locations", "12/24 Hour Format"]
        },
        {
            originalDay: 42,
            name: "Notes Tracker",
            description: "A simple and organized digital notebook to create, update, and manage notes efficiently.",
            demoLink: "./public/Day-42_NoteTaker/index.html",
            category: "productivity",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Add/Edit/Delete Notes", "Persistent Local Storage", "Search Functionality", "Dark Mode"]
        },
        {
            originalDay: 43,
            name: "Alien Hunt",
            description: "A fun and fast-paced shooting game where players hunt down aliens and score points.",
            demoLink: "./public/Day-31/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Alien Spawning", "Score Counter", "Sound Effects", "Game Over Logic"]
        },
        {
            originalDay: 44,
            name: "Book Recommendation",
            description: "Suggests books based on user-selected genres, moods, or interests with a clean UI.",
            demoLink: "https://book-recomendation.netlify.app/",
            category: "education",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Genre-Based Suggestions", "Book Covers & Descriptions", "Responsive Design", "Interactive Filters"]
        },
        {
            originalDay: 45,
            name: "Student Grade Analyzer",
            description: "Analyzes student marks and provides insights like total, average, grade, and performance level.",
            demoLink: "./public/Student_Grade_Analyzer/index.html",
            category: "education",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Marks Input", "Total & Average Calculation", "Grade Assignment", "Performance Feedback"]
        },
        {
            originalDay: 46,
            name: "Mood Based Music Suggester",
            description: "Recommends music tracks based on the user's selected mood for a personalized listening experience.",
            demoLink: "./public/Mood_Music_Suggester/index.html",
            category: "entertainment",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Mood Selection", "Curated Song List", "Audio Player Integration", "Responsive UI"]
        },
        {
            originalDay: 47,
            name: "CalRace",
            description: "A fast-paced calculator racing game where players solve math problems under time pressure to advance.",
            demoLink: "./public/Day-45/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Math Problem Challenges", "Timer-Based Gameplay", "Score Tracking", "Level Progression"]
        },
        {
            originalDay: 48,
            name: "Word Guess Game",
            description: "An interactive word guessing game where players try to reveal the hidden word within limited attempts.",
            demoLink: "./public/Day53-Word-Guess-Game/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Random Word Generation", "Limited Attempts", "Letter Hints", "Win/Loss Feedback"]
        },
        {
            originalDay: 49,
            name: "4 in a Row",
            description: "A strategic two-player game where the goal is to connect four discs in a row vertically, horizontally, or diagonally.",
            demoLink: "./public/Day-57_4_in_a_row/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Two Player Mode", "Win Detection", "Interactive Grid", "Game Reset"]
        },
        {
            originalDay: 50,
            name: "Budget Tracker",
            description: "A simple financial tracking tool to manage income, expenses, and visualize spending habits.",
            demoLink: "./public/Budget-Tracker/index.html",
            category: "productivity",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Add Income & Expenses", "Balance Calculation", "Expense Categories", "Persistent Local Storage"]
        },
        {
            originalDay: 51,
            name: "Memory Game App",
            description: "A classic card-flipping memory game where players match pairs to win with the fewest moves.",
            demoLink: "./public/Memory Game App/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Card Matching Logic", "Move Counter", "Timer", "Game Reset Functionality"]
        },
        {
            originalDay: 52,
            name: "MyPaint",
            description: "A simple and fun digital drawing app that allows users to sketch, doodle, and paint freely on a canvas.",
            demoLink: "./public/day75-mypaint/index.html",
            category: "creativity",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Canvas Drawing", "Color Picker", "Brush Size Control", "Clear Canvas Button"]
        },
        {
            originalDay: 53,
            name: "Fruit Slicer",
            description: "Every slice counts. Miss and it’s game over!",
            demoLink: "./public/Fruit_Slicer_Game/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Score System", "Lifes", "Fruit Cutting"]
        },
        {
            originalDay: 54,
            name: "BattleShip",
            description: "Destroy the enemy ship",
            demoLink: "./public/Day-71/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript", "Node.js"],
            features: ["Hide 'n' seek", "Catch"]
        },
        {
            originalDay: 55,
            name: "Github Profle Finder ",
            description: "Find Github Profile ",
            demoLink: "./public/Github_Profile_Finder/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Github", "Github Followers ", "Creative"]
        },
        {
            originalDay: 56,
            name: "HeliFly",
            description: "Fly the Helicopter",
            demoLink: "./public/Day-55/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Fly"]
        },
        {
            originalDay: 57,
            name: "RoboBuilder",
            description: "Buildd the Robot",
            demoLink: "./public/Day-72/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Repair", "Fix"]
        },
        {
            originalDay: 58,
            name: "Github Profile Finder",
            description: "Find Github Profile",
            demoLink: "./public/Github_Profile_Finder/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Github", "Github Followers", "Creative"]
        },
        {
            originalDay: 59,
            name: "Hamster Slap",
            description: "Slap the Hamster coming from the hole.",
            demoLink: "./public/Day-69/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Hide n seek", "Catch", "Slap"]
        },

        {
            originalDay: 60,
            name: "LeetMatrix",
            description: "Check Leetcode stats",
            demoLink: "./public/LeetMatrix/index.html",
            category: "basic",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["LeetCode", "Stats", "Graph"]
        },
        {
            originalDay: 61,
            name: "LoveVerse",
            description: "A Lovely Website with some crazy stuffs.",
            demoLink: "./public/Day-70/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Love Game", "Romantic"]
        },
        {
            originalDay: 62,
            name: "QuizProgram",
            description: "Take a random quiz",
            demoLink: "./public/QuizProgram/index.html",
            category: "basic",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Quiz", "Scores"]
        },
        {
            originalDay: 63,
            name: "University Management System",
            description: "Manage university operations including courses, students, and faculty.",
            demoLink: "./public/University_managment_system/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript", "API"],
            features: ["Visitor Management", "History Tracking", "Search Functionality"]
        },
        {
            originalDay: 64,
            name: " Pixel Art Maker",
            description: "Create pixel art with a simple grid interface.",
            demoLink: "./public/Day-76_PixelArt/index.html",
            category: "creativity",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Grid Creation", "Color Selection", "Download Art", "Reset Canvas"]

        },
        {
            originalDay: 65,
            name: "CineSearch",
            description: "stylish and responsive movie search web app that allows users to search for any movie using the OMDB API.",
            demoLink: "./public/CineSearch/index.html",
            category: "entertainment",
            technologies: ["HTML", "CSS", "JavaScript", "API"],
            features: [
                "Live Movie Search Functionality",
                "Poster, Title & Year Display",
                "Responsive Grid Layout",
                "OMDb API Integration",
                "Error Handling & No Result Messages",
                "Dark-Themed UI with Neon Accents",
                "Clean Separation of HTML, CSS, and JS"
            ]
        },
        {

            originalDay: 66,
            name: "Fruit Ninja",
            description: "Play with fruits",
            demoLink: "./public/Day-59/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Cut"]
        },
        {

            originalDay: 67,
            name: "Solitaire",
            description: "Play with Cards",
            demoLink: "./public/Day-90/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Ace", "King"]
        },
        {

            originalDay: 68,
            name: "Door Game",
            description: "Open the Doors of your luck",
            demoLink: "./public/Day-91/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Luck", "Doors"]
        },
        {

            originalDay: 69,
            name: "Roast Battle",
            description: "Roast Your self by AI",
            demoLink: "./public/Day-92/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Roast"]
        },
        {

            originalDay: 70,
            name: "Compliment Generator",
            description: "Generate Compliment for your love once",
            demoLink: "./public/Day-93/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Compliments"]
        },
        {

            originalDay: 71,
            name: "PickUp Lines",
            description: "Generate PickUp Lines for your someonce",
            demoLink: "./public/Day-94/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["PickUp Lines"]
        },
        {

            originalDay: 72,
            name: "Hero Identity",
            description: "Know who you are",
            demoLink: "./public/Day-95/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Hero", "Powers"]
        },
        {

            originalDay: 73,
            name: "Fotune Teller",
            description: "Know your future",
            demoLink: "./public/Day-96/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Future", "Fortune"]
        },
        {
            originalDay: 74,
            name: "Fitness Tracker",
            description: "Advanced, vibrant web app to track daily steps and water intake with charts, themes, and responsive design.",
            demoLink: "./public/Fitness_Tracker/index.html",
            category: "productivity",
            technologies: ["HTML", "CSS", "JavaScript", "Chart.js"],
            features: ["Daily Steps & Water Input", "Dark/Light Mode", "Chart.js Visualizations", "Responsive Design", "Duplicate Prevention", "Tooltips on Charts"]
        },


        {

            originalDay: 75,
            name: "Super Mario",
            description: "Mario is back.",
            demoLink: "./public/Day-62/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Mario", "Jump"]
        },

        {

            originalDay: 76,
            name: "Netflix",
            description: "Netflix Clone",
            demoLink: "./public/Day-97/index.html",
            category: "Utility",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Clone"]
        },
        {

            originalDay: 77,
            name: "Spin",
            description: "Spin the wheel",
            demoLink: "./public/Day-98/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Spin", "Wheel"]
        },
        {

            originalDay: 78,
            name: "PuckMan",
            description: "Escape from the ghost",
            demoLink: "./public/Day-99/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["PuckMan", "Ghost"]
        },
        {

            originalDay: 79,
            name: "EduGames phase 1",
            description: "Class 1 - Class 8",
            demoLink: "./public/Day-100/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Games", "MCQ"]
        },
        {

            originalDay: 80,
            name: "EduGames phase 2",
            description: "Class 9 - Class 12",
            demoLink: "./public/Day-80/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Games", "MCQ"]
        },
        {

            originalDay: 81,
            name: "Tank Battle",
            description: "Fight with Tanks",
            demoLink: "./public/Day-81/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Future", "Fortune"]
        },
        {

            originalDay: 82,
            name: "Carrom",
            description: "Play carrom",
            demoLink: "./public/Day-82/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Carrom", "Fun"]
        },
        {

            originalDay: 83,
            name: "Pong",
            description: "Play Pong",
            demoLink: "./public/Day-83/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Future", "Fortune"]
        },
        {

            originalDay: 84,
            name: "404 Escape Room",
            description: "Find the hidden clues",
            demoLink: "./public/Day-84/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Hidden", "Clues"]
        },
        {

            originalDay: 85,
            name: "Sudoku",
            description: "Play with numbers",
            demoLink: "./public/Day-85/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Numbers"]
        },
        {

            originalDay: 86,
            name: "KBC",
            description: "Kaun Banega crorepati?",
            demoLink: "./public/Day-86/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["MCQ", "Lifelines"]
        },
        {

            originalDay: 87,
            name: "Past Life Finder",
            description: "Know your Past",
            demoLink: "./public/Day-87/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Past"]
        },
        {

            originalDay: 88,
            name: "Tetris",
            description: "Play Tetris",
            demoLink: "./public/Day-88/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Tetris", "Boxes"]
        },
        {

            originalDay: 89,
            name: "Puzzle",
            description: "Slides the boxes",
            demoLink: "./public/Day-89/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Slide", "Solve"]
        },
        {

            originalDay: 90,
            name: "Archery",
            description: "Aim the target",
            demoLink: "./public/Day-61/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Slide", "Solve"]
        },


        {
            originalDay: 91,
            name: "Flappy Bird",
            description: "Play with Bird",
            demoLink: "./public/flappy-bird/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Bird", "Score", "Hard"]
        },

        {


            originalDay: 92,
            name: "Fanta Website Clone",
            description: "Enjoy your first Drink ",
            demoLink: "./public/Fanta-Website/index.html",
            category: "creativity",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Fanta", "Coldrink", "Animation"]
        },
        {
            originalDay: 93,
            name: "Ruchii Tiffin ",
            description: "Simple Homely Tasty Meals ",
            demoLink: "./public/Ruchii-Tiffin/index.html",
            category: "creativity",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["food", "meals", "creativity"]
        },

        {

            originalDay: 94,
            name: "Invoice Builder",
            description: "Generate Product Invoice",
            demoLink: "./public/Invoice-Builder/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Invoice", "Product Invoice ", "Invoice Generator"]
        },

        {
            originalDay: 95,
            name: "Fitness Club ",
            description: "Your Only Gym",
            demoLink: "./public/Gym-Website/index.html",
            category: "creativity",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Gym", "Weight", "Fitness"]
        },

        {
            originalDay: 96,
            name: "Bubble Pop",
            description: "Engaging bubble popping game where players clear groups of matching bubbles under a timer with increasing difficulty and score multipliers.",
            demoLink: "./public/Bubble_Pop/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Dynamic 8x8 bubble grid", "group matching and popping", "multi-levels with timer", "score tracking", "light/dark mode", "responsive design", "keyboard accessible", "animations", "sound effects"]
        },

        {
            originalDay: 97,
            name: "Library Book Manager",
            description: "A stylish, accessible, and fully functional library management app to add, edit, delete, and track reading status of books with persistent storage.",
            demoLink: "./public/Library_Book_Manager/index.html",
            category: "productivity",
            technologies: ["HTML", "CSS", "JavaScript", "LocalStorage"],
            features: [
                "Add, Edit, and Delete Books",
                "Reading Status Toggle (Unread, Reading, Read)",
                "Dark/Light Mode Toggle with Persistence",
                "Responsive and Accessible UI",
                "Animated Border Gradient Styling",
                "Empty Library Message Handling"
            ]
        },
        {
            originalDay: 98,
            name: "Memory Grid Rush",
            description: "Fast-paced memory game where players repeat flashing grid patterns that get progressively harder with each level.",
            demoLink: "./public/Memory_Grid_Rush/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: [
                "Dynamic grid scaling, pattern generation & replay, dark/light mode, score & level tracking, keyboard accessibility, animated feedback, and replay option."
            ]
        },

        {
            originalDay: 99,
            name: "Fitness Club ",
            description: "Your Only Gym",
            demoLink: "./public/Gym-Website/index.html",
            category: "creativity",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Gym", "Weight", "Fitness"]
        },


        {
            originalDay: 100,
            name: "Library Book Manager",
            description: "A stylish, accessible, and fully functional library management app to add, edit, delete, and track reading status of books with persistent storage.",
            demoLink: "./public/Library_Book_Manager/index.html",
            category: "productivity",
            technologies: ["HTML", "CSS", "JavaScript", "LocalStorage"],
            features: [
                "Add, Edit, and Delete Books", "Reading Status Toggle (Unread, Reading, Read)",
                "Dark/Light Mode Toggle with Persistence", "Responsive and Accessible UI",
                "Animated Border Gradient Styling", "Empty Library Message Handling"]
        },
        {
            originalDay: 101,
            name: "Drum Kit",
            description: "Play the Drum",
            demoLink: "./public/Drum-Kit/index.html",
            category: "productivity",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Music", "Drum"]
        },

        {
            originalDay: 102,
            name: "Memory Grid Rush",
            description: "Fast-paced memory game where players repeat flashing grid patterns that get progressively harder with each level.",
            demoLink: "./public/Memory_Grid_Rush/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: [
                "Dynamic grid scaling, pattern generation & replay, dark/light mode, score & level tracking, keyboard accessibility, animated feedback, and replay option."
            ]
        },

        {
            originalDay: 103,
            name: "Salon Website ",
            description: "Firt Cut Free",
            demoLink: "./public/Salon-Website/index.html",
            category: "creativity",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["salon", "cutting", "glow up"]
        },
        {
            originalDay: 104,
            name: "Agency Website",
            description: "Showcase your agency",
            demoLink: "./public/Agency-Website/index.html",
            category: "creativity",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["agency", "showcase", "portfolio"]
        },


        {
            originalDay: 105,
            name: "RAM Website",
            description: "A website for showcasing RAM products",
            demoLink: "./public/RAM-Website/index.html",
            category: "creativity",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["RAM", "Computer", "Website"]
        },

        {
            originalDay: 106,
            name: "Lagunitas Website",
            description: "A website for showcasing Lagunitas products",
            demoLink: "./public/Lagunitas-Website/index.html",
            category: "creativity",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Lagunitas", "Beer", "Website"]
        },


        {
            originalDay: 107,
            name: "Pirate Website",
            description: "A website for showcasing pirate-themed products",
            demoLink: "./public/Pirates-Website/index.html",
            category: "creativity",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Pirate", "Website", "Showcase"]
        },

        {
            originalDay: 108,
            name: "Christmas Lights",
            description: "A website for showcasing Christmas lights",
            demoLink: "./public/Christmas-Website/index.html",
            category: "creativity",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Christmas", "Lights", "Website"]
        },
        {
            originalDay: 109,
            name: "Bottle Spin",
            description: "Play truth & dare with friends",
            demoLink: "./public/Day-150/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Truth", "Dare", "Fun"]
        },
        {
            originalDay: 110,
            name: "Travel Bucket List App",
            description: "A website for your Travel Bucket List",
            demoLink: "./public/Day-151/index.html",
            category: "creativity",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Travel", "List", "Planning"]
        },
        {
            originalDay: 111,
            name: "Lost & Found Hub",
            description: "A website for Lost & Found products",
            demoLink: "./public/Day-152/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Items", "Lost", "Found"]
        },
        {
            originalDay: 112,
            name: "Recipe Finder",
            description: "A website which helps you in finding your favorait Recipes",
            demoLink: "./public/Day-153/index.html",
            category: "creativity",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Recipes"]
        },
        {
            originalDay: 113,
            name: "Cross the road",
            description: "Beaware from Cars",
            demoLink: "./public/Day-154/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Car", "Road"]
        },
        {
            originalDay: 114,
            name: "Borderland",
            description: "A website for Browser-Based Survival Game",
            demoLink: "./public/Day-155/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Cards", "survival"]
        },
        {
            originalDay: 115,
            name: "Rolling numbers",
            description: "Match the 3 numbers",
            demoLink: "./public/Day-156/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Numbers"]
        },
        {
            originalDay: 116,
            name: "Time Vault",
            description: "A website where you hide your message",
            demoLink: "./public/Day-157/index.html",
            category: "creativity",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Message", "Vault", "Time"]
        },
        {
            originalDay: 117,
            name: "Puzzle",
            description: "Puzzle Game",
            demoLink: "./public/Day-158/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Game"]
        },
        {
            originalDay: 118,
            name: "Lighthouse Building",
            description: "Build the Lighthouse",
            demoLink: "./public/Day-159/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Lighthouse", "Building"]
        },
        {
            originalDay: 119,
            name: "Car Racing",
            description: "Car Racing game",
            demoLink: "./public/Day-160/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Racing"]
        },
        {
            originalDay: 120,
            name: "Baloon Buster",
            description: "Bust the Baloon",
            demoLink: "./public/Day-161/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Baloon"]
        },
        {
            originalDay: 121,
            name: "Hacker Website",
            description: "A Hacker themed Website",
            demoLink: "./public/Day-162/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Website"]
        },
        {
            originalDay: 122,
            name: "Story Generator",
            description: "Generate Stories",
            demoLink: "./public/Day-163/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Stories"]
        },
        {
            originalDay: 123,
            name: "Alien Language translator",
            description: "Translate Alien Language",
            demoLink: "./public/Day-164/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Translator"]
        },
        {
            originalDay: 124,
            name: "Dino Game",
            description: "Chrome Dino Game",
            demoLink: "./public/Day-165/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Dino"]
        },
        {
            originalDay: 125,
            name: "Past Life Finder",
            description: "Past Life Finder website",
            demoLink: "./public/Day-166/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Website"]
        },
        {
            originalDay: 126,
            name: "Health Checkup Appointment",
            description: "Doctor appointment scheduled for a routine health checkup on 25th Aug, 2025 at 10:30 AM.",
            demoLink: "Home.html", // link to details page
            category: "Basic",
            technologies: ["HTML", "CSS", "JS"],
            features: [
                "Doctor consultation details",
                "Date & time reminder",
                "Hospital/Clinic information"
            ]
        },
        {
            originalDay: 127,
            name: "Reaction Time Test 2.0",
            description: "Challenging reaction game where players quickly identify and click the correct shape and color among multiple targets with increasing levels and timed responses.",
            demoLink: "./public/Reaction_Time_Test_2.0/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Multiple colorful shapes display", "timed reaction tracking", "progressive levels", "scoring system", "light/dark mode", "responsive layout", "keyboard accessibility", "animations", "sound effects"]
        },
        {
            originalDay: 128,
            name: "Save Animals Website ",
            description: "A website for saving animals",
            demoLink: "./public/Save-Animals-Website/index.html",
            category: "creativity",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Animal", "Save", "Website"]
        },
        {
            originalDay: 129,
            name: "Zombie Shooter",
            description: "A website for showcasing a zombie shooter game",
            demoLink: "./public/Zombie-Shooter-Game/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Zombie", "Shooter", "Game"]
        },
        {
            originalDay: 130,
            name: "HangMan Game",
            description: "A classic word-guessing game where players try to guess a hidden word by suggesting letters within a certain number of guesses.",
            demoLink: "./public/HangmanGame/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["HangMan", "Game", "Word Guessing"]
        },
        {
            originalDay: 131,
            name: "Movie Seat Booking",
            description: "A website for booking movie seats",
            demoLink: "./public/MovieSeatBooking/index.html",
            category: "creativity",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Movie", "Seat", "Booking"]
        },
        {
            originalDay: 132,
            name: "Discord Clone",
            description: "Discord UI Clone ",
            demoLink: "./public/Discord-Clone/index.html",
            category: "creativity",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Chat", "UI", "Channels"]
        },
        {
            originalDay: 133,
            name: "Cups & Ball",
            description: "Play with cups",
            demoLink: "./public/Day-167/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Cups", "Ball"]
        },
        {
            originalDay: 134,
            name: "BINGO",
            description: "Play BINGO",
            demoLink: "./public/Day-168/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["BINGO"]
        },
        {
            originalDay: 135,
            name: "Casino Roulette",
            description: "Spin the wheel",
            demoLink: "./public/Day-169/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Wheel", "Luck"]
        },
        {
            originalDay: 136,
            name: "Shooting",
            description: "Aim the target",
            demoLink: "./public/Day-170/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Shoot", "Aim"]
        },
        {
            originalDay: 137,
            name: "Car Racing",
            description: "A website for Car Racing Game",
            demoLink: "./public/Day-171/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Car", "Race"]
        },
        {
            originalDay: 138,
            name: "Tattoo Designer",
            description: "A website for Tattoo Designer",
            demoLink: "./public/Day-172/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Tattoo", "Designer"]
        },
        {
            originalDay: 139,
            name: "Signature Maker",
            description: "A website for Signature Maker",
            demoLink: "./public/Day-173/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Signature"]
        },
        {
            originalDay: 140,
            name: "Car rental website",
            description: "A website for Car rent",
            demoLink: "./public/Day-174/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Cars", "Rent"]
        },
        {
            originalDay: 141,
            name: "Admin Dashboard",
            description: "A website for Admin Dashboard",
            demoLink: "./public/Day-175/index.html",
            category: "utilities",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Dashboard"]
        },
        {
            originalDay: 142,
            name: "Treasure Hunt",
            description: "A website for Browser-Based Treasure Hunt Game",
            demoLink: "./public/Day-176/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Treasure Hunt"]
        },
        {
            originalDay: 143,
            name: "Rubik Cube",
            description: "A website for Rubik Cube solve",
            demoLink: "./public/Day-177/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Rubik Cube"]
        },
        {
            originalDay: 144,
            name: "Rocket Fighting",
            description: "A website for Rocket Fighting Games",
            demoLink: "./public/Day-178/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Rocket", "Fighting"]
        },
        {
            originalDay: 145,
            name: "Basketball",
            description: "Play Basketball Game",
            demoLink: "./public/Day-179/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Basketball"]
        },
        {
            originalDay: 146,
            name: "Blocks Smash",
            description: "A Blocks Smash Game",
            demoLink: "./public/Day-180/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Blocks", "Smash"]
        },
        {
            originalDay: 147,
            name: "Temple run",
            description: "A Temple run type game",
            demoLink: "./public/Day-181/index.html",
            category: "games",
            technologies: ["HTML", "CSS", "JavaScript"],
            features: ["Run"]
        }
    ];

    // Enhanced Q&A database with project-focused responses
    qnaDatabase = [
        {
            keywords: ['hello', 'hi', 'hey', 'greeting', 'good morning', 'good afternoon'],
            answer: 'Hello! Welcome to our portfolio of 100+ web projects. I can help you explore games, utilities, creative tools, and educational apps. What type of project interests you?'
        },
        {
            keywords: ['projects', 'portfolio', 'work', 'examples', 'apps', 'applications'],
            answer: 'We have 100+ amazing projects including:\n\n🎮 Games: Chess, Space War, Candy Crush, Neon Brick Breaker\n🛠️ Utilities: Weather App, QR Generator, Currency Converter\n🎨 Creative: Drawing Apps, Audio Visualizer, Gradient Generator\n📚 Education: Grade Analyzer, Book Recommendations\n\nWhich category interests you most?'
        },
        {
            keywords: ['games', 'gaming', 'play', 'fun', 'entertainment'],
            answer: 'Our game collection includes:\n\n🎯 Arcade: Neon Brick Breaker, Space Jumper, Fruit Ninja\n🧩 Puzzle: Chess, Memory Game, Candy Crush\n🎲 Casual: Rock Paper Scissors, Coin Flip, Tic Tac Toe\n🚁 Action: Space War, Alien Hunt, Flappy Bird\n\nWhich game would you like to try?'
        },
        {
            keywords: ['utilities', 'tools', 'useful', 'productivity', 'practical'],
            answer: 'Our utility collection:\n\n⏰ Time: Pomodoro Timer, World Clock, Stopwatch\n📝 Organization: Todo List, Notes App, Note Tracker\n🎨 Creative: Drawing App, Color Picker, Palette Generator\n💱 Converters: Currency, QR Code Generator\n🌤️ Information: Weather App, GitHub Profile Finder\n\nWhat tool do you need?'
        },
        {
            keywords: ['weather', 'climate', 'forecast', 'temperature'],
            answer: 'Our Weather App shows real-time weather for any city! Features: current conditions, weather icons, city search, and responsive design. Perfect for staying updated on weather conditions.'
        },
        {
            keywords: ['drawing', 'art', 'creative', 'design', 'paint'],
            answer: 'Creative tools available:\n\n🎨 Drawing Apps: Basic and advanced with layers\n🖌️ Design: Pixel Art Maker, ASCII Art Generator\n🌈 Colors: Palette Generator, Color Picker, Gradient Generator\n\nGreat for artists and designers!'
        },
        {
            keywords: ['chess', 'board game', 'strategy'],
            answer: 'Our Chess Game features move validation, piece animations, and complete game logic. Perfect for chess enthusiasts wanting to play in the browser!'
        },
        {
            keywords: ['audio', 'music', 'sound', 'visualizer'],
            answer: 'Audio projects:\n\n🎵 Audio Visualizer: Real-time frequency analysis with particle effects\n🎭 Mood Music Suggester: Music recommendations based on mood\n\nBoth offer unique interactive audio experiences!'
        },
        {
            keywords: ['technologies', 'tech', 'programming', 'code', 'built'],
            answer: 'Our projects showcase:\n\n💻 Core: HTML5, CSS3, JavaScript (ES6+)\n🎨 Graphics: Canvas API, SVG, CSS Animations\n🔊 Audio: Web Audio API\n📱 Responsive: Mobile-first design\n🎮 Games: Physics engines, collision detection\n\nAll built with vanilla JavaScript!'
        },
        {
            keywords: ['Day-1', 'Day1', 'day-1', 'day 1', 'Day 1'],
            answer: 'Name: Todo List<br>Description: A simple and elegant todo list application with local storage support.<br>DemoLink: <a href="./public/Day-1_TodoList/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-2', 'Day2', 'day-2', 'day 2', 'Day 2'],
            answer: 'Name: Digital Clock<br>Description: A beautiful digital clock with customizable themes and formats.<br>DemoLink: <a href="./public/Day-2_digital_clock/digitalclock.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-3', 'Day3', 'day-3', 'day 3', 'Day 3'],
            answer: 'Name: ASCII Art Generator<br>Description: Convert text into ASCII art with various font styles and customization options.<br>DemoLink: <a href="./public/Day-3_AsciiArtGenerator/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-4', 'Day4', 'day-4', 'day 4', 'Day 4'],
            answer: 'Name: Password Visualizer<br>Description: Visualize password strength and complexity with interactive graphics.<br>DemoLink: <a href="./public/Day-4_password_visualizer/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-5', 'Day5', 'day-5', 'day 5', 'Day 5'],
            answer: 'Name: Physics Simulation<br>Description: Interactive physics simulation with bouncing balls and gravity effects.<br>DemoLink: <a href="./public/Day-5_physics_simulation/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-6', 'Day6', 'day-6', 'day 6', 'Day 6'],
            answer: 'Name: Quote Generator<br>Description: Generate inspirational quotes with beautiful backgrounds and sharing options.<br>DemoLink: <a href="./public/Day-6_QuoteGenerator/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-7', 'Day7', 'day-7', 'day 7', 'Day 7'],
            answer: 'Name: Character Word Counter<br>Description: Count characters, words, and paragraphs in real-time with detailed statistics.<br>DemoLink: <a href="./public/Day-7_CharacterWordCounter/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-8', 'Day8', 'day-8', 'day 8', 'Day 8'],
            answer: 'Name: Dice Roll Simulator<br>Description: Simulate dice rolls with realistic 3D animations and multiple dice options.<br>DemoLink: <a href="./public/Day-8_DiceRollSimulator/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-9', 'Day9', 'day-9', 'day 9', 'Day 9'],
            answer: 'Name: Guess My Number<br>Description: A fun number guessing game with hints and score tracking.<br>DemoLink: <a href="./public/Day-9_Guess_My_Number/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-10', 'Day10', 'day-10', 'day 10', 'Day 10'],
            answer: 'Name: Neon Brick Breaker<br>Description: A modern twist on the classic brick breaker game with neon graphics.<br>DemoLink: <a href="./public/Day-10_Neon_Brick_Breaker/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-11', 'Day11', 'day-11', 'day 11', 'Day 11'],
            answer: 'Name: Weather App<br>Description: Get real-time weather information for any city with a beautiful interface.<br>DemoLink: <a href="./public/Day-11_WeatherApp/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-12', 'Day12', 'day-12', 'day 12', 'Day 12'],
            answer: 'Name: Coin Flip<br>Description: A realistic coin flipping animation with statistics tracking.<br>DemoLink: <a href="./public/Day-13_Coin_Flip/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-13', 'Day13', 'day-13', 'day 13', 'Day 13'],
            answer: 'Name: E-Waste Management Hub<br>Description: Educational platform for e-waste management with location finder.<br>DemoLink: <a href="./public/Day-14_E-WasteManagementHub/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-14', 'Day14', 'day-14', 'day 14', 'Day 14'],
            answer: 'Name: Currency Converter<br>Description: Convert between different currencies with real-time exchange rates.<br>DemoLink: <a href="./public/Day-15_Currency_Converter/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-15', 'Day15', 'day-15', 'day 15', 'Day 15'],
            answer: 'Name: Random User Generator<br>Description: Generate random user profiles with photos and detailed information.<br>DemoLink: <a href="./public/Day-16_Random_User_Generator/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-16', 'Day16', 'day-16', 'day 16', 'Day 16'],
            answer: 'Name: Image Search App<br>Description: Search and browse high-quality images with advanced filtering options.<br>DemoLink: <a href="./public/Day-17_Image_Search_App/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-17', 'Day17', 'day-17', 'day 17', 'Day 17'],
            answer: 'Name: Tic Tac Toe<br>Description: Classic tic-tac-toe game with AI opponent and score tracking.<br>DemoLink: <a href="./public/Day-20_tictactoe/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-18', 'Day18', 'day-18', 'day 18', 'Day 18'],
            answer: 'Name: Candy Crush<br>Description: Match-3 puzzle game inspired by the popular Candy Crush saga.<br>DemoLink: <a href="./public/Day-21_candycrush/candy_crush.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-19', 'Day19', 'day-19', 'day 19', 'Day 19'],
            answer: 'Name: Palette Generator<br>Description: Generate beautiful color palettes for your design projects.<br>DemoLink: <a href="./public/Day-22_Palette_generator/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-20', 'Day20', 'day-20', 'day 20', 'Day 20'],
            answer: 'Name: QR Code Generator<br>Description: Generate QR codes for text, URLs, and other data types.<br>DemoLink: <a href="./public/Day-23_QRCodeGenerator/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-21', 'Day21', 'day-21', 'day 21', 'Day 21'],
            answer: 'Name: Rock Paper Scissors<br>Description: Classic rock paper scissors game with computer opponent.<br>DemoLink: <a href="./public/Day-23_RockPaperScissor/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-22', 'Day22', 'day-22', 'day 22', 'Day 22'],
            answer: 'Name: Drawing App<br>Description: Digital drawing canvas with multiple brush tools and colors.<br>DemoLink: <a href="./public/Day-26_Drawing/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-23', 'Day23', 'day-23', 'day 23', 'Day 23'],
            answer: 'Name: Target Reflex Test<br>Description: Test your reflexes by clicking on moving targets as fast as possible.<br>DemoLink: <a href="./public/Day-28_Target_Reflex_Test/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-24', 'Day24', 'day-24', 'day 24', 'Day 24'],
            answer: 'Name: Memory Game<br>Description: Classic memory card matching game with multiple difficulty levels.<br>DemoLink: <a href="./public/Day-31/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-25', 'Day25', 'day-25', 'day 25', 'Day 25'],
            answer: 'Name: Color Picker<br>Description: Advanced color picker with multiple format outputs and palette saving.<br>DemoLink: <a href="./public/Day-34-Colour_picker/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-26', 'Day26', 'day-26', 'day 26', 'Day 26'],
            answer: 'Name: Advanced Drawing<br>Description: Professional drawing application with layers and advanced tools.<br>DemoLink: <a href="./public/Day-35-Drawing/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-27', 'Day27', 'day-27', 'day 27', 'Day 27'],
            answer: 'Name: Notes App<br>Description: Feature-rich notes application with search and organization tools.<br>DemoLink: <a href="./public/Day-36_Notes_App/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-28', 'Day28', 'day-28', 'day 28', 'Day 28'],
            answer: 'Name: Note Taker<br>Description: Simple and efficient note-taking app with markdown support.<br>DemoLink: <a href="./public/Day-42_NoteTaker/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-29', 'Day29', 'day-29', 'day 29', 'Day 29'],
            answer: 'Name: Audio Visualizer<br>Description: Interactive audio visualizer with particle effects and real-time frequency analysis.<br>DemoLink: <a href="./public/Day-45/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-30', 'Day30', 'day-30', 'day 30', 'Day 30'],
            answer: 'Name: Pomodoro Timer<br>Description: Productivity timer with task management, customizable themes, and session tracking.<br>DemoLink: <a href="./public/Day-47_Pomodoro-app/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-31', 'Day31', 'day-31', 'day 31', 'Day 31'],
            answer: 'Name: Chess Game<br>Description: Interactive chess game with move validation, piece animations, and game state tracking.<br>DemoLink: <a href="./public/Day-51/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-32', 'Day32', 'day-32', 'day 32', 'Day 32'],
            answer: 'Name: Rock Paper Scissors<br>Description: Interactive rock paper scissors game with user vs computer gameplay.<br>DemoLink: <a href="./public/Day-54_RockPaperSessior/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-33', 'Day33', 'day-33', 'day 33', 'Day 33'],
            answer: 'Name: Portfolio Website<br>Description: Modern portfolio website template with responsive design and animations.<br>DemoLink: <a href="./public/Day-72_Portfolio/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-34', 'Day34', 'day-34', 'day 34', 'Day 34'],
            answer: 'Name: Etch-a-Sketch<br>Description: Digital Etch-a-Sketch with customizable grid and drawing modes.<br>DemoLink: <a href="./public/Etch-a-Sketch/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-35', 'Day35', 'day-35', 'day 35', 'Day 35'],
            answer: 'Name: GiggleBits<br>Description: Fun collection of interactive mini-games and entertainment.<br>DemoLink: <a href="./public/GiggleBits/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-36', 'Day36', 'day-36', 'day 36', 'Day 36'],
            answer: 'Name: Gradient Generator<br>Description: Create beautiful CSS gradients with live preview and export functionality.<br>DemoLink: <a href="./public/Gradient_Generator/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-37', 'Day37', 'day-37', 'day 37', 'Day 37'],
            answer: 'Name: Snake and Ladder<br>Description: Classic board game with multiplayer support and animated gameplay.<br>DemoLink: <a href="./public/Snake-and-Ladder-Game/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-38', 'Day38', 'day-38', 'day 38', 'Day 38'],
            answer: 'Name: Space Jumper Game<br>Description: Exciting space-themed jumping game with physics engine and score system.<br>DemoLink: <a href="./public/Space-Jumper-Game/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-39', 'Day39', 'day-39', 'day 39', 'Day 39'],
            answer: 'Name: Space War Game<br>Description: Intense space battle game with enemy AI and power-ups.<br>DemoLink: <a href="./public/Space-War-Game/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-40', 'Day40', 'day-40', 'day 40', 'Day 40'],
            answer: 'Name: Stopwatch<br>Description: Precision stopwatch with lap timing and split functionality.<br>DemoLink: <a href="./public/Stopwatch/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-41', 'Day41', 'day-41', 'day 41', 'Day 41'],
            answer: 'Name: World Clock<br>Description: Display multiple world time zones with real-time updates and customization.<br>DemoLink: <a href="./public/World_Clock/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-42', 'Day42', 'day-42', 'day 42', 'Day 42'],
            answer: 'Name: Notes Tracker<br>Description: A simple and organized digital notebook to create, update, and manage notes efficiently.<br>DemoLink: <a href="./public/Day-42_NoteTaker/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-43', 'Day43', 'day-43', 'day 43', 'Day 43'],
            answer: 'Name: Alien Hunt<br>Description: A fun and fast-paced shooting game where players hunt down aliens and score points.<br>DemoLink: <a href="./public/Day-31/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-44', 'Day44', 'day-44', 'day 44', 'Day 44'],
            answer: 'Name: Book Recommendation<br>Description: Suggests books based on user-selected genres, moods, or interests with a clean UI.<br>DemoLink: <a href="https://book-recomendation.netlify.app/" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-45', 'Day45', 'day-45', 'day 45', 'Day 45'],
            answer: 'Name: Student Grade Analyzer<br>Description: Analyzes student marks and provides insights like total, average, grade, and performance level.<br>DemoLink: <a href="./public/Student_Grade_Analyzer/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-46', 'Day46', 'day-46', 'day 46', 'Day 46'],
            answer: 'Name: Mood Based Music Suggester<br>Description: Recommends music tracks based on the user\'s selected mood for a personalized listening experience.<br>DemoLink: <a href="./public/Mood_Music_Suggester/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-47', 'Day47', 'day-47', 'day 47', 'Day 47'],
            answer: 'Name: CalRace<br>Description: A fast-paced calculator racing game where players solve math problems under time pressure to advance.<br>DemoLink: <a href="./public/Day-45/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-48', 'Day48', 'day-48', 'day 48', 'Day 48'],
            answer: 'Name: Word Guess Game<br>Description: An interactive word guessing game where players try to reveal the hidden word within limited attempts.<br>DemoLink: <a href="./public/Day53-Word-Guess-Game/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-49', 'Day49', 'day-49', 'day 49', 'Day 49'],
            answer: 'Name: 4 in a Row<br>Description: A strategic two-player game where the goal is to connect four discs in a row vertically, horizontally, or diagonally.<br>DemoLink: <a href="./public/Day-57_4_in_a_row/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-50', 'Day50', 'day-50', 'day 50', 'Day 50'],
            answer: 'Name: Budget Tracker<br>Description: A simple financial tracking tool to manage income, expenses, and visualize spending habits.<br>DemoLink: <a href="./public/Budget-Tracker/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-51', 'Day51', 'day-51', 'day 51', 'Day 51'],
            answer: 'Name: Memory Game App<br>Description: A classic card-flipping memory game where players match pairs to win with the fewest moves.<br>DemoLink: <a href="./public/Memory Game App/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-52', 'Day52', 'day-52', 'day 52', 'Day 52'],
            answer: 'Name: MyPaint<br>Description: A simple and fun digital drawing app that allows users to sketch, doodle, and paint freely on a canvas.<br>DemoLink: <a href="./public/day75-mypaint/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-53', 'Day53', 'day-53', 'day 53', 'Day 53'],
            answer: 'Name: Fruit Slicer<br>Description: Every slice counts. Miss and it’s game over!<br>DemoLink: <a href="./public/Fruit_Slicer_Game/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-54', 'Day54', 'day-54', 'day 54', 'Day 54'],
            answer: 'Name: BattleShip<br>Description: Destroy the enemy ship.<br>DemoLink: <a href="./public/Day-71/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-55', 'Day55', 'day-55', 'day 55', 'Day 55'],
            answer: 'Name: Github Profle Finder<br>Description: Find Github Profile.<br>DemoLink: <a href="./public/Github_Profile_Finder/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-56', 'Day56', 'day-56', 'day 56', 'Day 56'],
            answer: 'Name: HeliFly<br>Description: Fly the Helicopter.<br>DemoLink: <a href="./public/Day-55/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-57', 'Day57', 'day-57', 'day 57', 'Day 57'],
            answer: 'Name: RoboBuilder<br>Description: Build the Robot.<br>DemoLink: <a href="./public/Day-72/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-58', 'Day58', 'day-58', 'day 58', 'Day 58'],
            answer: 'Name: Github Profile Finder<br>Description: Find Github Profile.<br>DemoLink: <a href="./public/Github_Profile_Finder/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-59', 'Day59', 'day-59', 'day 59', 'Day 59'],
            answer: 'Name: Hamster Slap<br>Description: Slap the Hamster coming from the hole.<br>DemoLink: <a href="./public/Day-69/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-60', 'Day60', 'day-60', 'day 60', 'Day 60'],
            answer: 'Name: LeetMatrix<br>Description: Check Leetcode stats.<br>DemoLink: <a href="./public/LeetMatrix/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-61', 'Day61', 'day-61', 'day 61', 'Day 61'],
            answer: 'Name: LoveVerse<br>Description: A Lovely Website with some crazy stuffs.<br>DemoLink: <a href="./public/Day-70/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-62', 'Day62', 'day-62', 'day 62', 'Day 62'],
            answer: 'Name: QuizProgram<br>Description: Take a random quiz.<br>DemoLink: <a href="./public/QuizProgram/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-63', 'Day63', 'day-63', 'day 63', 'Day 63'],
            answer: 'Name: University Management System<br>Description: Manage university operations including courses, students, and faculty.<br>DemoLink: <a href="./public/University_managment_system/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-64', 'Day64', 'day-64', 'day 64', 'Day 64'],
            answer: 'Name: Pixel Art Maker<br>Description: Create pixel art with a simple grid interface.<br>DemoLink: <a href="./public/Day-76_PixelArt/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-65', 'Day65', 'day-65', 'day 65', 'Day 65'],
            answer: 'Name: CineSearch<br>Description: Stylish and responsive movie search web app that allows users to search for any movie using the OMDB API.<br>DemoLink: <a href="./public/CineSearch/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-66', 'Day66', 'day-66', 'day 66', 'Day 66'],
            answer: 'Name: Fruit Ninja<br>Description: Play with fruits.<br>DemoLink: <a href="./public/Day-59/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-67', 'Day67', 'day-67', 'day 67', 'Day 67'],
            answer: 'Name: Solitaire<br>Description: Play with Cards.<br>DemoLink: <a href="./public/Day-90/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-68', 'Day68', 'day-68', 'day 68', 'Day 68'],
            answer: 'Name: Door Game<br>Description: Open the Doors of your luck.<br>DemoLink: <a href="./public/Day-91/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-69', 'Day69', 'day-69', 'day 69', 'Day 69'],
            answer: 'Name: Roast Battle<br>Description: Roast Yourself by AI.<br>DemoLink: <a href="./public/Day-92/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-70', 'Day70', 'day-70', 'day 70', 'Day 70'],
            answer: 'Name: Compliment Generator<br>Description: Generate Compliment for your loved one.<br>DemoLink: <a href="./public/Day-93/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-71', 'Day71', 'day-71', 'day 71', 'Day 71'],
            answer: 'Name: PickUp Lines<br>Description: Generate PickUp Lines for someone.<br>DemoLink: <a href="./public/Day-94/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-72', 'Day72', 'day-72', 'day 72', 'Day 72'],
            answer: 'Name: Hero Identity<br>Description: Know who you are.<br>DemoLink: <a href="./public/Day-95/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-73', 'Day73', 'day-73', 'day 73', 'Day 73'],
            answer: 'Name: Fortune Teller<br>Description: Know your future.<br>DemoLink: <a href="./public/Day-96/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-74', 'Day74', 'day-74', 'day 74', 'Day 74'],
            answer: 'Name: Fitness Tracker<br>Description: Advanced, vibrant web app to track daily steps and water intake with charts, themes, and responsive design.<br>DemoLink: <a href="./public/Fitness_Tracker/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-75', 'Day75', 'day-75', 'day 75', 'Day 75'],
            answer: 'Name: Super Mario<br>Description: Mario is back.<br>DemoLink: <a href="./public/Day-62/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-76', 'Day76', 'day-76', 'day 76', 'Day 76'],
            answer: 'Name: Netflix<br>Description: Netflix Clone.<br>DemoLink: <a href="./public/Day-97/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-77', 'Day77', 'day-77', 'day 77', 'Day 77'],
            answer: 'Name: Spin<br>Description: Spin the wheel.<br>DemoLink: <a href="./public/Day-98/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-78', 'Day78', 'day-78', 'day 78', 'Day 78'],
            answer: 'Name: PuckMan<br>Description: Escape from the ghost.<br>DemoLink: <a href="./public/Day-99/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-79', 'Day79', 'day-79', 'day 79', 'Day 79'],
            answer: 'Name: EduGames phase 1<br>Description: Class 1 - Class 8.<br>DemoLink: <a href="./public/Day-100/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-80', 'Day80', 'day-80', 'day 80', 'Day 80'],
            answer: 'Name: EduGames phase 2<br>Description: Class 9 - Class 12.<br>DemoLink: <a href="./public/Day-80/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-81', 'Day81', 'day-81', 'day 81', 'Day 81'],
            answer: 'Name: Tank Battle<br>Description: Fight with Tanks.<br>DemoLink: <a href="./public/Day-81/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-82', 'Day82', 'day-82', 'day 82', 'Day 82'],
            answer: 'Name: Carrom<br>Description: Play carrom.<br>DemoLink: <a href="./public/Day-82/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-83', 'Day83', 'day-83', 'day 83', 'Day 83'],
            answer: 'Name: Pong<br>Description: Play Pong.<br>DemoLink: <a href="./public/Day-83/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-84', 'Day84', 'day-84', 'day 84', 'Day 84'],
            answer: 'Name: 404 Escape Room<br>Description: Find the hidden clues.<br>DemoLink: <a href="./public/Day-84/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-85', 'Day85', 'day-85', 'day 85', 'Day 85'],
            answer: 'Name: Sudoku<br>Description: Play with numbers.<br>DemoLink: <a href="./public/Day-85/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-86', 'Day86', 'day-86', 'day 86', 'Day 86'],
            answer: 'Name: KBC<br>Description: Kaun Banega Crorepati?<br>DemoLink: <a href="./public/Day-86/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-87', 'Day87', 'day-87', 'day 87', 'Day 87'],
            answer: 'Name: Past Life Finder<br>Description: Know your Past.<br>DemoLink: <a href="./public/Day-87/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-88', 'Day88', 'day-88', 'day 88', 'Day 88'],
            answer: 'Name: Tetris<br>Description: Play Tetris.<br>DemoLink: <a href="./public/Day-88/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-89', 'Day89', 'day-89', 'day 89', 'Day 89'],
            answer: 'Name: Puzzle<br>Description: Slides the boxes.<br>DemoLink: <a href="./public/Day-89/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-90', 'Day90', 'day-90', 'day 90', 'Day 90'],
            answer: 'Name: Archery<br>Description: Aim the target.<br>DemoLink: <a href="./public/Day-61/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-91', 'Day91', 'day-91', 'day 91', 'Day 91'],
            answer: 'Name: Flappy Bird<br>Description: Play with Bird.<br>DemoLink: <a href="./public/flappy-bird/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-92', 'Day92', 'day-92', 'day 92', 'Day 92'],
            answer: 'Name: Fanta Website Clone<br>Description: Enjoy your first Drink.<br>DemoLink: <a href="./public/Fanta-Website/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-93', 'Day93', 'day-93', 'day 93', 'Day 93'],
            answer: 'Name: Ruchii Tiffin<br>Description: Simple Homely Tasty Meals.<br>DemoLink: <a href="./public/Ruchii-Tiffin/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-94', 'Day94', 'day-94', 'day 94', 'Day 94'],
            answer: 'Name: Invoice Builder<br>Description: Generate Product Invoice.<br>DemoLink: <a href="./public/Invoice-Builder/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-95', 'Day95', 'day-95', 'day 95', 'Day 95'],
            answer: 'Name: Fitness Club<br>Description: Your Only Gym.<br>DemoLink: <a href="./public/Gym-Website/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-96', 'Day96', 'day-96', 'day 96', 'Day 96'],
            answer: 'Name: Bubble Pop<br>Description: Engaging bubble popping game with increasing difficulty and score multipliers.<br>DemoLink: <a href="./public/Bubble_Pop/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-97', 'Day97', 'day-97', 'day 97', 'Day 97'],
            answer: 'Name: Library Book Manager<br>Description: Stylish, accessible, and fully functional library management app.<br>DemoLink: <a href="./public/Library_Book_Manager/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-98', 'Day98', 'day-98', 'day 98', 'Day 98'],
            answer: 'Name: Memory Grid Rush<br>Description: Fast-paced memory game with progressively harder patterns.<br>DemoLink: <a href="./public/Memory_Grid_Rush/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-99', 'Day99', 'day-99', 'day 99', 'Day 99'],
            answer: 'Name: Fitness Club<br>Description: Your Only Gym.<br>DemoLink: <a href="./public/Gym-Website/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-100', 'Day100', 'day-100', 'day 100', 'Day 100'],
            answer: 'Name: Library Book Manager<br>Description: Stylish, accessible, and fully functional library management app.<br>DemoLink: <a href="./public/Library_Book_Manager/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-101', 'Day101', 'day-101', 'day 101', 'Day 101'],
            answer: 'Name: Drum Kit<br>Description: Play the Drum.<br>DemoLink: <a href="./public/Drum-Kit/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-102', 'Day102', 'day-102', 'day 102', 'Day 102'],
            answer: 'Name: Memory Grid Rush<br>Description: Fast-paced memory game with progressively harder patterns.<br>DemoLink: <a href="./public/Memory_Grid_Rush/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-103', 'Day103', 'day-103', 'day 103', 'Day 103'],
            answer: 'Name: Salon Website<br>Description: First Cut Free.<br>DemoLink: <a href="./public/Salon-Website/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-104', 'Day104', 'day-104', 'day 104', 'Day 104'],
            answer: 'Name: Agency Website<br>Description: Showcase your agency.<br>DemoLink: <a href="./public/Agency-Website/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-105', 'Day105', 'day-105', 'day 105', 'Day 105'],
            answer: 'Name: RAM Website<br>Description: A website for showcasing RAM products.<br>DemoLink: <a href="./public/RAM-Website/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-106', 'Day106', 'day-106', 'day 106', 'Day 106'],
            answer: 'Name: Lagunitas Website<br>Description: A website for showcasing Lagunitas products.<br>DemoLink: <a href="./public/Lagunitas-Website/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-107', 'Day107', 'day-107', 'day 107', 'Day 107'],
            answer: 'Name: Pirate Website<br>Description: A website for showcasing pirate-themed products.<br>DemoLink: <a href="./public/Pirates-Website/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-108', 'Day108', 'day-108', 'day 108', 'Day 108'],
            answer: 'Name: Christmas Lights<br>Description: A website for showcasing Christmas lights.<br>DemoLink: <a href="./public/Christmas-Website/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-109', 'Day109', 'day-109', 'day 109', 'Day 109'],
            answer: 'Name: Bottle Spin<br>Description: Play truth & dare with friends.<br>DemoLink: <a href="./public/Day-150/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-110', 'Day110', 'day-110', 'day 110', 'Day 110'],
            answer: 'Name: Travel Bucket List App<br>Description: A website for your Travel Bucket List.<br>DemoLink: <a href="./public/Day-151/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-111', 'Day111', 'day-111', 'day 111', 'Day 111'],
            answer: 'Name: Lost & Found Hub<br>Description: A website for Lost & Found products.<br>DemoLink: <a href="./public/Day-152/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-112', 'Day112', 'day-112', 'day 112', 'Day 112'],
            answer: 'Name: Recipe Finder<br>Description: A website which helps you find your favorite recipes.<br>DemoLink: <a href="./public/Day-153/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-113', 'Day113', 'day-113', 'day 113', 'Day 113'],
            answer: 'Name: Cross the road<br>Description: Beware from Cars.<br>DemoLink: <a href="./public/Day-154/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-114', 'Day114', 'day-114', 'day 114', 'Day 114'],
            answer: 'Name: Borderland<br>Description: A website for Browser-Based Survival Game.<br>DemoLink: <a href="./public/Day-155/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-115', 'Day115', 'day-115', 'day 115', 'Day 115'],
            answer: 'Name: Rolling numbers<br>Description: Match the 3 numbers.<br>DemoLink: <a href="./public/Day-156/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-116', 'Day116', 'day-116', 'day 116', 'Day 116'],
            answer: 'Name: Time Vault<br>Description: A website where you hide your message.<br>DemoLink: <a href="./public/Day-157/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-117', 'Day117', 'day-117', 'day 117', 'Day 117'],
            answer: 'Name: Puzzle<br>Description: Puzzle Game.<br>DemoLink: <a href="./public/Day-158/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-118', 'Day118', 'day-118', 'day 118', 'Day 118'],
            answer: 'Name: Lighthouse Building<br>Description: Build the Lighthouse.<br>DemoLink: <a href="./public/Day-159/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-119', 'Day119', 'day-119', 'day 119', 'Day 119'],
            answer: 'Name: Car Racing<br>Description: Car Racing game.<br>DemoLink: <a href="./public/Day-160/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-120', 'Day120', 'day-120', 'day 120', 'Day 120'],
            answer: 'Name: Baloon Buster<br>Description: Bust the Baloon.<br>DemoLink: <a href="./public/Day-161/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-121', 'Day121', 'day-121', 'day 121', 'Day 121'],
            answer: 'Name: Hacker Website<br>Description: A Hacker themed Website.<br>DemoLink: <a href="./public/Day-162/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-122', 'Day122', 'day-122', 'day 122', 'Day 122'],
            answer: 'Name: Story Generator<br>Description: Generate Stories.<br>DemoLink: <a href="./public/Day-163/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-123', 'Day123', 'day-123', 'day 123', 'Day 123'],
            answer: 'Name: Alien Language Translator<br>Description: Translate Alien Language.<br>DemoLink: <a href="./public/Day-164/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-124', 'Day124', 'day-124', 'day 124', 'Day 124'],
            answer: 'Name: Dino Game<br>Description: Chrome Dino Game.<br>DemoLink: <a href="./public/Day-165/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-125', 'Day125', 'day-125', 'day 125', 'Day 125'],
            answer: 'Name: Past Life Finder<br>Description: Past Life Finder website.<br>DemoLink: <a href="./public/Day-166/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-126', 'Day126', 'day-126', 'day 126', 'Day 126'],
            answer: 'Name: Health Checkup Appointment<br>Description: Doctor appointment scheduled for a routine health checkup on 25th Aug, 2025 at 10:30 AM.<br>DemoLink: <a href="Home.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-127', 'Day127', 'day-127', 'day 127', 'Day 127'],
            answer: 'Name: Reaction Time Test 2.0<br>Description: Challenging reaction game with multiple shapes and colors.<br>DemoLink: <a href="./public/Reaction_Time_Test_2.0/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-128', 'Day128', 'day-128', 'day 128', 'Day 128'],
            answer: 'Name: Save Animals Website<br>Description: A website for saving animals.<br>DemoLink: <a href="./public/Save-Animals-Website/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-129', 'Day129', 'day-129', 'day 129', 'Day 129'],
            answer: 'Name: Zombie Shooter<br>Description: A website for showcasing a zombie shooter game.<br>DemoLink: <a href="./public/Zombie-Shooter-Game/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-130', 'Day130', 'day-130', 'day 130', 'Day 130'],
            answer: 'Name: HangMan Game<br>Description: Classic word-guessing game.<br>DemoLink: <a href="./public/HangmanGame/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-131', 'Day131', 'day-131', 'day 131', 'Day 131'],
            answer: 'Name: Movie Seat Booking<br>Description: A website for booking movie seats.<br>DemoLink: <a href="./public/MovieSeatBooking/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-132', 'Day132', 'day-132', 'day 132', 'Day 132'],
            answer: 'Name: Discord Clone<br>Description: Discord UI Clone.<br>DemoLink: <a href="./public/Discord-Clone/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-133', 'Day133', 'day-133', 'day 133', 'Day 133'],
            answer: 'Name: Cups & Ball<br>Description: Play with cups.<br>DemoLink: <a href="./public/Day-167/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-134', 'Day134', 'day-134', 'day 134', 'Day 134'],
            answer: 'Name: BINGO<br>Description: Play BINGO.<br>DemoLink: <a href="./public/Day-168/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-135', 'Day135', 'day-135', 'day 135', 'Day 135'],
            answer: 'Name: Casino Roulette<br>Description: Spin the wheel.<br>DemoLink: <a href="./public/Day-169/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-136', 'Day136', 'day-136', 'day 136', 'Day 136'],
            answer: 'Name: Shooting<br>Description: Aim the target.<br>DemoLink: <a href="./public/Day-170/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-137', 'Day137', 'day-137', 'day 137', 'Day 137'],
            answer: 'Name: Car Racing<br>Description: A website for Car Racing Game.<br>DemoLink: <a href="./public/Day-171/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-138', 'Day138', 'day-138', 'day 138', 'Day 138'],
            answer: 'Name: Tattoo Designer<br>Description: A website for Tattoo Designer.<br>DemoLink: <a href="./public/Day-172/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-139', 'Day139', 'day-139', 'day 139', 'Day 139'],
            answer: 'Name: Signature Maker<br>Description: A website for Signature Maker.<br>DemoLink: <a href="./public/Day-173/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-140', 'Day140', 'day-140', 'day 140', 'Day 140'],
            answer: 'Name: Car rental website<br>Description: A website for Car rent.<br>DemoLink: <a href="./public/Day-174/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-141', 'Day141', 'day-141', 'day 141', 'Day 141'],
            answer: 'Name: Admin Dashboard<br>Description: A website for Admin Dashboard.<br>DemoLink: <a href="./public/Day-175/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-142', 'Day142', 'day-142', 'day 142', 'Day 142'],
            answer: 'Name: Treasure Hunt<br>Description: A website for Browser-Based Treasure Hunt Game.<br>DemoLink: <a href="./public/Day-176/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-143', 'Day143', 'day-143', 'day 143', 'Day 143'],
            answer: 'Name: Rubik Cube<br>Description: A website for Rubik Cube solve.<br>DemoLink: <a href="./public/Day-177/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-144', 'Day144', 'day-144', 'day 144', 'Day 144'],
            answer: 'Name: Rocket Fighting<br>Description: A website for Rocket Fighting Games.<br>DemoLink: <a href="./public/Day-178/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-145', 'Day145', 'day-145', 'day 145', 'Day 145'],
            answer: 'Name: Basketball<br>Description: Play Basketball Game.<br>DemoLink: <a href="./public/Day-179/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-146', 'Day146', 'day-146', 'day 146', 'Day 146'],
            answer: 'Name: Blocks Smash<br>Description: A Blocks Smash Game.<br>DemoLink: <a href="./public/Day-180/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['Day-147', 'Day147', 'day-147', 'day 147', 'Day 147'],
            answer: 'Name: Temple run<br>Description: A Temple run type game.<br>DemoLink: <a href="./public/Day-181/index.html" target="_blank">Click Here</a>'
        },
        {
            keywords: ['categories', 'types', 'kinds', 'organize'],
            answer: 'Project categories:\n\n🎮 Games - Interactive entertainment\n🛠️ Utilities - Practical daily tools\n📚 Education - Learning applications\n🎨 Creative - Art and design tools\n📈 Productivity - Organization helpers\n\nWhich category interests you?'
        }
    ];

    /**
     * Initialize the chatbot widget
     */
    init() {
        this.bindEvents();
        this.setupKeyboardNavigation();
        this.loadChatHistory();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Toggle chat window
        this.chatIcon.addEventListener('click', () => this.toggleChat());
        this.chatIcon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleChat();
            }
        });

        // Close chat window
        this.closeButton.addEventListener('click', () => this.closeChat());

        // Send message events
        this.sendButton.addEventListener('click', () => this.handleSendMessage());
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        // Input validation
        this.chatInput.addEventListener('input', () => this.validateInput());

        // Quick action buttons
        this.setupQuickActions();

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.chatWindow.contains(e.target) && !this.chatIcon.contains(e.target)) {
                this.closeChat();
            }
        });

        // Escape key to close chat
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });
    }

    /**
     * Setup quick action buttons
     */
    setupQuickActions() {
        const quickButtons = document.querySelectorAll('.quick-btn');
        quickButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const message = e.currentTarget.dataset.message;
                if (message) {
                    this.chatInput.value = message;
                    this.handleSendMessage();

                    // Hide quick actions after first use
                    const quickActions = document.querySelector('.quick-actions');
                    if (quickActions) {
                        quickActions.style.display = 'none';
                    }
                }
            });
        });
    }

    /**
     * Setup keyboard navigation for accessibility
     */
    setupKeyboardNavigation() {
        // Trap focus within chat window when open
        this.chatWindow.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = this.chatWindow.querySelectorAll(
                    'button, input, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    /**
     * Toggle chat window open/close
     */
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    /**
     * Open chat window
     */
    openChat() {
        this.isOpen = true;
        this.chatWindow.classList.add('open');
        this.chatWindow.setAttribute('aria-hidden', 'false');
        this.chatIcon.setAttribute('aria-expanded', 'true');

        // Focus on input field
        setTimeout(() => {
            this.chatInput.focus();
        }, 300);

        // Mark messages as read
        this.markMessagesAsRead();
    }

    /**
     * Close chat window
     */
    closeChat() {
        this.isOpen = false;
        this.chatWindow.classList.remove('open');
        this.chatWindow.setAttribute('aria-hidden', 'true');
        this.chatIcon.setAttribute('aria-expanded', 'false');

        // Return focus to chat icon
        this.chatIcon.focus();

        // Save chat history
        this.saveChatHistory();
    }

    /**
     * Handle sending a message
     */
    async handleSendMessage() {
        const message = this.chatInput.value.trim();

        if (!message || this.isTyping) return;

        // Clear input
        this.chatInput.value = '';
        this.validateInput();

        // Add user message
        this.addMessage(message, 'user');

        // Show typing indicator
        this.showTypingIndicator();

        // Process message and get response
        try {
            const response = await this.processMessage(message);

            // Remove typing indicator and add bot response
            setTimeout(() => {
                this.hideTypingIndicator();
                this.addMessage(response, 'bot');
            }, 1000 + Math.random() * 1000); // Simulate realistic response time

        } catch (error) {
            console.error('Error processing message:', error);
            this.hideTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    }

    /**
     * Process user message and return appropriate response
     */
    async processMessage(message) {
        const lowercaseMessage = message.toLowerCase();

        // Check for specific project searches first
        const projectMatch = this.searchProjects(lowercaseMessage);
        if (projectMatch) {
            return projectMatch;
        }

        // Find matching Q&A based on keywords
        for (const qa of this.qnaDatabase) {
            const hasMatch = qa.keywords.some(keyword => {
                const pattern = `\\b${keyword.replace(/\s+/g, '\\s*')}\\b`;
                const regex = new RegExp(pattern, 'i');
                return regex.test(message);
            });

            if (hasMatch) {
                return qa.answer;
            }
        }


        // Fallback response with helpful suggestions
        return "I'd love to help! I can tell you about:\n\n🎮 **Our Games**: Chess, Space War, Candy Crush, Memory Game\n🛠️ **Utility Apps**: Weather App, QR Generator, Todo List\n🎨 **Creative Tools**: Drawing Apps, Color Tools\n📚 **Educational Apps**: Grade Analyzer, Quiz Programs\n\nTry asking about 'games', 'utilities', or a specific project name!";
    }

    /**
     * Search for specific projects based on user query
     */
    searchProjects(query) {
        // Look for exact project name matches
        for (const project of this.projectsData) {
            if (query.includes(project.name.toLowerCase())) {
                return `**${project.name}** - ${project.description}\n\n🔧 **Tech**: ${project.technologies.join(', ')}\n✨ **Features**: ${project.features.join(', ')}\n📂 **Category**: ${project.category}\n\nWould you like to explore more ${project.category} projects?`;
            }
        }

        // Look for category matches
        const categories = ['games', 'utilities', 'productivity', 'education', 'creative'];
        for (const category of categories) {
            if (query.includes(category)) {
                const categoryProjects = this.projectsData.filter(p =>
                    p.category === category ||
                    (category === 'games' && p.category === 'games') ||
                    (category === 'creative' && p.category === 'creativity')
                );

                if (categoryProjects.length > 0) {
                    const projectList = categoryProjects.slice(0, 5).map(p =>
                        `• **${p.name}**: ${p.description}`
                    ).join('\n');

                    return `Here are some ${category} projects:\n\n${projectList}\n\n${categoryProjects.length > 5 ? `...and ${categoryProjects.length - 5} more!` : ''}`;
                }
            }
        }

        return null;
    }

    /**
     * Add a message to the chat with smooth animation
     */
    addMessage(content, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(20px)';
        messageElement.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        if (sender === 'bot') {
            // Allow HTML in bot messages
            messageContent.innerHTML = `<p>${content.replace(/\n/g, '<br>')}</p>`;
        } else {
            // Escape HTML for user messages
            messageContent.innerHTML = `<p>${this.escapeHtml(content).replace(/\n/g, '<br>')}</p>`;
        }

        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = this.formatTime(new Date());

        messageElement.appendChild(messageContent);
        messageElement.appendChild(messageTime);

        this.messagesContainer.appendChild(messageElement);

        requestAnimationFrame(() => {
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            this.scrollToBottom();
        }, 100);

        this.saveChatHistory();
    }


    /**
     * Format message content with proper line breaks and emojis
     */
    formatMessageContent(content) {
        return this.escapeHtml(content).replace(/\n/g, '<br>');
    }

    /**
     * Show typing indicator
     */
    showTypingIndicator() {
        if (this.isTyping) return;

        this.isTyping = true;

        const typingElement = document.createElement('div');
        typingElement.className = 'message bot-message';
        typingElement.id = 'typing-indicator';

        const typingContent = document.createElement('div');
        typingContent.className = 'typing-indicator';

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingContent.appendChild(dot);
        }

        typingElement.appendChild(typingContent);
        this.messagesContainer.appendChild(typingElement);

        this.scrollToBottom();
    }

    /**
     * Hide typing indicator
     */
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
    }

    /**
     * Validate input and update send button state
     */
    validateInput() {
        const message = this.chatInput.value.trim();
        const isValid = message.length > 0 && message.length <= 500;

        this.sendButton.disabled = !isValid || this.isTyping;
    }

    /**
     * Scroll chat to bottom
     */
    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    /**
     * Format time for message timestamps
     */
    formatTime(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hr ago`;

        return date.toLocaleDateString();
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Save chat history to localStorage
     */
    saveChatHistory() {
        try {
            const messages = Array.from(this.messagesContainer.children)
                .filter(msg => !msg.id || msg.id !== 'typing-indicator')
                .map(msg => ({
                    content: msg.querySelector('.message-content p').textContent,
                    sender: msg.classList.contains('bot-message') ? 'bot' : 'user',
                    timestamp: msg.querySelector('.message-time').textContent
                }));

            localStorage.setItem('chatbot-history', JSON.stringify(messages.slice(-50))); // Keep last 50 messages
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }

    /**
     * Load chat history from localStorage
     */
    loadChatHistory() {
        try {
            const history = localStorage.getItem('chatbot-history');
            if (history) {
                const messages = JSON.parse(history);

                // Clear current messages except welcome message
                const welcomeMessage = this.messagesContainer.firstElementChild;
                this.messagesContainer.innerHTML = '';
                if (welcomeMessage) {
                    this.messagesContainer.appendChild(welcomeMessage);
                }

                // Restore messages
                messages.forEach(msg => {
                    if (msg.sender !== 'bot' || msg.content !== welcomeMessage?.querySelector('p')?.textContent) {
                        const messageElement = document.createElement('div');
                        messageElement.className = `message ${msg.sender}-message`;

                        const messageContent = document.createElement('div');
                        messageContent.className = 'message-content';
                        messageContent.innerHTML = `<p>${this.escapeHtml(msg.content)}</p>`;

                        const messageTime = document.createElement('div');
                        messageTime.className = 'message-time';
                        messageTime.textContent = msg.timestamp;

                        messageElement.appendChild(messageContent);
                        messageElement.appendChild(messageTime);

                        this.messagesContainer.appendChild(messageElement);
                    }
                });

                this.scrollToBottom();
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }

    /**
     * Mark messages as read (for potential notification features)
     */
    markMessagesAsRead() {
        // This method can be extended for notification features
        console.log('Messages marked as read');
    }

    /**
     * Clear chat history
     */
    clearHistory() {
        try {
            localStorage.removeItem('chatbot-history');

            // Reset to welcome message only
            this.messagesContainer.innerHTML = `
                <div class="message bot-message">
                    <div class="message-content">
                        <p>Hello! I'm here to help you with questions about our website, services, and contact information. How can I assist you today?</p>
                    </div>
                    <div class="message-time">Just now</div>
                </div>
            `;

            this.scrollToBottom();
        } catch (error) {
            console.error('Error clearing chat history:', error);
        }
    }
}

// Initialize the chatbot when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new ChatbotWidget();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotWidget;
}