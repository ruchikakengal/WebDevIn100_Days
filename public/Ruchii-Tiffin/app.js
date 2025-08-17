// Loader Javascript
// Wait for the entire page to load
window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    const mainContent = this.document.getElementById('main-content');

    preloader.classList.add('hidden'); // Add the class to hide the loader

    //Remove the loader after the transition
    preloader.addEventListener('transitionend',() => {preloader.classList.add('removed');
    });

    mainContent.classList.add('visible')
  });


// Debounce function to limit how often a function can run
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        let context = this, args = arguments;
        let later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Function to handle intersection and apply animation
const menuItems = document.querySelectorAll(".menu-item");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    } else {
      entry.target.classList.remove("visible"); // Remove class to allow re-trigger
    }
  });
});

// Observe each menu item
menuItems.forEach((item) => observer.observe(item));

// Get the button
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Show or hide the button based on scroll position
function scrollFunction() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollToTopBtn.style.display = "block"; // Changed 'flex' to 'block'
    } else {
        scrollToTopBtn.style.display = "none";
    }
}

// Add the event listener to trigger the scrollFunction when the user scrolls
window.onscroll = function() {
    scrollFunction();
};






//navbar meal plan seciton 
document.addEventListener('DOMContentLoaded', function () {
    // Get all dropdown toggles
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    // Add event listeners to each toggle
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default behavior of anchor tags
            
            // Close any open dropdowns except the one clicked
            dropdownToggles.forEach(otherToggle => {
                if (otherToggle !== toggle) {
                    otherToggle.nextElementSibling.classList.remove('show');
                    otherToggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle the current dropdown
            const dropdownMenu = toggle.nextElementSibling;
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded) {
                dropdownMenu.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
            } else {
                dropdownMenu.classList.add('show');
                toggle.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (e) {
        dropdownToggles.forEach(toggle => {
            const dropdownMenu = toggle.nextElementSibling;
            if (!toggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
});



  
  

// Attach the debounced scroll function to the window scroll event
window.addEventListener('scroll', debounce(scrollFunction, 20));

// Scroll to top smoothly when the button is clicked
scrollToTopBtn.addEventListener("click", function(){
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

