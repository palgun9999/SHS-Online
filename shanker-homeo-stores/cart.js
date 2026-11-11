// Backend API configuration
const API_URL = (typeof API_CONFIG !== 'undefined' && API_CONFIG) ? API_CONFIG.apiUrl : null;

// Fallback to localStorage if backend is not available
const USE_LOCALSTORAGE_FALLBACK = !API_URL;

// Cart functionality (still using localStorage for web version)
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    loadCart();
    checkAuthStatus();
});

// Check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('currentUser');
    if (!token && !storedUser) {
        // Show login prompt
        const cartSummary = document.querySelector('.cart-summary');
        if (cartSummary) {
            cartSummary.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <h3 style="color: #006064; margin-bottom: 1rem;">Login Required</h3>
                    <p style="color: #666; margin-bottom: 1.5rem;">Please login to place your order</p>
                    <button onclick="window.location.href='login.html'" style="padding: 1rem 2rem; background: linear-gradient(135deg, #00838f 0%, #006064 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Login</button>
                </div>
            `;
        }
    }
}

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
    const upiId = 'shankarhomoeostores@okhdfcbank';
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
    if (!cartContainer) return;

    cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🛒</div>
                <h3 style="color: #006064; margin-bottom: 0.5rem;">Your cart is empty</h3>
                <p style="color: #666; margin-bottom: 1.5rem;">Add some products to your cart</p>
                <button onclick="window.location.href='index.html'" style="padding: 1rem 2rem; background: linear-gradient(135deg, #00838f 0%, #006064 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Browse Products</button>
            </div>
        `;
        return;
    }

    cartContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const cartItem = createCartItem(item, index);
        cartContainer.appendChild(cartItem);
    });

    updateCartSummary();
    setupPaymentOptions();
}

// Create cart item element
function createCartItem(item, index) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';

    const mainImage = item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/80x80?text=No+Image';

    cartItem.innerHTML = `
        <img src="${mainImage}" alt="${item.medicine_name}" class="item-image" onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'">
        <div class="item-details">
            <div class="item-name">${item.medicine_name}</div>
            <div class="item-brand">${item.brand_name}</div>
            <div class="item-price">₹${item.price}</div>
        </div>
        <div class="quantity-controls">
            <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
            <span class="qty-display">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${index})">🗑️</button>
    `;

    return cartItem;
}

// Update quantity
function updateQuantity(index, change) {
    const item = cart[index];
    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
        removeFromCart(index);
        return;
    }

    if (newQuantity > item.maxQuantity) {
        alert('Cannot add more than available stock');
        return;
    }

    item.quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');

    if (subtotalElement) subtotalElement.textContent = `₹${subtotal}`;
    if (shippingElement) shippingElement.textContent = `₹${shipping}`;
    if (totalElement) totalElement.textContent = `₹${total}`;
}

// Checkout alias called by cart.html
function checkout() {
    placeOrder();
}

// Place order with backend API or localStorage fallback
async function placeOrder() {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!token && !storedUser) {
        alert('Please login to place your order');
        window.location.href = 'login.html';
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'cash_delivery';
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const orderData = {
        orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        customerName: storedUser?.name || 'Valued Customer',
        customerEmail: storedUser?.email || 'customer@example.com',
        customerMobile: storedUser?.mobile || '',
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString(),
        items: cart.map(item => ({
            productId: item.id,
            medicine_name: item.medicine_name,
            brand_name: item.brand_name || 'Shankar Homeo',
            price: item.price,
            quantity: item.quantity
        })),
        total: totalAmount,
        totalAmount: totalAmount,
        paymentMethod: paymentMethod,
        otp: Math.floor(1000 + Math.random() * 9000).toString(),
        status: 'placed'
    };

    // If API is configured and token is present, try backend first
    if (API_URL && token) {
        try {
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const data = await response.json();
                const savedOrder = data.order || orderData;
                finishOrder(savedOrder);
                return;
            }
        } catch (error) {
            console.warn('Backend order failed, falling back to local storage:', error.message);
        }
    }

    // LocalStorage order persistence fallback
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    allOrders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(allOrders));
    finishOrder(orderData);
}

// Complete order process
function finishOrder(order) {
    // Clear cart
    localStorage.removeItem('cart');
    cart = [];

    // Store order details for confirmation page
    localStorage.setItem('lastOrder', JSON.stringify(order));

    // Redirect to order confirmation
    window.location.href = 'order-confirmation.html';
}