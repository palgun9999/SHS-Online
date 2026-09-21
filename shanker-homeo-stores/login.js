// Simulated database storage
let users = JSON.parse(localStorage.getItem('shankerUsers')) || [];
let currentUser = null;

// Initialize with pre-configured owner account
function initializeOwnerAccount() {
    const ownerEmail = 'shankarhomeostores@gmail.com';
    const existingOwner = users.find(u => u.email === ownerEmail);

    if (!existingOwner) {
        const ownerAccount = {
            name: 'J D SHANKAR',
            email: ownerEmail,
            mobile: '9844874544',
            password: 'SHS#123',
            accountType: 'owner',
            roles: ['owner', 'customer', 'employee'], // Multi-role owner
            approved: true,
            rejected: false,
            createdAt: new Date().toISOString()
        };
        users.push(ownerAccount);
        localStorage.setItem('shankerUsers', JSON.stringify(users));
        console.log('Pre-configured owner account created');
    } else {
        // Update existing owner account with correct details and multi-role
        existingOwner.name = 'J D SHANKAR';
        existingOwner.mobile = '9844874544';
        existingOwner.roles = ['owner', 'customer', 'employee'];
        existingOwner.approved = true;
        existingOwner.rejected = false;
        localStorage.setItem('shankerUsers', JSON.stringify(users));
        console.log('Owner account updated with multi-role capabilities');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeOwnerAccount();
});

// Tab switching
function switchTab(tab) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(t => t.classList.remove('active'));

    if (tab === 'login') {
        tabs[0].classList.add('active');
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
    } else {
        tabs[1].classList.add('active');
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
    }
}

// Handle login
function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    if (!email || !password) {
        errorDiv.textContent = 'Please enter both email and password';
        errorDiv.style.display = 'block';
        return;
    }

    if (!validateEmail(email)) {
        errorDiv.textContent = 'Please enter a valid email address';
        errorDiv.style.display = 'block';
        return;
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        errorDiv.textContent = 'No account found with this email. Please check your email or create an account.';
        errorDiv.style.display = 'block';
        return;
    }

    if (user.password !== password) {
        errorDiv.textContent = 'Incorrect password. Please check your password and try again.';
        errorDiv.style.display = 'block';
        return;
    }

    // Login successful
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    errorDiv.style.display = 'none';

    // Redirect based on user type
    if (user.accountType === 'owner') {
        // Owner can access all dashboards, default to owner dashboard
        window.location.href = 'owner-dashboard.html';
    } else if (user.accountType === 'employee') {
        if (user.approved) {
            window.location.href = 'employee-dashboard.html';
        } else {
            alert('Your employee account is pending approval from the owner.');
            window.location.href = 'index.html';
        }
    } else {
        // Customer goes to homepage
        window.location.href = 'index.html';
    }
}

// Handle registration
function handleRegistration() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('regEmail').value;
    const mobile = document.getElementById('mobileNumber').value;
    const password = document.getElementById('regPassword').value;
    const accountType = document.getElementById('userType').value;

    if (!fullName || !email || !mobile || !password) {
        showError('Please fill in all fields');
        return;
    }

    if (!validateEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    if (!validateMobile(mobile)) {
        showError('Please enter a valid mobile number');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    // Check if user already exists
    if (users.find(u => u.email === email)) {
        showError('An account with this email already exists');
        return;
    }

    // Create user
    const newUser = {
        name: fullName,
        email,
        mobile,
        password,
        accountType,
        approved: accountType === 'customer', // Auto-approve customers, employees need approval
        rejected: false,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('shankerUsers', JSON.stringify(users));

    showSuccess('Account created successfully!');

    if (accountType === 'employee') {
        alert('Your employee account has been created and is pending approval from the owner.');
    } else {
        alert('Your customer account has been created successfully!');
    }

    // Reset form and go to login
    setTimeout(() => {
        resetRegistrationForm();
        switchTab('login');
    }, 2000);
}

function resetRegistrationForm() {
    document.getElementById('fullName').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('mobileNumber').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('userType').value = 'customer';
    hideMessages();
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateMobile(mobile) {
    const re = /^[0-9]{10}$/;
    return re.test(mobile);
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    document.getElementById('errorMessage').style.display = 'none';
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
}

function hideMessages() {
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
}