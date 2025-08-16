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
    let currentUser = null;
    try {
        const raw = localStorage.getItem('currentUser');
        if (raw && /^[\x20-\x7E]+$/.test(raw)) {
            currentUser = JSON.parse(raw);
        }
    } catch (e) {
        currentUser = null;
    }
    if (currentUser) {
        buttons.innerHTML = `
        <button class="button is-success is-dark has-text-weight-bold">
            <span class="icon">
                <i class="fas fa-user"></i>
            </span>
            <span>Welcome ${currentUser.fullName}</span>
        </button>
        <button class="button is-danger is-dark" id='logout'>
            <span class="icon">
                <i class="fas fa-sign-out-alt"></i>
            </span>
            <span>Logout</span>
        </button>
        <a class="button is-primary is-dark" href="https://github.com/ruchikakengal">
            <span class="icon">
                <i class="fab fa-github"></i>
            </span>
            <span>GitHub</span>
        </a>
        <a class="button is-primary is-dark" href="contributors.html">
            <span class="icon">
                <i class="fas fa-users"></i>
            </span>
            <span>Contributors</span>
        </a>`;

        document.getElementById('logout').addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            updateNavbar();
            // Optional: Redirect to home page after logout
            window.location.reload();
        });
    } else {
        buttons.innerHTML = `
        <a class="button is-primary is-dark" href="contributors.html">
            <span class="icon">
                <i class="fas fa-users"></i>
            </span>
            <span>Contributors</span>
        </a>
        <a class="button is-primary is-dark" href="https://github.com/ruchikakengal">
            <span class="icon">
                <i class="fab fa-github"></i>
            </span>
            <span>GitHub</span>
        </a>
        <a class="button is-success is-light" href="/public/Login.html">
            <span class="icon">
                <i class="fas fa-sign-in-alt"></i>
            </span>
            <span>Log in</span>
        </a>`;
    }
}

// Populate the table with project data
//function fillTable() {
    //const data = [
       // ["Day 1", "To-Do List", "/public/Day-1_TodoList/index.html"],
       // ["Day 2", "Digital Clock", "/public/Day-2_digital_clock/digitalclock.html"],
       // ["Day 3", "ASCII Art Generator", "/public/Day-3_AsciiArtGenerator/index.html"],
       // ["Day 4", "Password Strength Visualizer", "/public/Day-4_password_visualizer/index.html"],
       // ["Day 5", "Physics Simulation", "/public/Day-5_physics_simulation/index.html"],
       // ["Day 6", "Quote Generator", "/public/Day-6_QuoteGenerator/index.html"],
       // ["Day 7", "Character Word Counter", "/public/Day-7_CharacterWordCounter/index.html"],
        //["Day 8", "Dice Roll Simulator", "/public/Day-8_DiceRollSimulator/index.html"],
        //["Day 9", "Guess My Number", "/public/Day-9_Guess_My_Number/index.html"],
        //["Day 10", "Brick Breaker", "/public/Day-10_Neon_Brick_Breaker/index.html"],
        //["Day 11", "WeatherApp", "/public/Day-11_WeatherApp/index.html"],
        //["Day 12", "Countdown Banner", "https://countdown-banner.vercel.app/"], /* folder Not there */
        //["Day 13", "Coin Flip Heads/Tails", "/public/Day-13_Coin_Flip/index.html"],
        //["Day 14", "E-waste Management Hub", "https://e-waste-management-hub.netlify.app/"],
        //["Day 15", "Currency Converter", "/public/Day-15_Currency_Converter/index.html"],
        //["Day 16", "Random User Generator", "/public/Day-16_Random_User_Generator/index.html"],
        //["Day 17", "Image Search App", "/public/Day-17_Image_Search_App/index.html"],
        //["Day 18", "WaterMedic", "https://github.com/dipmanmajumdar/WaterMedic"], /* folder Not there */
        //["Day 19", "URL Shortener", "https://github.com/ANTIK-007/URL-Shortener"], /* folder Not there */
        //["Day 20", "TicTacToe Game", "/public/Day-20_tictactoe/index.html"],
        //["Day 21", "Candy Crush", "public/Day-21_candycrush/candy_crush.html"],
        //["Day 22", "QR Code Generator", "/public/Day-22_QRCodeGenerator/index.html"],
        //["Day 23", "Palette Generator", "public/Day-22_Palette_generator/index.html"],
        //["Day 24", "Palette Generator", "public/Day-22_Palette_generator/index.html"],
        //["Day 25", " Portfolio", " https://priyacodesarts.netlify.app/"],
        //["Day 26", "GiggleBits", "public/GiggleBits/index.html"],
        //["Day 28", "Target Reflex Test", "public/Day-28_Target_Reflex_Test/index.html"],
        //["Day 29", "Snake And Ladder Game", "public/Snake-and-Ladder-Game/index.html"],
        //["Day 30", "Note Taker", "public/Day-42_NoteTaker/index.html"],

        //["Day 31", "👾Alien Hunt", "public/Day-31/index.html"],
        //["Day 32","Rock Paper Scissor Game" ,"public/Day-23_RockPaperScissor/index.html" ],
        //["Day 34", "Colour Picker", "public/Day-34-Colour_picker/index.html"],
        //["Day 32","Drawing" ,"public/Day-35-Drawing/index.html" ],
        //["Day 33", "Etch-a-Sketch" ,"./public/Etch-a-Sketch/index.html"],
         // ["Day 34"," Periodic Table", "https://learn-periodic-table.netlify.app/"],
          //["Day 35", "Book Recommendation", "https://book-recomendation.netlify.app/"],
          //["Day 36", "World Clock", "public/World_Clock/index.html"],
          //["Day36", "World Clock", "public/World_Clock/index.html"],
          //["Day 38", "Gradient Generator", "public/Gradient_Generator/index.html"],
          //["Day 40", "Space War Game", "./public/Space-War-Game/index.html"],
          //["Day 42", "Student Grade Analyzer", "./public/Student_Grade_Analyzer/index.html"],
          //["Day 44", "Notes App", "./public/Day-36_Notes_App/index.html"],
          //["Day 46", "Mood Based Music Suggester", "./public/Mood_Music_Suggester/index.html"],
          //["Day 47", "Pomodoro App", "/public/Day-47_Pomodoro-app/index.html"],
          //["Day 48", "Space Jumper Game", "./public/Space-Jumper-Game/index.html"],
          //["Day 49", "CalRace", "./public/Day-45/index.html"],
          //["Day 50", "BMI Calculator", "./public/Day-50_BMI_Calculator_Tanu/index.html"],
          //["Day 51", "Chess", "/public/Day-51/index.html"],
          //["Day 52", "E-Commerce_UI", "public/Day52_E-Commerce_UI/index.html"],
          //["Day 53", "Word Guess Game"," public/Day53-Word-Guess-Game/index.html"],

          //["Day 57", "4 in a Row", "public/Day-57_4_in_a_row/index.html"],

          //["Day 58", "Budget Tracker", "public/Budget-Tracker/index.html"],

        //["Day 70", "Memory Game App", "./public/Memory Game App/index.html"],
  
        // ["Day 75", "MyPaint", "public/day75-mypaint/index.html"],

  
// See in Script Folder in app.js (where you can add your poject)];




    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

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

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    fillTable();
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



