// Constants and setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.tabIndex = 1; // Ensure canvas is focusable for keyboard events
const DEG_TO_RAD = Math.PI / 180;
let frameCount = 0;
const SPEED = 2;

// Game states
const GameState = {
    READY: 0,
    PLAYING: 1,
    OVER: 2,
    current: 0
};

// Audio assets
const AudioManager = {
    start: new Audio("sfx/start.wav"),
    flap: new Audio("sfx/flap.wav"),
    score: new Audio("sfx/score.wav"),
    hit: new Audio("sfx/hit.wav"),
    die: new Audio("sfx/die.wav"),
    hasPlayed: false
};

// Ground object
const Ground = {
    image: new Image(),
    x: 0,
    y: 0,
    init: function() {
        this.image.src = "img/ground.png";
    },
    render: function() {
        this.y = canvas.height - this.image.height;
        ctx.drawImage(this.image, this.x, this.y);
    },
    update: function() {
        if (GameState.current !== GameState.PLAYING) return;
        this.x = (this.x - SPEED) % (this.image.width / 2);
    }
};

// Background object
const Background = {
    image: new Image(),
    x: 0,
    y: 0,
    init: function() {
        this.image.src = "img/BG.png";
    },
    render: function() {
        this.y = canvas.height - this.image.height;
        ctx.drawImage(this.image, this.x, this.y);
    }
};

// Pipe object
const Pipes = {
    topImage: new Image(),
    bottomImage: new Image(),
    gap: 85,
    pipesArray: [],
    hasMoved: true,
    init: function() {
        this.topImage.src = "img/toppipe.png";
        this.bottomImage.src = "img/botpipe.png";
    },
    render: function() {
        this.pipesArray.forEach(p => {
            ctx.drawImage(this.topImage, p.x, p.y);
            ctx.drawImage(this.bottomImage, p.x, p.y + this.topImage.height + this.gap);
        });
    },
    update: function() {
        if (GameState.current !== GameState.PLAYING) return;
        if (frameCount % 100 === 0) {
            this.pipesArray.push({
                x: canvas.width,
                y: -210 * Math.min(Math.random() + 1, 1.8)
            });
        }
        this.pipesArray.forEach(p => p.x -= SPEED);
        if (this.pipesArray.length && this.pipesArray[0].x < -this.topImage.width) {
            this.pipesArray.shift();
            this.hasMoved = true;
        }
    }
};

// Bird object
const Player = {
    sprites: [
        new Image(),
        new Image(),
        new Image(),
        new Image()
    ],
    x: 50,
    y: 100,
    velocity: 0,
    gravity: 0.125,
    jumpForce: 3.6,
    rotation: 0,
    currentFrame: 0,
    init: function() {
        this.sprites[0].src = "img/bird/b0.png";
        this.sprites[1].src = "img/bird/b1.png";
        this.sprites[2].src = "img/bird/b2.png";
        this.sprites[3].src = "img/bird/b0.png";
    },
    render: function() {
        const sprite = this.sprites[this.currentFrame];
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * DEG_TO_RAD);
        ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
        ctx.restore();
    },
    update: function() {
        const radius = this.sprites[0].width / 2;
        switch (GameState.current) {
            case GameState.READY:
                this.rotation = 0;
                this.y += frameCount % 10 === 0 ? Math.sin(frameCount * DEG_TO_RAD) : 0;
                this.currentFrame += frameCount % 10 === 0 ? 1 : 0;
                break;
            case GameState.PLAYING:
                this.currentFrame += frameCount % 5 === 0 ? 1 : 0;
                this.y += this.velocity;
                this.setRotation();
                this.velocity += this.gravity;
                if (this.y + radius >= Ground.y || this.checkCollision()) {
                    GameState.current = GameState.OVER;
                }
                break;
            case GameState.OVER:
                this.currentFrame = 1;
                if (this.y + radius < Ground.y) {
                    this.y += this.velocity;
                    this.setRotation();
                    this.velocity += this.gravity * 2;
                } else {
                    this.velocity = 0;
                    this.y = Ground.y - radius;
                    this.rotation = 90;
                    if (!AudioManager.hasPlayed) {
                        AudioManager.die.play();
                        AudioManager.hasPlayed = true;
                    }
                }
                break;
        }
        this.currentFrame %= this.sprites.length;
    },
    jump: function() {
        if (this.y > 0) {
            AudioManager.flap.play();
            this.velocity = -this.jumpForce;
        }
    },
    setRotation: function() {
        if (this.velocity <= 0) {
            this.rotation = Math.max(-25, (-25 * this.velocity) / (-this.jumpForce));
        } else {
            this.rotation = Math.min(90, (90 * this.velocity) / (this.jumpForce * 2));
        }
    },
    checkCollision: function() {
        if (!Pipes.pipesArray.length) return false;
        const birdSprite = this.sprites[0];
        const pipe = Pipes.pipesArray[0];
        const radius = birdSprite.height / 4 + birdSprite.width / 4;
        const pipeX = pipe.x;
        const pipeY = pipe.y;
        const roof = pipeY + Pipes.topImage.height;
        const floor = roof + Pipes.gap;
        const pipeWidth = Pipes.topImage.width;
        if (this.x + radius >= pipeX) {
            if (this.x + radius < pipeX + pipeWidth) {
                if (this.y - radius <= roof || this.y + radius >= floor) {
                    AudioManager.hit.play();
                    return true;
                }
            } else if (Pipes.hasMoved) {
                Interface.score.current++;
                AudioManager.score.play();
                Pipes.hasMoved = false;
            }
        }
        return false;
    }
};

// Interface object
const Interface = {
    readyImage: new Image(),
    overImage: new Image(),
    tapImages: [new Image(), new Image()],
    score: {
        current: 0,
        best: 0
    },
    x: 0,
    y: 0,
    tapX: 0,
    tapY: 0,
    tapFrame: 0,
    init: function() {
        this.readyImage.src = "img/getready.png";
        this.overImage.src = "img/go.png";
        this.tapImages[0].src = "img/tap/t0.png";
        this.tapImages[1].src = "img/tap/t1.png";
    },
    render: function() {
        switch (GameState.current) {
            case GameState.READY:
                this.y = (canvas.height - this.readyImage.height) / 2;
                this.x = (canvas.width - this.readyImage.width) / 2;
                this.tapX = (canvas.width - this.tapImages[0].width) / 2;
                this.tapY = this.y + this.readyImage.height - this.tapImages[0].height;
                ctx.drawImage(this.readyImage, this.x, this.y);
                ctx.drawImage(this.tapImages[this.tapFrame], this.tapX, this.tapY);
                break;
            case GameState.OVER:
                this.y = (canvas.height - this.overImage.height) / 2;
                this.x = (canvas.width - this.overImage.width) / 2;
                this.tapX = (canvas.width - this.tapImages[0].width) / 2;
                this.tapY = this.y + this.overImage.height - this.tapImages[0].height;
                ctx.drawImage(this.overImage, this.x, this.y);
                ctx.drawImage(this.tapImages[this.tapFrame], this.tapX, this.tapY);
                break;
        }
        this.renderScore();
    },
    renderScore: function() {
        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.font = "35px Squada One";
        if (GameState.current === GameState.PLAYING) {
            ctx.fillText(this.score.current, canvas.width / 2 - 5, 50);
            ctx.strokeText(this.score.current, canvas.width / 2 - 5, 50);
        } else if (GameState.current === GameState.OVER) {
            ctx.font = "40px Squada One";
            const scoreText = `SCORE :     ${this.score.current}`;
            try {
                this.score.best = Math.max(this.score.current, localStorage.getItem("best") || 0);
                localStorage.setItem("best", this.score.best);
                const bestText = `BEST  :     ${this.score.best}`;
                ctx.fillText(scoreText, canvas.width / 2 - 80, canvas.height / 2);
                ctx.strokeText(scoreText, canvas.width / 2 - 80, canvas.height / 2);
                ctx.fillText(bestText, canvas.width / 2 - 80, canvas.height / 2 + 30);
                ctx.strokeText(bestText, canvas.width / 2 - 80, canvas.height / 2 + 30);
            } catch (e) {
                ctx.fillText(scoreText, canvas.width / 2 - 85, canvas.height / 2 + 15);
                ctx.strokeText(scoreText, canvas.width / 2 - 85, canvas.height / 2 + 15);
            }
        }
    },
    update: function() {
        if (GameState.current === GameState.PLAYING) return;
        this.tapFrame += frameCount % 10 === 0 ? 1 : 0;
        this.tapFrame %= this.tapImages.length;
    }
};

// Event handlers
function handleInput() {
    const action = () => {
        switch (GameState.current) {
            case GameState.READY:
                GameState.current = GameState.PLAYING;
                AudioManager.start.play();
                break;
            case GameState.PLAYING:
                Player.jump();
                break;
            case GameState.OVER:
                GameState.current = GameState.READY;
                Player.velocity = 0;
                Player.y = 100;
                Pipes.pipesArray = [];
                Interface.score.current = 0;
                AudioManager.hasPlayed = false;
                break;
        }
    };

    canvas.addEventListener("click", action);
    canvas.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "w" || e.key === "ArrowUp") {
            action();
        }
    });
}

// Main game loop
function gameLoop() {
    // Update
    Player.update();
    Ground.update();
    Pipes.update();
    Interface.update();

    // Render
    ctx.fillStyle = "#30c0df";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    Background.render();
    Pipes.render();
    Player.render();
    Ground.render();
    Interface.render();

    frameCount++;
}

// Initialize assets and start game
function init() {
    Ground.init();
    Background.init();
    Pipes.init();
    Player.init();
    Interface.init();
    handleInput();
    setInterval(gameLoop, 20);
}

// Start the game
init();