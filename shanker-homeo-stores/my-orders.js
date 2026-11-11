// Backend API configuration
const API_URL = (typeof API_CONFIG !== 'undefined' && API_CONFIG) ? API_CONFIG.apiUrl : null;

// Fallback to localStorage if backend is not available
const USE_LOCALSTORAGE_FALLBACK = !API_URL;

// Get current user
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    checkAuthStatus();
    loadOrders();
});

// Check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('currentUser');
    if (!token && !storedUser) {
        const ordersList = document.getElementById('ordersList');
        if (ordersList) {
            ordersList.innerHTML = '<div class="empty-orders"><h2>Please login to view your orders</h2><button class="info-btn" onclick="window.location.href=\'login.html\'">Login</button></div>';
        }
    }
}

// Load orders from backend or localStorage
async function loadOrders() {
    const token = localStorage.getItem('token');
    const ordersList = document.getElementById('ordersList');

    if (!ordersList) return;

    if (API_URL && token) {
        try {
            const response = await fetch(`${API_URL}/orders/my-orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                const orders = data.orders || [];

                if (orders.length > 0) {
                    ordersList.innerHTML = '';
                    orders.forEach(order => {
                        const orderCard = createOrderCard(order);
                        ordersList.appendChild(orderCard);
                    });
                    return;
                }
            }
        } catch (error) {
            console.warn('Backend unavailable for orders, checking local orders:', error.message);
        }
    }

    // Fallback to local storage
    loadLocalStorageOrders(ordersList);
}

// Load orders from localStorage (fallback)
function loadLocalStorageOrders(ordersList) {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!storedUser && allOrders.length === 0) {
        ordersList.innerHTML = '<div class="empty-orders"><h2>Please login to view your orders</h2><button class="info-btn" onclick="window.location.href=\'login.html\'">Login</button></div>';
        return;
    }

    let userOrders = allOrders;
    if (storedUser && storedUser.email) {
        const filtered = allOrders.filter(order => order.customerEmail === storedUser.email);
        if (filtered.length > 0) {
            userOrders = filtered;
        }
    }

    if (userOrders.length === 0) {
        ordersList.innerHTML = '<div class="empty-orders"><h2>No orders yet</h2><p>Start shopping to see your orders here!</p><button class="info-btn" onclick="window.location.href=\'index.html\'">Browse Products</button></div>';
        return;
    }

    ordersList.innerHTML = '';

    // Show newest orders first
    userOrders.slice().reverse().forEach(order => {
        const orderCard = createOrderCard(order);
        ordersList.appendChild(orderCard);
    });
}

// Create order card
function createOrderCard(order) {
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';

    const statusClass = `status-${order.status}`;
    const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);

    // Format date
    const orderDate = new Date(order.created_at).toLocaleString();

    // Build order items HTML
    const itemsHtml = order.items.map(item => `
        <div class="order-item">
            <div class="item-details">
                <div class="item-name">${item.medicine_name}</div>
                <div class="item-quantity">Qty: ${item.quantity}</div>
            </div>
            <div class="item-price">₹${item.price * item.quantity}</div>
        </div>
    `).join('');

    orderCard.innerHTML = `
        <div class="order-header">
            <div>
                <div class="order-id">Order ID: ${order.order_id}</div>
                <div class="order-date">Placed on: ${orderDate}</div>
            </div>
            <div style="display: flex; gap: 1rem; align-items: center;">
                <span class="order-status ${statusClass}">${statusText}</span>
                <div class="order-otp">OTP: ${order.otp}</div>
            </div>
        </div>

        <div class="payment-info">
            <strong>Payment Method:</strong> ${order.payment_method === 'cash_delivery' ? '💵 Cash on Delivery' : '📱 Online Payment'}
            <span style="margin-left: 1rem; color: ${order.payment_status === 'paid' ? '#28a745' : '#ffc107'};">(${order.payment_status === 'paid' ? 'Paid' : 'Pending'})</span>
        </div>

        <div class="order-items">
            ${itemsHtml}
        </div>

        <div class="order-total">
            Total: ₹${order.total}
        </div>
    `;

    return orderCard;
}