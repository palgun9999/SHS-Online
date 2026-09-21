// Load order confirmation details
document.addEventListener('DOMContentLoaded', function() {
    const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));

    if (!lastOrder) {
        document.getElementById('orderDetails').innerHTML = '<p>No order information found.</p>';
        return;
    }

    // Display order details
    const orderDetails = `
        <div class="detail-row">
            <span class="detail-label">Order ID:</span>
            <span class="detail-value">${lastOrder.orderId}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Customer Name:</span>
            <span class="detail-value">${lastOrder.customerName}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Order Date:</span>
            <span class="detail-value">${new Date(lastOrder.createdAt).toLocaleString()}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Total Items:</span>
            <span class="detail-value">${lastOrder.items.length}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Total Amount:</span>
            <span class="detail-value">₹${lastOrder.total}</span>
        </div>
    `;
    document.getElementById('orderDetails').innerHTML = orderDetails;

    // Display OTP
    document.getElementById('otpCode').textContent = lastOrder.otp;

    // Display payment information
    let paymentInfo = '';
    if (lastOrder.paymentMethod === 'cash_delivery') {
        paymentInfo = `
            <h3>💵 Cash on Delivery</h3>
            <p>Please pay ₹${lastOrder.total} when you collect your order.</p>
        `;
    } else if (lastOrder.paymentMethod === 'online_now') {
        paymentInfo = `
            <h3>📱 Online Payment Complete</h3>
            <p>Payment of ₹${lastOrder.total} has been received via UPI.</p>
        `;
    }
    document.getElementById('paymentInfo').innerHTML = paymentInfo;

    // Clear the last order from localStorage after displaying
    localStorage.removeItem('lastOrder');
});