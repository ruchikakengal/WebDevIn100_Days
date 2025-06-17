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
        } else if (row.id !== 'table-subheader') {
            row.style.display = 'none';
        }
    });

    const subheader = document.querySelector('.subheader');
    const noProjectsMessage = document.getElementById('no-projects');

    if (hasResults) {
        subheader.style.display = 'block';
        noProjectsMessage.style.display = 'none';
    } else {
        document.getElementById('table-subheader').style.display = 'none';
        subheader.style.display = 'none';
        noProjectsMessage.style.display = 'block';
    }
}

// Update Navbar for Login Status
const buttons = document.getElementsByClassName('buttons')[0]; // Refers to the section on NavBar where buttons will get appended based on login status

function updateNavbar() {
    const username = localStorage.getItem('username');
    if (username) {
        buttons.innerHTML = `
            <button class="button is-success is-dark has-text-weight-bold">
                Welcome ${username}
            </button>
            <button class="button is-danger is-dark" id='logout'>
                Logout
            </button>
            <a class="button is-primary is-dark" href="https://github.com/ruchikakengal">
                <strong>GitHub</strong>  
            </a>
            <a class="button is-primary is-dark" href="contributors/contributor.html">
                <strong>Contributors</strong>
            </a>
        `;

        document.getElementById('logout').addEventListener('click', () => {
            localStorage.removeItem('username');
            updateNavbar();
        });
    } else {
        buttons.innerHTML = `
            <a class="button is-primary is-dark" href="contributors/contributor.html">
                <strong>Contributors</strong>
            </a>
            <a class="button is-primary is-dark" href="https://github.com/ruchikakengal">
                <strong>GitHub</strong>
            </a>
            <a class="button is-success is-light" href="/public/Login.html">
                <strong>Log in</strong>
            </a>
            <button class='theme-toggle'>🌙</button>
        `;

        setupThemeToggle(); // Call this after inserting the button
    }
}

// Populate the table with project data
function fillTable() {
    const data = [
        ["Day 1", "To-Do List", "./public/TO_DO_LIST/todolist.html"],
        ["Day 2", "Digital Clock", "./public/digital_clock/digitalclock.html"],
        ["Day 3", "ASCII Art Generator (by Amaan Syed)", "./public/AsciiArtGenerator/index.html",],
        ["Day 4", "Physics Simulation (by Vishisht Dwivedi)", "./public/physics_simulation/index.html"],
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
});

// Apply theme ASAP
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
} else {
    document.body.classList.add('light-theme');
}


function setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    if (!themeToggle) return;

    // Set initial theme
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    } else {
        body.classList.add('light-theme');
        themeToggle.textContent = '🌙';
    }

    // Handle toggle
    themeToggle.addEventListener('click', () => {
        const isDark = body.classList.contains('dark-theme');
        body.classList.toggle('dark-theme', !isDark);
        body.classList.toggle('light-theme', isDark);
        themeToggle.textContent = isDark ? '🌙' : '☀️';
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });
}
