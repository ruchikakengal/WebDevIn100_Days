window.addEventListener('resize', function () {
    addRequiredClass();
})


function addRequiredClass() {
    if (window.innerWidth < 860) {
        document.body.classList.add('mobile')
    } else {
        document.body.classList.remove('mobile')
    }
}

window.onload = addRequiredClass

//let hamburger = document.querySelector('.hamburger')
let mobileNav = document.querySelector('.nav-list')

let bars = document.querySelectorAll('.hamburger span')

let isActive = false

hamburger.addEventListener('click', function () {
    mobileNav.classList.toggle('open')
    if (!isActive) {
        bars[0].style.transform = 'rotate(45deg)'
        bars[1].style.opacity = '0'
        bars[2].style.transform = 'rotate(-45deg)'
        isActive = true
    } else {
        bars[0].style.transform = 'rotate(0deg)'
        bars[1].style.opacity = '1'
        bars[2].style.transform = 'rotate(0deg)'
        isActive = false
    }


})


// Simple visitor management system
// let visitors = [];
// let currentVisitors = 0;
// let todayTotal = 0;

// // DOM elements
// const visitorForm = document.getElementById('visitor-form');
// const visitorList = document.getElementById('visitor-list');
// const currentVisitorsEl = document.getElementById('current-visitors');
// const todayTotalEl = document.getElementById('today-total');
// const lockAllBtn = document.getElementById('lock-all');
// const unlockAllBtn = document.getElementById('unlock-all');
// const generateReportBtn = document.getElementById('generate-report');
// const reportOutput = document.getElementById('report-output');

// // Event listeners
// visitorForm.addEventListener('submit', checkInVisitor);
// lockAllBtn.addEventListener('click', lockAllDoors);
// unlockAllBtn.addEventListener('click', unlockAllDoors);
// generateReportBtn.addEventListener('click', generateReport);

// // Check-in visitor
// function checkInVisitor(e) {
//     e.preventDefault();
//     const name = document.getElementById('visitor-name').value;
//     const email = document.getElementById('visitor-email').value;
//     const purpose = document.getElementById('visitor-purpose').value;

//     const visitor = {
//         name,
//         email,
//         purpose,
//         checkInTime: new Date()
//     };

//     visitors.push(visitor);
//     currentVisitors++;
//     todayTotal++;
//     updateStats();
//     displayVisitors();
//     visitorForm.reset();
// }

// // Display visitors
// function displayVisitors() {
//     visitorList.innerHTML = '';
//     visitors.forEach((visitor, index) => {
//         const visitorEl = document.createElement('div');
//         visitorEl.classList.add('visitor-item');
//         visitorEl.innerHTML = `
//             <h3>${visitor.name}</h3>
//             <p>Email: ${visitor.email}</p>
//             <p>Purpose: ${visitor.purpose}</p>
//             <p>Check-in Time: ${visitor.checkInTime.toLocaleString()}</p>
//             <button onclick="checkOutVisitor(${index})">Check-Out</button>
//         `;
//         visitorList.appendChild(visitorEl);
//     });
// }

// // Check-out visitor
// function checkOutVisitor(index) {
//     visitors.splice(index, 1);
//     currentVisitors--;
//     updateStats();
//     displayVisitors();
// }

// // Update stats
// function updateStats() {
//     currentVisitorsEl.textContent = currentVisitors;
//     todayTotalEl.textContent = todayTotal;
// }

// // Lock all doors (simulated)
// function lockAllDoors() {
//     alert('All doors have been locked.');
// }

// // Unlock all doors (simulated)
// function unlockAllDoors() {
//     alert('All doors have been unlocked.');
// }

// // Generate simple report
// function generateReport() {
//     const report = `
//         <h3>Visitor Report</h3>
//         <p>Current Visitors: ${currentVisitors}</p>
//         <p>Today's Total: ${todayTotal}</p>
//         <h4>Visitor List:</h4>
//         <ul>
//             ${visitors.map(visitor => `<li>${visitor.name} - ${visitor.purpose}</li>`).join('')}
//         </ul>
//     `;
//     reportOutput.innerHTML = report;
// }

// // Initial display
// updateStats();
const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('.nav-list');

hamburger.addEventListener('click', () => {
    navList.classList.toggle('open');
});