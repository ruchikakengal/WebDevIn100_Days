// Simple visitor management system
let visitors = [];
let currentVisitors = 0;
let todayTotal = 0;

// DOM elements
const visitorForm = document.getElementById('visitor-form');
const visitorList = document.getElementById('visitor-list');
const currentVisitorsEl = document.getElementById('current-visitors');
const todayTotalEl = document.getElementById('today-total');
const lockAllBtn = document.getElementById('lock-all');
const unlockAllBtn = document.getElementById('unlock-all');
const generateReportBtn = document.getElementById('generate-report');
const reportOutput = document.getElementById('report-output');

// Event listeners
visitorForm.addEventListener('submit', checkInVisitor);
lockAllBtn.addEventListener('click', lockAllDoors);
unlockAllBtn.addEventListener('click', unlockAllDoors);
generateReportBtn.addEventListener('click', generateReport);

// Check-in visitor
function checkInVisitor(e) {
    e.preventDefault();
    const name = document.getElementById('visitor-name').value;
    const email = document.getElementById('visitor-email').value;
    const purpose = document.getElementById('visitor-purpose').value;

    const visitor = {
        name,
        email,
        purpose,
        checkInTime: new Date()
    };

    visitors.push(visitor);
    currentVisitors++;
    todayTotal++;
    updateStats();
    displayVisitors();
    visitorForm.reset();
}

// Display visitors
function displayVisitors() {
    visitorList.innerHTML = '';
    visitors.forEach((visitor, index) => {
        const visitorEl = document.createElement('div');
        visitorEl.classList.add('visitor-item');
        visitorEl.innerHTML = `
            <h3>${visitor.name}</h3>
            <p>Email: ${visitor.email}</p>
            <p>Purpose: ${visitor.purpose}</p>
            <p>Check-in Time: ${visitor.checkInTime.toLocaleString()}</p>
            <button onclick="checkOutVisitor(${index})">Check-Out</button>
        `;
        visitorList.appendChild(visitorEl);
    });
}

// Check-out visitor
function checkOutVisitor(index) {
    visitors.splice(index, 1);
    currentVisitors--;
    updateStats();
    displayVisitors();
}

// Update stats
function updateStats() {
    currentVisitorsEl.textContent = currentVisitors;
    todayTotalEl.textContent = todayTotal;
}

// Lock all doors (simulated)
function lockAllDoors() {
    alert('All doors have been locked.');
}

// Unlock all doors (simulated)
function unlockAllDoors() {
    alert('All doors have been unlocked.');
}

// Generate simple report
function generateReport() {
    const report = `
        <h3>Visitor Report</h3>
        <p>Current Visitors: ${currentVisitors}</p>
        <p>Today's Total: ${todayTotal}</p>
        <h4>Visitor List:</h4>
        <ul>
            ${visitors.map(visitor => `<li>${visitor.name} - ${visitor.purpose}</li>`).join('')}
        </ul>
    `;
    reportOutput.innerHTML = report;
}

// Initial display
updateStats();
// Add a search bar to the HTML
// const searchInput = document.getElementById('search-input');

// // Add an event listener to the search input
// searchInput.addEventListener('input', searchVisitors);

// // Define the searchVisitors function
// function searchVisitors() {
//     const searchTerm = searchInput.value.toLowerCase();
//     const filteredVisitors = visitors.filter(visitor => {
//         return visitor.name.toLowerCase().includes(searchTerm) ||
//                visitor.email.toLowerCase().includes(searchTerm) ||
//                visitor.purpose.toLowerCase().includes(searchTerm);
//     });
//     displayVisitors(filteredVisitors);
// }

// // Update the displayVisitors function to accept an optional array of visitors
// function displayVisitors(visitorsArray = visitors) {
//     visitorList.innerHTML = '';
//     visitors}

    