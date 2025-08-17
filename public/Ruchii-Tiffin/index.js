var tl = gsap.timeline()
tl.from(".navbar-brand",{
    delay:0.4,
    opacity:0,
    y:-30,
    duration:1,
})
tl.from(".nav-item",{
    opacity:0,
    y:-30,
    duration:1,
    stagger:0.1
})
// Dark Mode Toggle
document.addEventListener("DOMContentLoaded", function () {
    const toggleSwitch = document.querySelector('#checkbox'); // Match the correct ID
  
    toggleSwitch.addEventListener('change', function () {
      document.body.classList.toggle('dark-mode');
      document.querySelector('.navbar').classList.toggle('dark-mode');
    });
  });
  
  