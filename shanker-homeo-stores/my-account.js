// Account page functionality
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Reload current user data to get latest role information
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    loadAccountContent();
});

// Load account content based on login status
function loadAccountContent() {
    const accountContent = document.getElementById('accountContent');

    if (!currentUser) {
        // Show login prompt
        accountContent.innerHTML = `
            <div class="login-prompt">
                <div class="login-card">
                    <h2>🔐 Login Required</h2>
                    <p>Please login to view your account details</p>
                    <button class="info-btn" onclick="window.location.href='login.html'">Login</button>
                    <button class="info-btn" onclick="window.location.href='register.html'" style="margin-left: 1rem;">Register</button>
                </div>
            </div>
        `;
    } else {
        // Show account details
        accountContent.innerHTML = `
            <div class="account-details">
                <div class="profile-card">
                    <div class="profile-header">
                        <div class="profile-avatar">👤</div>
                        <h2>${currentUser.name}</h2>
                        <p class="account-type">${getAccountTypeLabel(currentUser.accountType)}</p>
                        ${currentUser.roles && currentUser.roles.length > 1 ? `
                            <p class="roles-info">Additional Roles: ${currentUser.roles.filter(r => r !== currentUser.accountType).join(', ')}</p>
                        ` : ''}
                    </div>

                    <div class="account-info">
                        <div class="info-row">
                            <span class="info-label">📧 Email:</span>
                            <span class="info-value">${currentUser.email}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">📱 Mobile:</span>
                            <span class="info-value">${currentUser.mobile || 'Not provided'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">📅 Member Since:</span>
                            <span class="info-value">${formatDate(currentUser.createdAt)}</span>
                        </div>
                    </div>

                    <div class="account-actions">
                        <button class="info-btn" onclick="editProfile()">✏️ Edit Profile</button>
                        <button class="info-btn" onclick="changePassword()">🔒 Change Password</button>
                        <button class="info-btn logout-btn" onclick="logout()">🚪 Logout</button>
                    </div>

                    ${currentUser.accountType === 'owner' ? `
                        <div class="owner-actions">
                            <h3>Owner Dashboard</h3>
                            <button class="info-btn" onclick="window.location.href='owner-dashboard.html'">🏢 Owner Dashboard</button>
                        </div>
                    ` : ''}

                    ${currentUser.accountType === 'employee' || (currentUser.roles && currentUser.roles.includes('employee')) ? `
                        <div class="employee-actions">
                            <h3>Employee Dashboard</h3>
                            <button class="info-btn" onclick="window.location.href='employee-dashboard.html'">👷 Employee Dashboard</button>
                        </div>
                    ` : ''}

                    ${currentUser.accountType === 'customer' || (currentUser.roles && currentUser.roles.includes('customer')) ? `
                        <div class="customer-actions">
                            <h3>Customer Features</h3>
                            <button class="info-btn" onclick="window.location.href='products.html'">🛒 Browse Products</button>
                            <button class="info-btn" onclick="window.location.href='my-orders.html'">📦 My Orders</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

// Get account type label
function getAccountTypeLabel(accountType) {
    const labels = {
        'customer': 'Customer',
        'employee': 'Employee',
        'owner': 'Owner'
    };
    return labels[accountType] || 'User';
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Edit profile (placeholder)
function editProfile() {
    alert('Profile editing feature coming soon!');
}

// Change password (placeholder)
function changePassword() {
    alert('Password change feature coming soon!');
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    }
}