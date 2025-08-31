//POWER-UP GENERATOR
const launchPowerUp = () => {
    let powerUpDiv = document.createElement('div');
    if(powerUpToLaunch == "dEagle") {
        powerUpDiv.innerHTML="<div class='powerUpDiv' id='dEagle' draggable='true' ondragstart='drag(event)'><img class='powerUpImg' src='./assets/img/desertEagle.jfif' alt=''></div>"
    } else if(powerUpToLaunch == "mp5") {
        powerUpDiv.innerHTML="<div class='powerUpDiv' id='mp5' draggable='true' ondragstart='drag(event)'><img class='powerUpImg' src='./assets/img/mp5.jfif' alt=''></div>";
    } else if(powerUpToLaunch == "aa12") {
        powerUpDiv.innerHTML="<div class='powerUpDiv' id='aa12' draggable='true' ondragstart='drag(event)'><img class='powerUpImg' src='./assets/img/aa12.jfif' alt=''></div>";
    } else if(powerUpToLaunch == "ak47") {
        powerUpDiv.innerHTML="<div class='powerUpDiv' id='ak47' draggable='true' ondragstart='drag(event)'><img class='powerUpImg' src='./assets/img/ak47.jfif' alt=''></div>";
    } else if(powerUpToLaunch == "life") {
        powerUpDiv.innerHTML="<div class='powerUpDiv' id='life' draggable='true' ondragstart='drag(event)'><img class='powerUpImg' src='./assets/img/life.png' alt=''></div>";
    } else if(powerUpToLaunch == "xVision") {
        powerUpDiv.innerHTML="<div class='powerUpDiv' id='xVision' draggable='true' ondragstart='drag(event)'><img class='powerUpImg' src='./assets/img/xVision.jpg' alt=''></div>";
    }
    document.getElementById("powerUpZone").appendChild(powerUpDiv);




    // find the element that you want to drag.
    let box = document.querySelector(".powerUpDiv");
    let currentElement;
    let touchedElement;

    //TOUCH DRAG AND DROP
    box.addEventListener('touchmove', (e) => {
        // grab the location of touch
    let touchLocation = e.targetTouches[0];
    currentElement = e.target;
    touchedElement = currentElement.src;
    // assign box new coordinates based on the touch.
    box.style.left = touchLocation.pageX + 'px';
    box.style.top = touchLocation.pageY + 'px';
    });

    box.addEventListener('touchend', (e) => {
        // current box position.
        let x = parseInt(box.style.left);
        let y = parseInt(box.style.top);
        
        if(touchedElement.includes("Eagle")) {
            gunPlayer1 = new Gun("Desert Eagle", 40, 15, 15, './assets/img/desertEagle.jfif', dEagleAudio, dEagleRelAudio);
            if(!mute)dEagleVoice.play();
            gunPicked=true;
        } else if (touchedElement.includes("mp5")){
            gunPlayer1 = new Gun("MP5", 20, 25, 25,'./assets/img/mp5.jfif', mp5Audio, mp5RelAudio);
            if(!mute)mp5Voice.play();
            gunPicked=true;
        } else if(touchedElement.includes("aa12")){
            gunPlayer1 = new Gun("AA-12", 160, 8, 8,'./assets/img/aa12.jfif', aa12Audio, aa12RelAudio);
            if(!mute)aa12Voice.play();
            gunPicked=true;
        } else if(touchedElement.includes("ak47")){
            gunPlayer1 = new Gun("AK47", 100, 30, 30,'./assets/img/ak47.jfif', ak47Audio, ak47RelAudio);
            if(!mute)ak47Voice.play();
            gunPicked=true;
        } else if(touchedElement.includes("life")){
            if(!mute)lifeAudio.play();
            player1.life += 500;
        } else if(touchedElement.includes("Vision")){
            if(!mute)xVisionAudio.play();
            setXvision();
            timeoutXvision();
        };
        powerUpPresent = false;
        statsColPU +=1;
        document.getElementById("powerUpZone").innerHTML="";
    });



    powerUpPresent = true;
    setTimeout(()=>{
        document.getElementById("powerUpZone").innerHTML="";
    },5000);
};


//LAUNCH RANDOM POWER-UP
setInterval(()=>{
    powerUpToLaunch = powerUpsArray[minMaxRoundedRandom(0,5)];
    launchPowerUp(powerUpToLaunch);
},minMaxRoundedRandom(10000, 30000));

//MOUSE DRAG AND DROP
const drag = (ev) => {
    ev.dataTransfer.setData("text", ev.currentTarget.id);
};
const allowDrop = (ev) => {
    ev.preventDefault();
};
const setXvision =()=>{
    document.getElementById('_topWall').classList.add('xVision');
    xVision = true;
};

//When Player1 gets xVision, topWall changes the opacity
const timeoutXvision = () =>{
    setTimeout(()=>{
        if(!xVisionAI){
            document.getElementById('_topWall').classList.remove('xVision');
            player2ImgSrc = player2ImgSrc.replace("crouch", "shoot");
            xVision = false;
        } else {
            xVisionAI == false;
        };
    }, 5000);
};


//Audio power-up sources
let lifeAudio= new Audio("./assets/audio/life.mp3");
let xVisionAudio= new Audio("./assets/audio/xVision.mp3");
let dEagleVoice= new Audio("./assets/audio/godlikeVoice.mp3");
let mp5Voice= new Audio("./assets/audio/perfectVoice.mp3");
let aa12Voice= new Audio("./assets/audio/comboVoice.mp3");
let ak47Voice= new Audio("./assets/audio/unstoppableVoice.mp3");
let humilationVoice= new Audio("./assets/audio/humiliation.mp3");
let ludicrousVoice= new Audio("./assets/audio/ludicrous.mp3");

let gunPicked;
let AIgunPicked;

//Mouse drag and drop data collector
const drop = (ev) => {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");

    if(data == "dEagle") {
        gunPlayer1 = new Gun("Desert Eagle", 40, 15, 15, './assets/img/desertEagle.jfif', dEagleAudio, dEagleRelAudio);
        if(!mute)dEagleVoice.play();
        gunPicked=true;
    } else if(data == "mp5") {
        gunPlayer1 = new Gun("MP5", 20, 25, 25,'./assets/img/mp5.jfif', mp5Audio, mp5RelAudio);
        if(!mute)mp5Voice.play();
        gunPicked=true;
    } else if(data == "aa12") {
        gunPlayer1 = new Gun("AA-12", 160, 8, 8,'./assets/img/aa12.jfif', aa12Audio, aa12RelAudio);
        if(!mute)aa12Voice.play();
        gunPicked=true;
    } else if(data == "ak47") {
        gunPlayer1 = new Gun("AK47", 100, 30, 30,'./assets/img/ak47.jfif', ak47Audio, ak47RelAudio);
        if(!mute)ak47Voice.play();
        gunPicked=true;
    } else if(data == "life") {
        if(!mute)lifeAudio.play();
        player1.life += 500;
    } else if(data == "xVision") {
        if(!mute)xVisionAudio.play();
        setXvision();
        timeoutXvision();
    }
    powerUpPresent = false;
    statsColPU +=1;
    document.getElementById("powerUpZone").innerHTML="";
};


let battleRunning = true;
let statsAccuracy = 0;

//Stops battle and goes to screen4
const stopBattle = () => {
    battleRunning = false;
    mainThemeAudio.pause();
    mainThemeAudio.currentTime = 0;
    if(!mute)endBattleAudio.play();
    screen3.style.display="none";
    screen4.style.display="flex";
    screen4.webkitRequestFullscreen();

    if(player2.life <= 0){
        document.getElementById('youWin').style.display='flex';
        document.getElementById('gameOver').style.display='none';
        //Check if the characters have been defeated to unlock the ghost character if applicable
        if(player2.characterType == "Navy Seal") {
            navySealDefeated = true;
        }else if(player2.characterType == "Spetnaz"){
            spetnazDefeated = true;
        }else if(player2.characterType == "Legionario") {
            legionarioDefeated = true;
        }
        if((navySealDefeated)&&(spetnazDefeated)&&(legionarioDefeated)) {
            unblockGhost();
        };
    } else if(player1.life <= 0){
        document.getElementById('gameOver').style.display='flex';
        document.getElementById('youWin').style.display='none';
    };
    //Prints statistics
    statsAccuracy = Math.round((statsTotalHits*100)/statsTotalShoots);
    document.getElementById('accuracy').innerHTML = statsAccuracy;
    document.getElementById('damageReceived').innerHTML = statsDamageRec;
    document.getElementById('damageCaused').innerHTML = statsDmageCaus;
    document.getElementById('pickedPU').innerHTML = statsColPU;
};


//Let the player decrease enemy life to 10 with a secret password
const password = "geekshubsacademy";
let passtry ="";
let ask;
const checkPassword = (elmnt) => {
    if(elmnt === password){
        player2.life = 10;
        if(!mute)ludicrousVoice.play();
    } else ask = false;

}
let xVisionAI;


//StartBattle runs an interval to continually refresh variables during battle
const startBattle = () => {
    battleRunning=true;
    //SELF REFRESH VARIABLES:
    let battleInterval = setInterval(() => {
        if((player2.life <= 0)||(player1.life <= 0)) {
            stopBattle();
        };

    
        //Stats during battle
        document.getElementById('character2').innerHTML = player2.characterType;
        document.getElementById('character1').innerHTML = player1.characterType;
        if(AIgunPicked){
            document.getElementById('gun2').innerHTML = (gunPlayer2.name + " ★");
        } else document.getElementById('gun2').innerHTML = gunPlayer2.name;
        
        if(gunPicked){
            document.getElementById('gun1').innerHTML = (gunPlayer1.name + " ★");
        } else document.getElementById('gun1').innerHTML = gunPlayer1.name;
        document.getElementById('life2').innerHTML = player2.life;
        document.getElementById('life1').innerHTML = player1.life;
        document.getElementById('ammo2').innerHTML = gunPlayer2.ammo;
        document.getElementById('ammo1').innerHTML = gunPlayer1.ammo;

        //Side of the character2 changes when Player1 is left or right Player2
        if(player1.position > player2.position) {
            document.getElementById('_character2').classList.replace('character2L','character2R');
        } else if(player1.position < player2.position){
            document.getElementById('_character2').classList.replace('character2R','character2L');
        };

        //Player1 shooting animation
        if(player1.attack == true) {
            player1ImgSrc = player1ImgSrc.replace("(1)", "(4)");
            player1Img.src = player1ImgSrc;
        } else if(player1.attack == false) {
            player1ImgSrc = player1ImgSrc.replace("(4)", "(1)");
            player1Img.src = player1ImgSrc;
        }
        //Player2 shooting animation
        if(player2.attack == true) {
            player2ImgSrc = player2ImgSrc.replace("(1)", "(4)");
            player2Img.src = player2ImgSrc;
        } else if(player2.attack == false) {
            player2ImgSrc = player2ImgSrc.replace("(4)", "(1)");
            player2Img.src = player2ImgSrc;
        }
        player2.attack = false;



        //Player1 hurting animation
        if(player1.hurt == true){
            player1ImgSrc = player1ImgSrc.replace("shoot", "die");
            player1Img.src = player1ImgSrc;
        } else if(player1.hurt == false){
            player1ImgSrc = player1ImgSrc.replace("die", "shoot");
            player1Img.src = player1ImgSrc;
        }
        //Player2hurting animation
        if(player2.hurt == true){
            player2ImgSrc = player2ImgSrc.replace("shoot", "die");
            player2Img.src = player2ImgSrc;
        } else if(player2.hurt == false){
            player2ImgSrc = player2ImgSrc.replace("die", "shoot");
            player2Img.src = player2ImgSrc;
        }
        player1.hurt = false;
        player2.hurt = false;


        //Changes if AI got the powerup
        if(AIgotPowerUp){
            if(AIpowerUp == "dEagle") {
                gunPlayer2 = new Gun("Desert Eagle", 40, 15, 15, './assets/img/desertEagle.jfif', dEagleAudio, dEagleRelAudio);
                AIgunPicked = true;
            } else if(AIpowerUp == "mp5") {
                gunPlayer2 = new Gun("MP5", 20, 25, 25,'./assets/img/mp5.jfif', mp5Audio, mp5RelAudio);
                AIgunPicked = true;
            } else if(AIpowerUp == "aa12") {
                gunPlayer2 = new Gun("AA-12", 160, 8, 8,'./assets/img/aa12.jfif', aa12Audio, aa12RelAudio);
                AIgunPicked = true;
            } else if(AIpowerUp == "ak47") {
                gunPlayer2 = new Gun("AK47", 100, 30, 30,'./assets/img/ak47.jfif', ak47Audio, ak47RelAudio);
                AIgunPicked = true;
            } else if(AIpowerUp == "life") {
                player2.life += 500;
            } else if(AIpowerUp == "xVision") {
                xVisionAI = true;
                timeoutXvision();
            }
            if(!mute)humilationVoice.play();
            AIgotPowerUp = false;
            AIpowerUp = "powerUpToLaunch";

        };

        //stop interval when battle ends
        if(!battleRunning) clearInterval(battleInterval);

    }, 100);
};

//Cheat for killing player2
window.addEventListener('keydown', (event)=>{
    if((event.keyCode = 13)&&(!ask)&&(screen3active)){
        passtry = prompt('Good try but you can do it better..');
        checkPassword(passtry);
        ask = true;
    };
});


const mouseInScreen3 = () =>{
    //Side of character1 follows pointer
    window.addEventListener('mousemove', (e)=>{
        if(e.clientX < player1.position){
            document.getElementById('_character1').classList.replace('character1R','character1L');
        } else if(e.clientX > player1.position){
            document.getElementById('_character1').classList.replace('character1L','character1R');
        };
    });
};





//Depending on difficulty chosen, set different AI levels
const AIdifficulty = () => {
    switch (difficultyChosen) {
        case "easy" :
            // AI movement ratio
            let moveEasy = setInterval(()=>{
                player2.move();
                if(!battleRunning)clearInterval(moveEasy);
            }, 2000);
            // AI hiding ratio
            let hideEasy = setInterval(()=>{
                let value = Math.round(Math.random());
                if(value == 0) {
                    player2.hide();
                } else player2.show();
                if(!battleRunning)clearInterval(hideEasy);
            },1000);
            //AI shooting ratio
            let shootEasy = setInterval(()=>{
                if(player2.covered == false) {
                    player2.shooting();
                }
                if(player2.ammo == 0) {
                    player2.hide();
                }
                if(!battleRunning)clearInterval(shootEasy);
            },800);
            AIminAccuracy = 50;
        break;

        case "medium" :
            //AI movement ratio
            let moveMedium = setInterval(()=>{
                player2.move();
                if(!battleRunning)clearInterval(moveMedium);
            }, 900);
            //AI hiding ratio
            let hideMedium = setInterval(()=>{
                let value = Math.round(Math.random());
                if(value == 0) {
                    player2.hide();
                } else player2.show();
                if(!battleRunning)clearInterval(hideMedium);
            },1000); 
            //AI shooting ratio
            let shootMedium = setInterval(()=>{
                if(player2.covered == false) {
                    player2.shooting();
                }
                if(player2.ammo == 0) {
                    player2.hide();
                }
                if(!battleRunning)clearInterval(shootMedium);
            },400);
            AIminAccuracy = 60;
        break;

        case "hard" :
            //AI movement ratio
            let moveHard = setInterval(()=>{
                player2.move();
                if(!battleRunning)clearInterval(moveHard);
            }, 800);
            //AI hiding ratio
            let hideHard = setInterval(()=>{
                let value = Math.round(Math.random());
                if(value == 0) {
                    player2.hide();
                } else player2.show();
                if(!battleRunning)clearInterval(hideHard);
            },800); 
            //AI shooting ratio
            let shootHard = setInterval(()=>{
                if(player2.covered == false) {
                    player2.shooting();
                }
                if(player2.ammo == 0) {
                    player2.hide();
                } 
                if(!battleRunning)clearInterval(shootHard);
            },100); 
            AIminAccuracy = 70;
        break;

        case "fsd" :
            //AI movement ratio
            let moveFsd = setInterval(()=>{
                player2.move();
                if(!battleRunning)clearInterval(moveFsd);
            }, 500);
            //AI hiding ratio
            let hideFsd = setInterval(()=>{
                let value = Math.round(Math.random());
                if(value == 0) {
                    player2.hide();
                } else player2.show();
                if(!battleRunning)clearInterval(hideFsd);
            },400); 
            //AI shooting ratio
            let shootFsd = setInterval(()=>{
                if(player2.covered == false) {
                    player2.shooting();
                }
                if(player2.ammo == 0) {
                    player2.hide();
                }
                if(!battleRunning)clearInterval(shootFsd);
            },50); 
            AIminAccuracy = 80;
        break;
    };   
};