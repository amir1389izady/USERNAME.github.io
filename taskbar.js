// xp/taskbar.js
import { getCurrentUserEmail } from '../userAuth.js';
import { apps } from './apps.js';

const taskbarItems = {};

export function createTaskbarItem(appId, win, windowActions) {
    const app = apps[appId];
    const taskbarPrograms = document.getElementById('taskbar-programs');
    const item = document.createElement('button');
    item.className = 'taskbar-item';
    item.dataset.appId = appId;
    item.innerHTML = `<img src="${app.icon}" alt=""><span>${app.title}</span>`;

    item.addEventListener('click', () => {
        if (win) {
            if (windowActions.getActiveWindow() === win && win.style.display !== 'none') {
                windowActions.toggleMinimize(win);
            } else {
                if (win.style.display === 'none') {
                    windowActions.toggleMinimize(win);
                }
                windowActions.setActive(win);
            }
        }
    });

    taskbarPrograms.appendChild(item);
    taskbarItems[appId] = item;
}

export function removeTaskbarItem(appId) {
    if (taskbarItems[appId]) {
        taskbarItems[appId].remove();
        delete taskbarItems[appId];
    }
}

export function updateTaskbarActiveState(activeWindow) {
    document.querySelectorAll('.taskbar-item.active').forEach(item => item.classList.remove('active'));
    if (activeWindow) {
        const appId = activeWindow.dataset.appId;
        const taskbarItem = document.querySelector(`.taskbar-item[data-app-id="${appId}"]`);
        if (taskbarItem) taskbarItem.classList.add('active');
    }
}

function renderStartMenu() {
    const userEmail = getCurrentUserEmail() || 'Guest';
    const userAvatar = `https://images.websim.com/avatar/${userEmail.split('@')[0]}`;
    const programList = Object.keys(apps).map(appId => {
        const app = apps[appId];
        return `<li data-app="${appId}">
                    <img src="${app.icon}" alt="${app.title}">
                    <span>${app.title}</span>
                </li>`;
    }).join('');

    return `
        <div id="start-menu" style="display: none;">
            <div class="start-menu-header">
                <img src="${userAvatar}" alt="User Avatar">
                <span>${userEmail}</span>
            </div>
            <div class="start-menu-body">
                <ul class="start-menu-programs">${programList}</ul>
            </div>
            <footer class="start-menu-footer">
                <a href="#/" class="start-menu-logoff"><strong>Log Off</strong></a>
                <button class="start-menu-shutdown"><strong>Turn Off Computer</strong></button>
            </footer>
        </div>
    `;
}


export function initTaskbar(windowActions) {
    const taskbarEl = document.getElementById('taskbar');
    taskbarEl.innerHTML = `
        <button id="start-button"><span>Start</span></button>
        <div id="taskbar-programs"></div>
        <div id="taskbar-clock"></div>
        ${renderStartMenu()}
    `;

    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    const desktop = document.getElementById('desktop');

    startButton.addEventListener('click', (e) => {
        e.stopPropagation();
        startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
    });

    desktop.addEventListener('click', (e) => {
        if (startMenu.style.display === 'block' && !e.target.closest('#start-menu')) {
            startMenu.style.display = 'none';
        }
    });

    startMenu.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', () => {
            const appId = item.dataset.app;
            windowActions.createWindow(appId);
            startMenu.style.display = 'none';
        });
    });

    // Handle Start Menu footer actions
    const logOffBtn = startMenu.querySelector('.start-menu-logoff');
    if (logOffBtn) {
        logOffBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '/';
        });
    }

    const shutdownBtn = startMenu.querySelector('.start-menu-shutdown');
    if (shutdownBtn) {
        shutdownBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to turn off the computer? This will exit the emulator.')) {
                window.location.hash = '/';
            }
        });
    }
}