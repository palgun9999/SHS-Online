// API Configuration
// This file handles the API URL for both local and deployed environments

const API_CONFIG = {
    // Local development
    local: 'http://localhost:5000/api',

    // Production deployment - Change this to your deployed backend URL
    production: 'https://your-backend-domain.com/api',

    // Get custom API URL from localStorage (allows user to configure)
    get customUrl() {
        return localStorage.getItem('customApiUrl');
    },

    // Set custom API URL
    set customUrl(url) {
        if (url) {
            localStorage.setItem('customApiUrl', url);
        } else {
            localStorage.removeItem('customApiUrl');
        }
    },

    // Current environment detection
    get apiUrl() {
        // First check if user has set a custom URL
        if (this.customUrl) {
            return this.customUrl;
        }

        // Check if running locally
        if (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.protocol === 'file:') {
            return this.local;
        }

        // For deployed version without backend, return null to indicate no backend
        // The application will need to handle this gracefully
        return null;
    },

    // Check if backend is available
    async checkBackendAvailability() {
        try {
            const response = await fetch(this.apiUrl + '/auth/health', {
                method: 'GET',
                timeout: 5000
            });
            return response.ok;
        } catch (error) {
            console.log('Backend not available:', error.message);
            return false;
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}