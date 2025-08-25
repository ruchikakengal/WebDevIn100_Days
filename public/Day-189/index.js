let main = document.getElementById('main');
let score = document.getElementById('score');
let levelLabel = document.getElementById('level');
let boom = document.getElementById("myAudio");
let game = document.getElementById('gameover'); 
let background = document.getElementById('background'); 
let start = document.getElementById('start');
let count;
let level = 1;
let flightSpeed = 50;
let spawnTime = 3000;
let gameState;

const showBird = () => {
	if (gameState === 'playing') {
		let position;
		let bird = document.createElement('img');
		bird.src = 'bird.gif';
		bird.style.height = '80px';
		bird.style.width = '80px';
		bird.style.position = 'absolute';
		const screenSize = document.documentElement.clientWidth || window.innerWidth;
		if (screenSize <= 480) {
			bird.style.top = Math.random()*300+'px';
			position = 700;
		} else {
			position = 1400;
			bird.style.top = Math.random()*650+'px';
		}
		bird.style.right = position+'px';
		main.appendChild(bird);
		const flight = () => {
			if(Array.from(main?.children)?.find((child) => child.style.right === '0px')){
				main.innerHTML = "";
				background.pause();
				start.style.display = 'block';
				game.play();
				gameState = 'gameOver';
				alert('You did not shoot all the birds. Game over.');
				clearInterval(birdFlight);
				clearInterval(birdInterval);
			}
			else{
				bird.style.right = position+'px';
				position--;
			}
		}
		const birdFlight = () => setInterval(flight, flightSpeed);
		birdFlight();
	}	
}

const birdInterval = () => setInterval(showBird, spawnTime);

start.addEventListener('click', () => {
	gameState = 'playing';
	flightSpeed = 50;
	spawnTime = 6000;
	level = 1;
	levelLabel.innerHTML = `Level ${level}`;
	start.style.display = 'none';
	count = 0;
	score.innerHTML = `Score is ${count}`;
	background.play();
	background.loop = true;
	birdInterval();
});
	
main.addEventListener('click', (ev) => {
	if (ev.target.nodeName === 'IMG') {
		boom.play();
		ev.target.remove();
		count++;
		score.innerHTML = `Score is ${count}`;
		if (count % 10 === 0 && gameState === 'playing') {
			spawnTime = spawnTime <= 0 ? 0 : spawnTime - level*100;
			level++;
			levelLabel.innerHTML = `Level ${level}`;
			flightSpeed = flightSpeed === 0 ? 0 : flightSpeed-level;
			clearInterval(birdInterval);
			birdInterval();
		}
	}
});

main.addEventListener('mouseover', function(ev){
	if(ev.target.nodeName === 'IMG'){
		ev.target.style.cursor = 'crosshair';
	}
});

const loadResources = () => {
	background.preload = true;
	boom.preload = true;
	game.preload = true;
}

loadResources();