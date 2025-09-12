const generateBtn = document.querySelector('.generate-button');
const memeTitle = document.querySelector('.meme-title');
const memeImage = document.querySelector('.meme-image');
const authorOutput = document.querySelector('.author');

function getMeme() {
  // Add "Loading..." effect
  memeTitle.innerText = "Loading...";
  memeImage.src = "";
  authorOutput.innerText = "";

  fetch('https://meme-api.com/gimme/wholesomememes')
    .then((res) => res.json())
    .then((data) => {
      const { author, title, url } = data;
      memeTitle.innerText = title;
      memeImage.src = url;
      authorOutput.innerText = `Meme by: ${author}`;
    })
    .catch((err) => {
      memeTitle.innerText = "Oops! Something went wrong 😅";
      console.error(err);
    });
}

// Initial meme
getMeme();

// Button click
generateBtn.addEventListener('click', () => {
  getMeme();
});
