document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Bar Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close nav on link click (for mobile)
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // --- Hero Image Slider ---
    const heroImages = document.querySelectorAll('.hero-images img');
    let currentImageIndex = 0;

    function showNextImage() {
        heroImages[currentImageIndex].classList.remove('active-image');
        currentImageIndex = (currentImageIndex + 1) % heroImages.length;
        heroImages[currentImageIndex].classList.add('active-image');
    }

    // Initialize first image as active
    if (heroImages.length > 0) {
        heroImages[0].classList.add('active-image');
        setInterval(showNextImage, 4000); // Change image every 4 seconds
    }

    // --- Skill Detail Hover/Click Effect ---
    const skillItems = document.querySelectorAll('.skill-item');
    const skillDetails = document.querySelectorAll('.skill-detail');

    skillItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Remove highlight from all skill items
            skillItems.forEach(s => s.classList.remove('highlighted-skill'));
            // Hide all skill detail boxes
            skillDetails.forEach(d => {
                d.style.display = 'none';
                d.style.opacity = '0';
                d.style.transform = 'translateY(10px)';
            });

            // Highlight the clicked skill
            item.classList.add('highlighted-skill');

            // Find the corresponding skill detail for this category
            const skillCategory = item.closest('.skill-category');
            if (skillCategory) {
                const detailBox = skillCategory.querySelector('.skill-detail');
                if (detailBox) {
                    detailBox.textContent = item.dataset.detail;
                    detailBox.style.display = 'block'; // Make it visible
                    setTimeout(() => { // Trigger transition after display block
                        detailBox.style.opacity = '1';
                        detailBox.style.transform = 'translateY(0)';
                    }, 10); // Small delay to allow display property to apply
                }
            }
        });
    });

    // --- Certificates Slider ---
    const certificateItems = document.querySelectorAll('.certificate-item');
    const prevCertBtn = document.getElementById('prevCert');
    const nextCertBtn = document.getElementById('nextCert');
    let currentCertIndex = 0;

    function showCertificate(index) {
        certificateItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active-cert');
            } else {
                item.classList.remove('active-cert');
            }
        });
    }

    if (certificateItems.length > 0) {
        showCertificate(currentCertIndex); // Show the first certificate initially
    }

    prevCertBtn.addEventListener('click', () => {
        currentCertIndex = (currentCertIndex - 1 + certificateItems.length) % certificateItems.length;
        showCertificate(currentCertIndex);
    });

    nextCertBtn.addEventListener('click', () => {
        currentCertIndex = (currentCertIndex + 1) % certificateItems.length;
        showCertificate(currentCertIndex);
    });

    // --- Theme Switcher ---
    const themeSwitcher = document.querySelector('.theme-switcher');
    const body = document.body;
    const themeIcon = themeSwitcher.querySelector('i');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark-mode') {
        body.classList.add('dark-mode');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    } else {
        body.classList.remove('dark-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeSwitcher.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark-mode');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        } else {
            localStorage.setItem('theme', 'light-mode');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    });

    // --- Coding Achievements: Manual Update Modal ---
    const editStatsBtns = document.querySelectorAll('.edit-stats-btn');
    const modal = document.getElementById('manual-update-modal');
    const closeModalBtn = document.querySelector('.modal .close-button');
    const updateStatsForm = document.getElementById('update-stats-form');
    const platformDisplayName = document.getElementById('platform-display-name');
    const problemsSolvedInput = document.getElementById('problems-solved-input');
    const ratingInput = document.getElementById('rating-input');

    let currentCardElement = null; // To keep track of which card is being edited

    editStatsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentCardElement = btn.closest('.coding-profile-card');
            const platform = btn.dataset.platform; // e.g., 'leetcode', 'geeksforgeeks'

            platformDisplayName.value = currentCardElement.querySelector('h3').textContent;

            const problemsSolvedSpan = currentCardElement.querySelector('.problems-solved');
            problemsSolvedInput.value = problemsSolvedSpan ? problemsSolvedSpan.textContent : '';

            // Handle different stat fields based on platform
            let ratingValue = '';
            if (platform === 'leetcode' || platform === 'codeforces' || platform === 'codechef') {
                const ratingSpan = currentCardElement.querySelector('.contest-rating') || currentCardElement.querySelector('.max-rating');
                ratingValue = ratingSpan ? ratingSpan.textContent : '';
            } else if (platform === 'geeksforgeeks') {
                const rankSpan = currentCardElement.querySelector('.overall-rank');
                ratingValue = rankSpan ? rankSpan.textContent : '';
            } else if (platform === 'codestudio') {
                const coursesSpan = currentCardElement.querySelector('.courses-completed');
                ratingValue = coursesSpan ? coursesSpan.textContent : '';
            } else if (platform === 'codolio') {
                const totalContestSpan = currentCardElement.querySelector('.total-contest');
                ratingValue = totalContestSpan ? totalContestSpan.textContent : '';
            }
            ratingInput.value = ratingValue;

            modal.classList.add('active'); // Show modal
        });
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active'); // Hide modal
    });

    // Close modal if clicked outside content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    updateStatsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (currentCardElement) {
            const problemsSolvedSpan = currentCardElement.querySelector('.problems-solved');
            if (problemsSolvedSpan) {
                problemsSolvedSpan.textContent = problemsSolvedInput.value;
            }

            const platform = currentCardElement.id; // Get platform ID from the card's ID
            if (platform === 'leetcode') {
                currentCardElement.querySelector('.contest-rating').textContent = ratingInput.value;
            } else if (platform === 'geeksforgeeks') {
                currentCardElement.querySelector('.overall-rank').textContent = ratingInput.value;
            } else if (platform === 'codeforces') {
                currentCardElement.querySelector('.max-rating').textContent = ratingInput.value;
            } else if (platform === 'codestudio') {
                currentCardElement.querySelector('.courses-completed').textContent = ratingInput.value;
            } else if (platform === 'codechef') {
                currentCardElement.querySelector('.max-rating').textContent = ratingInput.value;
            } else if (platform === 'codolio') {
                currentCardElement.querySelector('.total-contest').textContent = ratingInput.value;
            }
        }

        modal.classList.remove('active'); // Hide modal after update
        alert('Stats updated successfully (locally)!'); // Inform user
    });
});