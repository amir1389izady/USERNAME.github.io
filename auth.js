const ADMIN_ID = 'amir ds';
const ADMIN_PASS = 'amir ds89';

export function isLoggedIn() {
    return sessionStorage.getItem('isAdmin') === 'true';
}

export function logout() {
    sessionStorage.removeItem('isAdmin');
}

function attemptLogin(id, pass) {
    if (id === ADMIN_ID && pass === ADMIN_PASS) {
        sessionStorage.setItem('isAdmin', 'true');
        return true;
    }
    return false;
}

export function renderLoginPage(container) {
    container.innerHTML = `
        <div class="login-container">
            <h2>Admin Login</h2>
            <form id="login-form" class="login-form">
                <div class="form-group">
                    <label for="adminId">ID</label>
                    <input type="text" id="adminId" name="adminId" required>
                </div>
                <div class="form-group">
                    <label for="adminPass">Password</label>
                    <input type="password" id="adminPass" name="adminPass" required>
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
                <p id="error-message" class="error-message" style="display: none;"></p>
            </form>
            <div class="or-divider">or</div>
            <button id="google-login" class="btn btn-google">Login with Google</button>
        </div>
    `;

    const form = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = form.adminId.value;
        const pass = form.adminPass.value;

        if (attemptLogin(id, pass)) {
            window.location.hash = '/admin';
        } else {
            errorMessage.textContent = 'Invalid ID or password.';
            errorMessage.style.display = 'block';
        }
    });

    document.getElementById('google-login').addEventListener('click', () => {
        alert('Google Login is not implemented in this demo.');
    });
}