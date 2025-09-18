let userscore = 0;
let compscore = 0;

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");
const userscorecount = document.querySelector("#user-score");
const compscorecount = document.querySelector("#comp-score");
const toggleThemeBtn = document.querySelector("#toggle-theme");
const resetBtn = document.querySelector("#reset-game");

const getcompchoice = () => {
  const options = ["rock", "paper", "scissors"];
  return options[Math.floor(Math.random() * 3)];
};

const drawgame = (userchoice, compchoice) => {
  msg.innerText = `🤝 It's a Draw! Your ${userchoice} = Computer's ${compchoice}`;
  msg.style.backgroundColor = "var(--draw)";
  animateMessage();
  drawSound.play();
};

const showwinner = (userwin, userchoice, compchoice) => {
  if (userwin) {
    userscore++;
    userscorecount.innerText = userscore;
    msg.innerText = `🎉 You Win! ${userchoice} beats ${compchoice}`;
    msg.style.backgroundColor = "var(--win)";
    document.body.classList.add("flash-win");
    setTimeout(() => document.body.classList.remove("flash-win"), 300);
    winSound.play();
  } else {
    compscore++;
    compscorecount.innerText = compscore;
    msg.innerText = `😞 You Lose! ${compchoice} beats ${userchoice}`;
    msg.style.backgroundColor = "var(--lose)";
    document.body.classList.add("flash-lose");
    setTimeout(() => document.body.classList.remove("flash-lose"), 300);
    loseSound.play();
  }
  animateMessage();
};

const playGame = (userchoice) => {
  const compchoice = getcompchoice();
  if (userchoice === compchoice) {
    drawgame(userchoice, compchoice);
  } else {
    let userwin = true;
    if (userchoice === "rock") userwin = compchoice !== "paper";
    else if (userchoice === "paper") userwin = compchoice !== "scissors";
    else userwin = compchoice !== "rock";
    showwinner(userwin, userchoice, compchoice);
  }
};

const animateMessage = () => {
  msg.classList.remove("pulse");
  void msg.offsetWidth;
  msg.classList.add("pulse");
};

choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    const userchoice = choice.id;
    playGame(userchoice);
  });
});

toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

resetBtn.addEventListener("click", () => {
  userscore = 0;
  compscore = 0;
  userscorecount.innerText = "0";
  compscorecount.innerText = "0";
  msg.innerText = "Game reset! Take your move 🎮";
  msg.style.backgroundColor = "var(--box)";
});
