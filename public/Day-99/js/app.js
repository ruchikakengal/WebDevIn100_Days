const playerNameDisplay = document.getElementById("player-name");
const currentScoreDisplay = document.getElementById("current-score-display");
const highScoreDisplay = document.getElementById("high-score-display");

// Splash page
const splashDisplay = document.getElementById("splash");

// main wrapper
const gridWrapper = document.getElementById("grid-wrapper");

// Lives and Bonus score display
const livesDisplay = document.getElementById("lives");
const bonusDisplay = document.getElementById("bonus");

// Background
const backgroundDisplay = document.querySelector("main");
const readyDisplay = document.getElementById("ready");

const audio = document.createElement("audio");
const fruitAudio = document.createElement("audio");
const audioIntermission = document.createElement("audio");
const ghostAudio = document.createElement("audio");
ghostAudio.volume = 0.5;
fruitAudio.volume = 0.5;
audio.volume = 0.5;
audioIntermission.volume = 0.5;

// ! Variables
// Maze size and empty array
const width = 28;
const height = 31;
const gridSize = width * height;
let gridReference = [];
// Go through each tile of the maze and assign it a value that can be referenced later
const mazeLayout = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
  1, 2, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 2, 1,
  1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1,
  1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 3, 3, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 3, 3, 3, 3, 3, 3, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  5, 5, 5, 5, 5, 5, 0, 4, 4, 4, 1, 3, 3, 3, 3, 3, 3, 1, 4, 4, 4, 0, 5, 5, 5, 5, 5, 5,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 3, 3, 3, 3, 3, 3, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
  1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
  1, 2, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 2, 1,
  1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
  1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
  1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
  1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];
// pellet = 0
// wall = 1
// power pellet = 2
// ghost pen = 3
// blank = 4
// tunnel = 5
let currentScore = 0;
let highScore =
  localStorage.getItem("highscore") === null
    ? 0
    : parseInt(localStorage.getItem("highscore"));
let lives = 2;

class Character {
  constructor(name, position) {
    (this.name = name),
      (this.moving = false),
      this.lastMovement, // Done
      this.interval, // Done
      this.timeout, // Done
      this.timeout2,
      this.timeout3,
      this.timeout4,
      (this.position = position),
      (this.key = []);
    this.calc = {};
    this.up, this.down, this.left, this.right;
  }
}

let blinky = new Character("blinky", 321);
let inky = new Character("inky", 404);
let pinky = new Character("pinky", 406);
let clyde = new Character("clyde", 408);
let pacman = new Character("pacman", 657);
let characterObjects = [blinky, inky, pinky, clyde, pacman];
let ghostObjects = [blinky, inky, pinky, clyde];

let ghosts = ["blinky", "inky", "pinky", "clyde"];
let pelletCount = 240;
let key;
let level;
let lastWorkingKey;
let chase = false;
let ghostMode;
let ghostsEaten = 1;
let fruitCounter = 0;
let gameClock = 0;

// Interval initialisation
let gameClockInterval;
let backgroundInterval;
let exitInterval;
let blinkingInterval;
let chaseTimeout;

// Set the initial positions for pacman and the ghosts
let positions = {
  pacman: 657,
  blinky: 321,
  inky: 404,
  pinky: 406,
  clyde: 408,
};
let bonuses = [
  { name: "cherry", value: 100 },
  { name: "strawberry", value: 300 },
  { name: "orange", value: 500 },
  { name: "apple", value: 700 },
  { name: "melon", value: 1000 },
  { name: "galaxian", value: 2000 },
  { name: "bell", value: 3000 },
  { name: "key", value: 5000 },
];

// Game speed (feed this in as the variable in intervals)
let gameSpeed = 300;

// Keycodes for arrows and wasd
const up = [38, 87];
const down = [40, 83];
const left = [37, 65];
const right = [39, 68];
let keyboardLocked = false;
let blinking = false;
let activeGame = false;

// ! Page Load
bonusDisplay.classList.add("cherry");
livesDisplay.innerHTML = "CREDIT 1";
playerNameDisplay.innerHTML = "1UP";
scoreUpdate();

// ! Executions
function mazeGenerator() {
  // Create a grid with the variable gridSize and display their number inside
  gridReference = [];
  for (i = 0; i < gridSize; i++) {
    let gridItem = document.createElement("div");
    gridItem.classList.add("gridItem");
    gridItem.id = i;
    // Use the layout to initialise the pellets, power pellets and starting positions
    if (mazeLayout[i] === 0) {
      gridItem.classList.add("pellet");
    } else if (mazeLayout[i] === 2) {
      gridItem.classList.add("power-pellet");
    }
    gridItem.style.width = `${100 / width}%`;
    gridItem.style.height = `${100 / width}%`;
    gridReference.push(gridItem);
    gridWrapper.append(gridItem);
  }
  generatePositions();
}

function generatePositions() {
  characterObjects.forEach((character) => {
    addCharacter(character.position, character.name);
  });
}

function scoreUpdate(amount = 0) {
  currentScoreDisplay.innerHTML = currentScore += amount;
  highScoreDisplay.innerHTML = highScore > currentScore ? highScore : currentScore; // Function this later
  currentScore > highScore && localStorage.setItem("highscore", currentScore);
  // Award one life when the player gets over 10,000 pts
  if (currentScore % 10000 === 0 && currentScore < 19900 && currentScore !== 0) {
    lives++;
    livesUpdate();
  }
}

function livesUpdate(lostLife = 0) {
  livesDisplay.innerHTML = "";
  lives -= lostLife;
  for (i = 0; i < lives; i++) {
    let lifeDisplay = document.createElement("div");
    lifeDisplay.classList.add("life");
    livesDisplay.append(lifeDisplay);
  }
}

function gameIntro() {
  splashDisplay.style.display = "none";
  readyDisplay.style.display = "block";
  mazeGenerator();
  livesUpdate();
  audio.src = "sounds/pacman_beginning.wav";
  audio.play();
  level = 1;
  setTimeout(gameStart, 4500);
}

function gameStart() {
  blinking = true;
  activeGame = true;
  ghostMode = "scatter";
  readyDisplay.style.display = "none"; // Remove the ready! h2
  document.addEventListener("keydown", movePacman);
  audio.src = "sounds/pacman_chomp.wav";
  fruitAudio.src = "sounds/pacman_eatfruit.wav";
  moveBlinky();
  inky.timeout = setTimeout(moveInky, 5000);
  pinky.timeout = setTimeout(movePinky, 10000);
  clyde.timeout = setTimeout(moveClyde, 15000);
  blinkingObjectsStart();
  gameTimings();
  gameClock = 0;
}

function addCharacter(position, character) {
  if (ghosts.includes(character) && ghostMode === "frightened") {
    gridReference[position].classList.add("scared");
    gridReference[position].classList.add(character);
  } else gridReference[position].classList.add(character);
}

function removeCharacter(character) {
  if (ghosts.includes(character) && ghostMode === "frightened") {
    gridReference[positions[character]].classList.remove(character);
    gridReference[positions[character]].classList.remove("scared");
  } else {
    gridReference[positions[character]].classList.remove(character);
    gridReference[positions[character]].classList.remove("scared");
    gridReference[positions[character]].classList.remove("up");
    gridReference[positions[character]].classList.remove("down");
    gridReference[positions[character]].classList.remove("left");
    gridReference[positions[character]].classList.remove("right");
  }
}

function movePacman(event) {
  key = event.keyCode;

  if (!pacman.moving) {
    pacman.moving = true;
    pacman.interval = setInterval(() => {
      movementManager(key, "pacman");
      let currentPosition = document.getElementById(positions.pacman);
      if (currentPosition.classList.contains("pellet")) {
        currentPosition.classList.remove("pellet");
        pelletCount--;
        if (pelletCount === 0) {
          endScreen();
        }
        if (pelletCount === 170) {
          generateFruit();
        }
        if (
          pelletCount === 70 &&
          !document.getElementById("489").classList.contains("fruit")
        ) {
          generateFruit();
        }
        scoreUpdate(10);
        audio.play();
      } else if (currentPosition.classList.contains("power-pellet")) {
        currentPosition.classList.remove("power-pellet");
        currentPosition.style.backgroundImage = ""; // Override the blinking image
        scoreUpdate(50);
        frightenedTrigger();
      } else if (currentPosition.classList.contains("fruit")) {
        currentPosition.classList.remove("fruit");
        for (const [key, value] of Object.entries(bonuses)) {
          bonuses.forEach((fruit) => {
            if (currentPosition.classList.contains(fruit.name)) {
              scoreUpdate(fruit.value);
            }
            currentPosition.classList.remove(fruit.name);
          });
        }
        fruitAudio.play();
      }
    }, gameSpeed * 0.9);
  }
}

// Logic for 'random' ghost movement, different functions as eventually they have different movements
function moveBlinky() {
  blinky.interval = setInterval(() => {
    let blinkyKey = [];
    let blinkyCalc = {};
    let blinkyUp = positions.blinky - width;
    let blinkyDown = positions.blinky + width;
    let blinkyLeft = positions.blinky - 1;
    let blinkyRight = positions.blinky + 1;
    // Up
    if (
      mazeLayout[blinkyUp] !== 1 &&
      mazeLayout[blinkyUp] !== 3 &&
      mazeLayout[blinkyUp] !== 5 &&
      blinky.lastMovement !== down[0]
    ) {
      blinkyKey.push(up[0]);
      blinkyCalc[blinkyUp] = up[0];
    }
    // Down
    if (
      mazeLayout[blinkyDown] !== 1 &&
      mazeLayout[blinkyDown] !== 3 &&
      mazeLayout[blinkyDown] !== 5 &&
      blinky.lastMovement !== up[0]
    ) {
      blinkyKey.push(down[0]);
      blinkyCalc[blinkyDown] = down[0];
    }
    // Left
    if (
      mazeLayout[blinkyLeft] !== 1 &&
      mazeLayout[blinkyLeft] !== 3 &&
      mazeLayout[blinkyLeft] !== 5 &&
      blinky.lastMovement !== right[0]
    ) {
      blinkyKey.push(left[0]);
      blinkyCalc[blinkyLeft] = left[0];
    }
    // Right
    if (
      mazeLayout[blinkyRight] !== 1 &&
      mazeLayout[blinkyRight] !== 3 &&
      mazeLayout[blinkyRight] !== 5 &&
      blinky.lastMovement !== left[0]
    ) {
      blinkyKey.push(right[0]);
      blinkyCalc[blinkyRight] = right[0];
    }
    blinkyKey.filter((element) => element !== blinky.lastMovement); // This prevents the ghost from reversing itself
    let randomKey = blinkyKey[Math.floor(Math.random() * blinkyKey.length)]; // This picks a random direction from the available

    if (ghostMode === "frightened") {
      blinky.lastMovement = randomKey; // Put this before movementManager
      movementManager(randomKey, "blinky");
    } else if (ghostMode === "chase") {
      moveTowardsTarget(positions.pacman, "blinky", blinkyCalc); // blinkys target is pacmans position
    } else if (ghostMode === "scatter") {
      moveTowardsTarget(54, "blinky", blinkyCalc);
    }
  }, gameSpeed);
}

function moveTowardsTarget(target, character, directionObject) {
  let towardsKey;
  let lowestDistance = 100000;
  for (const [position, direction] of Object.entries(directionObject)) {
    // Get the row and column for blinky and pacman
    let targetColumn = (target % width) + 1;
    let targetRow = Math.ceil(target / width);
    let characterColumn = (position % width) + 1;
    let characterRow = Math.ceil(position / width);
    // Find the distance between the rows and columns
    let distanceColumn = Math.abs(targetColumn - characterColumn);
    let distanceRow = Math.abs(targetRow - characterRow);
    // Use pythagorus to get the straight line distance
    let distance = distanceColumn ** 2 + distanceRow ** 2;
    // If the distance is shorter then set towardsKey to the direction of the lowest distance
    if (distance < lowestDistance) {
      lowestDistance = distance;
      towardsKey = direction;
      if (character === "blinky") {
        blinky.lastMovement = towardsKey;
      } else if (character === "inky") {
        inky.lastMovement = towardsKey;
      } else if (character === "pinky") {
        pinky.lastMovement = towardsKey;
      } else if (character === "clyde") {
        clyde.lastMovement = towardsKey;
      }
    }
  }
  movementManager(towardsKey, character);
}

function moveInky(character = "inky") {
  // Do some initial movement to get out of the cage
  if (document.getElementById("404").classList.contains("inky")) {
    singleMovement(character, "right");
    inky.timeout2 = setTimeout(() => {
      singleMovement(character, "up");
    }, gameSpeed);
    inky.timeout3 = setTimeout(() => {
      singleMovement(character, "up");
    }, gameSpeed * 2);
    inky.timeout4 = setTimeout(() => {
      singleMovement(character, "up");
    }, gameSpeed * 3);
  }
  inky.interval = setInterval(() => {
    let inkyTarget;
    let inkyKey = [];
    let inkyCalc = {};
    let inkyUp = positions.inky - width;
    let inkyDown = positions.inky + width;
    let inkyLeft = positions.inky - 1;
    let inkyRight = positions.inky + 1;
    // Up
    if (
      mazeLayout[inkyUp] !== 1 &&
      mazeLayout[inkyUp] !== 3 &&
      mazeLayout[inkyUp] !== 5 &&
      inky.lastMovement !== down[0]
    ) {
      inkyKey.push(up[0]);
      inkyCalc[inkyUp] = up[0];
    }
    // Down
    if (
      mazeLayout[inkyDown] !== 1 &&
      mazeLayout[inkyDown] !== 3 &&
      mazeLayout[inkyDown] !== 5 &&
      inky.lastMovement !== up[0]
    ) {
      inkyKey.push(down[0]);
      inkyCalc[inkyDown] = down[0];
    }
    // Left
    if (
      mazeLayout[inkyLeft] !== 1 &&
      mazeLayout[inkyLeft] !== 3 &&
      mazeLayout[inkyLeft] !== 5 &&
      inky.lastMovement !== right[0]
    ) {
      inkyKey.push(left[0]);
      inkyCalc[inkyLeft] = left[0];
    }
    // Right
    if (
      mazeLayout[inkyRight] !== 1 &&
      mazeLayout[inkyRight] !== 3 &&
      mazeLayout[inkyRight] !== 5 &&
      inky.lastMovement !== left[0]
    ) {
      inkyKey.push(right[0]);
      inkyCalc[inkyRight] = right[0];
    }
    inkyKey.filter((element) => element !== inky.lastMovement); // This prevents the ghost from reversing itself
    let randomKey = inkyKey[Math.floor(Math.random() * inkyKey.length)]; // This picks a random direction from the available
    // set the last movement to this movement then trigger the movement

    // Calculate inkyTarget based on pacman movement - inky targets blinkys position mirrored through a space 2  in front of pacman
    // find the columns and rows between blinky and pacman + 2
    let blinkyRow = Math.ceil(positions.blinky / width);
    let blinkyColumn = (positions.blinky % width) + 1;
    let inkyTargetRow;
    let inkyTargetColumn;
    // add the column and rows to pacman + 2 which is inkys target

    // If pacman facing up
    if (up.includes(key)) {
      inkyTargetRow = Math.ceil((positions.pacman - width * 2 - 2) / width);
      inkyTargetColumn = ((positions.pacman - width * 2 - 2) % width) + 1;
      inkyTargetRow = blinkyRow - inkyTargetRow;
      inkyTargetColumn = blinkyColumn - inkyTargetColumn;
      inkyTargetRow =
        Math.ceil((positions.pacman - width * 2 - 2) / width) - inkyTargetRow;
      inkyTargetColumn =
        ((positions.pacman - width * 2 - 2) % width) + 1 - inkyTargetColumn;
    } else if (down.includes(key)) {
      // If pacman facing down
      inkyTargetRow = Math.ceil((positions.pacman + width * 2) / width);
      inkyTargetColumn = ((positions.pacman + width * 2) % width) + 1;
      inkyTargetRow = blinkyRow - inkyTargetRow;
      inkyTargetColumn = blinkyColumn - inkyTargetColumn;
      inkyTargetRow =
        Math.ceil((positions.pacman + width * 2) / width) - inkyTargetRow;
      inkyTargetColumn =
        ((positions.pacman + width * 2) % width) + 1 - inkyTargetColumn;
    } else if (left.includes(key)) {
      // If pacman facing left
      inkyTargetRow = Math.ceil((positions.pacman - 2) / width);
      inkyTargetColumn = ((positions.pacman - 2) % width) + 1;
      inkyTargetRow = blinkyRow - inkyTargetRow;
      inkyTargetColumn = blinkyColumn - inkyTargetColumn;
      inkyTargetRow = Math.ceil((positions.pacman - 2) / width) - inkyTargetRow;
      inkyTargetColumn = ((positions.pacman - 2) % width) + 1 - inkyTargetColumn;
    } else if (right.includes(key)) {
      // If pacman facing right
      inkyTargetRow = Math.ceil((positions.pacman + 2) / width);
      inkyTargetColumn = ((positions.pacman + 2) % width) + 1;
      inkyTargetRow = blinkyRow - inkyTargetRow;
      inkyTargetColumn = blinkyColumn - inkyTargetColumn;
      inkyTargetRow = Math.ceil((positions.pacman + 2) / width) - inkyTargetRow;
      inkyTargetColumn = ((positions.pacman + 2) % width) + 1 - inkyTargetColumn;
    }
    // Convert the absolute values for row and column back into a position
    inkyTarget = (inkyTargetRow - 1) * width + Math.abs(inkyTargetColumn);

    if (ghostMode === "frightened") {
      inky.lastMovement = randomKey; // Put this before movementManager
      movementManager(randomKey, "inky");
    } else if (ghostMode === "chase") {
      moveTowardsTarget(inkyTarget, "inky", inkyCalc);
    } else if (ghostMode === "scatter") {
      moveTowardsTarget(838, "inky", inkyCalc);
    }
  }, gameSpeed);
}

function movePinky(character = "pinky") {
  if (document.getElementById("406").classList.contains("pinky")) {
    singleMovement(character, "up");
    pinky.position = 378;
    pinky.timeout2 = setTimeout(() => {
      pinky.position = 350;
      singleMovement(character, "up");
    }, gameSpeed);
    pinky.timeout3 = setTimeout(() => {
      pinky.position = 350;
      singleMovement(character, "up");
    }, gameSpeed * 2);
  }
  pinky.interval = setInterval(() => {
    let pinkyTarget;
    let pinkyKey = [];
    let pinkyCalc = {};
    let pinkyUp = positions.pinky - width;
    let pinkyDown = positions.pinky + width;
    let pinkyLeft = positions.pinky - 1;
    let pinkyRight = positions.pinky + 1;
    // Up
    if (
      mazeLayout[pinkyUp] !== 1 &&
      mazeLayout[pinkyUp] !== 3 &&
      mazeLayout[pinkyUp] !== 5 &&
      pinky.lastMovement !== down[0]
    ) {
      pinkyKey.push(up[0]);
      pinkyCalc[pinkyUp] = up[0];
    }
    // Down
    if (
      mazeLayout[pinkyDown] !== 1 &&
      mazeLayout[pinkyDown] !== 3 &&
      mazeLayout[pinkyDown] !== 5 &&
      pinky.lastMovement !== up[0]
    ) {
      pinkyKey.push(down[0]);
      pinkyCalc[pinkyDown] = down[0];
    }
    // Left
    if (
      mazeLayout[pinkyLeft] !== 1 &&
      mazeLayout[pinkyLeft] !== 3 &&
      mazeLayout[pinkyLeft] !== 5 &&
      pinky.lastMovement !== right[0]
    ) {
      pinkyKey.push(left[0]);
      pinkyCalc[pinkyLeft] = left[0];
    }
    // Right
    if (
      mazeLayout[pinkyRight] !== 1 &&
      mazeLayout[pinkyRight] !== 3 &&
      mazeLayout[pinkyRight] !== 5 &&
      pinky.lastMovement !== left[0]
    ) {
      pinkyKey.push(right[0]);
      pinkyCalc[pinkyRight] = right[0];
    }
    pinkyKey.filter((element) => element !== pinky.lastMovement); // This prevents the ghost from reversing itself
    let randomKey = pinkyKey[Math.floor(Math.random() * pinkyKey.length)]; // This picks a random direction from the available
    // set the last movement to this movement then trigger the movement

    // Calculate pinkyTarget based on pacman movement - pinky targets 4 spaces in front of pacman
    // If pacman facing up
    if (up.includes(key)) {
      pinkyTarget = positions.pacman - width * 4 - 4;
    } else if (down.includes(key)) {
      // If pacman facing down
      pinkyTarget = positions.pacman + width * 4;
    } else if (left.includes(key)) {
      // If pacman facing left
      pinkyTarget = positions.pacman - 4;
    } else if (right.includes(key)) {
      // If pacman facing right
      pinkyTarget = positions.pacman + 4;
    }

    if (ghostMode === "frightened") {
      pinky.lastMovement = randomKey; // Put this before movementManager
      movementManager(randomKey, "pinky");
    } else if (ghostMode === "chase") {
      moveTowardsTarget(pinkyTarget, "pinky", pinkyCalc);
    } else if (ghostMode === "scatter") {
      moveTowardsTarget(28, "pinky", pinkyCalc);
    }
  }, gameSpeed);
}

function moveClyde(character = "clyde") {
  // Do some initial movement to get out of the cage
  if (document.getElementById("408").classList.contains("clyde")) {
    singleMovement(character, "left");
    setTimeout(() => {
      singleMovement(character, "left");
    }, gameSpeed);
    setTimeout(() => {
      singleMovement(character, "up");
    }, gameSpeed * 2);
    setTimeout(() => {
      singleMovement(character, "up");
    }, gameSpeed * 3);
    setTimeout(() => {
      singleMovement(character, "up");
    }, gameSpeed * 4);
  }
  clyde.interval = setInterval(() => {
    let clydeTarget;
    let clydeKey = [];
    let clydeCalc = {};
    let clydeUp = positions.clyde - width;
    let clydeDown = positions.clyde + width;
    let clydeLeft = positions.clyde - 1;
    let clydeRight = positions.clyde + 1;
    let clydeMode;
    // Up
    if (
      mazeLayout[clydeUp] !== 1 &&
      mazeLayout[clydeUp] !== 3 &&
      mazeLayout[clydeUp] !== 5 &&
      clyde.lastMovement !== down[0]
    ) {
      clydeKey.push(up[0]);
      clydeCalc[clydeUp] = up[0];
    }
    // Down
    if (
      mazeLayout[clydeDown] !== 1 &&
      mazeLayout[clydeDown] !== 3 &&
      mazeLayout[clydeDown] !== 5 &&
      clyde.lastMovement !== up[0]
    ) {
      clydeKey.push(down[0]);
      clydeCalc[clydeDown] = down[0];
    }
    // Left
    if (
      mazeLayout[clydeLeft] !== 1 &&
      mazeLayout[clydeLeft] !== 3 &&
      mazeLayout[clydeLeft] !== 5 &&
      clyde.lastMovement !== right[0]
    ) {
      clydeKey.push(left[0]);
      clydeCalc[clydeLeft] = left[0];
    }
    // Right
    if (
      mazeLayout[clydeRight] !== 1 &&
      mazeLayout[clydeRight] !== 3 &&
      mazeLayout[clydeRight] !== 5 &&
      clyde.lastMovement !== left[0]
    ) {
      clydeKey.push(right[0]);
      clydeCalc[clydeRight] = right[0];
    }

    // Clyde = blinky unless within 8 tiles of pacman then he switches to scatter mode

    let clydeRow = Math.ceil(positions.clyde / width);
    let clydeColumn = (positions.clyde % width) + 1;
    let pacmanRow = Math.ceil(positions.pacman / width);
    let pacmanColumn = (positions.pacman % width) + 1;
    if (
      Math.abs(clydeRow - pacmanRow) < 8 &&
      Math.abs(clydeColumn - pacmanColumn) < 8
    ) {
      clydeMode = "scatter";
    } else {
      clydeMode = "chase";
    }
    clydeKey.filter((element) => element !== clyde.lastMovement); // This prevents the ghost from reversing itself
    let randomKey = clydeKey[Math.floor(Math.random() * clydeKey.length)]; // This picks a random direction from the available
    if (ghostMode === "frightened") {
      clyde.lastMovement = randomKey; // Put this before movementManager
      movementManager(randomKey, "clyde");
    } else if (ghostMode === "scatter" || clydeMode === "scatter") {
      moveTowardsTarget(813, "clyde", clydeCalc);
    } else if (ghostMode === "chase") {
      moveTowardsTarget(positions.pacman, "clyde", clydeCalc);
    }
  }, gameSpeed);
}

function movementManager(key = 37, character) {
  removeCharacter(character);
  if (left.includes(key) && positions[character] === 392) {
    // Goes left at the end of the tunnel
    positions[character] = 419;
  } else if (right.includes(key) && positions[character] === 419) {
    // Goes right at the end of the tunnel
    positions[character] = 392;
  } else if (
    up.includes(key) &&
    positions[character] >= width &&
    mazeLayout[positions[character] - width] !== 1 &&
    mazeLayout[positions[character] - width] !== 3
  ) {
    positions[character] -= width; // up
  } else if (
    down.includes(key) &&
    gridSize - 1 >= positions[character] + width &&
    mazeLayout[positions[character] + width] !== 1 &&
    mazeLayout[positions[character] + width] !== 3
  ) {
    positions[character] += width; // down
  } else if (
    left.includes(key) &&
    positions[character] % width !== 0 &&
    mazeLayout[positions[character] - 1] !== 1 &&
    mazeLayout[positions[character] - 1] !== 3
  ) {
    positions[character]--; // left
  } else if (
    right.includes(key) &&
    positions[character] % width !== width &&
    mazeLayout[positions[character] + 1] !== 1 &&
    mazeLayout[positions[character] + 1] !== 3
  ) {
    positions[character]++; // right
  } else if (character === "pacman" && key !== lastWorkingKey) {
    movementManager(lastWorkingKey, character);
    addCharacter(positions[character], character);
    return;
  }

  addCharacter(positions[character], character);
  collisionCheck();
  // Add the direction that pacman is moving to the css
  if (character === "pacman") {
    lastWorkingKey = key;
    if (up.includes(key)) {
      gridReference[positions[character]].classList.add("up");
    } else if (down.includes(key)) {
      gridReference[positions[character]].classList.add("down");
    } else if (left.includes(key)) {
      gridReference[positions[character]].classList.add("left");
    } else if (right.includes(key)) {
      gridReference[positions[character]].classList.add("right");
    }
  }
}

function singleMovement(character, direction) {
  removeCharacter(character);
  if (direction === "up") {
    positions[character] -= width; // up
  } else if (direction === "down") {
    positions[character] += width; // down
  } else if (direction === "left") {
    positions[character]--; // left
  } else if (direction === "right") {
    positions[character]++; // right
  }
  addCharacter(positions[character], character);
}

function gameTimings() {
  gameClockInterval = setInterval(() => {
    gameClock++;
    // Use predetermined times to switch between chase and scatter modes until eventually the ghosts only chase
    if (ghostMode !== "frightened") {
      if (gameClock >= 7 && gameClock < 27) {
        ghostMode = "chase";
      } else if (gameClock >= 27 && gameClock < 34) {
        ghostMode = "scatter";
      } else if (gameClock >= 34 && gameClock < 54) {
        ghostMode = "chase";
      } else if (gameClock >= 54 && gameClock < 59) {
        ghostMode = "scatter";
      } else if (gameClock >= 59 && gameClock < 79) {
        ghostMode = "chase";
      } else if (gameClock >= 79 && gameClock < 84) {
        ghostMode = "scatter";
      } else if (gameClock >= 84) {
        ghostMode = "chase";
      }
    }
  }, 1000);
}

function generateFruit() {
  if (fruitCounter > 7) {
    fruitCounter = 7;
  }
  let fruitGrid = document.getElementById("489");
  fruitGrid.classList.add("fruit");
  if (level < 8) {
    fruitGrid.classList.add(bonuses[level - 1 + fruitCounter].name);
    fruitCounter++;
  } else if (level >= 8 && level < 20) {
    fruitGrid.classList.add(bonuses[level - 1 + fruitCounter].name);
    fruitCounter++;
  } else if (level >= 20) {
    fruitGrid.classList.add(bonuses[6].name);
  }
  bonusDisplay.classList = bonuses[level - 1 + fruitCounter].name;
}

function clearAllIntervals() {
  clearInterval(blinky.interval);
  clearInterval(inky.interval);
  clearInterval(pinky.interval);
  clearInterval(clyde.interval);
  clearTimeout(inky.timeout);
  clearTimeout(inky.timeout2); // Bugfixes for leaving the pen
  clearTimeout(inky.timeout3);
  clearTimeout(inky.timeout4);
  clearTimeout(pinky.timeout);
  clearTimeout(pinky.timeout2);
  clearTimeout(pinky.timeout3);
  clearTimeout(clyde.timeout);
  clearInterval(pacman.interval);
  clearInterval(blinkingInterval);
  clearTimeout(chaseTimeout);
  clearInterval(gameClockInterval);
  fruitCounter = 0;
  blinking = false;
  pacman.moving = false;
  ghostMode = "chase";
}

function endScreen() {
  activeGame = false;
  clearAllIntervals();
  document.removeEventListener("keydown", movePacman);
  gridWrapper.innerHTML = "";
  pelletCount = 240;
  positions = {
    pacman: 657,
    blinky: 321,
    inky: 404,
    pinky: 406,
    clyde: 408,
  };
  backgroundDisplay.style.filter = "invert(0)";
  flashBackground();
  backgroundDisplay.style.filter = "invert(0)";
  gameSpeed += 50;
  level++;
  setTimeout(() => {
    for (const [key] of Object.entries(positions)) {
      removeCharacter(key);
    }
    resetPosition();
    mazeGenerator();
    readyDisplay.style.display = "block";
  }, 3500);
  setTimeout(() => {
    gameStart();
    readyDisplay.style.display = "none";
  }, 4500);
}

function flashBackground(repeats = 7) {
  if (repeats > 0) {
    backgroundDisplay.style.filter =
      backgroundDisplay.style.filter === "invert(0)" ? "invert(1)" : "invert(0)";
    setTimeout(() => flashBackground(repeats - 1), 500);
  }
}

function blinkingObjectsStart() {
  let powerPellets = document.getElementsByClassName("power-pellet");
  blinkingInterval = setInterval(() => {
    if (blinking) {
      playerNameDisplay.style.filter =
        playerNameDisplay.style.filter === "opacity(1)" ? "opacity(0)" : "opacity(1)";
      [...powerPellets].forEach((element) => {
        element.style.backgroundImage =
          element.style.backgroundImage === "" ? "url(./images/power-pellet.png)" : "";
      });
    } else {
      clearInterval(blinkingInterval);
    }
  }, 700);
}

function collisionCheck() {
  if (activeGame) {
    if (positions.pacman === positions.blinky && ghostMode === "frightened") {
      ghostDeath("blinky");
    } else if (positions.pacman === positions.inky && ghostMode === "frightened") {
      ghostDeath("inky");
    } else if (positions.pacman === positions.pinky && ghostMode === "frightened") {
      ghostDeath("pinky");
    } else if (positions.pacman === positions.clyde && ghostMode === "frightened") {
      ghostDeath("clyde");
    } else if (
      positions.pacman === positions.blinky ||
      positions.pacman === positions.inky ||
      positions.pacman === positions.pinky ||
      positions.pacman === positions.clyde
    ) {
      deathSequence();
    }
  }
}

function deathSequence() {
  activeGame = false;
  clearAllIntervals();
  document.removeEventListener("keydown", movePacman);
  audio.src = "sounds/pacman_death.wav";
  audio.play();
  deathAnimation();
  if (lives > 0) {
    livesUpdate(1);
    setTimeout(() => {
      for (const [key] of Object.entries(positions)) {
        removeCharacter(key);
      }
      resetPosition();
      generatePositions();
      readyDisplay.style.display = "block";
    }, 1500);
    setTimeout(() => {
      gameStart();
    }, 3500);
  } else {
    readyDisplay.style.display = "block";
    readyDisplay.innerHTML = "GAME OVER";
    readyDisplay.style.color = "red";
  }
}

function deathAnimation(repeats = 1) {
  if (repeats < 13) {
    document.getElementsByClassName(
      "pacman"
    )[0].style.backgroundImage = `url(./images/p-dead${repeats}.png)`;
    setTimeout(() => deathAnimation(repeats + 1), 110);
  } else {
    document.getElementsByClassName("pacman")[0].style.backgroundImage = "";
    document.getElementById(positions.pacman).className = "gridItem";
  }
}

function resetPosition() {
  positions = {
    pacman: 657,
    blinky: 321,
    inky: 404,
    pinky: 406,
    clyde: 408,
  };
  blinky.position = 321;
  inky.position = 404;
  pinky.position = 406;
  clyde.position = 408;
}

function frightenedTrigger() {
  ghostMode = "frightened";
  ghostsEaten = 1;
  audioIntermission.src = "sounds/pacman_intermission.wav";
  audioIntermission.play();
  chaseTimeout = setTimeout(() => {
    ghostMode = "chase";
  }, 5500);
}

function ghostDeath(character) {
  scoreUpdate(200 * ghostsEaten);
  ghostAudio.src = "sounds/pacman_eatghost.wav";
  ghostAudio.play();
  ghostsEaten++;
  removeCharacter(character);
  if (character === "blinky") {
    clearInterval(blinky.interval);
    positions[character] = 321;
    addCharacter(positions[character], character);
    moveBlinky();
  } else if (character === "inky") {
    clearInterval(inky.interval);
    positions[character] = 404;
    addCharacter(positions[character], character);
    moveInky();
  } else if (character === "pinky") {
    clearInterval(pinky.interval);
    positions[character] = 406;
    addCharacter(positions[character], character);
    movePinky();
  } else if (character === "clyde") {
    clearInterval(clyde.interval);
    positions[character] = 408;
    addCharacter(positions[character], character);
    moveClyde();
  }
}

// ! Events

splashDisplay.addEventListener("click", () => {
  gameIntro();
});

// Trigger events on keypress see line 171

// * ----- STRETCH CONTENT -----

// * Add bonus fruit

// Add movement behaviours for ghosts
// * Blinky
// * Inky
// * Pinky
// * Clyde

// * Store highscore in localstorage

// * Animate Pacman's death sequence

// * Create timings to switch ghosts between scatter and chase modes

// Animate each of the characters
// * Pacman
// ! Blinky
// ! Inky
// ! Pinky
// ! Clyde
