// Theme Management
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const themeToggle = document.getElementById('themeToggle');

    if (currentTheme === 'dark') {
        html.removeAttribute('data-theme');
        if (themeToggle) themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}

// Initialize theme on page load
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');

    if (savedTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.textContent = '☀️';
    } else {
        html.removeAttribute('data-theme');
        if (themeToggle) themeToggle.textContent = '🌙';
    }
}

// Auto-detect system preference
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
});