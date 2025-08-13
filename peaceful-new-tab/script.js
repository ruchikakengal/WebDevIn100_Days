const API_KEY="YOUR_PEXEL_API_KEY_HERE" //replace the placeholder with your pexels api key

// Greeting and Name
function getName() {
  let name = localStorage.getItem("name");
  if (!name) {
    name = prompt("What's your name?");
    if (name) localStorage.setItem("name", name);
  }
  return name;
}

function setGreeting() {
  const name = getName();
  const hours = new Date().getHours();

  let timeOfDay = hours < 12 ? "Good Morning" : hours < 18 ? "Good Afternoon" : "Good Evening";
  let greeting = `${timeOfDay}, ${name} 👋`;

  let workingNote = "";
  if (hours < 6) {
    workingNote = "Working early morning? Let’s make it productive! 🌅";
  } else if (hours >= 22 || hours < 1) {
    workingNote = "Burning the midnight oil? Keep going, you’ve got this! 🌙";
  }

  document.getElementById("greeting").innerText = `${greeting}\n${workingNote}`;
}


document.getElementById("resetNameBtn").addEventListener("click", () => {
  localStorage.removeItem("name");
  setGreeting();
});

// Quote
async function fetchQuote() {
  const quotes = [
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Don’t stop when you’re tired. Stop when you’re done.",
    "Do something today that your future self will thank you for.",
    "Self-belief and hard work will always earn you success. – Virat Kohli",
  "I like to be someone who is known for his commitment and passion more than anything else. – Virat Kohli",
  "Irrespective of whether you have talent or not, one has to work hard. Just being talented does not mean anything. – Virat Kohli",
  "You need to realize that you must have something to aim for, something to drive you. – Rohit Sharma",
  "Critics will always judge you. But if you believe in yourself, that’s all that matters. – Rohit Sharma",
  "You define your own success. Stay focused and keep working hard. – Rohit Sharma",
  "Success is not easy and is certainly not for the lazy. – Hardik Pandya",
  "There is no substitute for hard work. You have to keep pushing your limits. – Hardik Pandya",
  "Keep working, stay humble, and let your performance do the talking. – Hardik Pandya",
  "Be it cricket or politics, I don’t believe in compromising with what I stand for. – Gautam Gambhir",
  "When you are playing for the country, personal milestones don’t matter. – Gautam Gambhir",
  "The only way to shut people up is to perform on the field. – Gautam Gambhir",
  "Practice like you never Won, Perform like you never Lost!",
  "Start to satisfy your Hunger, Stare to satisfy your Mind! - Aniket Gawande"

  ];
  document.getElementById("quote").innerText = quotes[Math.floor(Math.random() * quotes.length)];
}
document.getElementById("refreshQuote").addEventListener("click", fetchQuote);

// Background
async function setBackground() {
  const categories = [
    "nature",
    "scenery",
    "forest",
    "cricket",
    "mountains",
    "river",
    "sunrise",
    "sunset",
    "waterfalls",
    "green landscape",
    "outdoor beauty",
    "bluesky",
    "moon",
    "planets"
  ];

  const randomCategory = categories[Math.floor(Math.random() * categories.length)];

  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${randomCategory}&per_page=30`, {
      headers: { Authorization: API_KEY }
    });

    const data = await res.json();
    if (!data.photos || data.photos.length === 0) return console.error("No photos found!");

    let photo;
    let attempts = 0;

    // Avoid white-ish or low color images (avg_color close to white)
    while (attempts < 5) {
      const candidate = data.photos[Math.floor(Math.random() * data.photos.length)];
      const avgColor = candidate.avg_color || "#ffffff";

      // Simple check: skip if too light
      if (!["#ffffff", "#eeeeee", "#dddddd"].includes(avgColor.toLowerCase())) {
        photo = candidate;
        break;
      }
      attempts++;
    }

    if (!photo) photo = data.photos[0]; // fallback

    document.body.style.backgroundImage = `url(${photo.src.landscape})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center";
  } catch (error) {
    console.error("Error fetching Pexels image:", error);
  }
}

// Load and display top sites as styled buttons
function loadSites() {
  const container = document.getElementById("top-sites-list");
  container.innerHTML = "";
  const sites = JSON.parse(localStorage.getItem("sites") || "[]");

  sites.forEach((site, index) => {
    const button = document.createElement("button");
    button.className = "top-site-button";
    button.onclick = () => window.open(site.url, "_blank");

    const content = document.createElement("div");
    content.className = "top-site-content";

    const favicon = document.createElement("img");
    favicon.src = `https://www.google.com/s2/favicons?sz=64&domain_url=${site.url}`;
    favicon.alt = "favicon";
    favicon.className = "top-site-favicon";

    const label = document.createElement("span");
    label.textContent = site.name || new URL(site.url).hostname.replace("www.", "");
    label.className = "top-site-label";

    content.appendChild(favicon);
    content.appendChild(label);

    const removeBtn = document.createElement("span");
    removeBtn.textContent = "×";
    removeBtn.className = "remove-site";
    removeBtn.onclick = (e) => {
      e.stopPropagation(); // prevent click from opening link
      const sites = JSON.parse(localStorage.getItem("sites") || "[]");
      sites.splice(index, 1);
      localStorage.setItem("sites", JSON.stringify(sites));
      loadSites();
    };

    button.appendChild(content);
    button.appendChild(removeBtn);
    container.appendChild(button);
  });
}

// Add site handler
document.getElementById("add-site-form").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("site-name").value.trim();
  const url = document.getElementById("site-url").value.trim();

  if (!url) return;

  const sites = JSON.parse(localStorage.getItem("sites") || "[]");
  sites.push({ name, url });
  localStorage.setItem("sites", JSON.stringify(sites));
  loadSites();
  e.target.reset();
});

// Pets toggle
document.getElementById("petsToggle").addEventListener("change", async e => {
  await chrome.runtime.sendMessage({ action: "togglePets", enabled: e.target.checked });
});

// Clear Data
document.getElementById("clearData").addEventListener("click", () => {
  if (confirm("Clear all stored data?")) {
    localStorage.clear();
    chrome.storage.local.clear();
    setGreeting();
    fetchQuote();
    loadSites();
  }
});

function createPetsOnNewTab() {
    if (document.getElementById('chrome-pets-extension-container')) return;

    const petsContainer = document.createElement('div');
    petsContainer.id = 'chrome-pets-extension-container';
    petsContainer.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 60px;
        pointer-events: none;
        z-index: 2147483647;
        font-family: system-ui, -apple-system, sans-serif;
    `;

    const cutePets = ["🐶", "🐱", "🐰", "🦊"];
    const numberOfPets = 4;

    for (let i = 0; i < numberOfPets; i++) {
        const pet = document.createElement('div');
        pet.className = 'chrome-extension-pet walking-pet';
        pet.textContent = cutePets[i];
        pet.style.cssText = `
            position: absolute;
            bottom: 5px;
            left: ${i * 25 + 10}%;
            font-size: 2rem;
            cursor: pointer;
            pointer-events: auto;
            transition: all 0.3s ease;
            animation: petFloat 3s ease-in-out infinite;
            animation-delay: ${i * -0.5}s;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
            user-select: none;
        `;

        pet.addEventListener('mouseenter', () => {
            pet.style.transform = 'scale(1.3) translateY(-10px)';
            pet.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))';
        });

        pet.addEventListener('mouseleave', () => {
            pet.style.transform = '';
            pet.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))';
        });

        pet.addEventListener('click', () => {
            pet.style.animation = 'petBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            setTimeout(() => {
                pet.style.animation = 'petFloat 3s ease-in-out infinite';
                pet.style.animationDelay = `${i * -0.5}s`;
            }, 600);
        });

        petsContainer.appendChild(pet);
    }

    // Add keyframe styles once
    if (!document.getElementById('chrome-pets-styles')) {
        const style = document.createElement('style');
        style.id = 'chrome-pets-styles';
        style.textContent = `
            @keyframes petFloat {
                0%, 100% { transform: translateY(0px) rotate(-1deg); }
                25% { transform: translateY(-8px) rotate(1deg); }
                50% { transform: translateY(-4px) rotate(-0.5deg); }
                75% { transform: translateY(-12px) rotate(0.5deg); }
            }

            @keyframes petBounce {
                0% { transform: scale(1.3) translateY(-10px); }
                50% { transform: scale(1.5) translateY(-25px) rotate(15deg); }
                100% { transform: scale(1.3) translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(petsContainer);
}






// Init
setGreeting();
fetchQuote();
loadSites();
setBackground();
createPetsOnNewTab();