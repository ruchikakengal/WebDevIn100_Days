// Question Database for the Bottle Spin Game
const QUESTIONS = {
    funny: {
        truth: [
            "What's the most embarrassing thing you've ever done in public?",
            "Have you ever pretended to be sick to get out of something?",
            "What's the weirdest food combination you actually enjoy?",
            "Have you ever talked to yourself in the mirror? What did you say?",
            "What's the most childish thing you still do?",
            "Have you ever laughed so hard you peed a little?",
            "What's the strangest thing you believed as a child?",
            "Have you ever eaten something off the floor?",
            "What's your most irrational fear?",
            "Have you ever been caught singing in the shower?",
            "What's the weirdest dream you've ever had?",
            "Have you ever snorted while laughing?",
            "What's the most ridiculous lie you believed for way too long?",
            "Have you ever walked into a glass door?",
            "What's the funniest thing that's happened to you recently?",
            "Have you ever forgotten someone's name right after they introduced themselves?",
            "What's the worst haircut you've ever had?",
            "Have you ever waved at someone who was waving at someone behind you?",
            "What's the most embarrassing autocorrect fail you've had?",
            "Have you ever tried to look cool but failed miserably?"
        ],
        dare: [
            "Do your best impression of a chicken for 30 seconds.",
            "Sing 'Happy Birthday' in a silly voice.",
            "Do 10 jumping jacks while saying the alphabet backwards.",
            "Pretend to be a news reporter describing what's happening in the room.",
            "Do your best dance moves for 30 seconds.",
            "Talk in a British accent for the next 3 minutes.",
            "Act like a robot until your next turn.",
            "Do your best impression of a celebrity.",
            "Pretend to be a cat for 1 minute.",
            "Sing the chorus of your favorite song while hopping on one foot.",
            "Do your best superhero pose and hold it for 20 seconds.",
            "Pretend you're a cooking show host and describe how to make a sandwich.",
            "Do your best impression of a baby crying.",
            "Act out your favorite movie scene without talking.",
            "Do 5 push-ups while naming your favorite foods.",
            "Pretend to be an opera singer and sing about what you had for breakfast.",
            "Do your best zombie walk across the room.",
            "Act like you're stuck in an invisible box for 30 seconds.",
            "Do your best impression of your favorite teacher.",
            "Pretend to be a weather reporter predicting tomorrow's weather."
        ]
    },
    
    friendship: {
        truth: [
            "Who was your first crush?",
            "What's your biggest regret in life so far?",
            "Have you ever lied to get out of hanging out with someone?",
            "What's something you've never told your best friend?",
            "Who in this room would you want to be stranded on a desert island with?",
            "What's the meanest thing you've ever said about someone?",
            "Have you ever had a crush on a friend's sibling?",
            "What's your most embarrassing moment from school?",
            "Who do you think is the most attractive person in this room?",
            "Have you ever stolen anything?",
            "What's the biggest lie you've ever told?",
            "Who was your worst teacher and why?",
            "Have you ever cheated on a test?",
            "What's something you're glad your parents don't know about you?",
            "Who do you secretly think is overrated?",
            "What's the most trouble you've ever gotten into?",
            "Have you ever pretended to like someone just to fit in?",
            "What's your most unpopular opinion?",
            "Who in this group do you trust the most?",
            "What's something you judge people for but shouldn't?"
        ],
        dare: [
            "Text your crush and tell them how you feel.",
            "Call a random contact and sing them 'Happy Birthday'.",
            "Let someone go through your phone for 2 minutes.",
            "Post an embarrassing photo of yourself on social media.",
            "Let the group choose your profile picture for the next week.",
            "Send a weird selfie to your family group chat.",
            "Let someone else write a status for your social media.",
            "Call your parents and tell them you love them.",
            "Text your ex a funny meme.",
            "Let the person to your right redo your hairstyle.",
            "Give your phone to someone else to send a text to anyone they choose.",
            "Post a video of yourself doing a silly dance.",
            "Let someone look through your search history for 1 minute.",
            "Call a pizza place and ask if they deliver to Mars.",
            "Send a message to your 10th contact saying 'The chickens have escaped!'",
            "Let someone tickle you for 30 seconds.",
            "Call a random number and try to convince them you know them.",
            "Let the group go through your photos for 3 minutes.",
            "Text your boss/teacher a funny gif without explanation.",
            "Let someone else choose what you wear tomorrow."
        ]
    },
    
    general: {
        truth: [
            "What's your biggest fear?",
            "What's the best compliment you've ever received?",
            "What's your guilty pleasure?",
            "If you could have dinner with anyone, dead or alive, who would it be?",
            "What's the best advice you've ever been given?",
            "What's your biggest pet peeve?",
            "What's something you're secretly proud of?",
            "If you could change one thing about yourself, what would it be?",
            "What's the best gift you've ever received?",
            "What's your favorite memory from childhood?",
            "What's something that always cheers you up?",
            "What's the worst advice you've ever been given?",
            "What's your biggest accomplishment?",
            "If you could live anywhere in the world, where would it be?",
            "What's something you want to learn how to do?",
            "What's the best purchase you've ever made?",
            "What's your favorite thing about yourself?",
            "If you could have any superpower, what would it be?",
            "What's the most important lesson life has taught you?",
            "What's something you wish you were better at?"
        ],
        dare: [
            "Give a genuine compliment to each person in the room.",
            "Share your most played song and dance to it.",
            "Do a 2-minute stand-up comedy routine about your day.",
            "Speak only in questions for the next 5 minutes.",
            "Do your best impression of each person in the room.",
            "Describe your dream house in great detail.",
            "Act out your morning routine in fast-forward.",
            "Tell us about your goals for the next year without stopping for 2 minutes.",
            "Do your best motivational speech for 1 minute.",
            "Share a talent you have that people might not know about.",
            "Describe your perfect day from start to finish.",
            "Do your best impression of your favorite animal.",
            "Tell a funny story about yourself that you've never shared before.",
            "Give dating advice to an imaginary person for 2 minutes.",
            "Act out your favorite book or movie scene.",
            "Describe what you think each person will be doing in 10 years.",
            "Do your best infomercial pitch for a ridiculous product.",
            "Share your top 3 life rules and explain why they're important.",
            "Act out how you think you'll be when you're 80 years old.",
            "Give a tour of the room as if you're showing it to aliens."
        ]
    }
};

// Additional question categories can be easily added
const BONUS_QUESTIONS = {
    would_you_rather: [
        "Would you rather be able to fly or be invisible?",
        "Would you rather always be 10 minutes late or 20 minutes early?",
        "Would you rather have the ability to read minds or predict the future?",
        "Would you rather give up social media or Netflix forever?",
        "Would you rather live without music or without movies?",
        "Would you rather be famous or be the best friend of someone famous?",
        "Would you rather always have to sing instead of speaking or dance everywhere you go?",
        "Would you rather live in the past or the future?",
        "Would you rather be able to talk to animals or speak every language?",
        "Would you rather never be able to use the internet again or never be able to watch TV again?"
    ],
    
    this_or_that: [
        "Pizza or burgers?",
        "Beach vacation or mountain retreat?",
        "Morning person or night owl?",
        "Books or movies?",
        "Coffee or tea?",
        "Summer or winter?",
        "Sweet or salty snacks?",
        "Texting or calling?",
        "Indoor or outdoor activities?",
        "Cats or dogs?"
    ]
};

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QUESTIONS, BONUS_QUESTIONS };
}
