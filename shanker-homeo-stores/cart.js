// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
});

// Load cart items
function loadCart() {
    const cartContainer = document.getElementById('cartItems');
    const summaryContainer = document.getElementById('cartSummary');

    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="empty-cart"><h2>Your cart is empty</h2><p>Add some products to get started!</p><button class="info-btn" onclick="window.location.href=\'products.html\'">Browse Products</button></div>';
        summaryContainer.style.display = 'none';
        return;
    }

    summaryContainer.style.display = 'block';
    cartContainer.innerHTML = '';

    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += item.quantity;

        const cartItem = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.medicine_name}" class="item-image" onerror="this.src='https://via.placeholder.com/100x100?text=No+Image'">
                <div class="item-details">
                    <div class="item-name">${item.medicine_name}</div>
                    <div class="item-price">₹${item.price}</div>
                </div>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <div class="qty-display">${item.quantity}</div>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartContainer.innerHTML += cartItem;
    });

    document.getElementById('subtotal').textContent = `₹${subtotal}`;
    document.getElementById('total').textContent = `₹${subtotal}`;
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Checkout
function checkout() {
    if (!currentUser) {
        alert('Please login to proceed to checkout');
        window.location.href = 'login.html';
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    alert('Proceeding to checkout... (This would integrate with payment gateway in production)');
    // In production, this would redirect to a payment page
}

// Check for intended action after login
window.onload = function() {
    const intendedAction = localStorage.getItem('intendedAction');
    const intendedProductId = localStorage.getItem('intendedProductId');

    if (intendedAction === 'addToCart' && intendedProductId && currentUser) {
        // Add the product to cart
        const allProducts = JSON.parse(localStorage.getItem('stockData')) || [];
        const product = allProducts.find(p => p.id === parseInt(intendedProductId));

        if (product && product.quantity > 0) {
            const existingItem = cart.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    medicine_name: product.medicine_name,
                    price: product.price,
                    quantity: 1,
                    image: product.image
                });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Product added to cart!');
        }

        // Clear intended action
        localStorage.removeItem('intendedAction');
        localStorage.removeItem('intendedProductId');
    }
};