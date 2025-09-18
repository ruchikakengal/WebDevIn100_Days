  const textInput = document.getElementById('text-input');
    const charCount = document.getElementById('char-count');
    const wordCount = document.getElementById('word-count');
    const sentenceCount = document.getElementById('sentence-count');
    const paragraphCount = document.getElementById('paragraph-count');
    const readingTime = document.getElementById('reading-time');
    const characterDensity = document.getElementById('character-density');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const saveBtn = document.getElementById('save-btn');
    const progressBar = document.getElementById('progress-bar');
    const toast = document.getElementById('toast');

    // Initialize
    textInput.focus();

    // Event listener for text input
    textInput.addEventListener('input', updateCounts);

    // Button event listeners
    clearBtn.addEventListener('click', clearText);
    copyBtn.addEventListener('click', copyText);
    saveBtn.addEventListener('click', saveText);

    // Update all counts and statistics
    function updateCounts() {
      const text = textInput.value;
      
      // Character count (including spaces)
      const characters = text.length;
      charCount.textContent = characters;
      
      // Word count
      const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
      wordCount.textContent = words;
      
      // Sentence count
      const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.length > 0).length;
      sentenceCount.textContent = sentences;
      
      // Paragraph count
      const paragraphs = text.trim() === '' ? 0 : text.split(/\n+/).filter(p => p.trim().length > 0).length;
      paragraphCount.textContent = paragraphs;
      
      // Reading time (assuming 225 words per minute)
      const readingTimeMin = Math.ceil(words / 225);
      readingTime.textContent = `Reading time: ${readingTimeMin} min`;
      
      // Character density (most frequent character)
      updateCharacterDensity(text);
      
      // Update progress bar (based on character count with 1000 as max)
      const progress = Math.min((characters / 1000) * 100, 100);
      progressBar.style.width = `${progress}%`;
      
      // Change progress bar color based on progress
      if (progress > 90) {
        progressBar.style.background = 'linear-gradient(90deg, #ff6b6b, #ff5252)';
      } else if (progress > 75) {
        progressBar.style.background = 'linear-gradient(90deg, #ff9e6b, #ff7b52)';
      } else {
        progressBar.style.background = 'linear-gradient(90deg, #6a11cb, #2575fc)';
      }
    }

    // Find the most frequently used character
    function updateCharacterDensity(text) {
      if (text.length === 0) {
        characterDensity.textContent = 'Most used: -';
        return;
      }
      
      // Remove spaces and make lowercase for analysis
      const cleanText = text.replace(/\s+/g, '').toLowerCase();
      
      if (cleanText.length === 0) {
        characterDensity.textContent = 'Most used: -';
        return;
      }
      
      // Count character frequency
      const charCount = {};
      for (let char of cleanText) {
        charCount[char] = (charCount[char] || 0) + 1;
      }
      
      // Find the most frequent character
      let maxChar = '';
      let maxCount = 0;
      
      for (let char in charCount) {
        if (charCount[char] > maxCount) {
          maxCount = charCount[char];
          maxChar = char;
        }
      }
      
      characterDensity.textContent = `Most used: "${maxChar}" (${maxCount} times)`;
    }

    // Clear text area
    function clearText() {
      textInput.value = '';
      updateCounts();
      textInput.focus();
      showToast('Text cleared!');
    }

    // Copy text to clipboard
    function copyText() {
      if (textInput.value.trim() === '') {
        showToast('Nothing to copy!');
        return;
      }
      
      textInput.select();
      document.execCommand('copy');
      showToast('Text copied to clipboard!');
    }

    // Save text to local storage
    function saveText() {
      if (textInput.value.trim() === '') {
        showToast('Nothing to save!');
        return;
      }
      
      localStorage.setItem('savedText', textInput.value);
      showToast('Text saved successfully!');
    }

    // Show toast notification
    function showToast(message) {
      toast.textContent = message;
      toast.classList.add('show');
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2000);
    }

    // Load saved text if available
    window.addEventListener('DOMContentLoaded', () => {
      const savedText = localStorage.getItem('savedText');
      if (savedText) {
        textInput.value = savedText;
        updateCounts();
      }
    });