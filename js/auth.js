// Authentication system for instructor panel (PIN-based)

// Default PIN (should be changed by instructor)
const DEFAULT_PIN = '1234';

// Session management
const SESSION_KEY = 'instructor_session';
const PIN_KEY = 'instructor_pin';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Initialize authentication
function initializeAuth() {
    // Load custom PIN if it exists, otherwise use default
    const storedPin = localStorage.getItem(PIN_KEY);
    if (!storedPin) {
        localStorage.setItem(PIN_KEY, DEFAULT_PIN);
    }
}

// Check if user is currently authenticated
function isAuthenticated() {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return false;
    
    try {
        const sessionData = JSON.parse(session);
        const now = new Date().getTime();
        
        // Check if session has expired
        if (now > sessionData.expiresAt) {
            localStorage.removeItem(SESSION_KEY);
            return false;
        }
        
        return true;
    } catch (error) {
        localStorage.removeItem(SESSION_KEY);
        return false;
    }
}

// Create a new session
function createSession(rememberMe = false) {
    const now = new Date().getTime();
    const duration = rememberMe ? SESSION_DURATION : 2 * 60 * 60 * 1000; // 2 hours if not remembered
    
    const sessionData = {
        createdAt: now,
        expiresAt: now + duration,
        rememberMe: rememberMe
    };
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
}

// Validate PIN
function validatePin(pin) {
    try {
        const storedPin = localStorage.getItem(PIN_KEY);
        const currentPin = storedPin || DEFAULT_PIN;
        
        // Simple string comparison
        return pin === currentPin;
    } catch (error) {
        return pin === DEFAULT_PIN;
    }
}

// Update PIN
function updatePin(newPin) {
    if (!isAuthenticated()) return false;
    
    // Validate PIN format (4 digits)
    if (!/^\d{4}$/.test(newPin)) {
        return false;
    }
    
    localStorage.setItem(PIN_KEY, newPin);
    return true;
}

// Logout function
function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
}

// Get current PIN (for display purposes - only returns if authenticated)
function getCurrentPin() {
    if (!isAuthenticated()) return null;
    
    try {
        const storedPin = localStorage.getItem(PIN_KEY);
        return storedPin || DEFAULT_PIN;
    } catch (error) {
        return DEFAULT_PIN;
    }
}

// Check authentication on protected pages
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Login form handler
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const pin = document.getElementById('pin').value.trim();
            const rememberMe = document.getElementById('remember-me').checked;
            const errorMessage = document.getElementById('error-message');
            const submitButton = this.querySelector('button[type="submit"]');
            
            // Clear previous errors
            errorMessage.style.display = 'none';
            
            // Add loading state
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            
            // Simulate a brief delay for better UX
            setTimeout(() => {
                if (validatePin(pin)) {
                    createSession(rememberMe);
                    window.location.href = 'instructor.html';
                } else {
                    errorMessage.style.display = 'block';
                    submitButton.classList.remove('loading');
                    submitButton.disabled = false;
                    
                    // Clear PIN field
                    document.getElementById('pin').value = '';
                    document.getElementById('pin').focus();
                }
            }, 800);
        });
    }
    
    // PIN input formatting
    const pinInput = document.getElementById('pin');
    if (pinInput) {
        pinInput.addEventListener('input', function(e) {
            // Only allow numbers
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Limit to 4 digits
            if (this.value.length > 4) {
                this.value = this.value.slice(0, 4);
            }
        });
        
        // Auto-submit when 4 digits are entered
        pinInput.addEventListener('input', function(e) {
            if (this.value.length === 4) {
                setTimeout(() => {
                    loginForm.dispatchEvent(new Event('submit'));
                }, 300);
            }
        });
    }
});

// Auto-redirect if already authenticated
if (window.location.pathname.includes('login.html') && isAuthenticated()) {
    window.location.href = 'instructor.html';
}
