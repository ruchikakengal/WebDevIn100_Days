// Update Navbar for Login Status
const buttons = document.getElementsByClassName('buttons')[0];

function updateNavbar() {
    const username = localStorage.getItem('username');
    if (username) {
        buttons.innerHTML = `
            <button class="button is-success is-dark has-text-weight-bold">
                Welcome ${username}
            </button>
            <button class="button is-danger is-dark" id="logout">
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
        `;
    }
}

// Search/filter functionality
function filterProjects() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const rows = document.querySelector('tbody').querySelectorAll('tr');
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

    const noProjectsMessage = document.getElementById('no-projects');
    if (hasResults) {
        noProjectsMessage.style.display = 'none';
    } else {
        noProjectsMessage.style.display = 'block';
    }
}

// Populate the table with project data
function fillTable() {
    const data = [
        ["Day 1",  "To-Do List",                                   "./public/TO_DO_LIST/todolist.html"],
        ["Day 2",  "Digital Clock",                                 "./public/digital_clock/digitalclock.html"],
        ["Day 3",  "Snake Game",                                    "./public/snake/snake.html"],
        ["Day 4",  "ASCII Art Generator (by Amaan Syed)",          "./public/AsciiArtGenerator/index.html"],
        ["Day 5",  "Physics Simulation (by Vishisht Dwivedi)",     "./public/physics_simulation/index.html"],
        ["Day 6",  " ",                                            ""],
        ["Day 7",  " ",                                            ""],
        ["Day 8",  " ",                                            ""],
        ["Day 9",  " ",                                            ""],
        ["Day 10", " ",                                            ""],
        ["Day 11", " ",                                            ""],
        ["Day 12", " ",                                            ""],
        ["Day 13", " ",                                            ""],
        ["Day 14", " ",                                            ""],
        ["Day 100"," ",                                            ""]
    ];

    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // clear any existing rows

    data.forEach(([day, name, href]) => {
        const row = document.createElement('tr');
        const daysCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const linkCell = document.createElement('td');
        const a = document.createElement('a');

        daysCell.innerText = day;
        nameCell.innerText = name;
        nameCell.classList.add('project-name');

        if (href) {
            a.href = href;
            a.innerText = 'Here';
            a.target = '_blank';
            linkCell.appendChild(a);
        }

        row.appendChild(daysCell);
        row.appendChild(nameCell);
        row.appendChild(linkCell);
        tbody.appendChild(row);
    });
}

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    themeToggle.textContent = '☀️';
} else {
    body.classList.add('light-theme');
    themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
        body.classList.replace('dark-theme', 'light-theme');
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.replace('light-theme', 'dark-theme');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
});

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    fillTable();
    document.getElementById('searchButton').addEventListener('click', filterProjects);
    document.getElementById('searchInput').addEventListener('keyup', filterProjects);
});
