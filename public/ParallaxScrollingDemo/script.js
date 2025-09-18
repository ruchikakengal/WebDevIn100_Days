// Parallax effect
const title = document.querySelector('.title');
const leaf1 = document.querySelector('.leaf1');
const leaf2 = document.querySelector('.leaf2');
const bush2 = document.querySelector('.bush2');
const mount1 = document.querySelector('.mount1');
const mount2 = document.querySelector('.mount2');

document.addEventListener('scroll', () => {
  let value = window.scrollY;
  title.style.marginTop = value * 1.1 + 'px';
  leaf1.style.marginLeft = -value + 'px';
  leaf2.style.marginLeft = value + 'px';
  bush2.style.marginBottom = -value + 'px';
  mount1.style.marginBottom = -value * 1.1 + 'px';
  mount2.style.marginBottom = -value * 1.2 + 'px';
});

// Smooth scroll
const navLinks = document.querySelectorAll('header nav a[data-target]');
function scrollToSection(targetClass) {
  const section = document.querySelector(`.${targetClass}`);
  if (!section) return;
  const header = document.querySelector('header');
  const offset = header.offsetHeight;
  const top = section.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.dataset.target;
    if (target) scrollToSection(target);
  });
});

// Scroll to top button
const scrollTopBtn = document.getElementById("scrollTopBtn");
window.addEventListener("scroll", () => {
  scrollTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
});
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
