export class Gameboard {
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
