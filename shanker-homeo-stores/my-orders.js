// Get current user
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
});

// Load orders
function loadOrders() {
    const ordersList = document.getElementById('ordersList');

    if (!currentUser) {
        ordersList.innerHTML = '<div class="empty-orders"><h2>Please login to view your orders</h2><button class="info-btn" onclick="window.location.href=\'login.html\'">Login</button></div>';
        return;
    }

    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = allOrders.filter(order => order.customerId === currentUser.email);

    if (userOrders.length === 0) {
        ordersList.innerHTML = '<div class="empty-orders"><h2>No orders yet</h2><p>Start shopping to see your orders here!</p><button class="info-btn" onclick="window.location.href=\'products.html\'">Browse Products</button></div>';
        return;
    }

    // Sort orders by date (newest first)
    userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    ordersList.innerHTML = '';

    userOrders.forEach(order => {
        const statusClass = `status-${order.status}`;
        const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);

        const orderCard = `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">Order ID: ${order.orderId}</div>
                        <div class="order-date">Placed on: ${new Date(order.createdAt).toLocaleString()}</div>
                    </div>
                    <div style="display: flex; gap: 1rem; align-items: center;">
                        <span class="order-status ${statusClass}">${statusText}</span>
                        <div class="order-otp">OTP: ${order.otp}</div>
                    </div>
                </div>

                <div class="payment-info">
                    <strong>Payment Method:</strong> ${order.paymentMethod === 'cash_delivery' ? '💵 Cash on Delivery' : '📱 Online Payment'}
                    <span style="margin-left: 1rem; color: ${order.paymentStatus === 'paid' ? '#28a745' : '#ffc107'};">(${order.paymentStatus === 'paid' ? 'Paid' : 'Pending'})</span>
                </div>

                <div class="order-items">
                    ${order.items.map(item => {
                        const images = item.images || (item.image ? [item.image] : ['https://via.placeholder.com/60x60?text=No+Img']);
                        const firstImage = images[0];

                        return `
                            <div class="order-item">
                                <img src="${firstImage}" alt="${item.medicine_name}" class="item-image" onerror="this.src='https://via.placeholder.com/60x60?text=No+Img'">
                                <div class="item-details">
                                    <div class="item-name">${item.medicine_name}</div>
                                    <div class="item-quantity">Quantity: ${item.quantity}</div>
                                </div>
                                <div class="item-price">₹${item.price * item.quantity}</div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="order-total">Total: ₹${order.total}</div>
            </div>
        `;
        ordersList.innerHTML += orderCard;
    });
}