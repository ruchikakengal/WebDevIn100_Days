export class Player {
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
