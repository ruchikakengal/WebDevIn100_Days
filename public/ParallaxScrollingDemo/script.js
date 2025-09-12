const title = document.querySelector('.title')
const leaf1 = document.querySelector('.leaf1')
const leaf2 = document.querySelector('.leaf2')
const bush2 = document.querySelector('.bush2')
const mount1 = document.querySelector('.mount1')
const mount2 = document.querySelector('.mount2')

document.addEventListener('scroll', function() {
    let value = window.scrollY
    // console.log(value)
    title.style.marginTop = value * 1.1 + 'px'

    leaf1.style.marginLeft = -value + 'px'
    leaf2.style.marginLeft = value + 'px'

    bush2.style.marginBottom = -value + 'px'

    mount1.style.marginBottom = -value * 1.1 + 'px'
    mount2.style.marginBottom = -value * 1.2 + 'px'
})
 // Smooth-scroll to sections referenced by class via data-target
const navLinks = document.querySelectorAll('header nav a[data-target], .scroll-btn[data-target]');

function scrollToClass(targetClass) {
  const section = document.querySelector(`.${targetClass}`);
  if (!section) return;

  // If your header overlays content, offset by its height
  const header = document.querySelector('header');
  const headerStyles = header ? getComputedStyle(header) : null;
  const overlays = header && (headerStyles.position === 'fixed' || headerStyles.position === 'sticky' || headerStyles.position === 'absolute');
  const offset = overlays ? header.offsetHeight : 0;

  const top = section.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();               // stop the default "#" jump
    const target = link.dataset.target;
    if (target) scrollToClass(target);
  });
});


// Scroll to Top Button
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
