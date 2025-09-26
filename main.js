import { renderProgrammingPage } from './programming.js';
import { renderEconomyPage } from './economy-view.js';
import { renderMediaPage } from './media.js';
import { renderLoginPage as renderAdminLoginPage } from './auth.js';
import { renderAdminPanel } from './admin.js';
import { isLoggedIn as isAdminLoggedIn, logout as adminLogout } from './auth.js';
import { renderUserLoginPage, isUserLoggedIn, logoutUser, getCurrentUserEmail } from './userAuth.js';
import { renderXpEmulatorPage } from './xp-emulator.js';
import { renderWebsiteBuilderPage } from './website-builder.js';
import { renderSiteViewerPage } from './site-viewer.js';
import { 
    generateAiNews,
    handleAiFileGeneration, 
    handleCodeGeneration, 
    handleCodeSubmission, 
    handleTranslation,
    handleCodeOptimization,
    handleCodeExecution
} from './api/ai.js';
import { simulateApkBuild } from './utils.js';
import { fetchIranGold18kOffline } from './iran-gold-offline.js';

// Initialize WebsimSocket globally to track presence across the site.
const room = new WebsimSocket();

// --- THEME MANAGEMENT ---
const THEME_KEY = 'devhub_theme';
const FONT_KEY = 'devhub_font';

function applyTheme(themeName) {
    document.body.dataset.theme = themeName;
}

function applyFont(fontName) {
    const map = {
        'Cal Sans': `'Cal Sans', 'Noto Sans', sans-serif`,
        'Noto Sans': `'Noto Sans', sans-serif`,
        'Space Mono': `'Space Mono', monospace`
    };
    document.body.style.fontFamily = map[fontName] || `'Noto Sans', sans-serif`;
}

function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark-default';
    applyTheme(savedTheme);
    const savedFont = localStorage.getItem(FONT_KEY) || 'Noto Sans';
    applyFont(savedFont);
}

export function saveTheme(themeName) {
    localStorage.setItem(THEME_KEY, themeName);
    applyTheme(themeName);
}

export function saveFont(fontName) {
    localStorage.setItem(FONT_KEY, fontName);
    applyFont(fontName);
}
// --- END THEME MANAGEMENT ---

const appRoot = document.getElementById('app-root');
const navLinks = document.getElementById('nav-links');
const userNavContainer = document.getElementById('user-nav-links');

const routes = {
    '/programming': renderProgrammingPage,
    '/economy': renderEconomyPage,
    '/media': renderMediaPage,
    '/login': renderAdminLoginPage,
    '/admin': renderAdminPanel,
    '/user-login': renderUserLoginPage,
    '/xp': renderXpEmulatorPage,
    '/website-builder': renderWebsiteBuilderPage,
};

function router() {
    const path = window.location.hash.slice(1) || '/';
    
    if (path === '/') {
        const preferredCategory = localStorage.getItem('devhub_category');
        if (preferredCategory) {
            window.location.hash = `/${preferredCategory}`;
        } else {
            showCategorySelector();
        }
        return;
    }

    // Handle parameterized routes
    if (path.startsWith('/site/')) {
        const username = path.split('/')[2];
        renderSiteViewerPage(appRoot, username);
        updateNav();
        return;
    }

    if (path === '/admin' && !isAdminLoggedIn()) {
        window.location.hash = '/login';
        return;
    }

    if ((path === '/xp' || path === '/website-builder') && !isUserLoggedIn()) {
        window.location.hash = '/user-login';
        return;
    }
    
    const renderFunction = routes[path] || renderNotFound;
    appRoot.innerHTML = ''; // Clear previous content
    renderFunction(appRoot);
    updateNav();
}

function renderNotFound(container) {
    container.innerHTML = `
        <div class="container">
            <h2>404 - Not Found</h2>
            <p>The page you are looking for does not exist.</p>
        </div>
    `;
}

function updateNav() {
    if (isAdminLoggedIn()) {
        navLinks.innerHTML = `
            <a href="#/">Home</a>
            <a href="#/admin">Admin Panel</a>
            <a href="#/logout" id="logout-btn">Logout Admin</a>
        `;
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            adminLogout();
            window.location.hash = '/';
            router();
        });
        userNavContainer.innerHTML = '';
    } else {
        navLinks.innerHTML = `
            <a href="#/programming">Programming</a>
            <a href="#/economy">Economy</a>
            <a href="#/media">Media</a>
            <a href="#/login">Admin Login</a>
        `;
        updateUserNav();
    }
}

function updateUserNav() {
    if (isUserLoggedIn()) {
        userNavContainer.innerHTML = `
            <span>${getCurrentUserEmail()}</span>
            <button id="user-logout-btn" class="btn-logout">Logout</button>
        `;
        document.getElementById('user-logout-btn').addEventListener('click', () => {
            logoutUser();
            window.location.hash = '/'; // Go to home on logout to refresh view
            router();
        });
    } else {
        userNavContainer.innerHTML = `
            <a href="#/user-login">User Login</a>
        `;
    }
}

function showCategorySelector() {
    const overlay = document.getElementById('category-selector-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        overlay.querySelectorAll('.category-option').forEach(option => {
            option.addEventListener('click', () => {
                const category = option.dataset.category;
                localStorage.setItem('devhub_category', category);
                overlay.style.display = 'none';
                window.location.hash = `/${category}`;
            });
        });
    }
}

function setupCategoryMenu() {
    const menuBtn = document.getElementById('category-menu-btn');
    const menu = document.getElementById('category-menu');
    
    if (!menuBtn || !menu) return;

    const closeMenu = () => {
        menu.style.display = 'none';
        document.removeEventListener('click', closeMenuOnClickOutside);
    };

    const closeMenuOnClickOutside = (event) => {
        if (!menu.contains(event.target) && !menuBtn.contains(event.target)) {
            closeMenu();
        }
    };

    menuBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        const isVisible = menu.style.display === 'block';
        if (isVisible) {
            closeMenu();
        } else {
            menu.style.display = 'block';
            document.addEventListener('click', closeMenuOnClickOutside);
        }
    });

    // Theme & Font controls inside three-dot menu
    const themeSelect = document.getElementById('menu-theme-select');
    const fontSelect = document.getElementById('menu-font-select');
    if (themeSelect) {
        themeSelect.value = localStorage.getItem(THEME_KEY) || 'dark-default';
        themeSelect.addEventListener('change', (e)=> saveTheme(e.target.value));
    }
    if (fontSelect) {
        fontSelect.value = localStorage.getItem(FONT_KEY) || 'Noto Sans';
        fontSelect.addEventListener('change', (e)=> saveFont(e.target.value));
    }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
    loadTheme();
    router();
    setupCategoryMenu();
    
    // Track unique visitors per session for total visit count
    const hasVisited = sessionStorage.getItem('devhub_visited_session');
    if (!hasVisited) {
        room.collection('visits_v1').create({ visitedAt: new Date().toISOString() });
        sessionStorage.setItem('devhub_visited_session', 'true');
    }
});