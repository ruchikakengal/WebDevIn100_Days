const buttonElement = document.querySelector('.theme-button');
const cardElement = document.querySelector('.card');

buttonElement.addEventListener("click", () => {
  const bodyElement = document.body;

  if(bodyElement.classList.contains("light")) {
    bodyElement.classList.add("dark");
    buttonElement.innerHTML = "LIGHT MODE";
    bodyElement.classList.remove("light");

  } else {
    
    bodyElement.classList.add("light");
    buttonElement.innerHTML = "DARK MODE";
    bodyElement.classList.remove("dark");
  }
});

function updateScreen() {
  const inputElement = document.querySelector('.js-update');

  document.querySelector('.js-message')
    .innerHTML = inputElement.value;
}

cardElement.addEventListener("click", () => {
  document.querySelector('.action-area')
    .textContent = "You clicked me! 😎";
})