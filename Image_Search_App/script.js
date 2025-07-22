const searchBox = document.querySelector("#search-box");
const searchBtn = document.querySelector(".search-btn");
const searchResult = document.querySelector(".search-result");
const showMoreButton = document.querySelector("#show-more-btn");

let keyword = "";
let page = 1;

async function getImage() {
    keyword = searchBox.value;

    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${API_KEY}`;

    try {
        let response = await fetch(url);
        let data = await response.json();

        if (page === 1) {
            searchResult.innerHTML = "";    // for clearing images when new search is typed
        }

        let result = data.results;

        for (let i = 0; i < 9; i++) {
            let imgURL = result[i].urls.small;
            let image = document.createElement(`img`);
            image.setAttribute("src", imgURL);
            searchResult.appendChild(image);
        }

        showMoreButton.style.display = "inline-block";
    } catch (error) {
        if(keyword != "")
        alert(`Error: ${error}`)
    }
}

searchBtn.addEventListener("click", () => {
    page = 1;
    getImage();
})

showMoreButton.addEventListener("click", function () {
    page++;
    getImage();
})