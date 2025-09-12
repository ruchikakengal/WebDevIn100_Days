const quotes = [
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "You are enough just as you are.", author: "Meghan Markle" },
    { text: "Be a voice, not an echo.", author: "Albert Einstein" },
    { text: "You're entirely bonkers. But I'll tell you a secret. All the best people are.", author: "Lewis Carroll" },
    { text: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman" },
    { text: "The world needs that special gift only you have.", author: "Marie Forleo" },
    { text: "You are stronger than you think, braver than you believe, and smarter than you know.", author: "A.A. Milne" },
    { text: "Don't wait for opportunity. Create it.", author: "Unknown" },
    { text: "Your only limit is your mind.", author: "Unknown" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "Make today so awesome that yesterday gets jealous.", author: "Unknown" },
    { text: "Doubt kills more dreams than failure ever will.", author: "Suzy Kassem" },
    { text: "Small steps every day lead to big results.", author: "Unknown" },
    { text: "Don't compare your chapter 1 to someone else's chapter 20.", author: "Unknown" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Stay positive, work hard, and make it happen.", author: "Unknown" },
    { text: "You didn't come this far to only come this far.", author: "Unknown" },
    { text: "Fall in love with taking care of yourself.", author: "Unknown" },
    { text: "You glow differently when you're confident in your own energy.", author: "Unknown" },
    { text: "Your vibe attracts your tribe.", author: "Unknown" },
    { text: "Don't shrink to fit places you've outgrown.", author: "Unknown" }
  ];

  let usedQuotes = [];
  let currentQuote = null;
  let favorites = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];
  let progressInterval;

  const quoteText = document.getElementById("quote");
  const authorText = document.getElementById("author");
  const newQuoteBtn = document.getElementById("new-quote");
  const buttonText = document.getElementById("button-text");
  const loader = document.getElementById("loader");
  const card = document.getElementById("card");
  const progress = document.getElementById("progress");
  const shareBtn = document.getElementById("share");
  const favoriteBtn = document.getElementById("favorite");
  const toast = document.getElementById("toast");
  const favoritesContainer = document.getElementById("favorites-container");
  const favoritesList = document.getElementById("favorites-list");

  // Initialize
  function init() {
    showRandomQuote();
    updateFavoritesButton();
    if (favorites.length > 0) {
      showFavorites();
    }
  }

  // Show a random quote with smooth transition
  function showRandomQuote() {
    // Start loading animation
    buttonText.style.display = 'none';
    loader.style.display = 'block';
    newQuoteBtn.disabled = true;
    
    // Fade out current quote
    card.classList.remove('fade-in');
    card.classList.add('fade-out');
    
    setTimeout(() => {
      // Reset progress bar animation
      progress.style.animation = 'none';
      void progress.offsetWidth; // Trigger reflow
      
      // Get a random quote that hasn't been shown recently
      let availableQuotes = quotes.filter(q => !usedQuotes.includes(q.text));
      
      if (availableQuotes.length === 0) {
        // If all quotes have been used, reset
        usedQuotes = [];
        availableQuotes = quotes;
      }
      
      const randomIndex = Math.floor(Math.random() * availableQuotes.length);
      currentQuote = availableQuotes[randomIndex];
      usedQuotes.push(currentQuote.text);
      
      // Update the quote text
      quoteText.innerText = `"${currentQuote.text}"`;
      authorText.innerText = `- ${currentQuote.author}`;
      
      // Fade in new quote
      card.classList.remove('fade-out');
      card.classList.add('fade-in');
      
      // Stop loading animation
      buttonText.style.display = 'block';
      loader.style.display = 'none';
      newQuoteBtn.disabled = false;
      
      // Update favorites button appearance
      updateFavoritesButton();
      
      // Start progress bar animation
      progress.style.animation = 'progressAnim 10s linear';
      
      // Change background color gradually
      document.body.style.background = getRandomGradient();
      
    }, 500); // Match the fade-out animation duration
  }

  // Get a random gradient for background
  function getRandomGradient() {
    const gradients = [
      'linear-gradient(135deg, #ffe0f0, #d0f0ff)',
      'linear-gradient(135deg, #ffd0e0, #c0e0ff)',
      'linear-gradient(135deg, #ffc0d0, #b0e0e6)',
      'linear-gradient(135deg, #ffb6c1, #add8e6)',
      'linear-gradient(135deg, #f8c8dc, #a7d0e8)'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  }

  // Show toast notification
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Update favorite button appearance
  function updateFavoritesButton() {
    const heartIcon = favoriteBtn.querySelector('i');
    const isFavorite = favorites.some(fav => fav.text === currentQuote?.text);
    
    if (isFavorite) {
      heartIcon.className = 'fas fa-heart';
      favoriteBtn.style.background = '#ff90b3';
    } else {
      heartIcon.className = 'far fa-heart';
      favoriteBtn.style.background = '#b0e0ff';
    }
  }

  // Toggle favorite status
  function toggleFavorite() {
    if (!currentQuote) return;
    
    const index = favorites.findIndex(fav => fav.text === currentQuote.text);
    
    if (index === -1) {
      // Add to favorites
      favorites.push(currentQuote);
      showToast('Added to favorites! 💖');
    } else {
      // Remove from favorites
      favorites.splice(index, 1);
      showToast('Removed from favorites');
    }
    
    // Save to localStorage
    localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
    
    // Update button appearance
    updateFavoritesButton();
    
    // Refresh favorites display if visible
    if (favoritesContainer.style.display === 'block') {
      showFavorites();
    }
  }

  // Share quote
  function shareQuote() {
    if (!currentQuote) return;
    
    const text = `"${currentQuote.text}" - ${currentQuote.author}`;
    
    if (navigator.share) {
      // Web Share API is supported
      navigator.share({
        title: 'Inspirational Quote',
        text: text,
        url: window.location.href
      })
      .catch(err => {
        console.log('Error sharing:', err);
        copyToClipboard(text);
      });
    } else {
      // Fallback to copying to clipboard
      copyToClipboard(text);
    }
  }

  // Copy text to clipboard
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
      .then(() => {
        showToast('Copied to clipboard! 📋');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
        showToast('Failed to copy to clipboard');
      });
  }

  // Show favorites
  function showFavorites() {
    if (favorites.length === 0) {
      favoritesContainer.style.display = 'none';
      return;
    }
    
    favoritesContainer.style.display = 'block';
    favoritesList.innerHTML = '';
    
    favorites.forEach((quote, index) => {
      const quoteEl = document.createElement('div');
      quoteEl.className = 'quote-container';
      quoteEl.innerHTML = `
        <p class="quote-text">"${quote.text}"</p>
        <p class="quote-author">- ${quote.author}</p>
        <button class="remove-favorite" data-index="${index}">
          <i class="fas fa-times"></i> Remove
        </button>
      `;
      favoritesList.appendChild(quoteEl);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-favorite').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        favorites.splice(index, 1);
        localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
        showFavorites();
        updateFavoritesButton();
        showToast('Removed from favorites');
      });
    });
  }

  // Event listeners
  newQuoteBtn.addEventListener('click', showRandomQuote);
  favoriteBtn.addEventListener('click', toggleFavorite);
  shareBtn.addEventListener('click', shareQuote);

  // Initialize the app
  init();