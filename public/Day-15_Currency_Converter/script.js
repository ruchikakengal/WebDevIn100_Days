const convertButton = document.querySelector(".convert-button");

async function getCurrency() {
    try {
        const fromCountry = document.getElementById("from-currency").value;
        const toCountry = document.getElementById("to-currency").value;
        const amount = document.getElementById("amount").value;

        const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCountry}.json`;

        const response = await fetch(url);
        const data = await response.json();

        const rates = data[fromCountry][toCountry];
        const result = rates * amount;
        
        document.querySelector(".amount").innerHTML = `${amount} ${fromCountry} = `;
        document.querySelector(".converted-amount").innerHTML = `${result.toFixed(2)} ${toCountry}`;

    } catch(err) {
        console.error("Error fetching currency rates:", err);
    }
};

convertButton.addEventListener("click", getCurrency);


// swap button
const swapButton = document.querySelector(".swap-button");

swapButton.addEventListener("click", ()=> {
    const fromCurrency = document.getElementById("from-currency").value;
    const toCurrency = document.getElementById("to-currency").value;
    document.getElementById("from-currency").value = toCurrency;
    document.getElementById("to-currency").value = fromCurrency;
})


// copy to clipboard
const convertionText = document.querySelector(".conversion-text");
convertionText.addEventListener("click", ()=> {
    const copyText = document.querySelector(".amount").innerText + document.querySelector(".converted-amount").innerText;
    navigator.clipboard.writeText(copyText)
        .then(alert("Copied to clipboard!"))
        .catch((err)=> console.error("Error copying to clipboard:", err));
});