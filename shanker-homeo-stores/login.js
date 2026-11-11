// Backend API configuration
const API_URL = API_CONFIG.apiUrl;

// Fallback to localStorage if backend is not available
const USE_LOCALSTORAGE_FALLBACK = !API_URL;

// Owner account credentials specification
const DEFAULT_OWNER_ACCOUNT = {
    id: 1,
    name: 'J D Shankar',
    email: 'shankarhomeostores@gmail.com',
    mobile: '9844874544',
    password: 'SHS#123',
    accountType: 'owner',
    type: 'owner',
    roles: ['owner', 'customer', 'employee'],
    approved: true,
    is_approved: true,
    createdAt: new Date().toISOString()
};

// Reset all accounts and ensure only the owner account exists
function resetAllAccounts() {
    // Delete all existing accounts and set only the single owner account
    localStorage.setItem('users', JSON.stringify([DEFAULT_OWNER_ACCOUNT]));
    localStorage.removeItem('shankerUsers');

    // If an active session is not the owner, clear it
    const active = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (active && active.email !== DEFAULT_OWNER_ACCOUNT.email) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
    }

    console.log('All previous accounts deleted. Owner account created:', DEFAULT_OWNER_ACCOUNT.email);
    return DEFAULT_OWNER_ACCOUNT;
}

// Initialize owner account and clean slate
async function initializeOwnerAccount() {
    // Perform reset to delete old accounts and ensure single owner exists
    resetAllAccounts();

    if (USE_LOCALSTORAGE_FALLBACK) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/check-owner`);
        const data = await response.json();
        if (!data.exists) {
            // Create owner account in backend database
            await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(DEFAULT_OWNER_ACCOUNT)
            });
            console.log('Pre-configured owner account created in database');
        }
    } catch (error) {
        console.log('Owner account initialization check skipped');
    }
}

// Current user
let currentUser = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeOwnerAccount();
    checkAuthStatus();

    // Show notification if using localStorage fallback
    if (USE_LOCALSTORAGE_FALLBACK) {
        console.log('Running in localStorage fallback mode - backend not available');
        // Optional: Show a notification to the user
        // alert('Note: Running in offline mode. Some features may be limited.');
    }
});

// Check authentication status
async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('currentUser');

    if (USE_LOCALSTORAGE_FALLBACK) {
        // Use localStorage fallback
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            updateUIForLoggedInUser();
        }
        return;
    }

    if (token) {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                currentUser = data.user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateUIForLoggedInUser();
            }
        } catch (error) {
            console.log('Token validation failed');
        }
    }
}

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
async function handleLogin() {
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

    // Use localStorage fallback if backend is not available
    if (USE_LOCALSTORAGE_FALLBACK) {
        handleLocalStorageLogin(email, password, errorDiv);
        return;
    }

    try {
        console.log('Attempting login to:', `${API_URL}/auth/login`);
        console.log('Email:', email);

        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        const data = await response.json();
        console.log('Response data:', data);

        if (response.ok) {
            // Login successful
            currentUser = data.user;
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            errorDiv.style.display = 'none';

            // Redirect based on user type
            if (data.user.accountType === 'owner') {
                window.location.href = 'owner-dashboard.html';
            } else if (data.user.accountType === 'employee') {
                if (data.user.approved) {
                    window.location.href = 'employee-dashboard.html';
                } else {
                    alert('Your employee account is pending approval from the owner.');
                    window.location.href = 'index.html';
                }
            } else {
                window.location.href = 'index.html';
            }
        } else {
            errorDiv.textContent = data.message || data.error || 'Login failed. Please check your credentials.';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.warn('Backend server not reachable, attempting offline/local login:', error.message);
        handleLocalStorageLogin(email, password, errorDiv);
    }
}

// Handle localStorage login (fallback when backend is not available)
function handleLocalStorageLogin(email, password, errorDiv) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', 'owner-token-' + Date.now());
        errorDiv.style.display = 'none';

        // Redirect based on user type
        if (user.accountType === 'owner') {
            window.location.href = 'owner-dashboard.html';
        } else if (user.accountType === 'employee') {
            if (user.approved) {
                window.location.href = 'employee-dashboard.html';
            } else {
                alert('Your employee account is pending approval from the owner.');
                window.location.href = 'index.html';
            }
        } else {
            window.location.href = 'index.html';
        }
    } else {
        errorDiv.textContent = 'Invalid email or password';
        errorDiv.style.display = 'block';
    }
}

// Handle registration
async function handleRegistration() {
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

    // Use localStorage fallback if backend is not available
    if (USE_LOCALSTORAGE_FALLBACK) {
        handleLocalStorageRegistration(fullName, email, mobile, password, accountType);
        return;
    }

    try {
        console.log('Attempting registration to:', `${API_URL}/auth/register`);
        console.log('Account Type:', accountType);

        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: fullName,
                email,
                mobile,
                password,
                accountType
            })
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        const data = await response.json();
        console.log('Response data:', data);

        if (response.ok) {
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
        } else {
            showError(data.message || data.error || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.warn('Backend server not reachable, attempting offline/local registration:', error.message);
        handleLocalStorageRegistration(fullName, email, mobile, password, accountType);
    }
}

// Handle localStorage registration (fallback when backend is not available)
function handleLocalStorageRegistration(fullName, email, mobile, password, accountType) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if user already exists
    if (users.some(u => u.email === email)) {
        showError('User with this email already exists');
        return;
    }

    // Create new user
    const newUser = {
        id: users.length + 1,
        name: fullName,
        email,
        mobile,
        password,
        accountType,
        approved: accountType === 'customer' || accountType === 'owner', // Auto-approve customers and owners
        roles: [accountType]
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

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

function updateUIForLoggedInUser() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.textContent = 'Logout';
        loginBtn.onclick = function() {
            logout();
        };
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    currentUser = null;
    window.location.href = 'index.html';
}