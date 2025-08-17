document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("dark-mode-toggle");
    const body = document.body;
  
    // Check if dark mode is already enabled in localStorage
    if (localStorage.getItem("darkMode") === "enabled") {
      body.classList.add("dark-mode");
      toggleButton.innerHTML = '<i class="fas fa-sun"></i>'; // Change to sun icon
    }
  
    toggleButton.addEventListener("click", function () {
      body.classList.toggle("dark-mode");
  
      // Save preference in localStorage
      if (body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
        toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
        localStorage.setItem("darkMode", "disabled");
        toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
      }
    });
  });
  