// responsive nav
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
menuBtn.addEventListener('click', ()=> {
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  nav.style.flexDirection = 'column';
  nav.style.gap = '0.5rem';
  nav.style.padding = '1rem';
});

// simple form behaviour (no backend)
const form = document.getElementById('signupForm');
const formMsg = document.getElementById('formMsg');
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  if(!name || !email){ formMsg.textContent = 'Please enter name & email'; return; }
  formMsg.textContent = `Thanks ${name}! We'll email you at ${email} when early access opens.`;
  form.reset();
});

// smooth scroll for CTA
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const target = document.querySelector(a.getAttribute('href'));
    if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth'}); }
  });
});
