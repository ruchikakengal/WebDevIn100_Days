
function incrementQuantity(index) {
    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    cart[index].quantity += 1;
    localStorage.setItem('cartItems', JSON.stringify(cart));
    displayCartItems();
}

function decrementQuantity(index) {
    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        localStorage.setItem('cartItems', JSON.stringify(cart));
        displayCartItems();
    } else {
        removeItem(index);
    }
}

function calculateTotalPrice() {
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    let totalPrice = 0;
    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
    });
    document.getElementById('total-price').textContent = `Total: ₹${totalPrice}`;
}

// Display cart items in the checkout table
function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];// Get cart items from localStorage
    const tableBody = document.getElementById('cart-items-table-body');// Get the table body where items will be listed
    tableBody.innerHTML = '';
    
    // Loop through each item in the cart and create a table row
    cart.forEach((item, index) => {
        const itemTotalPrice = item.price * item.quantity;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}" width="75" height="50" class="cart-item-image"></td>
            <td>${item.name}</td>
            <td>${item.meal_type}</td>
            <td>₹${itemTotalPrice}</td>
            <td>
                <button class="quantity-btn" onclick="decrementQuantity(${index})">-</button>
                ${item.quantity}
                <button class="quantity-btn" onclick="incrementQuantity(${index})">+</button>
            </td>
            <td><button class="remove-btn" onclick="removeItem(${index})">Remove</button></td>
        `;
        tableBody.appendChild(row);
    });

    calculateTotalPrice();
}

// Proceed to checkout (just for demonstration)
function checkout() {
    const cart = JSON.parse(localStorage.getItem('cartItems')) || []; // Get the current cart items
    if (cart.length === 0) {
        alert('Your cart is empty!');
    } else {
        alert('Proceeding to checkout...');
        // You can redirect the user to a payment page or handle checkout logic here
    }
}

// Remove item from cart
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];// Get the current cart items
    cart.splice(index, 1); // Remove the item at the given index
    localStorage.setItem('cartItems', JSON.stringify(cart)); // Update the cart in localStorage
    displayCartItems(); // Re-render the table
    calculateTotalPrice();
}

// Clear the entire cart
function clearCart() {
    localStorage.removeItem('cartItems'); // Remove cart items from localStorage
    displayCartItems();// Re-render the empty table
    calculateTotalPrice();
}


// Display cart items when the page loads
window.onload = displayCartItems;
