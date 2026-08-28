// Get stock data from localStorage
function getStockData() {
    const storedData = localStorage.getItem('stockData');
    if (storedData) {
        return JSON.parse(storedData);
    }
    return [];
}

// Attendance data
let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];
let currentSession = null;

// Get current user
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    if (!currentUser || currentUser.userType !== 'employee' || !currentUser.approved) {
        alert('Access denied. Please login as an approved employee.');
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('userName').textContent = currentUser.fullName;
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

// Get stock data for statistics
function getStockData() {
    const storedData = localStorage.getItem('stockData');
    if (storedData) {
        return JSON.parse(storedData);
    }
    return [];
}

// Load attendance data
function loadAttendanceData() {
    const tbody = document.getElementById('attendanceTableBody');
    tbody.innerHTML = '';

    // Sort by date (newest first)
    const sortedAttendance = [...attendanceData].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedAttendance.forEach(record => {
        const hoursWorked = calculateHoursWorked(record.checkIn, record.checkOut);
        const row = `
            <tr>
                <td>${formatDate(record.date)}</td>
                <td>${formatTime(record.checkIn)}</td>
                <td>${record.checkOut ? formatTime(record.checkOut) : 'Not checked out'}</td>
                <td>${hoursWorked}</td>
                <td>${record.status}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function calculateHoursWorked(checkIn, checkOut) {
    if (!checkOut) return 'In progress';
    const inTime = new Date(checkIn);
    const outTime = new Date(checkOut);
    const diff = outTime - inTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

// Check in
function checkIn() {
    if (currentSession) {
        alert('You are already checked in!');
        return;
    }

    currentSession = {
        userId: currentUser.email,
        date: new Date().toISOString(),
        checkIn: new Date().toISOString(),
        checkOut: null,
        status: 'Present'
    };

    updateAttendanceStatus();
    alert('Checked in successfully at ' + formatTime(currentSession.checkIn));
}

// Check out
function checkOut() {
    if (!currentSession) {
        alert('You need to check in first!');
        return;
    }

    currentSession.checkOut = new Date().toISOString();
    attendanceData.push(currentSession);
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));

    currentSession = null;
    updateAttendanceStatus();
    loadAttendanceData();
    updateStats();

    alert('Checked out successfully!');
}

function updateAttendanceStatus() {
    const statusElement = document.getElementById('currentStatus');
    const timeElement = document.getElementById('checkInTime');

    if (currentSession) {
        statusElement.textContent = 'Checked In';
        statusElement.style.color = '#28a745';
        timeElement.textContent = 'Since: ' + formatTime(currentSession.checkIn);
    } else {
        statusElement.textContent = 'Not Checked In';
        statusElement.style.color = '#dc3545';
        timeElement.textContent = '';
    }
}

// Update statistics
function updateStats() {
    const stockData = getStockData();
    const totalProducts = stockData.length;
    const lowStockItems = stockData.filter(item => item.quantity < 10).length;

    // Calculate attendance for current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthAttendance = attendanceData.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    }).length;

    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('lowStockItems').textContent = lowStockItems;
    document.getElementById('thisMonthAttendance').textContent = thisMonthAttendance;
}

// Logout
function logout() {
    if (currentSession) {
        if (confirm('You are currently checked in. Do you want to check out before logging out?')) {
            checkOut();
        } else {
            alert('Please check out before logging out.');
            return;
        }
    }

    localStorage.removeItem('currentUser');
    currentUser = null;
    window.location.href = 'index.html';
}