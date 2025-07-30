const img = document.querySelector("img");
const btn = document.querySelector(".search");

const url = `https://randomuser.me/api/`;

async function getImage() {
    try {
        const response = await fetch(url);
        const data = await response.json()

        const imageURL = data.results[0].picture.large;
        const name = `${data.results[0].name.title} ${data.results[0].name.first} ${data.results[0].name.last}`
        const gender = data.results[0].gender;
        const contact = data.results[0].phone;
        const country = data.results[0].location.country;


        document.querySelector("#name").innerText = name;
        document.querySelector("#gender").innerText = gender;
        document.querySelector("#contact").innerText = contact;
        document.querySelector("#country").innerText = country;

        img.setAttribute("src", imageURL);

    } catch (error) {
        console.error("ERROR: ", error);
    }
}

btn.addEventListener("click", getImage);