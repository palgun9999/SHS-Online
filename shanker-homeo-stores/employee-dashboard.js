// Backend API configuration
const API_URL = API_CONFIG.apiUrl;

// Attendance data (still using localStorage for attendance)
let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];
let currentSession = null;

// Get current user
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token || !currentUser || (currentUser.accountType !== 'employee' && !currentUser.roles?.includes('employee')) || !currentUser.approved) {
        alert('Access denied. Please login as an approved employee.');
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('userName').textContent = currentUser.name;
    loadAttendanceData();
    updateStats();
    updateAttendanceStatus();
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
    if (section === 'attendance') buttons[1].classList.add('active');

    // Update page title
    const titles = {
        'home': 'Welcome',
        'attendance': 'Attendance Report'
    };
    document.getElementById('pageTitle').textContent = titles[section];
}

// Load attendance data
function loadAttendanceData() {
    attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];
    updateAttendanceTable();
}

// Update attendance table
function updateAttendanceTable() {
    const tableBody = document.getElementById('attendanceTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (attendanceData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No attendance records</td></tr>';
        return;
    }

    attendanceData.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(record.date)}</td>
            <td>${record.checkIn}</td>
            <td>${record.checkOut || 'Not checked out'}</td>
            <td>${record.hoursWorked || '0'}</td>
            <td><span class="status-badge ${record.status}">${record.status}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

// Update statistics
async function updateStats() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            const orders = data.orders || [];

            const totalOrders = orders.length;
            const pendingOrders = orders.filter(o => o.status === 'placed').length;
            const readyOrders = orders.filter(o => o.status === 'ready').length;
            const completedOrders = orders.filter(o => o.status === 'completed').length;

            document.getElementById('totalOrders').textContent = totalOrders;
            document.getElementById('pendingOrders').textContent = pendingOrders;
            document.getElementById('readyOrders').textContent = readyOrders;
            document.getElementById('completedOrders').textContent = completedOrders;
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

// Update attendance status
function updateAttendanceStatus() {
    const statusElement = document.getElementById('attendanceStatus');
    if (!statusElement) return;

    currentSession = attendanceData.find(record => record.date === new Date().toDateString() && !record.checkOut);

    if (currentSession) {
        statusElement.textContent = 'Checked In';
        statusElement.className = 'status-badge checked-in';
    } else {
        statusElement.textContent = 'Not Checked In';
        statusElement.className = 'status-badge not-checked-in';
    }
}

// Check in
function checkIn() {
    if (currentSession) {
        alert('You are already checked in');
        return;
    }

    const newRecord = {
        date: new Date().toDateString(),
        checkIn: new Date().toLocaleTimeString(),
        checkOut: null,
        hoursWorked: null,
        status: 'checked-in'
    };

    attendanceData.push(newRecord);
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
    currentSession = newRecord;

    updateAttendanceStatus();
    updateAttendanceTable();
    alert('Checked in successfully');
}

// Check out
function checkOut() {
    if (!currentSession) {
        alert('You are not checked in');
        return;
    }

    const checkOutTime = new Date();
    const checkInTime = new Date(`${currentSession.date} ${currentSession.checkIn}`);
    const hoursWorked = ((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(2);

    currentSession.checkOut = checkOutTime.toLocaleTimeString();
    currentSession.hoursWorked = hoursWorked;
    currentSession.status = 'completed';

    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
    currentSession = null;

    updateAttendanceStatus();
    updateAttendanceTable();
    alert('Checked out successfully');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
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