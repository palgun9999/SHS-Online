// Get all users from localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('shankerUsers')) || [];
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem('shankerUsers', JSON.stringify(users));
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || currentUser.accountType !== 'owner' || !currentUser.approved) {
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

    // Refresh data when switching sections
    loadDashboardData();
}

// Load dashboard data
function loadDashboardData() {
    const users = getUsers();
    const employees = users.filter(user => user.accountType === 'employee');

    // Get stock data
    const stockData = JSON.parse(localStorage.getItem('stockData')) || [];

    // Update statistics
    const pendingApprovals = employees.filter(emp => !emp.approved && emp.rejected !== true).length;
    const approvedEmployees = employees.filter(emp => emp.approved).length;
    const totalProducts = stockData.length;
    const lowStockItems = stockData.filter(item => item.quantity < 10).length;

    document.getElementById('pendingApprovals').textContent = pendingApprovals;
    document.getElementById('totalEmployees').textContent = employees.length;
    document.getElementById('approvedEmployees').textContent = approvedEmployees;
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('lowStockItems').textContent = lowStockItems;

    // Load pending approvals table
    loadPendingApprovals(employees);

    // Load all employees table
    loadAllEmployees(employees);

    // Load stock overview
    loadStockOverview(stockData);
}

// Load pending approvals
function loadPendingApprovals(employees) {
    const tbody = document.getElementById('approvalsTableBody');
    tbody.innerHTML = '';

    const pendingEmployees = employees.filter(emp => !emp.approved && emp.rejected !== true);

    if (pendingEmployees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No pending approvals</td></tr>';
        return;
    }

    pendingEmployees.forEach(employee => {
        const row = `
            <tr>
                <td>${employee.name}</td>
                <td>${employee.email}</td>
                <td>${employee.mobile}</td>
                <td>${formatDate(employee.createdAt)}</td>
                <td><span class="status-badge status-pending">Pending</span></td>
                <td>
                    <button class="action-btn approve-btn" onclick="approveEmployee('${employee.email}')">Approve</button>
                    <button class="action-btn reject-btn" onclick="rejectEmployee('${employee.email}')">Reject</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Load all employees
function loadAllEmployees(employees) {
    const tbody = document.getElementById('employeesTableBody');
    tbody.innerHTML = '';

    if (employees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data">No employees registered</td></tr>';
        return;
    }

    employees.forEach(employee => {
        let statusClass = 'status-pending';
        let statusText = 'Pending';

        if (employee.approved) {
            statusClass = 'status-approved';
            statusText = 'Approved';
        } else if (employee.rejected === true) {
            statusClass = 'status-rejected';
            statusText = 'Rejected';
        }

        const row = `
            <tr>
                <td>${employee.name}</td>
                <td>${employee.email}</td>
                <td>${employee.mobile}</td>
                <td>${formatDate(employee.createdAt)}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Load stock overview
function loadStockOverview(stockData) {
    const tbody = document.getElementById('stockOverviewTableBody');
    if (!tbody) return; // Don't try to load if element doesn't exist

    tbody.innerHTML = '';

    if (stockData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No stock data available</td></tr>';
        return;
    }

    stockData.forEach(item => {
        let statusClass = 'status-approved';
        let statusText = 'In Stock';

        if (item.quantity === 0) {
            statusClass = 'status-rejected';
            statusText = 'Out of Stock';
        } else if (item.quantity < 10) {
            statusClass = 'status-pending';
            statusText = 'Low Stock';
        }

        const row = `
            <tr>
                <td>${item.medicine_name}</td>
                <td>${item.brand_name}</td>
                <td>${item.category}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Approve employee
function approveEmployee(email) {
    if (!confirm('Are you sure you want to approve this employee?')) {
        return;
    }

    const users = getUsers();
    const userIndex = users.findIndex(user => user.email === email);

    if (userIndex !== -1) {
        users[userIndex].approved = true;
        users[userIndex].rejected = false;
        saveUsers(users);

        alert('Employee approved successfully!');
        loadDashboardData();
    }
}

// Reject employee
function rejectEmployee(email) {
    if (!confirm('Are you sure you want to reject this employee?')) {
        return;
    }

    const users = getUsers();
    const userIndex = users.findIndex(user => user.email === email);

    if (userIndex !== -1) {
        users[userIndex].approved = false;
        users[userIndex].rejected = true;
        saveUsers(users);

        alert('Employee rejected successfully!');
        loadDashboardData();
    }
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}