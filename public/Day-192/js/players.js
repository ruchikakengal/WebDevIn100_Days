

//MOVE AND SHOOTING METHODS PRE-FUNCTIONS
//X position
let xPosition;
let xMaxPosition;
let xMinPosition;

let player2Data;
let yTargetPosition;
let yPosition;

let powerUpsArray = ["life", "dEagle", "mp5", "aa12", "ak47", "xVision" ];
let powerUpToLaunch;
let powerUpPresent;
let AIgotPowerUp;
let AIpowerUp;
let xVision;

let mainThemeAudio = new Audio("./assets/audio/mainTheme.mp3");
let endBattleAudio = new Audio("./assets/audio/endBattle.mp3");
let beep = new Audio("./assets/audio/beep2.mp3");
let selectPlayerBeep = new Audio("./assets/audio/selectPlayerBeep.mp3");
let unselectPlayerBeep = new Audio("./assets/audio/unselectPlayerBeep.mp3");
let dEagleSelection = new Audio("./assets/audio/DesertEagleRel.mp3");
let mp5Selection = new Audio("./assets/audio/MP5Rel.mp3");
let aa12Selection = new Audio("./assets/audio/shotgunRel.mp3");
let ak47Selection = new Audio("./assets/audio/ar15Rel.mp3");

//Guns audio sources
dEagleAudio = "./assets/audio/DesertEagle.mp3";
dEagleRelAudio = "./assets/audio/DesertEagleRel.mp3";
mp5Audio = "./assets/audio/MP5.mp3";
mp5RelAudio = "./assets/audio/MP5Rel.mp3";
aa12Audio = "./assets/audio/shotgun.mp3";
aa12RelAudio = "./assets/audio/shotgunRel.mp3";
ak47Audio = "./assets/audio/ar15.mp3";
ak47RelAudio = "./assets/audio/ar15Rel.mp3";


//final stats intialization
let statsTotalShoots=0;
let statsTotalHits=0;
let statsDamageRec=0;
let statsDmageCaus=0;
let statsColPU=0;

let xPosDifference; 
let bottomWallClicked = false;
let absoluteMovement;

document.getElementById('_bottomWall').addEventListener('mousedown', ()=>{
    bottomWallClicked = true;
})

const clickedOutsideWall = () =>{
    bottomWallClicked = false;
    return bottomWallClicked;
}


//Character generation:
let player1Img;
let player1ImgSrc;
let player2Img;
let player2ImgSrc;

let char1ArrayRun = ["./assets/img/01navy/run (1).png","./assets/img/01navy/run (2).png", "./assets/img/01navy/run (3).png", "./assets/img/01navy/run (4).png", "./assets/img/01navy/run (5).png", "./assets/img/01navy/run (6).png", "./assets/img/01navy/run (7).png", "./assets/img/01navy/run (8).png","./assets/img/01navy/run (9).png", "./assets/img/01navy/run (10).png", "./assets/img/01navy/run (11).png", "./assets/img/01navy/run (12).png" ];

let player1AnimationCount = 1;

//Iterates the array of images for make character running animation
const changeCharAnimation =(char)=>{
    for(let i=0 ; i<char1ArrayRun.length ; i++){
        char1ArrayRun[i] = char1ArrayRun[i].replace('01navy', char);
    };
};


//COORDINATES PRE-FUNCTION
document.querySelector('#screen3').addEventListener('mousedown', (e)=>{
    //Collects up X position
    xPosition = e.clientX;
    xMinPosition = 1;
    //Collects Y position of character2
    player2Data = document.getElementById('_character2').getBoundingClientRect();
    yTargetPosition = player2Data.top + 50;
    yPosition = e.clientY;


    //X position limitation depending on the screen width (custom break points)
    if(screen.width > 1936) xMaxPosition = screen.width * 0.80;
    if((screen.width > 1836)&&(screen.width <= 1936)) xMaxPosition = screen.width * 0.82;
    if((screen.width > 1736)&&(screen.width <= 1836)) xMaxPosition = screen.width * 0.84;
    if((screen.width > 1636)&&(screen.width <= 1736)) xMaxPosition = screen.width * 0.88;
    if((screen.width > 1536)&&(screen.width <= 1636)) xMaxPosition = screen.width * 0.91;
    if((screen.width > 1436)&&(screen.width <= 1536)) xMaxPosition = screen.width * 0.94;
    if(screen.width <= 1436) xMaxPosition = screen.width * 0.99;
    
    //Calculates difference for running animation
    xPosDifference = xPosition-player1.position;
    absoluteMovement = Math.abs(xPosition-player1.position);

    if(bottomWallClicked) player1.move();
    
    return xPosition;
})


//SHOOTING METHOD PRE-FUNCTIONS
//If user clicks on topVoid, topWall or centerVoid, calls player1.shooting() for fire
document.querySelectorAll('.shooting1').forEach(item =>{
    item.addEventListener("mousedown", (e)=>{
        if((e.button === 0)) {
            xPosition = e.clientX;
            yPosition = e.clientY;
            bottomWallClicked = false;
            player1.shooting();
        }
    });
});
document.getElementById('screen3').addEventListener("mouseup", (e)=>{
    player1.attack = false;
});


//PLAYER2 (AI) SHOOTING PRE-METHOD
let AIaccuracy = 0;
//This function returns a random rounded number between two limits.
const minMaxRoundedRandom = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
}


//GUN CLASS
class Gun {
    constructor(name, damage, ammo, initialAmmo, img, shootSound, reloadSound) {
        this.name = name;
        this.damage = damage;
        this.ammo = ammo;
        this.initialAmmo = initialAmmo;
        this.img = img;
        this.shootSound = shootSound;
        this.reloadSound = reloadSound;
    }
    playShoot(){
        let shootSound = new Audio(this.shootSound);
        if(!mute)shootSound.play();
    }
    playReload(){
        let reloadSound = new Audio(this.reloadSound);
        if(!mute)reloadSound.play();
    }
}




//CHARACTER CLASS
class Character {

    constructor(player, characterType, life, gun, position) {
        //Player defines who owns the character (1=user, 2=AI);
        this.player = player;
        //Name of the differente characters
        this.characterType = characterType;
        //Life goes down when character is damaged (min0-max1000)
        this.life = life;
        //gun is inherited from the object gun
        this.gun = gun;
        //position defines which position is the character when gets out of cover
        this.position = position;

        this.attack = false;
        this.covered = true;
        this.hurt = false;
    };

    show(){
        if(this.player == 1) {
            if(this.covered === true) {
                //Replace char1 image
                player1ImgSrc = player1ImgSrc.replace("crouch", "shoot");
                player1Img.src = player1ImgSrc;
    
                this.covered = false;
            };
        } else if (this.player == 2) {
            //Replace char2 style
            document.getElementById('_character2').style.display = "block";
            this.covered = false;
            //If char2 is out, steals the Power-Up depending on the AIaccuracy level
            if((powerUpPresent)&&(AIaccuracy > 80)){
                document.querySelector('.powerUpDiv').classList.toggle('getPowerUp');
                AIgotPowerUp = true;
                AIpowerUp = powerUpToLaunch;
                powerUpPresent = false;
            };
        };
    };

    //Hides and reloads ammo when click on the player1 wall
    hide(){
        if(this.player == 1) {
            player1ImgSrc = player1ImgSrc.replace("shoot", "crouch");
            player1Img.src = player1ImgSrc;
            gunPlayer1.ammo = gunPlayer1.initialAmmo;
            if(this.covered == false) gunPlayer1.playReload();
            this.covered = true;
            bottomWallClicked = true;
            
        } else if (this.player == 2) {
            if(this.covered == false) {
                if(!xVision) {
                    document.getElementById('_character2').style.display = "none";
                } else if(xVision) {
                    //if player1 has xVision, char2 style when hide changes to crouch
                    player2ImgSrc = player2ImgSrc.replace("shoot", "crouch");
                    player2Img.src = player2ImgSrc;
                };
                 
                gunPlayer2.ammo = gunPlayer2.initialAmmo;
                gunPlayer2.playReload();
                this.covered = true;
            };
        };
    };

    //Moves to another point in X. Must be covered first
    move(){
        //Move limitation depending on break points for avoiding going out of viewport
        if(xPosition > (xMaxPosition)) xPosition = (xMaxPosition);
        if(xPosition < 1) xPosition = 1;
    
        
        if(this.player == 1) {
            if(bottomWallClicked){
                if(this.covered==true) {
                    //Difference btw actual pos and target pos is divided in 8 parts..
                    xPosDifference = xPosDifference / 8;
                    player1ImgSrc = player1ImgSrc.replace("crouch", "run");
                    player1Img.src = player1ImgSrc;
                    //if it is positive...
                    if(xPosDifference>0){
                        //and has not arrived yet..
                        if(this.position < this.position + xPosDifference){
                            //runs an interval iterating the array of running images...
                            let timeId = setInterval(()=>{
                                //moves div to target position. -150 is for centering the image to the click
                                document.getElementById("_character1").style.left= (this.position + xPosDifference - 150) +"px";
                                this.position +=xPosDifference;
                                
                                player1Img.src = char1ArrayRun[player1AnimationCount];
                                player1AnimationCount+=1;
                                //until target position has been reached
                                if(this.position >= xPosition) {
                                    clearInterval(timeId);
                                    player1AnimationCount = 1;
                                    player1ImgSrc = player1ImgSrc.replace("run", "crouch");
                                    player1Img.src = player1ImgSrc;
                                    bottomWallClicked = false;   
                                };
                            },100)
                        };
                    } else if(xPosDifference<0){
                        if(this.position > this.position + xPosDifference){
                            let timeId = setInterval(()=>{
                                document.getElementById("_character1").style.left= (this.position + xPosDifference - 150) +"px";
                                this.position +=xPosDifference;
    
                                player1Img.src = char1ArrayRun[player1AnimationCount];
                                player1AnimationCount+=1;
                                
                                if(this.position <= xPosition){
                                    clearInterval(timeId);
                                    player1AnimationCount = 1;
                                    player1ImgSrc = player1ImgSrc.replace("run", "crouch");
                                    player1Img.src = player1ImgSrc;
                                    bottomWallClicked = false;  
                                }
                            },100);
                        };
                    };
                };
            };
            //char2 moves randomly position    
        } else if (this.player == 2) {
            this.position = minMaxRoundedRandom(1,xMaxPosition);
            if(player2.position < 1) player2.position = 1;
            if(player2.position > xMaxPosition) player2.position = xMaxPosition;
            document.getElementById("_character2").style.left= (player2.position) + "px";
        };
    };

    shooting = () => {
        //player1 shoots to x and y position
        if((this.player == 1)&&(!this.covered)&&(gunPlayer1.ammo > 0)) {
            gunPlayer1.ammo -=1;
            this.attack = true;
            gunPlayer1.playShoot();
            statsTotalShoots +=1;
            if((player2.position >= xPosition*0.1)&&(player2.position <= xPosition*1.3)&& 
            (yTargetPosition >= yPosition * 0.2)&&(yTargetPosition <= yPosition*1.3)) {
                if((!player2.covered)||(xVision)) {
                    player2.life -= gunPlayer1.damage;
                    player2.hurt = true;
                    statsTotalHits +=1;
                    statsDmageCaus+=gunPlayer1.damage;
                };
            };

            //player2 depends on AI level
        } else if((this.player == 2)&&(!this.covered)&&(gunPlayer2.ammo > 0)){
            gunPlayer2.ammo -=1;
            gunPlayer2.playShoot();
            this.attack = true;
            if((player1.covered== false)||(xVisionAI)) {
                //AIminAccuracy depends on AI level
                AIaccuracy = minMaxRoundedRandom(AIminAccuracy,100);
                //These lines are from increase AIaccuracy if player1 remains static
                if((absoluteMovement<300)&&(absoluteMovement>200)) AIaccuracy + 5;
                if((absoluteMovement<200)&&(absoluteMovement>100)) AIaccuracy + 5;
                if((absoluteMovement<100)&&(absoluteMovement>0)) AIaccuracy + 5;
                if((absoluteMovement>=300)) AIaccuracy = AIminAccuracy;
                
                if(AIaccuracy > 80) {
                    player1.life -= gunPlayer2.damage;
                    player1.hurt = true;
                    statsDamageRec+=gunPlayer2.damage;
                };
            };
        };
    };
};







