let result='' ;

let score =JSON.parse((localStorage.getItem ('score'))) || {
    wins : 0 ,
    loses : 0
} ;

function actualSide() {

   const randomNumber=Math.random();

    if (randomNumber<0.5) {
        computerChoice= 'Heads';
    } else {
        computerChoice= 'Tails';
    }
}

function playerMove(guess) {
    document.querySelector('.js-player-move').innerHTML = guess
    ?`Your Choice : ${guess}`: '' ;
}

function playGame(guess) {

    playerMove(guess);
    actualSide();

    if (guess===computerChoice) {
        result = ` So, your guess is correct.` ;
        score.wins += 1;
    } else {
        result = `So, your guess is wrong.` ;
        score.loses += 1;
    }
    localStorage.setItem ('score', JSON.stringify(score)) ;

    document.querySelector('.js-coin').innerHTML = `Coin : ${computerChoice}`;

    document.querySelector('.js-result').innerHTML = `Wins:${score.wins}, Loses:${score.loses}`;
    
}

function resetGame() {
    playerMove('');
    document.querySelector('.js-coin').innerHTML='';
    document.querySelector('.js-result').innerHTML='Wins:0,Loses:0';
    score.wins=0;
    score.loses=0;
    localStorage.removeItem('score');
}








