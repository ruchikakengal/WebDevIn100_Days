import { Ship } from './ship';
import { Gameboard } from './gameboard';
import { Player } from './player';

test('Ship', () => {
	const ship = new Ship(5);
	expect(ship.length).toBe(5);
	expect(ship.numberOfHits).toBe(0);
	ship.hit();
	expect(ship.numberOfHits).toBe(1);
	expect(ship.isSunk()).toBe(false);
	ship.hit();
	ship.hit();
	ship.hit();
	ship.hit();
	expect(ship.isSunk()).toBe(true);
});

test('Gameboard', () => {
	const gameboard = new Gameboard();
	gameboard.initializeCoordinates();
	const ship = new Ship(5);
	gameboard.placeShip(ship, ['0, 0', '0, 1', '0, 2', '0, 3', '0, 4']);
	gameboard.receiveAttack('0, 0');
	gameboard.receiveAttack('0, 1');
	gameboard.receiveAttack('0, 2');
	gameboard.receiveAttack('0, 3');
	gameboard.receiveAttack('0, 4');
	expect(gameboard.ships[0].length).toBe(5);
	expect(gameboard.ships[0].numberOfHits).toBe(5);
	expect(gameboard.ships[0].sunk).toBeTruthy();
	expect(gameboard.gameOver()).toBeTruthy();
});

test('Computer gameboard', () => {
	const computerGameboard = new Gameboard();
	computerGameboard.initializeCoordinates();
	const firstShip = new Ship(1);
	const secondShip = new Ship(2);
	const thirdShip = new Ship(3);
	const fourthShip = new Ship(4);
	const fifthShip = new Ship(5);
	const randomCoordinates = computerGameboard.generateRandomCoordinates(1);
	expect(randomCoordinates.length).toBe(1);
	computerGameboard.placeComputerShips(
		firstShip,
		secondShip,
		thirdShip,
		fourthShip,
		fifthShip
	);
	expect(computerGameboard.ships.length).toBe(5);
});

test('Player', () => {
	const gameboard = new Gameboard();
	const enemyGameboard = new Gameboard();
	gameboard.initializeCoordinates();
	enemyGameboard.initializeCoordinates();
	const player = new Player('human', gameboard);
	const computer = new Player('computer', enemyGameboard);
	const ship = new Ship(5);
	const enemyShip = new Ship(5);
	gameboard.placeShip(ship, ['0, 0', '0, 1', '0, 2', '0, 3', '0, 4']);
	enemyGameboard.placeShip(enemyShip, [
		'0, 0',
		'0, 1',
		'0, 2',
		'0, 3',
		'0, 4',
	]);

	expect(player.gameboard).toBe(gameboard);
	expect(player.gameboard.coordinates['0, 0']).toBe(ship);
	player.humanMove(enemyGameboard, '0, 0');
	expect(player.previousMoves.length).toBe(1);

	expect(computer.name).toBe('computer');
	expect(computer.previousMoves.length).toBe(0);
	computer.computerMove(gameboard);
	expect(computer.previousMoves.length).toBe(1);
});
