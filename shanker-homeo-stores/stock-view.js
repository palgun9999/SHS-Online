// Backend API configuration
const API_URL = (typeof API_CONFIG !== 'undefined' && API_CONFIG) ? API_CONFIG.apiUrl : null;

let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let allProductsCache = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = localStorage.getItem('token');

    if (!currentUser) {
        alert('Please login first.');
        window.location.href = 'login.html';
        return;
    }

    // Allow owners and employees to access stock management
    const isOwnerOrEmp = currentUser.accountType === 'owner' || 
                         currentUser.accountType === 'employee' || 
                         currentUser.roles?.includes('employee') || 
                         currentUser.roles?.includes('owner');

    if (!isOwnerOrEmp) {
        alert('Customers do not have access to stock management.');
        window.location.href = 'index.html';
        return;
    }

    const userNameEl = document.getElementById('userName');
    if (userNameEl) userNameEl.textContent = currentUser.name;
    loadStockData();
});

// Load stock data from backend or localStorage
async function loadStockData() {
    let products = [];
    if (API_URL) {
        try {
            const response = await fetch(`${API_URL}/products`);
            if (response.ok) {
                const data = await response.json();
                products = data.products || [];
            }
        } catch (error) {
            console.warn('Backend unavailable, using local stock catalog for stock-view:', error.message);
        }
    }

    if (!products || products.length === 0) {
        products = JSON.parse(localStorage.getItem('products') || '[]');
    }

    allProductsCache = products;
    updateStatsCards(products);
    renderStockTable(products);
}

// Update stats cards in stock-view
function updateStatsCards(products) {
    const totalProducts = products.length;
    const lowStockItems = products.filter(p => p.quantity < 10).length;

    let expiringSoon = 0;
    let expiredItems = 0;
    const today = new Date();

    products.forEach(p => {
        const expDateStr = p.exp_date || p.expiry_date;
        if (expDateStr) {
            const exp = new Date(expDateStr);
            if (!isNaN(exp.getTime())) {
                const daysDiff = (exp - today) / (1000 * 60 * 60 * 24);
                if (daysDiff < 0) {
                    expiredItems++;
                } else if (daysDiff <= 30) {
                    expiringSoon++;
                }
            }
        }
    });

    if (document.getElementById('totalProducts')) document.getElementById('totalProducts').textContent = totalProducts;
    if (document.getElementById('lowStockItems')) document.getElementById('lowStockItems').textContent = lowStockItems;
    if (document.getElementById('expiringSoon')) document.getElementById('expiringSoon').textContent = expiringSoon;
    if (document.getElementById('expiredItems')) document.getElementById('expiredItems').textContent = expiredItems;
}

// Render stock table matching all 11 columns in stock-view.html
function renderStockTable(products) {
    const tableBody = document.getElementById('stockTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (!products || products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="11" style="text-align: center; padding: 2rem; color: #666;">No products found in stock.</td></tr>';
        return;
    }

    products.forEach(product => {
        const row = document.createElement('tr');
        const stockStatus = getStockStatus(product.quantity);
        const expDateVal = product.exp_date || product.expiry_date;
        const mgfDateVal = product.mgf_date || product.manufacturing_date;
        const expiryStatus = getExpiryStatus(expDateVal);
        const batch = product.batch_no || product.batch_number || 'N/A';

        row.innerHTML = `
            <td><strong>${product.medicine_name}</strong></td>
            <td>${product.brand_name || 'N/A'}</td>
            <td><code>${batch}</code></td>
            <td>${formatDate(mgfDateVal)}</td>
            <td>${formatDate(expDateVal)}</td>
            <td><strong>${product.quantity}</strong></td>
            <td>₹${product.price}</td>
            <td>${product.location || 'N/A'}</td>
            <td>${product.note || '-'}</td>
            <td><span class="status-badge ${stockStatus.class}">${stockStatus.text}</span></td>
            <td><span class="status-badge ${expiryStatus.class}">${expiryStatus.text}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

// Search stock
function searchStock() {
    const input = document.getElementById('searchInput');
    const term = input ? input.value.trim().toLowerCase() : '';

    if (!term) {
        renderStockTable(allProductsCache);
        return;
    }

    const filtered = allProductsCache.filter(p => {
        const name = (p.medicine_name || '').toLowerCase();
        const brand = (p.brand_name || '').toLowerCase();
        const batch = (p.batch_no || p.batch_number || '').toLowerCase();
        const loc = (p.location || '').toLowerCase();
        const note = (p.note || '').toLowerCase();
        return name.includes(term) || brand.includes(term) || batch.includes(term) || loc.includes(term) || note.includes(term);
    });

    renderStockTable(filtered);
}

// Navigation back to dashboard
function goBack() {
    window.location.href = 'owner-dashboard.html';
}

// Get stock status
function getStockStatus(quantity) {
    if (quantity === 0) {
        return { class: 'status-out-of-stock', text: 'Out of Stock' };
    } else if (quantity < 10) {
        return { class: 'status-low-stock', text: 'Low Stock' };
    } else {
        return { class: 'status-in-stock', text: 'In Stock' };
    }
}

// Get expiry status
function getExpiryStatus(expDate) {
    if (!expDate) {
        return { class: 'status-in-stock', text: 'Good' };
    }

    const expiryDate = new Date(expDate);
    const today = new Date();
    const daysUntilExpiry = (expiryDate - today) / (1000 * 60 * 60 * 24);

    if (daysUntilExpiry < 0) {
        return { class: 'expired', text: 'Expired' };
    } else if (daysUntilExpiry <= 30) {
        return { class: 'expiring-soon', text: 'Expiring Soon' };
    } else {
        return { class: 'status-in-stock', text: 'Good' };
    }
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}
