document.addEventListener('DOMContentLoaded', () => {

    // --- Responsive Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // --- Dynamic Specials ---
    const specialItems = [
        {
            name: 'Grilled Salmon with Asparagus',
            description: 'Perfectly grilled salmon fillet served with fresh asparagus and a lemon-dill sauce.',
            price: '₹1250',
            image: 'images/gallery-2.jpg'
        },
        {
            name: 'Gourmet Beef Burger',
            description: 'Juicy prime beef patty, aged cheddar, crispy bacon, and our signature sauce.',
            price: '₹850',
            image: 'images/burger-frenchfries.png'
        },
        {
            name: 'Chocolate Lava Cake',
            description: 'Warm, rich chocolate cake with a molten center, served with vanilla bean ice cream.',
            price: '₹450',
            image: 'images/desserts.png'
        }
    ];

    const specialsContainer = document.querySelector('.specials-container');
    specialItems.forEach(item => {
        const itemHtml = `
            <div class="menu-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="menu-item-content">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p class="price">${item.price}</p>
                </div>
            </div>
        `;
        specialsContainer.innerHTML += itemHtml;
    });

    // --- Dynamic Full Menu ---
    const menuData = {
        "Starters": [
            { name: "Bruschetta", price: "₹350" },
            { name: "Garlic Bread with Cheese", price: "₹400" },
            { name: "Stuffed Mushrooms", price: "₹450" },
        ],
        "Main Courses": [
            { name: "Spaghetti Carbonara", price: "₹750" },
            { name: "Margherita Pizza", price: "₹650" },
            { name: "Chicken Parmesan", price: "₹900" },
        ],
        "Desserts": [
            { name: "Tiramisu", price: "₹400" },
            { name: "Panna Cotta", price: "₹350" },
        ]
    };

    const menuContainer = document.querySelector('.menu-container');
    for (const category in menuData) {
        let categoryHtml = `<h3 class="menu-category-title">${category}</h3><div class="menu-grid">`;
        menuData[category].forEach(item => {
            categoryHtml += `
                <div class="menu-item">
                    <div class="menu-item-content">
                        <h3>${item.name}</h3>
                        <p class="price">${item.price}</p>
                    </div>
                </div>
            `;
        });
        categoryHtml += `</div>`;
        menuContainer.innerHTML += categoryHtml;
    }


    // --- Booking Form Handling ---
    const bookingForm = document.getElementById('booking-form');
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        alert(`Thank you, ${name}! Your table booking has been received. We will contact you shortly to confirm.`);
        
        bookingForm.reset();
    });
    
    // Set min date for booking to today
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

});