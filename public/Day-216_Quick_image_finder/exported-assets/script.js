// ⚠️ IMPORTANT: Replace 'YOUR_UNSPLASH_ACCESS_KEY' with your actual Unsplash API key
// Get your free API key from: https://unsplash.com/developers

const API_KEY = 'ZctjphDp66bzNjCO0WNer58GaAXtUAecVUSwfcD2SBo';
const API_URL = 'https://api.unsplash.com/search/photos';

// DOM Elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsSection = document.getElementById('results-section');
const resultImage = document.getElementById('result-image');
const resultText = document.getElementById('result-text');
const photographerName = document.getElementById('photographer-name');
const imageLink = document.getElementById('image-link');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const showMoreBtn = document.getElementById('show-more-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const imageCounter = document.getElementById('image-counter');

// State management
let currentImages = [];
let currentIndex = 0;
let currentQuery = '';
let currentPage = 1;

// Event Listeners
searchForm.addEventListener('submit', handleSearch);
showMoreBtn.addEventListener('click', loadMoreResults);
prevBtn.addEventListener('click', showPreviousImage);
nextBtn.addEventListener('click', showNextImage);

// Handle search submission
async function handleSearch(e) {
    e.preventDefault();

    const query = searchInput.value.trim();

    if (!query) {
        showError('Please enter a search term');
        return;
    }

    // Check if API key is set
    if (API_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
        showError('Please add your Unsplash API key in script.js. Get it from https://unsplash.com/developers');
        return;
    }

    currentQuery = query;
    currentPage = 1;
    currentIndex = 0;

    await fetchImages(query, currentPage);
}

// Fetch images from Unsplash API
async function fetchImages(query, page = 1) {
    try {
        hideError();
        showLoading();
        hideResults();

        const url = `${API_URL}?query=${encodeURIComponent(query)}&page=${page}&per_page=10&client_id=${API_KEY}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        hideLoading();

        if (data.results.length === 0) {
            showError(`No images found for "${query}". Try a different search term.`);
            return;
        }

        if (page === 1) {
            currentImages = data.results;
        } else {
            currentImages = [...currentImages, ...data.results];
        }

        displayCurrentImage();
        showResults();
        updateNavigationButtons();

    } catch (error) {
        hideLoading();
        console.error('Error fetching images:', error);
        showError('Failed to fetch images. Please check your API key and internet connection.');
    }
}

// Display the current image
function displayCurrentImage() {
    const image = currentImages[currentIndex];

    if (!image) return;

    resultImage.src = image.urls.regular;
    resultImage.alt = image.alt_description || image.description || 'Image';
    photographerName.textContent = `Photo by ${image.user.name}`;
    imageLink.href = image.links.html;
    resultText.textContent = `Showing results for "${currentQuery}"`;
    imageCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
}

// Show previous image
function showPreviousImage() {
    if (currentIndex > 0) {
        currentIndex--;
        displayCurrentImage();
        updateNavigationButtons();
    }
}

// Show next image
function showNextImage() {
    if (currentIndex < currentImages.length - 1) {
        currentIndex++;
        displayCurrentImage();
        updateNavigationButtons();
    }
}

// Update navigation buttons state
function updateNavigationButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === currentImages.length - 1;
}

// Load more results (next page)
async function loadMoreResults() {
    currentPage++;
    await fetchImages(currentQuery, currentPage);
}

// UI Helper Functions
function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showResults() {
    resultsSection.classList.remove('hidden');
}

function hideResults() {
    resultsSection.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');

    // Auto-hide error after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    errorMessage.classList.add('hidden');
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (currentImages.length === 0) return;

    if (e.key === 'ArrowLeft') {
        showPreviousImage();
    } else if (e.key === 'ArrowRight') {
        showNextImage();
    }
});