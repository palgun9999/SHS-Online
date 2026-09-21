// Get current user
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    if (!currentUser || (currentUser.type !== 'employee' && currentUser.type !== 'owner')) {
        alert('Access denied. Employee or owner access required.');
        window.location.href = 'login.html';
        return;
    }
    loadOrders();
});

// Load orders
function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];

    if (allOrders.length === 0) {
        ordersList.innerHTML = '<div class="empty-orders"><h2>No orders yet</h2><p>Orders will appear here when customers place them.</p></div>';
        return;
    }

    // Sort orders by date (newest first)
    allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    ordersList.innerHTML = '';

    allOrders.forEach(order => {
        const statusClass = `status-${order.status}`;
        const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);

        let actionButtons = '';

        if (order.status === 'placed') {
            actionButtons = `
                <div class="order-actions">
                    <button class="action-btn accept-btn" onclick="acceptOrder('${order.orderId}')">Accept Order</button>
                </div>
            `;
        } else if (order.status === 'ready') {
            actionButtons = `
                <div class="order-actions">
                    <div class="otp-input-group">
                        <input type="text" class="otp-input" id="otp-${order.orderId}" placeholder="Enter OTP from customer" maxlength="4">
                        <button class="action-btn complete-btn" onclick="completeOrder('${order.orderId}')">Complete Order</button>
                    </div>
                    ${order.paymentMethod === 'cash_delivery' ? `
                        <div style="margin-top: 1rem; padding: 1rem; background: #fff3cd; border-radius: 8px; font-size: 0.9rem;">
                            <strong>💵 Cash to collect: ₹${order.total}</strong>
                        </div>
                    ` : ''}
                </div>
            `;
        } else if (order.status === 'completed') {
            actionButtons = `
                <div class="order-actions">
                    <div style="text-align: center; color: #155724; font-weight: 600;">✓ Order Completed</div>
                    ${order.paymentMethod === 'cash_delivery' ? `
                        <div style="margin-top: 1rem; padding: 1rem; background: #d4edda; border-radius: 8px; font-size: 0.9rem;">
                            <strong>💵 Cash collected: ₹${order.total}</strong>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        const orderCard = `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">Order ID: ${order.orderId}</div>
                        <div class="customer-info">Customer: ${order.customerName} (${order.customerId})</div>
                        <div class="order-date">Placed on: ${new Date(order.createdAt).toLocaleString()}</div>
                        ${order.acceptedBy ? `<div class="customer-info">Accepted by: ${order.acceptedBy} at ${new Date(order.acceptedAt).toLocaleString()}</div>` : ''}
                    </div>
                    <span class="order-status ${statusClass}">${statusText}</span>
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
                ${actionButtons}
            </div>
        `;
        ordersList.innerHTML += orderCard;
    });
}

// Accept order
function acceptOrder(orderId) {
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = allOrders.findIndex(order => order.orderId === orderId);

    if (orderIndex === -1) {
        alert('Order not found');
        return;
    }

    allOrders[orderIndex].status = 'ready';
    allOrders[orderIndex].acceptedBy = currentUser.name;
    allOrders[orderIndex].acceptedAt = new Date().toISOString();

    localStorage.setItem('orders', JSON.stringify(allOrders));
    alert('Order accepted and marked as ready!');
    loadOrders();
}

// Complete order (with OTP verification)
function completeOrder(orderId) {
    const otpInput = document.getElementById(`otp-${orderId}`);
    const enteredOtp = otpInput.value.trim();

    if (!enteredOtp) {
        alert('Please enter the OTP provided by the customer');
        return;
    }

    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = allOrders.findIndex(order => order.orderId === orderId);

    if (orderIndex === -1) {
        alert('Order not found');
        return;
    }

    if (allOrders[orderIndex].otp !== enteredOtp) {
        alert('Invalid OTP. Please check with the customer.');
        return;
    }

    allOrders[orderIndex].status = 'completed';
    allOrders[orderIndex].completedAt = new Date().toISOString();

    localStorage.setItem('orders', JSON.stringify(allOrders));
    alert('Order completed successfully!');
    loadOrders();
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}