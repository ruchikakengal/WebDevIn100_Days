"use strict";
//------------------------------------------------------------ENUMERATIONS
var Keys;
(function (Keys) {
    Keys[Keys["Space"] = 32] = "Space";
    Keys[Keys["Left"] = 37] = "Left";
    Keys[Keys["Up"] = 38] = "Up";
    Keys[Keys["Right"] = 39] = "Right";
    Keys[Keys["Down"] = 40] = "Down";
})(Keys || (Keys = {}));
var ScrData;
(function (ScrData) {
    ScrData[ScrData["Width"] = 100] = "Width";
    ScrData[ScrData["Height"] = 100] = "Height";
})(ScrData || (ScrData = {}));
var Character;
(function (Character) {
    Character[Character["Width"] = 10] = "Width";
    Character[Character["Height"] = 15] = "Height";
})(Character || (Character = {}));
var Fire;
(function (Fire) {
    Fire[Fire["Width"] = 5] = "Width";
    Fire[Fire["Height"] = 5] = "Height";
})(Fire || (Fire = {}));
var Which;
(function (Which) {
    Which[Which["Player"] = 0] = "Player";
    Which[Which["Computer"] = 1] = "Computer";
})(Which || (Which = {}));
var Difficulty;
(function (Difficulty) {
    Difficulty[Difficulty["Easy"] = 0] = "Easy";
    Difficulty[Difficulty["Medium"] = 1] = "Medium";
    Difficulty[Difficulty["Hard"] = 2] = "Hard";
})(Difficulty || (Difficulty = {}));
var MoveReactionTime;
(function (MoveReactionTime) {
    MoveReactionTime[MoveReactionTime["Easy"] = 750] = "Easy";
    MoveReactionTime[MoveReactionTime["Medium"] = 350] = "Medium";
    MoveReactionTime[MoveReactionTime["Hard"] = 100] = "Hard";
})(MoveReactionTime || (MoveReactionTime = {}));
var FireReactionTime;
(function (FireReactionTime) {
    FireReactionTime[FireReactionTime["Easy"] = 800] = "Easy";
    FireReactionTime[FireReactionTime["Medium"] = 500] = "Medium";
    FireReactionTime[FireReactionTime["Hard"] = 150] = "Hard";
})(FireReactionTime || (FireReactionTime = {}));
var DodgeThreshold;
(function (DodgeThreshold) {
    DodgeThreshold[DodgeThreshold["Easy"] = 5] = "Easy";
    DodgeThreshold[DodgeThreshold["Medium"] = 10] = "Medium";
    DodgeThreshold[DodgeThreshold["Hard"] = 15] = "Hard";
})(DodgeThreshold || (DodgeThreshold = {}));
var MoveLocation;
(function (MoveLocation) {
    MoveLocation[MoveLocation["Left"] = 0] = "Left";
    MoveLocation[MoveLocation["Right"] = 1] = "Right";
})(MoveLocation || (MoveLocation = {}));
var DisplaySteps;
(function (DisplaySteps) {
    DisplaySteps[DisplaySteps["Top"] = 0] = "Top";
    DisplaySteps[DisplaySteps["Instructions"] = 1] = "Instructions";
    DisplaySteps[DisplaySteps["Difficulty"] = 2] = "Difficulty";
    DisplaySteps[DisplaySteps["Score"] = 3] = "Score";
    DisplaySteps[DisplaySteps["Start"] = 4] = "Start";
    DisplaySteps[DisplaySteps["Play"] = 5] = "Play";
    DisplaySteps[DisplaySteps["End"] = 6] = "End";
})(DisplaySteps || (DisplaySteps = {}));
var Control;
(function (Control) {
    Control[Control["Width"] = 2] = "Width";
    Control[Control["Height"] = 2] = "Height";
    Control[Control["BorderWidth"] = 0.25] = "BorderWidth";
})(Control || (Control = {}));
//------------------------------------------------------------CONSTANTS
const ONE_SECOND = 1000;
const FPS = 24;
const SCREEN_EDGE = ScrData.Width - Character.Width;
const MOVE_SPEED = 0.8;
const BASIC_UNIT = "vmin";
const TEXT_UNIT = "em";
const FIRE_INTERVAL = 300;
const FIRE_SPEED = 1.2;
const ENDING_ANIMATION = 2000;
let app = new Vue({
    el: "#app",
    data: {
        keys: {
            space: Keys.Space,
            left: Keys.Left,
            up: Keys.Up,
            right: Keys.Right,
            down: Keys.Down
        },
        screen: {
            width: ScrData.Width + BASIC_UNIT,
            height: ScrData.Height + BASIC_UNIT
        },
        control: {
            width: Control.Width + TEXT_UNIT,
            height: Control.Height + TEXT_UNIT,
            borderWidth: Control.BorderWidth + TEXT_UNIT
        },
        wall: {
            player: {
                bottom: 0
            },
            computer: {
                top: Character.Height + BASIC_UNIT
            }
        },
        play: false,
        currentTime: 0,
        lastRenderTime: 0,
        activeKey: {
            Player: null,
            Computer: null
        },
        player: {
            width: 0,
            height: 0,
            left: 0
        },
        computer: {
            width: 0,
            height: 0,
            left: 0
        },
        location: {
            Player: 0,
            Computer: 0
        },
        fires: {
            Player: [],
            Computer: []
        },
        lastFireTime: {
            Player: 0,
            Computer: 0
        },
        ai: {
            difficulty: null,
            moveCurrentTime: 0,
            moveReactionTime: 0,
            fireCurrentTime: 0,
            fireReactionTime: 0,
            dodgeThreshold: 0
        },
        points: {
            Player: 0,
            Computer: 0
        },
        displaySteps: {
            top: DisplaySteps.Top,
            instructions: DisplaySteps.Instructions,
            difficulty: DisplaySteps.Difficulty,
            score: DisplaySteps.Score,
            start: DisplaySteps.Start,
            play: DisplaySteps.Play,
            end: DisplaySteps.End
        },
        displayStep: 0,
        selectDifficulty: [
            Difficulty[Difficulty.Easy],
            Difficulty[Difficulty.Medium],
            Difficulty[Difficulty.Hard]
        ],
        currentOption: 0,
        stepMenuCount: [0, 0, 3, 5, 0, 0, 0],
        winningScore: [10, 20, 30, 40, 50],
        maxScore: 0,
        winMessage: null,
        ending: false
    },
    methods: {
        //------------------------------------------------------------HELPERS
        // Randomize number with start and end
        randomize(start, end) {
            return Math.round(Math.random() * (end - start) + start);
        },
        // Get the lapsed time
        timeLapse(currentTime) {
            return this.currentTime - currentTime;
        },
        // Game loop function (Just a simple iteration)
        gameLoop() {
            setTimeout(() => {
                if (this.play === true) {
                    window.requestAnimationFrame(this.gameLoop);
                    this.currentTime = performance.now();
                    this.moveCharacter(Which[Which.Player]);
                    this.moveFire(Which[Which.Player]);
                    this.fireCollision(Which[Which.Player], 0, 0);
                    this.computerAction();
                    this.moveCharacter(Which[Which.Computer]);
                    this.moveFire(Which[Which.Computer]);
                    this.fireCollision(Which[Which.Computer], 0, 0);
                    if (this.currentTime - this.lastRenderTime > ONE_SECOND / FPS) {
                        this.lastRenderTime = this.currentTime;
                        this.renderCharacters();
                        this.renderFires();
                    }
                }
            }, 0);
        },
        //------------------------------------------------------------CHARACTER
        // Set the character's initial size
        initializeCharactersSize() {
            let width = Character.Width + BASIC_UNIT;
            let height = Character.Height + BASIC_UNIT;
            this.player.width = width;
            this.player.height = height;
            this.computer.width = width;
            this.computer.height = height;
        },
        // Set the character's initial position
        initializeCharactersPosition() {
            let end = SCREEN_EDGE * 100;
            let player = this.randomize(0, end) / 100;
            let computer = this.randomize(0, end) / 100;
            this.location.Player = player;
            this.location.Computer = computer;
        },
        // Set the initial fire values
        initializeFire() {
            this.fires = {
                Player: [],
                Computer: []
            };
        },
        // Set the initial score
        initializeScore() {
            this.points = {
                Player: 0,
                Computer: 0
            };
        },
        // Do all the initialize commands
        initializeAll() {
            this.initializeCharactersSize();
            this.initializeCharactersPosition();
            this.initializeFire();
            this.initializeScore();
            this.displayStep = 0;
        },
        // Move the character's location to another point
        moveCharacter(which) {
            switch (this.activeKey[which]) {
                case Keys.Left:
                    if (this.location[which] - MOVE_SPEED <= 0) {
                        this.location[which] = 0;
                        break;
                    }
                    this.location[which] -= MOVE_SPEED;
                    break;
                case Keys.Right:
                    if (this.location[which] + MOVE_SPEED >= SCREEN_EDGE) {
                        this.location[which] = SCREEN_EDGE;
                        break;
                    }
                    this.location[which] += MOVE_SPEED;
                    break;
                default:
                    return;
            }
        },
        // Move the computer's position
        computerPosition() {
            if (this.computerFiringGap() === true) {
                this.activeKey.Computer = null;
                return true;
            }
            if (this.location.Computer <= this.location.Player) {
                this.activeKey.Computer = Keys.Right;
            }
            else {
                this.activeKey.Computer = Keys.Left;
            }
            this.ai.fireCurrentTime = this.currentTime;
            return false;
        },
        // Render the characters into their respective locations
        renderCharacters() {
            this.player.left = this.location.Player + BASIC_UNIT;
            this.computer.left = this.location.Computer + BASIC_UNIT;
        },
        //------------------------------------------------------------FIRE
        // Set the fire's initial position when summoned
        initializeFirePosition(which) {
            let fireTime = this.currentTime;
            let lastFire = this.lastFireTime[which];
            if (fireTime - lastFire < FIRE_INTERVAL) {
                return;
            }
            if (this.fires[which].length < 2) {
                this.lastFireTime[which] = fireTime;
                let x = this.location[which] + Character.Width / 2 - Fire.Width / 2;
                let y = Character.Height;
                if (which === Which[Which.Player]) {
                    y = ScrData.Height - Character.Height - Fire.Height;
                }
                this.fires[which].push({
                    x: x,
                    y: y,
                    style: {
                        top: y + BASIC_UNIT,
                        left: x + BASIC_UNIT,
                        width: Fire.Width + BASIC_UNIT,
                        height: Fire.Height + BASIC_UNIT
                    }
                });
            }
        },
        // Launch the fire
        launchFire(which) {
            this.initializeFirePosition(which);
        },
        // Move the fire's location to another point
        moveFire(which) {
            let fireSpeed = FIRE_SPEED;
            if (which === Which[Which.Player]) {
                fireSpeed *= -1;
            }
            for (let i in this.fires[which]) {
                this.fires[which][i].y += fireSpeed;
                let fire = this.fires[which][i];
                if (which === Which[Which.Player] && fire.y + Fire.Height < 0) {
                    this.fires[which].splice(i, 1);
                }
                else if (which === Which[Which.Computer] && fire.y > ScrData.Height) {
                    this.fires[which].splice(i, 1);
                }
            }
        },
        // Render fire sprite into their respective locations
        renderFires() {
            let whichArray = [Which[Which.Player], Which[Which.Computer]];
            for (let i in whichArray) {
                let which = whichArray[i];
                for (let j in this.fires[which]) {
                    let fire = this.fires[which][j];
                    this.fires[which][j].style.top = fire.y + BASIC_UNIT;
                }
            }
        },
        // Fire collision
        fireCollision(which, advance, prediction) {
            let otherWhich = Which[Which.Computer];
            let yCharacter = Character.Height;
            let fireHeightHalf = Fire.Height / 2;
            if (which === Which[Which.Computer]) {
                otherWhich = Which[Which.Player];
                yCharacter = ScrData.Height - Character.Height;
            }
            for (let i = 0; i < this.fires[which].length; i++) {
                let fire = this.fires[which][i];
                let x1 = fire.x;
                let x2 = x1 + Fire.Width;
                let y = fire.y;
                let cX1 = this.location[otherWhich];
                let cX2 = cX1 + Character.Width;
                if (prediction !== 0 && this.computerDistanceCheck(i) === true) {
                    cX1 -= prediction;
                    cX2 -= prediction;
                }
                else {
                    cX1 += prediction;
                    cX2 += prediction;
                }
                let xCondition = x1 <= cX2 && x2 >= cX1;
                y = y + fireHeightHalf - advance;
                if (which === Which[Which.Computer]) {
                    if (y > yCharacter && xCondition === true) {
                        this.analyzeFire(i, which, advance);
                        return i;
                    }
                }
                else {
                    if (y < yCharacter && xCondition === true) {
                        this.analyzeFire(i, which, advance);
                        return i;
                    }
                }
            }
            return null;
        },
        // Analyze the fire position, then remove
        analyzeFire(i, which, advance) {
            if (advance === 0) {
                this.fires[which].splice(i, 1);
                this.points[which]++;
            }
            if (this.points[which] === this.winningScore[this.maxScore]) {
                this.play = false;
                if (which === Which[Which.Computer]) {
                    let aiType = Difficulty[this.ai.difficulty];
                    this.winMessage = "You lose! " + which + " (" + aiType + ")";
                }
                else {
                    this.winMessage = "Congratulations! You";
                }
                this.ending = true;
                let timeout = setTimeout(() => {
                    this.ending = false;
                    this.displayStep++;
                    clearTimeout(timeout);
                }, ENDING_ANIMATION);
            }
        },
        //------------------------------------------------------------ACTION
        // Set the key that is being hold
        setActiveKey(key) {
            if (this.activeKey.Player === null) {
                this.activeKey.Player = key;
                this.ai.moveCurrentTime = this.currentTime;
            }
        },
        // Clear the active key
        clearActiveKey(key) {
            if (key === this.activeKey.Player) {
                this.activeKey.Player = null;
            }
        },
        // Set the computer's difficulty
        setComputerDifficulty() {
            let difficulty = Difficulty[this.ai.difficulty];
            this.ai.moveReactionTime = MoveReactionTime[difficulty];
            this.ai.fireReactionTime = FireReactionTime[difficulty];
            this.ai.dodgeThreshold = DodgeThreshold[difficulty];
        },
        // Trigger for all of the computer's function
        computerAction() {
            if (this.computerDodge() === true) {
                return;
            }
            if (this.computerAvoidFire() === true) {
                return;
            }
            let moveElapsedTime = this.timeLapse(this.ai.moveCurrentTime);
            if (moveElapsedTime < this.ai.moveReactionTime) {
                this.activeKey.Computer = null;
                return;
            }
            if (this.computerPosition() === true) {
                this.computerLaunchFire();
            }
        },
        // Make the AI to launch a fire
        computerLaunchFire() {
            let fireElapsedTime = this.timeLapse(this.ai.fireCurrentTime);
            if (fireElapsedTime < this.ai.fireReactionTime) {
                return;
            }
            this.launchFire(Which[Which.Computer]);
        },
        // Make the AI dodge the player's fire
        computerDodge() {
            let fireIndex = this.fireCollision(Which[Which.Player], this.ai.dodgeThreshold, 0);
            if (fireIndex !== null) {
                if (this.computerDistanceCheck(fireIndex) === true) {
                    this.activeKey.Computer = Keys.Right;
                }
                else {
                    this.activeKey.Computer = Keys.Left;
                }
                return true;
            }
            return false;
        },
        // Make the computer avoid the incoming fire
        computerAvoidFire() {
            let fireIndex = this.fireCollision(Which[Which.Player], this.ai.dodgeThreshold, Fire.Width);
            if (fireIndex !== null) {
                this.activeKey.Computer = null;
                this.computerLaunchFire();
                return true;
            }
            return false;
        },
        // Gap within the player for the AI to launch a fire
        computerFiringGap() {
            let computerLocation = this.location.Computer;
            let playerLocation = this.location.Player;
            let fullWidth = Character.Width;
            let halfWidth = fullWidth / 2;
            return (computerLocation >= playerLocation - halfWidth &&
                computerLocation <= playerLocation + fullWidth - halfWidth);
        },
        // Check the distance between the fire and center of computer
        computerDistanceCheck(fireIndex) {
            let x = this.location.Computer + Character.Width / 2;
            let f1 = this.fires.Player[fireIndex].x;
            let f2 = f1 + Fire.Width;
            let d1 = Math.abs(x - f1);
            let d2 = Math.abs(x - f2);
            return d1 > d2;
        },
        // Set the game controls for playing status
        setPlayControlsDown(key) {
            switch (key) {
                case Keys.Left:
                    this.setActiveKey(Keys.Left);
                    break;
                case Keys.Right:
                    this.setActiveKey(Keys.Right);
                    break;
            }
        },
        // Set the game controls for menu status
        setMenuControlsDown(key) {
            switch (key) {
                case Keys.Up:
                    this.selectMenu(Keys.Up);
                    break;
                case Keys.Down:
                    this.selectMenu(Keys.Down);
                    break;
            }
        },
        // Set the game controls for playing status
        setPlayControlsUp(key) {
            switch (key) {
                case Keys.Space:
                    this.launchFire(Which[Which.Player]);
                    break;
                case Keys.Left:
                    this.clearActiveKey(key);
                    break;
                case Keys.Right:
                    this.clearActiveKey(key);
                    break;
            }
        },
        // Set the game controls for menu status
        setMenuControlsUp(key) {
            switch (key) {
                case Keys.Space:
                    this.confirmMenu();
                    break;
            }
        },
        // Set the game controls
        setControls() {
            window.addEventListener("keydown", (e) => {
                if (this.play === true) {
                    this.setPlayControlsDown(e.keyCode);
                }
                else {
                    this.setMenuControlsDown(e.keyCode);
                }
            });
            window.addEventListener("keyup", (e) => {
                if (this.play === true) {
                    this.setPlayControlsUp(e.keyCode);
                }
                else {
                    this.setMenuControlsUp(e.keyCode);
                }
            });
        },
        //------------------------------------------------------------INTERFACE EVENTS
        // Select item from the menu
        selectMenu(key) {
            let count = this.stepMenuCount[this.displayStep];
            let option = null;
            if (key === Keys.Up) {
                option = -1;
            }
            else if (key === Keys.Down) {
                option = 1;
            }
            else {
                return;
            }
            switch (this.currentOption + option) {
                case -1:
                    this.currentOption = count - 1;
                    break;
                case count:
                    this.currentOption = 0;
                    break;
                default:
                    this.currentOption += option;
                    break;
            }
        },
        // Confirm the selected item from the menu
        confirmMenu() {
            if (this.ending === true) {
                return;
            }
            if (this.displayStep === DisplaySteps.Difficulty) {
                this.ai.difficulty = this.currentOption;
                this.setComputerDifficulty();
                this.currentOption = 0;
            }
            else if (this.displayStep === DisplaySteps.Score) {
                this.maxScore = this.currentOption;
                this.currentOption = 0;
            }
            else if (this.displayStep === DisplaySteps.End) {
                this.initializeAll();
                return;
            }
            this.displayStep++;
            if (this.displayStep === DisplaySteps.Play) {
                this.currentOption = 0;
                this.winMessage = null;
                this.play = true;
                this.gameLoop();
                return;
            }
        },
        // Mousedown event on screen buttons
        mouseActionDown(key) {
            if (this.play === true) {
                this.setPlayControlsDown(key);
            }
            else {
                this.setMenuControlsDown(key);
            }
        },
        // Mouseup event on screen buttons
        mouseActionUp(key) {
            if (this.play === true) {
                this.setPlayControlsUp(key);
            }
            else {
                this.setMenuControlsUp(key);
            }
        }
    },
    created() {
        this.setControls();
        this.initializeAll();
    }
});