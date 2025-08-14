const convertButton = document.querySelector(".convert-button");
const swapButton = document.querySelector(".swap-button");
const fromCurrencySelect = document.getElementById("from-currency");
const toCurrencySelect = document.getElementById("to-currency");
const fromFlagImg = document.getElementById("from-flag");
const toFlagImg = document.getElementById("to-flag");
const conversionText = document.querySelector(".conversion-text");

// Currency to country mapping
const countryCodes = {
  USD: "us",
  INR: "in",
  EUR: "eu",
  GBP: "gb",
  JPY: "jp",
  AUD: "au",
  CAD: "ca",
  CNY: "cn",
  KRW: "kr",
  RUB: "ru",
  BRL: "br",
};

// Populate dropdowns
for (let currency in countryCodes) {
  const fromOption = document.createElement("option");
  const toOption = document.createElement("option");
  fromOption.value = toOption.value = currency;
  fromOption.innerText = toOption.innerText = currency;
  fromCurrencySelect.appendChild(fromOption);
  toCurrencySelect.appendChild(toOption);
}
fromCurrencySelect.value = "USD";
toCurrencySelect.value = "INR";

// Update flag function
function updateFlag(selectEl, imgEl) {
  const currencyCode = selectEl.value;
  const countryCode = countryCodes[currencyCode];
  imgEl.src = `https://flagcdn.com/48x36/${countryCode}.png`;
}

// Initial flag setup
updateFlag(fromCurrencySelect, fromFlagImg);
updateFlag(toCurrencySelect, toFlagImg);

// Flag change events
fromCurrencySelect.addEventListener("change", () => updateFlag(fromCurrencySelect, fromFlagImg));
toCurrencySelect.addEventListener("change", () => updateFlag(toCurrencySelect, toFlagImg));

// Convert currency
async function getCurrency() {
  try {
    const from = fromCurrencySelect.value;
    const to = toCurrencySelect.value;
    const amount = document.getElementById("amount").value;

    const res = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from.toLowerCase()}.json`);
    const data = await res.json();
    const rate = data[from.toLowerCase()][to.toLowerCase()];
    const result = rate * amount;

    document.querySelector(".amount").innerText = `${amount} ${from} = `;
    document.querySelector(".converted-amount").innerText = `${result.toFixed(2)} ${to}`;
  } catch (err) {
    console.error("Conversion error:", err);
  }
}

convertButton.addEventListener("click", getCurrency);

// Swap currencies
swapButton.addEventListener("click", () => {
  const temp = fromCurrencySelect.value;
  fromCurrencySelect.value = toCurrencySelect.value;
  toCurrencySelect.value = temp;
  updateFlag(fromCurrencySelect, fromFlagImg);
  updateFlag(toCurrencySelect, toFlagImg);
});

// Theme toggle
const themeToggle = document.getElementById("theme-toggle");

function setTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeToggle.innerText = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") setTheme(true);

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  setTheme(isDark);
});
