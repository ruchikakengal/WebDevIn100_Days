//screen control
let screen0 = document.getElementById('screen0');
let screen1 =document.getElementById('screen1');
let screen2 =document.getElementById('screen2');
let screen3 =document.getElementById('screen3');
let screen4 =document.getElementById('screen4');

//Goes to screen1 after the intro
const goToScreen1 = () => {
    screen0.style.display = 'none';
    screen1.style.display = 'flex';
    screen1.webkitRequestFullscreen();
}

setTimeout(()=>{
    goToScreen1();
},10000)



//char. selection background
let charBckgrnd;

//stats div
let screen2Stats = document.getElementById('_screen2CharactersStats');


//guns div = screen2Guns
let gunsDiv = document.getElementById('_screen2Guns');
//gun selection background
let gunBckgrnd;
//gun selectors
let gunDesertEagle = document.getElementById('desertEagleDiv');
let gunMp5 = document.getElementById('mp5Div');
let gunAa12 = document.getElementById('aa12Div');
let gunAk47 = document.getElementById('ak47Div');
let gunChosen;
let gunPlayer1;
let gunPlayer2;




//difficulty div
let screen2GunsDifficulty = document.getElementById('_screen2GunsDifficulty');
// difficulties selector
let diffEasy = document.getElementById('_easy');
let diffMedium = document.getElementById('_medium');
let diffHard = document.getElementById('_hard');
let diffFsd = document.getElementById('_fsd');
let difficultyChosen;

//AI difficulty parameters:
let AIhiding;
let AImoving;
let AIshooting;
let AIminAccuracy=30;


//players initalitation
let player1;
let player2;



const resetGame = () =>{
    difficultyChosen = undefined;
    gunPlayer1 = undefined;
    gunPlayer2 = undefined;
    player1 = undefined;
    player2 = undefined;
    gunPicked = false;
    AIgunPicked = false;
    AIgotPowerUp = false;
    xVisionAI = false;
    

    statsTotalShoots=0;
    statsTotalHits=0;
    statsDamageRec=0;
    statsDmageCaus=0;
    statsColPU=0;
    screen4.style.display = 'none';
    screen2.style.display = 'flex';
    screen2.webkitRequestFullscreen();

    player1ImgSrc = '';
    player1Img.style.display = 'none';
    player2ImgSrc = '';
    player2Img.style.display = 'none';


    gunDesertEagle.style.backgroundColor = 'gray';
    gunMp5.style.backgroundColor = 'gray';
    gunAa12.style.backgroundColor = 'gray';
    gunAk47.style.backgroundColor = 'gray';

    diffEasy.style.color = 'black';
    diffMedium.style.color = 'black';
    diffHard.style.color = 'black';
    diffFsd.style.color = 'black';

    document.getElementById('_screen2Char1').style.backgroundColor="black";
    document.getElementById('_screen2CharDiv1').style.backgroundColor="black";
    document.getElementById('_screen2Char2').style.backgroundColor="black";
    document.getElementById('_screen2CharDiv2').style.backgroundColor="black";
    document.getElementById('_screen2Char3').style.backgroundColor="black";
    document.getElementById('_screen2CharDiv3').style.backgroundColor="black";
    document.getElementById('_screen2Char4').style.backgroundColor="black";
    document.getElementById('_screen2CharDiv4').style.backgroundColor="black";

    document.getElementById('cheat').style.display='none';
    document.getElementById('_topWall').classList.remove('xVision');

    char1ArrayRun = ["./assets/img/01navy/run (1).png","./assets/img/01navy/run (2).png", "./assets/img/01navy/run (3).png", "./assets/img/01navy/run (4).png", "./assets/img/01navy/run (5).png", "./assets/img/01navy/run (6).png", "./assets/img/01navy/run (7).png", "./assets/img/01navy/run (8).png","./assets/img/01navy/run (9).png", "./assets/img/01navy/run (10).png", "./assets/img/01navy/run (11).png", "./assets/img/01navy/run (12).png" ];

    battleRunning = true;
    endBattleAudio.pause();
    endBattleAudio.currentTime = 0;
    if(!mute)mainThemeAudio.play();
};

//Screen1 to Screen2: Click anywhere
document.querySelector('#screen1').addEventListener('mousedown', ()=>{
    screen1.style.display = 'none';
    screen2.style.display = 'flex';
    screen2.webkitRequestFullscreen();
    screen2GunsDifficulty.style.display = 'none';

    
    if(!mute)mainThemeAudio.play();
});




// Screen2 to select guns and difficulty: Select character and click next
document.querySelector('.screen2NextButton').addEventListener('mousedown', ()=>{
    if((player1 == undefined)&&(!mute)) unselectPlayerBeep.play();
    if(player1 != undefined) {
        if(!mute)beep.play();
        screen2Stats.style.display = 'none';
        screen2GunsDifficulty.style.display = 'flex';
    };
});






//Select gun
document.querySelector('#desertEagleDiv').addEventListener('mousedown', ()=>{
    if(player1 != undefined) {
        gunDesertEagle.style.backgroundColor ='blue';
        if(!mute)dEagleSelection.play();
        gunPlayer1 = new Gun("Desert Eagle", 20, 15, 15, './assets/img/desertEagle.jfif', dEagleAudio, dEagleRelAudio);
        gunMp5.style.backgroundColor = 'gray';
        gunAa12.style.backgroundColor = 'gray';
        gunAk47.style.backgroundColor = 'gray';
    };
});
document.querySelector('#mp5Div').addEventListener('mousedown', ()=>{
    if(player1 != undefined){
        gunMp5.style.backgroundColor ='blue';
        if(!mute)mp5Selection.play();
        gunPlayer1 = new Gun("MP5", 10, 25, 25,'./assets/img/mp5.jfif', mp5Audio, mp5RelAudio);
        gunAa12.style.backgroundColor = 'gray';
        gunAk47.style.backgroundColor = 'gray';
        gunDesertEagle.style.backgroundColor = 'gray';
    };
});
document.querySelector('#aa12Div').addEventListener('mousedown', ()=>{
    if(player1 != undefined) {
        gunAa12.style.backgroundColor ='blue';
        if(!mute)aa12Selection.play();
        gunPlayer1 = new Gun("AA-12", 80, 8, 8,'./assets/img/aa12.jfif', aa12Audio, aa12RelAudio);
        gunDesertEagle.style.backgroundColor = 'gray';
        gunMp5.style.backgroundColor = 'gray';
        gunAk47.style.backgroundColor = 'gray';
    };
});
document.querySelector('#ak47Div').addEventListener('mousedown', ()=>{
    if(player1 != undefined) {
        gunAk47.style.backgroundColor ='blue';
        if(!mute)ak47Selection.play();
        gunPlayer1 = new Gun("AK47", 50, 30, 30,'./assets/img/ak47.jfif', ak47Audio, ak47RelAudio);
        gunDesertEagle.style.backgroundColor = 'gray';
        gunMp5.style.backgroundColor = 'gray';
        gunAa12.style.backgroundColor = 'gray';
    };
});

// Select Difficulty 
document.querySelector('#_easy').addEventListener('mousedown', ()=>{
    if(player1 != undefined) {
        diffEasy.style.color = 'green';
        if(!mute)selectPlayerBeep.play()
        difficultyChosen = "easy"

        diffMedium.style.color = 'black';
        diffHard.style.color = 'black';
        diffFsd.style.color = 'black';
    };
});
document.querySelector('#_medium').addEventListener('mousedown', ()=>{
    if(player1 != undefined){
        diffMedium.style.color = 'yellow';
        if(!mute)selectPlayerBeep.play()
        difficultyChosen = "medium";

        diffEasy.style.color = 'black';
        diffHard.style.color = 'black';
        diffFsd.style.color = 'black';
    };
});
document.querySelector('#_hard').addEventListener('mousedown', ()=>{
    if(player1 != undefined){
        diffHard.style.color = 'violet';
        if(!mute)selectPlayerBeep.play();
        difficultyChosen = "hard"

        diffMedium.style.color = 'black';
        diffEasy.style.color = 'black';
        diffFsd.style.color = 'black';
    };
});
document.querySelector('#_fsd').addEventListener('mousedown', ()=>{
    if(player1 != undefined) {
        diffFsd.style.color = 'red';
        if(!mute)selectPlayerBeep.play();
        difficultyChosen = "fsd";

        diffMedium.style.color = 'black';
        diffHard.style.color = 'black';
        diffEasy.style.color = 'black';
    };
});
let screen3active;
let playVoice= new Audio("./assets/audio/playVoice.mp3");
//Screen 2 to Screen3: Select gun, difficulty and click next
document.querySelector('.screen2NextButton').addEventListener('mousedown', ()=>{
    if((difficultyChosen == undefined)||(gunPlayer1 == undefined)){
        if(!mute){
            unselectPlayerBeep.play();
        }
    } 
    if((difficultyChosen != undefined)&&(gunPlayer1 != undefined)) {
        if(difficultyChosen == "easy") {
            gunPlayer2 = new Gun("MP5", 10, 25, 25,'./assets/img/mp5.jfif', mp5Audio, mp5RelAudio);
            player2 = new Character(2, "Navy Seal", 1200, gunPlayer2, 100);
            AIdifficulty();
        } else if(difficultyChosen == "medium") {
            gunPlayer2 = new Gun("Desert Eagle", 20, 15, 15, './assets/img/desertEagle.jfif', dEagleAudio, dEagleRelAudio);
            player2 = new Character(2, "Spetnaz", 1500, gunPlayer2, 100);
            AIdifficulty();
        } else if(difficultyChosen == "hard") {
            gunPlayer2 = new Gun("AK47", 50, 30, 30,'./assets/img/ak47.jfif', ak47Audio, ak47RelAudio);
            player2 = new Character(2, "Legionario", 2000, gunPlayer2, 100);
            AIdifficulty();
        } else if(difficultyChosen == "fsd") {
            gunPlayer2 = new Gun("AA-12", 80, 8, 8,'./assets/img/aa12.jfif', aa12Audio, aa12RelAudio);
            player2 = new Character(2, "Special Ops", 2500, gunPlayer2, 100);
            AIdifficulty();
        }

        screen2.style.display = 'none';
        screen3.style.display = 'flex';
        screen3.webkitRequestFullscreen();
        if(player2.characterType == "Special Ops")document.getElementById('cheat').style.display='block';

        if(!mute)beep.play();
        if(!mute)playVoice.play();
        startBattle();
        screen3active = true;
        ask = false;

        //Player1 character generation
        if(player1.characterType == "Navy Seal") {
            player1Img = document.getElementById('_character1imgHero1');
            player1ImgSrc = player1Img.src;
            player1Img.style.display = 'block';
        } else if(player1.characterType == "Spetnaz") {
            player1Img = document.getElementById('_character1imgHero2');
            player1ImgSrc = player1Img.src;
            player1Img.style.display = 'block';
            changeCharAnimation('02spetnaz')
        } else if(player1.characterType == "Legionario") {
            player1Img = document.getElementById('_character1imgHero3');
            player1ImgSrc = player1Img.src;
            player1Img.style.display = 'block';
            changeCharAnimation('03legio');
        } else if(player1.characterType == "Special Ops") {
            player1Img = document.getElementById('_character1imgHero4');
            player1ImgSrc = player1Img.src;
            player1Img.style.display = 'block';
            changeCharAnimation('04ghost')
        };

        //Player2 character generation
        if(player2.characterType == "Navy Seal") {
            player2Img = document.getElementById('_character2imgHero1');
            player2ImgSrc = player2Img.src;
            player2Img.style.display = 'block';
        } else if(player2.characterType == "Spetnaz") {
            player2Img = document.getElementById('_character2imgHero2');
            player2ImgSrc = player2Img.src;
            player2Img.style.display = 'block';
        } else if(player2.characterType == "Legionario") {
            player2Img = document.getElementById('_character2imgHero3');
            player2ImgSrc = player2Img.src;
            player2Img.style.display = 'block';
        } else if(player2.characterType == "Special Ops") {
            player2Img = document.getElementById('_character2imgHero4');
            player2ImgSrc = player2Img.src;
            player2Img.style.display = 'block';
        };
    };
});





//PLAYER SELECTION
document.querySelector('#_screen2Char1').addEventListener('mousedown', ()=>{
    player1 = new Character(1, "Navy Seal", 1200, gunPlayer1, 0);
    document.getElementById('_screen2Char1').style.backgroundColor="blue";
    document.getElementById('_screen2CharDiv1').style.backgroundColor="blue";
    document.getElementById('_screen2Char2').style.backgroundColor="black";
    document.getElementById('_screen2CharDiv2').style.backgroundColor="black";
    document.getElementById('_screen2Char3').style.backgroundColor="black";
    document.getElementById('_screen2CharDiv3').style.backgroundColor="black";
    document.getElementById('_screen2Char4').style.backgroundColor="black";
    document.getElementById('_screen2CharDiv4').style.backgroundColor="black";
    if(!mute)selectPlayerBeep.play()
})
document.querySelector('#_screen2Char2').addEventListener('mousedown', ()=>{
    player1 = new Character(1, "Spetnaz", 1500, gunPlayer1, 0);
    document.getElementById('_screen2Char1').style.backgroundColor="black";
    document.getElementById('_screen2CharDiv1').style.backgroundColor="black";
    document.getElementById('_screen2Char2').style.backgroundColor="blue";
    document.getElementById('_screen2CharDiv2').style.backgroundColor="blue";
    document.getElementById('_screen2Char3').style.backgroundColor="black";
    document.getElementById('_screen2CharDiv3').style.backgroundColor="black";
    document.getElementById('_screen2Char4').style.backgroundColor="black";
    document.getElementById('_screen2CharDiv4').style.backgroundColor="black";
    if(!mute)selectPlayerBeep.play()
})
document.querySelector('#_screen2Char3').addEventListener('mousedown', ()=>{
    player1 = new Character(1, "Legionario", 2000, gunPlayer1, 100);
    document.getElementById('_screen2Char1').style.backgroundColor="black";
    document.getElementById('_screen2CharDiv1').style.backgroundColor="black";
    document.getElementById('_screen2Char2').style.backgroundColor="black";
    document.getElementById('_screen2CharDiv2').style.backgroundColor="black";
    document.getElementById('_screen2Char3').style.backgroundColor="blue";
    document.getElementById('_screen2CharDiv3').style.backgroundColor="blue";
    document.getElementById('_screen2Char4').style.backgroundColor="black";
    document.getElementById('_screen2CharDiv4').style.backgroundColor="black";
    if(!mute)selectPlayerBeep.play()
})
document.querySelector('#_screen2Char4').addEventListener('mousedown', ()=>{
    player1 = new Character(1, "Special Ops", 2500, gunPlayer1, 100);
    document.getElementById('_screen2Char1').style.backgroundColor="black";
    document.getElementById('_screen2CharDiv1').style.backgroundColor="black";
    document.getElementById('_screen2Char2').style.backgroundColor="black";
    document.getElementById('_screen2CharDiv2').style.backgroundColor="black";
    document.getElementById('_screen2Char3').style.backgroundColor="black";
    document.getElementById('_screen2CharDiv3').style.backgroundColor="black";
    document.getElementById('_screen2Char4').style.backgroundColor="blue";
    document.getElementById('_screen2CharDiv4').style.backgroundColor="blue";
    if(!mute)selectPlayerBeep.play()
})

let mute = false;
const muteSound = () => {
    if(!mute) {
        mainThemeAudio.muted = true;
        mainThemeAudio.pause();
        mainThemeAudio.currentTime = 0;
        endBattleAudio.muted = true;
        endBattleAudio.pause();
        endBattleAudio.currentTime = 0;
        mute = true;
    } else if(mute) {
        mainThemeAudio.muted = false;
        mainThemeAudio.play();
        mute = false;
    }
}

let navySealDefeated = false;
let spetnazDefeated = false;
let legionarioDefeated = false;
let ghost = false;
//Unblocks character4 and FSD difficulty
const unblockGhost = () =>{
    document.getElementById('_screen2Char4question').style.display='none';
    document.getElementById('_screen2Char4').style.display='flex';
    document.getElementById('_screen2Char4Stats').style.display='flex';
    document.getElementById('_fsd').style.display='block';
    document.getElementById('_fsdInactive').style.display='none';

    ghost = true;
};