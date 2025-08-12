function flipCoin() {
  const coin = document.getElementById("coin");
  const result = document.getElementById("result");

  // Reset result and rotation
  result.textContent = "";
  coin.style.transition = "none";
  coin.style.transform = "rotateY(0deg)";
  void coin.offsetWidth;
  const isHeads = Math.random() < 0.5;
  const rotation = 360 * 5 + (isHeads ? 0 : 180);
  coin.style.transition = "transform 2s ease-in-out";
  coin.style.transform = `rotateY(${rotation}deg)`;

  setTimeout(() => {
    result.textContent = isHeads ? "You got Heads!" : "You got Tails!";
  }, 2000);
}
function flipCoin() {
  const coin = document.getElementById("coin");
  const result = document.getElementById("result");
  const historyList = document.getElementById("historyList");

  // Reset result and rotation
  result.textContent = "";
  coin.style.transition = "none";
  coin.style.transform = "rotateY(0deg)";
  void coin.offsetWidth;

  const isHeads = Math.random() < 0.5;
  const rotation = 360 * 5 + (isHeads ? 0 : 180);

  coin.style.transition = "transform 2s ease-in-out";
  coin.style.transform = `rotateY(${rotation}deg)`;

  setTimeout(() => {
    const outcome = isHeads ? "Heads" : "Tails";
    result.textContent = `You got ${outcome}!`;
    const li = document.createElement("li");
    li.textContent = outcome;
    historyList.prepend(li); 
  }, 2000);
}
