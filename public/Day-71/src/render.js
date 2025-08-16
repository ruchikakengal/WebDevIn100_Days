export default function showOurShips(gameboard, grid) {
	const coordinates = Object.keys(gameboard.coordinates);
	coordinates.forEach((coordinate) => {
		if (gameboard.coordinates[coordinate] !== true) {
			const cell = grid.querySelector(`[data-human='${coordinate}']`);
			cell.style.backgroundColor = 'mediumseagreen';
		}
	});
}

export function showAttack(computerGameboard, computerGrid, event) {
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

export function showComputerAttack(gameboard, humanGrid, move) {
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

export function showNextDragShip(
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
