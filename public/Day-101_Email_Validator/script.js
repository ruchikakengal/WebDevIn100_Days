console.log("This is my script")

let result = {
    "tag": "",
    "free": false,
    "role": false,
    "user": "sougata",
    "email": "sougata@gmail.com",
    "score": 0.64,
    "state": "undeliverable",
    "domain": "codewithharry.com",
    "reason": "invalid_mailbox",
    "mx_found": true,
    "catch_all": null,
    "disposable": false,
    "smtp_check": false,
    "did_you_mean": "",
    "format_valid": true
}

submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("Clicked!");

    // Show loading
    resultCont.innerHTML = `<div class="loader"><img width="60" src="images/loading.svg" alt="Loading..."></div>`;

    let key = "ema_live_rOCZzWMn8NYR6FCBnoACdE82vHTjuHRnHj8juxxO";
    let email = document.getElementById("email").value;
    let url = `https://api.emailvalidation.io/v1/info?apikey=${key}&email=${email}`;

    try {
        let res = await fetch(url);
        let result = await res.json();

        let str = "";
        for (let key of Object.keys(result)) {
            if(result[key] !== "" && result[key]!== " ") {
                let valueClass = "";

                // highlight specific keys
                if(key === "state") {
                    valueClass = (result[key] === "deliverable") ? "result-valid" : "result-invalid";
                }

                str += `
                  <div class="result-item">
                    <span class="result-key">${key}</span>
                    <span class="result-value ${valueClass}">${result[key]}</span>
                  </div>`;
            }
        }

        resultCont.innerHTML = str;
    } catch (err) {
        resultCont.innerHTML = `<div class="result-item result-invalid">❌ Error fetching results</div>`;
    }
});
