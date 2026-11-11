// Load order confirmation details
document.addEventListener('DOMContentLoaded', function() {
    let lastOrder = null;
    try {
        lastOrder = JSON.parse(localStorage.getItem('lastOrder'));
    } catch (e) {
        console.error('Failed to parse lastOrder:', e);
    }

    if (!lastOrder) {
        // Try getting latest order from orders history
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        if (orders.length > 0) {
            lastOrder = orders[orders.length - 1];
        }
    }

    if (!lastOrder) {
        document.getElementById('orderDetails').innerHTML = '<p style="text-align: center; color: #666;">No recent order information found. <a href="index.html">Return to store</a></p>';
        return;
    }

    const customerName = lastOrder.customerName || 'Valued Customer';
    const orderDate = lastOrder.createdAt || lastOrder.created_at || new Date().toISOString();
    const itemsCount = lastOrder.items ? lastOrder.items.length : 0;
    const totalAmount = lastOrder.total || lastOrder.totalAmount || 0;

    // Display order details
    const orderDetails = `
        <div class="detail-row">
            <span class="detail-label">Order ID:</span>
            <span class="detail-value"><strong>${lastOrder.orderId || 'N/A'}</strong></span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Customer Name:</span>
            <span class="detail-value">${customerName}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Order Date:</span>
            <span class="detail-value">${new Date(orderDate).toLocaleString()}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Total Items:</span>
            <span class="detail-value">${itemsCount}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Total Amount:</span>
            <span class="detail-value" style="color: #00838f; font-weight: 700;">₹${totalAmount}</span>
        </div>
    `;
    document.getElementById('orderDetails').innerHTML = orderDetails;

    // Display OTP
    const otpElement = document.getElementById('otpCode');
    if (otpElement) {
        otpElement.textContent = lastOrder.otp || '----';
    }

    // Display payment information
    let paymentInfo = '';
    if (lastOrder.paymentMethod === 'cash_delivery') {
        paymentInfo = `
            <h3>💵 Cash on Delivery / Store Pickup</h3>
            <p>Please pay ₹${totalAmount} when you collect your order.</p>
        `;
    } else if (lastOrder.paymentMethod === 'online_now') {
        paymentInfo = `
            <h3>📱 Online Payment (UPI)</h3>
            <p>Payment initiated for ₹${totalAmount}. Please complete via UPI at collection.</p>
        `;
    }
    const paymentInfoEl = document.getElementById('paymentInfo');
    if (paymentInfoEl) {
        paymentInfoEl.innerHTML = paymentInfo;
    }
});