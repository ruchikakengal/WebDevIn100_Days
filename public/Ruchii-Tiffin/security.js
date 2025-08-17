// script.js

// Example: Add a click event listener to the "Get in touch" button
document.addEventListener('DOMContentLoaded', () => {
    const getInTouchBtn = document.querySelector('.get-in-touch-btn');
  
    getInTouchBtn.addEventListener('click', () => {
      // Redirect to the contact page
      window.location.href = 'contactUs.html';
    });
  });