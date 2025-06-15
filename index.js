function filterProjects() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const rows = document.querySelector('tbody').querySelectorAll('tr'); // Choose all rows in the table body
    let hasResults = false;

    rows.forEach(row => {
        const projectName = row.querySelector('.project-name')?.innerText.toLowerCase();

        if (projectName && projectName.includes(filter)) {
            row.style.display = '';
            hasResults = true;
        } else {
            row.style.display = 'none';
        }
    });

    const linksContainer = document.querySelector('.links'); // Get the container for the table
    const noProjectsMessage = document.getElementById('no-projects');

    if (hasResults) {
        linksContainer.style.display = 'block'; // Show the table container
        noProjectsMessage.style.display = 'none'; // Hide the no projects message
    } else {
        linksContainer.style.display = 'none'; // Hide the table container
        noProjectsMessage.style.display = 'block'; // Show the no projects message
    }
}

// Update Navbar for Login Status
const buttons = document.getElementsByClassName('buttons')[0]; // Refers to the section on NavBar where buttons will get appended based on login status

function updateNavbar() {
    const username = localStorage.getItem('username');
    const currentPage = window.location.pathname;

    let contactButton = '';
    if (currentPage.includes('contact.html')) {
        contactButton = `
        <a href="index.html" class="button is-light">
            <span class="icon">
                <i class="fas fa-home"></i>
            </span>
            <span>Home</span>
        </a>`;
    } else {
        contactButton = `
        <a href="contact.html" class="button is-light">
            <span class="icon">
                <i class="fas fa-envelope"></i>
            </span>
            <span>Contact Us</span>
        </a>`;
    }

    if (username) {
        buttons.innerHTML = `
        ${contactButton}
        <button class="button is-success is-dark has-text-weight-bold">
            Welcome ${username}
        </button>
        <button class="button is-danger is-dark" id='logout'>
            Logout
        </button>
        <a class="button is-primary is-dark" href="https://github.com/ruchikakengal" target="_blank">
            <strong>GitHub</strong>  
        </a>
        <a class="button is-primary is-dark" href="contributors/contributor.html">
            <strong>Contributors</strong>
        </a>`;

        document.getElementById('logout').addEventListener('click', () => {
            localStorage.removeItem('username');
            updateNavbar();
        });
    } else {
        buttons.innerHTML = `
        ${contactButton}
        <a class="button is-primary is-dark" href="contributors/contributor.html">
            <strong>Contributors</strong>
        </a>
        <a class="button is-primary is-dark" href="https://github.com/ruchikakengal" target="_blank">
            <strong>GitHub</strong>
        </a>
        <a class="button is-success is-light" href="/public/Login.html">
            <strong>Log in</strong>
        </a>`;
    }
}

// Populate the table with project data
function fillTable() {
    const data = [
        ["Day 1", "To-Do List", " /public/TO_DO_LIST/todolist.html"],
        ["Day 2", "Digital Clock", " /public/digital_clock/digitalclock.html"],
        ["Day 3", " ",],
        ["Day 4", " ",],
        ["Day 5", " ",],
        ["Day 6", " ",],
        ["Day 7", " ",],
        ["Day 8", " ",],
        ["Day 9", " ",],
        ["Day 10", " ",],
        ["Day 11", " ",],
        ["Day 12", " ",],
        ["Day 13", " ",],
        ["Day 14", " ",],
        ["Day 100", " ",],

    ];




    const tbody = document.getElementById('tableBody');

    data.forEach(e => {
        const row = document.createElement('tr');
        const days = document.createElement('td');
        const nameP = document.createElement('td');
        const link = document.createElement('td');
        const a = document.createElement('a');

        days.innerText = e[0];
        nameP.innerText = e[1];
        a.href = e[2];
        a.innerText = 'Here';
        a.target = '_blank'; // Open link in a new tab
        nameP.classList.add('project-name');

        link.appendChild(a);
        row.appendChild(days);
        row.appendChild(nameP);
        row.appendChild(link);

        tbody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    fillTable();

    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    const contributeForm = document.getElementById('contributeForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form submission logic here
        alert('Contact form submitted! (Add your backend logic)');
    });

    contributeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form submission logic here
        alert('Contribution form submitted! (Add your backend logic)');
    });

    // Navbar burger menu toggle
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {
                console.log('Hamburger menu clicked!');
                const target = el.dataset.target;
                const $target = document.getElementById(target);
                console.log('Target element:', $target);
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
                console.log('is-active class toggled on burger:', el.classList.contains('is-active'));
                console.log('is-active class toggled on target:', $target.classList.contains('is-active'));
            });
        });
    }
});

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check if the user has a saved theme preference
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-theme');
  themeToggle.textContent = '☀️';
} else {
  body.classList.add('light-theme');  // Explicitly set light theme
  themeToggle.textContent = '🌙';
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
  if (body.classList.contains('dark-theme')) {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    themeToggle.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
    themeToggle.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  }
});
