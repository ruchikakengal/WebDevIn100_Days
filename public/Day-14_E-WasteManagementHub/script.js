document.addEventListener('DOMContentLoaded', () => {
    // Learn more button
    const learnMore = document.getElementById('learnMore');
    learnMore.addEventListener('click', () => {
      document.getElementById('definition').scrollIntoView({ 
        behavior: 'smooth' 
      });
    });
  
    // Form handling
    const form = document.getElementById('collaborateForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your interest in e-waste management! We will be in touch soon.');
      form.reset();
    });
  
    // Add animation for timeline items
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);
  
    // Apply initial styles and then observe
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
      item.style.opacity = 0;
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(item);
    });
  
    // Same for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.style.opacity = 0;
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(card);
    });
  });