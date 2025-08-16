export class Ship {
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
