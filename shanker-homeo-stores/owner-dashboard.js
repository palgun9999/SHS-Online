// Backend API configuration
const API_URL = API_CONFIG.apiUrl;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!token || !currentUser || (currentUser.accountType !== 'owner' && !currentUser.roles?.includes('owner'))) {
        alert('Access denied. Please login as an approved owner.');
        window.location.href = 'login.html';
        return;
    }

    // Set owner name
    document.getElementById('ownerName').textContent = currentUser.name;

    loadDashboardData();
});

// Section navigation
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-menu button').forEach(b => b.classList.remove('active'));

    // Show selected section
    document.getElementById(`${section}Section`).classList.add('active');

    // Update active button
    const buttons = document.querySelectorAll('.sidebar-menu button');
    if (section === 'home') buttons[0].classList.add('active');
    if (section === 'employee-management') buttons[1].classList.add('active');
    if (section === 'stock-management') buttons[2].classList.add('active');
    if (section === 'approvals') buttons[1].classList.add('active');
    if (section === 'employees') buttons[1].classList.add('active');

    // Update page title
    const titles = {
        'home': 'Welcome',
        'employee-management': 'Employee Management',
        'stock-management': 'Stock Management',
        'approvals': 'Employee Approvals',
        'employees': 'All Employees'
    };
    document.getElementById('pageTitle').textContent = titles[section];

    // Load section-specific data
    if (section === 'home') loadDashboardData();
    if (section === 'employee-management' || section === 'approvals') loadPendingApprovals();
    if (section === 'employees') loadAllEmployees();
    if (section === 'stock-management') loadStockOverview();
}

// Load dashboard data
async function loadDashboardData() {
    try {
        const token = localStorage.getItem('token');

        // Load orders
        const ordersResponse = await fetch(`${API_URL}/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const ordersData = await ordersResponse.json();
        const orders = ordersData.orders || [];

        // Load products
        const productsResponse = await fetch(`${API_URL}/products`);
        const productsData = await productsResponse.json();
        const products = productsData.products || [];

        // Load users
        const usersResponse = await fetch(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const usersData = await usersResponse.json();
        const users = usersData.users || [];

        // Calculate statistics
        const pendingApprovals = users.filter(u => (u.type === 'employee' || u.accountType === 'employee') && !u.is_approved && !u.approved).length;
        const totalEmployees = users.filter(u => u.type === 'employee' || u.accountType === 'employee').length;
        const approvedEmployees = users.filter(u => (u.type === 'employee' || u.accountType === 'employee') && (u.is_approved || u.approved)).length;
        const totalProducts = products.length;
        const lowStockItems = products.filter(p => p.quantity < 10).length;

        // Update UI
        document.getElementById('pendingApprovals').textContent = pendingApprovals;
        document.getElementById('totalEmployees').textContent = totalEmployees;
        document.getElementById('approvedEmployees').textContent = approvedEmployees;
        document.getElementById('totalProducts').textContent = totalProducts;
        document.getElementById('lowStockItems').textContent = lowStockItems;

    } catch (error) {
        console.warn('Backend unavailable, loading local dashboard statistics:', error.message);
        const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]');

        const pendingApprovals = localUsers.filter(u => (u.accountType === 'employee' || u.type === 'employee') && !u.approved && !u.is_approved).length;
        const totalEmployees = localUsers.filter(u => u.accountType === 'employee' || u.type === 'employee').length;
        const approvedEmployees = localUsers.filter(u => (u.accountType === 'employee' || u.type === 'employee') && (u.approved || u.is_approved)).length;
        const totalProducts = localProducts.length;
        const lowStockItems = localProducts.filter(p => p.quantity < 10).length;

        if (document.getElementById('pendingApprovals')) document.getElementById('pendingApprovals').textContent = pendingApprovals;
        if (document.getElementById('totalEmployees')) document.getElementById('totalEmployees').textContent = totalEmployees;
        if (document.getElementById('approvedEmployees')) document.getElementById('approvedEmployees').textContent = approvedEmployees;
        if (document.getElementById('totalProducts')) document.getElementById('totalProducts').textContent = totalProducts;
        if (document.getElementById('lowStockItems')) document.getElementById('lowStockItems').textContent = lowStockItems;
    }
}

// Load pending approvals
async function loadPendingApprovals() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        const users = data.users || [];

        const pendingUsers = users.filter(u => u.type === 'employee' && !u.is_approved);
        const container = document.getElementById('pendingApprovalsContainer');

        if (pendingUsers.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">No pending approvals</p>';
            return;
        }

        container.innerHTML = '';
        pendingUsers.forEach(user => {
            const userCard = createUserCard(user, true);
            container.appendChild(userCard);
        });
    } catch (error) {
        console.warn('Backend unavailable, loading local pending approvals:', error.message);
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const pendingUsers = users.filter(u => (u.accountType === 'employee' || u.type === 'employee') && !u.approved && !u.is_approved);
        const container = document.getElementById('pendingApprovalsContainer');
        if (container) {
            if (pendingUsers.length === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">No pending approvals</p>';
            } else {
                container.innerHTML = '';
                pendingUsers.forEach(user => {
                    container.appendChild(createUserCard(user, true));
                });
            }
        }
    }
}

// Load all employees
async function loadAllEmployees() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        const users = data.users || [];

        const employees = users.filter(u => u.type === 'employee');
        const container = document.getElementById('allEmployeesContainer');

        if (employees.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">No employees found</p>';
            return;
        }

        container.innerHTML = '';
        employees.forEach(user => {
            const userCard = createUserCard(user, false);
            container.appendChild(userCard);
        });
    } catch (error) {
        console.warn('Backend unavailable, loading local employees:', error.message);
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const employees = users.filter(u => u.accountType === 'employee' || u.type === 'employee');
        const container = document.getElementById('allEmployeesContainer');
        if (container) {
            if (employees.length === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">No employees found</p>';
            } else {
                container.innerHTML = '';
                employees.forEach(user => {
                    container.appendChild(createUserCard(user, false));
                });
            }
        }
    }
}

// Create user card
function createUserCard(user, isPending) {
    const card = document.createElement('div');
    card.className = 'user-card';

    const statusClass = user.is_approved ? 'approved' : 'pending';
    const statusText = user.is_approved ? 'Approved' : 'Pending';

    card.innerHTML = `
        <div class="user-info">
            <h3>${user.name}</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Mobile:</strong> ${user.mobile}</p>
            <p><strong>Status:</strong> <span class="status-badge ${statusClass}">${statusText}</span></p>
        </div>
        ${isPending ? `
            <div class="user-actions">
                <button class="approve-btn" onclick="approveUser(${user.id})">✅ Approve</button>
                <button class="reject-btn" onclick="rejectUser(${user.id})">❌ Reject</button>
            </div>
        ` : ''}
    `;

    return card;
}

// Approve user
async function approveUser(userId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/${userId}/approve`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert('User approved successfully');
            loadPendingApprovals();
            loadDashboardData();
        } else {
            alert('Failed to approve user');
        }
    } catch (error) {
        console.error('Error approving user:', error);
        alert('Failed to approve user');
    }
}

// Reject user
async function rejectUser(userId) {
    if (!confirm('Are you sure you want to reject this user?')) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/${userId}/reject`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert('User rejected successfully');
            loadPendingApprovals();
            loadDashboardData();
        } else {
            alert('Failed to reject user');
        }
    } catch (error) {
        console.error('Error rejecting user:', error);
        alert('Failed to reject user');
    }
}

// Load stock overview
async function loadStockOverview() {
    const tableBody = document.getElementById('stockOverviewTableBody');
    if (!tableBody) return;

    let products = [];
    if (API_URL) {
        try {
            const response = await fetch(`${API_URL}/products`);
            if (response.ok) {
                const data = await response.json();
                products = data.products || [];
            }
        } catch (error) {
            console.warn('Backend unavailable, reading local stock for overview:', error.message);
        }
    }

    if (products.length === 0) {
        products = JSON.parse(localStorage.getItem('products') || '[]');
    }

    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #666;">No products found in stock. <button onclick="window.location.href=\'stock-edit.html\'" style="margin-left: 0.5rem; padding: 0.4rem 0.8rem; background: #00838f; color: white; border: none; border-radius: 4px; cursor: pointer;">Add Product</button></td></tr>';
        return;
    }

    tableBody.innerHTML = '';

    products.forEach(product => {
        const stockStatus = getStockStatus(product.quantity);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${product.medicine_name}</strong></td>
            <td>${product.brand_name || 'N/A'}</td>
            <td><span class="status-badge" style="background: #e0f2f1; color: #006064;">${product.category || 'homeopathic'}</span></td>
            <td><strong>${product.quantity}</strong></td>
            <td>₹${product.price}</td>
            <td><span class="status-badge ${stockStatus.class}">${stockStatus.text}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

// Get stock status
function getStockStatus(quantity) {
    if (quantity === 0) {
        return { class: 'out-of-stock', text: 'Out of Stock' };
    } else if (quantity < 10) {
        return { class: 'low-stock', text: 'Low Stock' };
    } else {
        return { class: 'in-stock', text: 'In Stock' };
    }
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}