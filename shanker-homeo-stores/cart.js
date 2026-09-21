// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
});

// Setup payment method selection
function setupPaymentOptions() {
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const upiSection = document.getElementById('upiSection');

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'online_now') {
                upiSection.style.display = 'block';
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                document.getElementById('upiAmount').textContent = total;
            } else {
                upiSection.style.display = 'none';
            }
        });
    });
}

// Redirect to UPI app
function redirectToUPI() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('upiAmount').textContent = total;

    // UPI redirect format for mobile
    const upiId = '9844874544@ptyes';
    const name = 'Shankar Homeo Stores';
    const amount = total;
    const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;

    // Redirect to UPI app
    window.location.href = upiString;

    // Also show confirmation after redirect
    setTimeout(() => {
        alert('Opening UPI app to pay ₹' + amount + '. Please complete payment and then place your order.');
    }, 1000);
}

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

        const images = item.images || (item.image ? [item.image] : ['https://via.placeholder.com/100x100?text=No+Image']);
        const firstImage = images[0];

        const cartItem = `
            <div class="cart-item">
                <img src="${firstImage}" alt="${item.medicine_name}" class="item-image" onerror="this.src='https://via.placeholder.com/100x100?text=No+Image'">
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

    // Setup payment options
    setupPaymentOptions();
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

    // Get selected payment method
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    // Generate unique order ID
    const orderId = 'ORD' + Date.now().toString().slice(-8);

    // Generate OTP for order pickup
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Create order object
    const order = {
        orderId: orderId,
        otp: otp,
        customerId: currentUser.email,
        customerName: currentUser.name,
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'online_now' ? 'paid' : 'pending',
        status: 'placed', // placed, ready, completed
        createdAt: new Date().toISOString(),
        acceptedBy: null,
        acceptedAt: null,
        completedAt: null
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Store order details for confirmation page
    localStorage.setItem('lastOrder', JSON.stringify(order));

    // Redirect to order confirmation page
    window.location.href = 'order-confirmation.html';
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
                const images = product.images || (product.image ? [product.image] : ['https://via.placeholder.com/100x100?text=No+Img']);
                cart.push({
                    id: product.id,
                    medicine_name: product.medicine_name,
                    price: product.price,
                    quantity: 1,
                    images: images
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