document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.innerHTML = `
            <nav>
                <div class="logo">Notes App</div>
                <ul>
                    <li><a href="index.html" ${isActive('index.html')}>Home</a></li>
                    <li><a href="notes.html" ${isActive('notes.html')}>Notes</a></li>
                    <li><a href="contact.html" ${isActive('contact.html')}>Contact</a></li>
                </ul>
                <button class="dark-mode-toggle" aria-label="Toggle Dark Mode">🌙</button>
            </nav>
        `;
    }

    // Highlight active page
    function isActive(page) {
        return window.location.pathname.includes(page) ? 'class="active"' : '';
    }

    // Dark mode toggle
    const toggleButton = document.querySelector('.dark-mode-toggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        toggleButton.textContent = '☀️';
    }

    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const darkModeEnabled = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', darkModeEnabled);
        toggleButton.textContent = darkModeEnabled ? '☀️' : '🌙';
    });
});