/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/player.js
class Player {
	constructor(name, gameboard) {
		this.name = name;
		this.gameboard = gameboard;
		this.previousMoves = [];
	}

	humanMove(enemyGameboard, coordinates) {
		const move = coordinates;
		if (!this.previousMoves.includes(move)) {
			enemyGameboard.receiveAttack(move);
			this.previousMoves.push(move);
		}
	}

	computerMove(enemyGameboard) {
		const firstRandomNumber = Math.floor(Math.random() * 10);
		const secondRandomNumber = Math.floor(Math.random() * 10);
		const move = `${firstRandomNumber}, ${secondRandomNumber}`;
		if (!this.previousMoves.includes(move)) {
			enemyGameboard.receiveAttack(move);
			this.previousMoves.push(move);
			return move;
		}

		return this.computerMove(enemyGameboard);
	}
}

;// CONCATENATED MODULE: ./src/gameboard.js
class Gameboard {
	constructor() {
		this.coordinates = {};
		this.missed = [];
		this.ships = [];
	}

	initializeCoordinates() {
		for (let i = 0; i < 10; i++) {
			for (let j = 0; j < 10; j++) {
				this.coordinates[`${i}, ${j}`] = true;
			}
		}
	}

	placeShip(ship, coordinates) {
		const shipLength = ship.length;
		if (shipLength === coordinates.length) {
			this.ships.push(ship);
			coordinates.forEach((coordinate) => {
				this.coordinates[coordinate] = ship;
			});
		}
	}

	receiveAttack(coordinates) {
		if (this.missed.includes(coordinates)) {
			return;
		} else {
			if (this.coordinates[coordinates] !== true) {
				const ship = this.coordinates[coordinates];
				ship.hit();
			} else {
				this.missed.push(coordinates);
			}
		}
	}

	placeComputerShips(
		firstComputerShip,
		secondComputerShip,
		thirdComputerShip,
		fourthComputerShip,
		fifthComputerShip
	) {
		const coordinatesFirstShip = this.generateRandomCoordinates(1);
		const coordinatesSecondShip = this.generateRandomCoordinates(2);
		const coordinatesThirdShip = this.generateRandomCoordinates(3);
		const coordinatesFourthShip = this.generateRandomCoordinates(4);
		const coordinatesFifthShip = this.generateRandomCoordinates(5);

		const shipCoordinates = [
			...coordinatesFirstShip,
			...coordinatesSecondShip,
			...coordinatesThirdShip,
			...coordinatesFourthShip,
			...coordinatesFifthShip,
		];

		function hasUniqueElements(array) {
			const uniqueSet = new Set(array);
			return uniqueSet.size === array.length;
		}

		if (hasUniqueElements(shipCoordinates)) {
			this.placeShip(firstComputerShip, coordinatesFirstShip);
			this.placeShip(secondComputerShip, coordinatesSecondShip);
			this.placeShip(thirdComputerShip, coordinatesThirdShip);
			this.placeShip(fourthComputerShip, coordinatesFourthShip);
			this.placeShip(fifthComputerShip, coordinatesFifthShip);
		} else {
			this.placeComputerShips(
				firstComputerShip,
				secondComputerShip,
				thirdComputerShip,
				fourthComputerShip,
				fifthComputerShip
			);
		}
	}

	generateRandomCoordinates(n) {
		const result = [];
		const isHorizontal = Math.random() < 0.5;

		if (isHorizontal) {
			const startingRow = Math.floor(Math.random() * 10);
			const startingColumn = Math.floor(Math.random() * (10 - n + 1));

			for (let i = 0; i < n; i++) {
				const newCoordinate = `${startingRow}, ${startingColumn + i}`;
				result.push(newCoordinate);
			}
		} else {
			const startingColumn = Math.floor(Math.random() * 10);
			const startingRow = Math.floor(Math.random() * (10 - n + 1));

			for (let i = 0; i < n; i++) {
				const newCoordinate = `${startingRow + i}, ${startingColumn}`;
				result.push(newCoordinate);
			}
		}
		return result;
	}

	gameOver() {
		return this.ships.every((ship) => ship.sunk === true);
	}
}

;// CONCATENATED MODULE: ./src/ship.js
class Ship {
	constructor(length, numberOfHits = 0, sunk = false) {
		this.length = length;
		this.numberOfHits = numberOfHits;
		this.sunk = sunk;
	}

	hit() {
		this.numberOfHits += 1;
		if (this.numberOfHits >= this.length) {
			this.sunk = true;
		}
	}

	isSunk() {
		return this.sunk;
	}
}

;// CONCATENATED MODULE: ./src/render.js
function showOurShips(gameboard, grid) {
	const coordinates = Object.keys(gameboard.coordinates);
	coordinates.forEach((coordinate) => {
		if (gameboard.coordinates[coordinate] !== true) {
			const cell = grid.querySelector(`[data-human='${coordinate}']`);
			cell.style.backgroundColor = 'mediumseagreen';
		}
	});
}

function showAttack(computerGameboard, computerGrid, event) {
	event.target.textContent = 'X';
	if (
		computerGameboard.coordinates[
			event.target.getAttribute('data-computer')
		] === true
	) {
		event.target.style.backgroundColor = 'cornflowerblue';
	} else {
		event.target.style.backgroundColor = '#FFA351';
	}

	const keys = Object.keys(computerGameboard.coordinates);
	for (const key of keys) {
		if (computerGameboard.coordinates[key].sunk === true) {
			const cell = computerGrid.querySelector(`[data-computer='${key}']`);
			cell.style.backgroundColor = '#F96167';
			cell.style.color = 'white';
		}
	}
}

function showComputerAttack(gameboard, humanGrid, move) {
	const cell = humanGrid.querySelector(`[data-human='${move}']`);
	cell.textContent = 'X';
	if (gameboard.coordinates[cell.getAttribute('data-human')] === true) {
		cell.style.backgroundColor = 'cornflowerblue';
	} else {
		cell.style.backgroundColor = '#FFA351';
	}

	const keys = Object.keys(gameboard.coordinates);
	for (const key of keys) {
		if (gameboard.coordinates[key].sunk === true) {
			const cell = humanGrid.querySelector(`[data-human='${key}']`);
			cell.style.backgroundColor = '#F96167';
			cell.style.color = 'white';
		}
	}
}

function showNextDragShip(
	draggedShip,
	shipLength,
	secondDragShip,
	thirdDragShip,
	fourthDragShip,
	fifthDragShip,
	shipsContainer
) {
	switch (shipLength) {
		case '1':
			draggedShip.style.display = 'none';
			secondDragShip.style.display = 'flex';
			break;
		case '2':
			draggedShip.style.display = 'none';
			thirdDragShip.style.display = 'flex';
			break;
		case '3':
			draggedShip.style.display = 'none';
			fourthDragShip.style.display = 'flex';
			break;
		case '4':
			draggedShip.style.display = 'none';
			fifthDragShip.style.display = 'flex';
			break;
		case '5':
			draggedShip.style.display = 'none';
			shipsContainer.style.borderColor = 'mediumseagreen';
			break;
	}
}

;// CONCATENATED MODULE: ./src/index.js






const humanGridContainer = document.getElementById('human-grid-container');
const computerGridContainer = document.getElementById(
	'computer-grid-container'
);
let humanGrid = document.getElementById('human-grid');
let computerGrid = document.getElementById('computer-grid');
const modal = document.getElementById('modal');
const winner = document.getElementById('winner');
const replayButton = document.getElementById('replay-button');
const humanScore = document.getElementById('human-score');
const computerScore = document.getElementById('computer-score');
const ships = document.querySelectorAll('.ship');
const shipsContainer = document.getElementById('ships');
const firstDragShip = document.getElementById('ship-1');
const secondDragShip = document.getElementById('ship-2');
const thirdDragShip = document.getElementById('ship-3');
const fourthDragShip = document.getElementById('ship-4');
const fifthDragShip = document.getElementById('ship-5');
const dragFirstShip = document.getElementById('drag-1');
const dragSecondShip = document.getElementById('drag-2');
const dragThirdShip = document.getElementById('drag-3');
const dragFourthShip = document.getElementById('drag-4');
const dragFifthShip = document.getElementById('drag-5');

let computerCurrentScore = 0;
let humanCurrentScore = 0;

function initialize() {
	const gameboard = new Gameboard();
	gameboard.initializeCoordinates();
	const firstShip = new Ship(1);
	const secondShip = new Ship(2);
	const thirdShip = new Ship(3);
	const fourthShip = new Ship(4);
	const fifthShip = new Ship(5);
	const humanPlayer = new Player('Human', gameboard);

	const computerGameboard = new Gameboard();
	computerGameboard.initializeCoordinates();
	const firstComputerShip = new Ship(1);
	const secondComputerShip = new Ship(2);
	const thirdComputerShip = new Ship(3);
	const fourthComputerShip = new Ship(4);
	const fifthComputerShip = new Ship(5);
	computerGameboard.placeComputerShips(
		firstComputerShip,
		secondComputerShip,
		thirdComputerShip,
		fourthComputerShip,
		fifthComputerShip
	);
	const computerPlayer = new Player('Computer', computerGameboard);

	humanGrid.parentNode.removeChild(humanGrid);
	humanGrid = document.createElement('div');
	humanGrid.setAttribute('id', 'human-grid');
	humanGrid.classList.add('grid');
	humanGridContainer.appendChild(humanGrid);

	computerGrid.parentNode.removeChild(computerGrid);
	computerGrid = document.createElement('div');
	computerGrid.setAttribute('id', 'computer-grid');
	computerGrid.classList.add('grid');
	computerGridContainer.appendChild(computerGrid);

	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			const gridCell = document.createElement('div');
			gridCell.classList.add('computer-grid-cell');
			gridCell.setAttribute('data-computer', `${i}, ${j}`);
			computerGrid.appendChild(gridCell);
		}
	}

	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			const gridCell = document.createElement('div');
			gridCell.classList.add('human-grid-cell');
			gridCell.setAttribute('data-human', `${i}, ${j}`);
			humanGrid.appendChild(gridCell);
		}
	}

	computerScore.textContent = `Computer: ${computerCurrentScore}`;
	humanScore.textContent = `Human: ${humanCurrentScore}`;

	function attack(event) {
		if (!event.target.classList.contains('clicked')) {
			event.target.classList.add('clicked');
			humanPlayer.humanMove(
				computerGameboard,
				event.target.getAttribute('data-computer')
			);

			showAttack(computerGameboard, computerGrid, event);

			if (computerGameboard.gameOver()) {
				winner.textContent = "You're a winner 🥳";
				humanScore.textContent = `Human: ${++humanCurrentScore}`;
				modal.showModal();
				modal.style.display = 'flex';
			} else {
				computerMove();
			}
		} else {
			return;
		}
	}

	//Drag functionality
	let draggedShip = null;

	ships.forEach((ship) => {
		ship.addEventListener('dragstart', handleDragStart);
	});
	humanGrid.addEventListener('dragover', handleDragOver);
	humanGrid.addEventListener('drop', handleDrop);

	function handleDragStart(event) {
		draggedShip = event.target;
		event.dataTransfer.setData(
			'text/plain',
			draggedShip.getAttribute('data-length')
		);
	}

	function handleDragOver(event) {
		event.preventDefault();
	}

	function handleDrop(event) {
		event.preventDefault();

		if (draggedShip) {
			const shipLength = draggedShip.getAttribute('data-length');
			const cell = document.elementFromPoint(
				event.clientX,
				event.clientY
			);
			const coordinate = cell.getAttribute('data-human');

			if (coordinate) {
				const [row, col] = coordinate.split(',').map(Number);
				const shipCoordinates = [];
				shipCoordinates.push(`${row}, ${col}`);
				if (draggedShip.classList.contains('horizontal')) {
					for (let i = 1; i < shipLength; i++) {
						shipCoordinates.push(`${row}, ${col + i}`);
					}
				} else {
					for (let i = 1; i < shipLength; i++) {
						shipCoordinates.push(`${row + i}, ${col}`);
					}
				}

				let ship = null;
				switch (shipLength) {
					case '1':
						ship = firstShip;
						break;
					case '2':
						ship = secondShip;
						break;
					case '3':
						ship = thirdShip;
						break;
					case '4':
						ship = fourthShip;
						break;
					case '5':
						ship = fifthShip;
						break;
				}

				if (
					shipCoordinates.every(
						(coordinate) =>
							gameboard.coordinates[coordinate] === true
					)
				) {
					gameboard.placeShip(ship, shipCoordinates);
					showOurShips(gameboard, humanGrid);
					showNextDragShip(
						draggedShip,
						shipLength,
						secondDragShip,
						thirdDragShip,
						fourthDragShip,
						fifthDragShip,
						shipsContainer
					);

					if (shipLength === '5') {
						const computerGridCells = document.querySelectorAll(
							'.computer-grid-cell'
						);
						computerGridCells.forEach((cell) => {
							cell.style.cursor = 'pointer';
							cell.addEventListener('click', (event) => {
								attack(event);
							});
						});
					}

					draggedShip = null;
				}
			}
		}
	}

	function computerMove() {
		const move = computerPlayer.computerMove(gameboard);

		showComputerAttack(gameboard, humanGrid, move);

		if (gameboard.gameOver()) {
			winner.textContent = 'Computer is a winner 😭';
			computerScore.textContent = `Computer: ${++computerCurrentScore}`;
			modal.showModal();
			modal.style.display = 'flex';
		}
	}

	//Cheat 🫣
	function cheat() {
		const computerCoordinates = Object.keys(gameboard.coordinates);
		computerCoordinates.forEach((coordinate) => {
			if (computerGameboard.coordinates[coordinate] !== true) {
				const cell = computerGrid.querySelector(
					`[data-computer='${coordinate}']`
				);
				cell.style.backgroundColor = 'mediumseagreen';
			}
		});
		return 'You are cheating 🫣';
	}
	window.cheat = cheat;
}

initialize();

replayButton.addEventListener('click', () => {
	firstDragShip.style.display = 'flex';
	modal.close();
	modal.style.display = 'none';
	shipsContainer.style.borderColor = 'black';
	initialize();
});

//Add event listeners for dragging
dragFirstShip.addEventListener('mousedown', () => {
	firstDragShip.setAttribute('draggable', 'true');
});
firstDragShip.addEventListener('dragend', () => {
	firstDragShip.setAttribute('draggable', 'false');
});

dragSecondShip.addEventListener('mousedown', () => {
	secondDragShip.setAttribute('draggable', 'true');
});
secondDragShip.addEventListener('dragend', () => {
	secondDragShip.setAttribute('draggable', 'false');
});

dragThirdShip.addEventListener('mousedown', () => {
	thirdDragShip.setAttribute('draggable', 'true');
});
thirdDragShip.addEventListener('dragend', () => {
	thirdDragShip.setAttribute('draggable', 'false');
});

dragFourthShip.addEventListener('mousedown', () => {
	fourthDragShip.setAttribute('draggable', 'true');
});
fourthDragShip.addEventListener('dragend', () => {
	fourthDragShip.setAttribute('draggable', 'false');
});

dragFifthShip.addEventListener('mousedown', () => {
	fifthDragShip.setAttribute('draggable', 'true');
});
fifthDragShip.addEventListener('dragend', () => {
	fifthDragShip.setAttribute('draggable', 'false');
});

//Rotate a ship on a click
ships.forEach((ship) => {
	ship.addEventListener('click', () => {
		const height = ship.offsetHeight;
		const width = ship.offsetWidth;
		ship.style.width = `${height}px`;
		ship.style.height = `${width}px`;
		if (ship.classList.contains('horizontal')) {
			ship.classList.remove('horizontal');
			ship.classList.add('vertical');
			ship.style.flexDirection = 'column';
		} else {
			ship.classList.remove('vertical');
			ship.classList.add('horizontal');
			ship.style.flexDirection = 'row';
		}
	});
});

/* function updateDragShipDimensions() {
	const gridCell = document.querySelector('.human-grid-cell');
	const cellWidth = gridCell.offsetWidth;
	const cellHeight = gridCell.offsetHeight;

	document.documentElement.style.setProperty(
		'--cell-width',
		`${cellWidth}px`
	);
	document.documentElement.style.setProperty(
		'--cell-height',
		`${cellHeight}px`
	);
}

updateDragShipDimensions();
window.addEventListener('resize', updateDragShipDimensions); */

/******/ })()
;
//# sourceMappingURL=main.js.map