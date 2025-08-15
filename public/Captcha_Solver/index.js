// your code goes here
// Select DOM elements for captcha display, reload button, input field, submit button, and message area
let captchadisplay = document.querySelector(".captchadisplay");
let reload = document.querySelector(".reload");
let inp = document.querySelector(".inp");
let submit = document.querySelector(".submit");
let msgarea = document.querySelector(".msgarea");

// Generate arrays for lowercase letters, uppercase letters, and numbers
const smallLetters = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(97 + i)
); // a-z
const capitalLetters = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
); // A-Z
const numbers = Array.from({ length: 10 }, (_, i) => i.toString()); // 0-9

// Combine all characters (lowercase, uppercase, numbers) into one array
const combinedArray = [...smallLetters, ...capitalLetters, ...numbers];

let captcha = ""; // Initialize the captcha string

// Function to generate a new captcha
function getcaptcha() {
  captcha = ""; // Reset captcha
  inp.value = ""; // Clear input field
  inp.disabled = false; // Enable input field if previously disabled
  for (let i = 0; i < 6; i++) {
    // Randomly select 6 characters from the combined array
    captcha += combinedArray[Math.floor(Math.random() * combinedArray.length)];
  }
  // Display the captcha with spaces between characters
  captchadisplay.innerHTML = captcha.split("").join("&nbsp; &nbsp;");
  // Show message prompting user to enter the captcha
  msgarea.innerHTML = `<span style="color: black;">Enter the Captcha and hit the check button.</span>`;
}
getcaptcha(); // Generate the initial captcha

// Add event listener for submit button click
submit.addEventListener("click", () => {
  if (inp.value.length > 0) {
    // Validate the input if it's not empty
    validate(inp.value);
  } else {
    // Show error message if input is empty
    msgarea.innerHTML = `<span>Fill the captcha.</span>`;
  }
});

// Function to validate the entered captcha
function validate(c) {
  if (c == captcha) {
    // If captcha matches, display success message
    inp.disabled = true; // Disable the input field after successful validation
    msgarea.innerHTML = `<span >Nice! You are not a robot ✅</span>`;
  } else {
    // If captcha does not match, display error message
    msgarea.innerHTML = `<span>Captcha not matched. Please try again ❗️</span>`;
  }
}

// Add event listener for reload button click
reload.addEventListener("click", () => {
  getcaptcha(); // Generate a new captcha
});
