// Get stock data from localStorage
function getStockData() {
    const storedData = localStorage.getItem('stockData');
    if (storedData) {
        const data = JSON.parse(storedData);
        // Check if data has new structure (has medicine_name field)
        if (data.length > 0 && data[0].medicine_name) {
            // Check if it has location field (newest structure)
            if (data[0].location !== undefined) {
                return data;
            }
            // Old structure without location, clear and use new structure
            localStorage.removeItem('stockData');
        }
        // Old structure detected, clear and use new structure
        localStorage.removeItem('stockData');
    }

    // Sample stock data with new structure including location and note
    const sampleData = [
        { id: 1, medicine_name: "Arnica Montana", brand_name: "Dr. Reckeweg", batch_no: "ARN001", mgf_date: "2024-01-15", exp_date: "2027-01-15", quantity: 50, price: 150, location: "Shelf A-1", note: "Best seller" },
        { id: 2, medicine_name: "Nux Vomica", brand_name: "SBL", batch_no: "NUX002", mgf_date: "2024-02-20", exp_date: "2027-02-20", quantity: 8, price: 120, location: "Shelf A-2", note: "Low stock, reorder soon" },
        { id: 3, medicine_name: "Rhus Tox", brand_name: "Schwabe", batch_no: "RHS003", mgf_date: "2024-03-10", exp_date: "2027-03-10", quantity: 0, price: 140, location: "Shelf B-1", note: "Out of stock" },
        { id: 4, medicine_name: "Bryonia", brand_name: "Dr. Reckeweg", batch_no: "BRY004", mgf_date: "2024-04-05", exp_date: "2027-04-05", quantity: 35, price: 130, location: "Shelf B-2", note: "" },
        { id: 5, medicine_name: "Belladonna", brand_name: "SBL", batch_no: "BEL005", mgf_date: "2024-05-12", exp_date: "2027-05-12", quantity: 25, price: 110, location: "Shelf C-1", note: "Popular for fever" },
        { id: 6, medicine_name: "Pulsatilla", brand_name: "Schwabe", batch_no: "PUL006", mgf_date: "2024-06-18", exp_date: "2027-06-18", quantity: 40, price: 160, location: "Shelf C-2", note: "Women's health section" },
        { id: 7, medicine_name: "Silicea", brand_name: "Dr. Reckeweg", batch_no: "SIL007", mgf_date: "2024-07-22", exp_date: "2027-07-22", quantity: 5, price: 145, location: "Shelf D-1", note: "Skin care section" },
        { id: 8, medicine_name: "Sulphur", brand_name: "SBL", batch_no: "SUL008", mgf_date: "2024-08-30", exp_date: "2027-08-30", quantity: 30, price: 135, location: "Shelf D-2", note: "" },
        { id: 9, medicine_name: "Calcarea Carb", brand_name: "Schwabe", batch_no: "CAL009", mgf_date: "2024-09-14", exp_date: "2027-09-14", quantity: 45, price: 155, location: "Shelf E-1", note: "General health" },
        { id: 10, medicine_name: "Lycopodium", brand_name: "Dr. Reckeweg", batch_no: "LYC010", mgf_date: "2024-10-25", exp_date: "2027-10-25", quantity: 20, price: 165, location: "Shelf E-2", note: "Digestive health" }
    ];

    localStorage.setItem('stockData', JSON.stringify(sampleData));
    return sampleData;
}

let stockData = getStockData();
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    if (!currentUser) {
        alert('Please login first.');
        window.location.href = 'login.html';
        return;
    }

    if (currentUser.userType === 'customer') {
        alert('Customers do not have access to stock management.');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('userName').textContent = currentUser.fullName;
    loadStockData();
    updateStats();
});

// Load stock data
function loadStockData() {
    stockData = getStockData();
    const tbody = document.getElementById('stockTableBody');
    tbody.innerHTML = '';

    stockData.forEach(item => {
        const stockStatus = getStockStatus(item.quantity);
        const expiryStatus = getExpiryStatus(item.exp_date);
        const row = `
            <tr>
                <td>${item.medicine_name}</td>
                <td>${item.brand_name}</td>
                <td>${item.batch_no}</td>
                <td>${formatDate(item.mgf_date)}</td>
                <td>${formatDate(item.exp_date)}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price}</td>
                <td>${item.location || 'N/A'}</td>
                <td>${item.note || '-'}</td>
                <td><span class="status-badge ${stockStatus.class}">${stockStatus.text}</span></td>
                <td><span class="status-badge ${expiryStatus.class}">${expiryStatus.text}</span></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function getStockStatus(quantity) {
    if (quantity === 0) {
        return { class: 'status-out-of-stock', text: 'Out of Stock' };
    } else if (quantity < 10) {
        return { class: 'status-low-stock', text: 'Low Stock' };
    } else {
        return { class: 'status-in-stock', text: 'In Stock' };
    }
}

function getExpiryStatus(expDate) {
    const today = new Date();
    const expiryDate = new Date(expDate);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { class: 'expired', text: 'Expired' };
    } else if (diffDays <= 30) {
        return { class: 'expiring-soon', text: `Expiring in ${diffDays} days` };
    } else {
        return { class: 'status-in-stock', text: 'Good' };
    }
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Update statistics
function updateStats() {
    const totalProducts = stockData.length;
    const lowStockItems = stockData.filter(item => item.quantity < 10).length;

    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    const expiringSoon = stockData.filter(item => {
        const expDate = new Date(item.exp_date);
        return expDate > today && expDate <= thirtyDaysLater;
    }).length;

    const expiredItems = stockData.filter(item => {
        const expDate = new Date(item.exp_date);
        return expDate < today;
    }).length;

    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('lowStockItems').textContent = lowStockItems;
    document.getElementById('expiringSoon').textContent = expiringSoon;
    document.getElementById('expiredItems').textContent = expiredItems;
}

// Search functionality
function searchStock() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const tbody = document.getElementById('stockTableBody');
    tbody.innerHTML = '';

    const filteredData = stockData.filter(item =>
        item.medicine_name.toLowerCase().includes(searchTerm) ||
        item.brand_name.toLowerCase().includes(searchTerm) ||
        item.batch_no.toLowerCase().includes(searchTerm) ||
        (item.location && item.location.toLowerCase().includes(searchTerm)) ||
        (item.note && item.note.toLowerCase().includes(searchTerm))
    );

    filteredData.forEach(item => {
        const stockStatus = getStockStatus(item.quantity);
        const expiryStatus = getExpiryStatus(item.exp_date);
        const row = `
            <tr>
                <td>${item.medicine_name}</td>
                <td>${item.brand_name}</td>
                <td>${item.batch_no}</td>
                <td>${formatDate(item.mgf_date)}</td>
                <td>${formatDate(item.exp_date)}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price}</td>
                <td>${item.location || 'N/A'}</td>
                <td>${item.note || '-'}</td>
                <td><span class="status-badge ${stockStatus.class}">${stockStatus.text}</span></td>
                <td><span class="status-badge ${expiryStatus.class}">${expiryStatus.text}</span></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Go back to dashboard
function goBack() {
    if (currentUser.userType === 'owner') {
        window.location.href = 'owner-dashboard.html';
    } else if (currentUser.userType === 'employee') {
        window.location.href = 'employee-dashboard.html';
    } else {
        window.location.href = 'index.html';
    }
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}